import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  ChefHat, CheckCircle2, Clock, TrendingUp, Package,
  Star, BarChart3, Loader2, Edit, Trash2, Plus
} from "lucide-react";
import { MenuItem, categories } from "@/data/menuData";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/Footer";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  items: any[];
  total_amount: number;
  status: "preparing" | "ready" | "served" | "completed";
  payment_status: string;
  created_at: string;
}

interface FeedbackItem {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  order_id: string;
}

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [activeTab, setActiveTab] = useState<"orders" | "analytics" | "feedback" | "menu">("orders");
  const [menuItemsLocal, setMenuItemsLocal] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem('adminMenuItems');
    if (saved) {
      setMenuItemsLocal(JSON.parse(saved));
    } else {
      import('@/data/menuData').then(module => {
        setMenuItemsLocal(module.menuItems);
        localStorage.setItem('adminMenuItems', JSON.stringify(module.menuItems));
      });
    }
  }, []);

  const saveMenu = () => {
    localStorage.setItem('adminMenuItems', JSON.stringify(menuItemsLocal));
    toast({ title: 'Menu saved!' });
  };

  const addNewItem = () => {
    if (!newItem.name || !newItem.price) return;
    const id = 'item_' + Date.now();
    const item: MenuItem = {
      id,
      name: newItem.name!,
      price: newItem.price!,
      description: newItem.description || '',
      image: newItem.image || '☕',
      category: (newItem.category as Category) || 'Coffee',
      isPopular: false,
      isNew: false,
    };
    setMenuItemsLocal([item, ...menuItemsLocal]);
    setNewItem({});
    toast({ title: 'Item added!' });
  };

  const startEdit = (item: MenuItem) => {
    setEditingItem({...item});
  };

  const updateItem = () => {
    if (!editingItem) return;
    setMenuItemsLocal(menuItemsLocal.map(i => i.id === editingItem.id ? editingItem : i));
    setEditingItem(null);
    toast({ title: 'Item updated!' });
  };

  const cancelEdit = () => {
    setEditingItem(null);
  };

  const deleteItem = (id: string) => {
    setMenuItemsLocal(menuItemsLocal.filter(i => i.id !== id));
    toast({ title: 'Item deleted!' });
  };

  useEffect(() => {
    fetchOrders();
    fetchFeedbacks();

    const channel = supabase
      .channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setOrders(data as Order[]);
    setLoading(false);
  };

  const fetchFeedbacks = async () => {
    const { data } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setFeedbacks(data as FeedbackItem[]);
  };

  const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      toast({ title: "Failed to update", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Order marked as ${status}` });
      fetchOrders();
    }
  };

  const todayOrders = orders.filter(
    (o) => new Date(o.created_at).toDateString() === new Date().toDateString()
  );
  const todayRevenue = todayOrders
    .filter((o) => o.payment_status === "paid")
    .reduce((sum, o) => sum + o.total_amount, 0);
  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : "N/A";

  const statusColor = (status: string) => {
    switch (status) {
      case "preparing": return "text-caramel bg-caramel/20";
      case "ready": return "bg-primary/20 text-primary";
      case "served": return "bg-muted text-muted-foreground";
      case "completed": return "bg-muted text-muted-foreground";
      default: return "";
    }
  };

  const peakHours = orders.reduce((acc, o) => {
    const hour = new Date(o.created_at).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="pt-20 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div>
            <h1 className="font-heading text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm">Manage orders and track performance</p>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { icon: Package, label: "Today's Orders", value: todayOrders.length, color: "text-primary" },
              { icon: TrendingUp, label: "Revenue Today", value: `₹${todayRevenue}`, color: "text-caramel" },
              { icon: Clock, label: "Active Orders", value: orders.filter((o) => o.status === "preparing" || o.status === "ready").length, color: "text-primary" },
              { icon: Star, label: "Avg Rating", value: avgRating, color: "text-caramel" },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-4 space-y-1">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <p className="font-heading text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {(["orders", "analytics", "feedback", "menu"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                  activeTab === tab
                    ? "gradient-warm-bg text-accent-foreground shadow-warm"
                    : "glass text-muted-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No orders yet</p>
                </div>
              ) : (
                orders.map((order) => (
                  <motion.div
                    key={order.id}
                    layout
                    className="glass rounded-xl p-5 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-heading text-xl font-extrabold text-primary">
                          {order.order_number}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="text-foreground font-medium">{order.customer_name}</span>
                      <span className="text-muted-foreground">{order.customer_phone}</span>
                      <span className="font-heading font-bold text-primary">₹{order.total_amount}</span>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {Array.isArray(order.items) &&
                        (order.items as any[]).map((i: any) => `${i.name} x${i.quantity}`).join(" • ")}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 flex-wrap">
                      {order.status === "preparing" && (
                        <button
                          onClick={() => updateOrderStatus(order.id, "ready")}
                          className="px-4 py-2 rounded-lg gradient-warm-bg text-accent-foreground text-xs font-heading font-semibold shadow-warm flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Mark Ready
                        </button>
                      )}
                      {order.status === "ready" && (
                        <button
                          onClick={() => updateOrderStatus(order.id, "served")}
                          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-heading font-semibold flex items-center gap-1"
                        >
                          <ChefHat className="w-3 h-3" /> Mark Served
                        </button>
                      )}
                      {(order.status === "served") && (
                        <button
                          onClick={() => updateOrderStatus(order.id, "completed")}
                          className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-heading font-semibold flex items-center gap-1"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="glass rounded-xl p-6 space-y-4">
                <h3 className="font-heading font-bold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" /> Popular Items
                </h3>
                {(() => {
                  const itemCounts: Record<string, number> = {};
                  orders.forEach((o) => {
                    if (Array.isArray(o.items)) {
                      (o.items as any[]).forEach((i: any) => {
                        itemCounts[i.name] = (itemCounts[i.name] || 0) + (i.quantity || 1);
                      });
                    }
                  });
                  const sorted = Object.entries(itemCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
                  const max = sorted[0]?.[1] || 1;
                  return sorted.map(([name, count]) => (
                    <div key={name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground">{name}</span>
                        <span className="text-muted-foreground">{count} orders</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / max) * 100}%` }}
                          className="h-full rounded-full gradient-warm-bg"
                        />
                      </div>
                    </div>
                  ));
                })()}
                {orders.length === 0 && <p className="text-muted-foreground text-sm">No data yet</p>}
              </div>

              {/* Peak Hours */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-heading font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" /> Peak Hours
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(peakHours).map(([hour, count]) => (
                    <div key={hour} className="text-center space-y-1">
                      <div className="font-heading text-2xl font-bold text-primary">{count}</div>
                      <div className="text-xs text-muted-foreground capitalize">{hour}:00 - {parseInt(hour)+1}:00</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Feedback Tab */}
          {activeTab === "feedback" && (
            <div className="space-y-4">
              {feedbacks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No feedback yet</p>
                </div>
              ) : (
                feedbacks.map((f) => (
                  <div key={f.id} className="glass rounded-xl p-5 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-4 h-4 ${s <= f.rating ? "fill-caramel text-caramel" : "text-muted-foreground"}`} />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(f.created_at).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                    {f.comment && <p className="text-sm text-foreground">"{f.comment}"</p>}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Menu Tab */}
          {activeTab === "menu" && (
            <div className="space-y-6">
              {/* Add New Item Form */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-heading font-bold mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" /> Add New Item
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      placeholder="Item name"
                      value={newItem.name || ''}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Price</Label>
                    <Input
                      type="number"
                      placeholder="Price"
                      value={newItem.price || ''}
                      onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>Emoji</Label>
                    <Input
                      placeholder="Emoji"
                      value={newItem.image || ''}
                      onChange={(e) => setNewItem({...newItem, image: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2 lg:col-span-1">
                    <Label>Category</Label>
                    <select
                      className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                      value={newItem.category || ''}
                      onChange={(e) => setNewItem({...newItem, category: e.target.value as Category})}
                    >
                      {categories.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="lg:col-span-3">
                    <Label>Description</Label>
                    <Input
                      placeholder="Description"
                      value={newItem.description || ''}
                      onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    />
                  </div>
                </div>
                <Button onClick={addNewItem} className="mt-4 gradient-warm-bg text-accent-foreground">
                  Add Item
                </Button>
              </div>

              {/* Menu Table */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-heading font-bold flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" /> Menu Items ({menuItemsLocal.length})
                  </h3>
                  <div className="flex gap-2">
                    <Button onClick={saveMenu} variant="outline" size="sm">
                      Save All Changes
                    </Button>
                  </div>
                </div>
                <div className="glass rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Popular</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {menuItemsLocal.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-2xl">{item.image}</TableCell>
                          <TableCell>
                            {editingItem?.id === item.id ? (
                              <Input
                                value={editingItem.name}
                                onChange={(e) => setEditingItem({...editingItem!, name: e.target.value})}
                              />
                            ) : (
                              <span className="font-medium">{item.name}</span>
                            )}
                          </TableCell>
                          <TableCell className="max-w-xs">
                            {editingItem?.id === item.id ? (
                              <Input
                                value={editingItem.description}
                                onChange={(e) => setEditingItem({...editingItem!, description: e.target.value})}
                              />
                            ) : (
                              item.description
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full bg-secondary text-xs">
                              {item.category}
                            </span>
                          </TableCell>
                          <TableCell className="font-mono font-bold">₹{item.price}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant={item.isPopular ? "default" : "outline"}
                              onClick={() => setMenuItemsLocal(menuItemsLocal.map(i => i.id === item.id ? {...i, isPopular: !item.isPopular} : i))}
                            >
                              {item.isPopular ? 'Yes' : 'No'}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {editingItem?.id === item.id ? (
                                <>
                                  <Button size="sm" variant="default" onClick={() => updateItem(editingItem!)}>
                                    <Save className="w-4 h-4 mr-1" /> Save
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={cancelEdit}>
                                    Cancel
                                  </Button>
                                </>
                              ) : (
                                <Button size="sm" variant="ghost" onClick={() => startEdit(item)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteItem(item.id)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </main>
  );
};

export default AdminDashboard;
