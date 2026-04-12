import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Volume2, VolumeX } from "lucide-react";

interface OrderDisplay {
  id: string;
  order_number: string;
  customer_name: string;
  items: any[];
  status: string;
  created_at: string;
}

const OrdersDisplayPage = () => {
  const [orders, setOrders] = useState<OrderDisplay[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const announcementQueue = useRef<string[]>([]);
  const isAnnouncing = useRef(false);

  const speak = useCallback((text: string) => {
    if (!voiceEnabled || !("speechSynthesis" in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = "en-IN";
    
    // Try to find a good English voice
    const voices = speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith("en") && v.name.includes("Google")) || voices.find(v => v.lang.startsWith("en"));
    if (englishVoice) utterance.voice = englishVoice;

    speechSynthesis.speak(utterance);
  }, [voiceEnabled]);

  const processQueue = useCallback(() => {
    if (isAnnouncing.current || announcementQueue.current.length === 0) return;
    isAnnouncing.current = true;
    const text = announcementQueue.current.shift()!;
    
    // Announce twice
    speak(text);
    setTimeout(() => {
      speak(text);
      isAnnouncing.current = false;
      processQueue();
    }, 4000);
  }, [speak]);

  const announceOrder = useCallback((orderNumber: string, customerName: string) => {
    const text = `Order number ${orderNumber.replace("CAFE-", "")} for ${customerName} is ready for pickup`;
    announcementQueue.current.push(text);
    processQueue();
  }, [processQueue]);

  // Fetch initial orders
  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, order_number, customer_name, items, status, created_at")
        .in("status", ["preparing", "ready"])
        .order("created_at", { ascending: true });

      if (data) setOrders(data as OrderDisplay[]);
    };

    fetchOrders();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("orders-display")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newOrder = payload.new as OrderDisplay;
            if (newOrder.status === "preparing" || newOrder.status === "ready") {
              setOrders((prev) => [...prev, newOrder]);
            }
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as OrderDisplay;
            if (updated.status === "ready") {
              // Announce when order becomes ready
              announceOrder(updated.order_number, updated.customer_name);
            }
            if (updated.status === "served" || updated.status === "completed") {
              // Remove from display
              setOrders((prev) => prev.filter((o) => o.id !== updated.id));
            } else {
              setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
            }
          } else if (payload.eventType === "DELETE") {
            setOrders((prev) => prev.filter((o) => o.id !== (payload.old as any).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [announceOrder]);

  // Load voices
  useEffect(() => {
    speechSynthesis.getVoices();
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
  }, []);

  const preparing = orders.filter((o) => o.status === "preparing");
  const ready = orders.filter((o) => o.status === "ready");
  const currentTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl md:text-5xl font-extrabold">
            Flourisense<span className="text-primary">.</span> Orders
          </h1>
          <p className="text-muted-foreground text-lg">{currentTime}</p>
        </div>
        <button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className="p-3 rounded-xl glass hover:bg-secondary transition-colors"
        >
          {voiceEnabled ? (
            <Volume2 className="w-6 h-6 text-primary" />
          ) : (
            <VolumeX className="w-6 h-6 text-muted-foreground" />
          )}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 h-[calc(100vh-160px)]">
        {/* Preparing Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-4 h-4 rounded-full bg-caramel animate-pulse" />
            <h2 className="font-heading text-2xl md:text-3xl font-bold">Preparing</h2>
            <span className="text-muted-foreground">({preparing.length})</span>
          </div>
          <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-240px)] pr-2">
            <AnimatePresence>
              {preparing.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30, scale: 0.9 }}
                  layout
                  className="glass rounded-2xl p-5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-2xl md:text-3xl font-extrabold text-caramel">
                      {order.order_number}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-caramel/20 text-caramel text-xs font-medium">
                      Preparing
                    </span>
                  </div>
                  <p className="font-medium text-foreground">{order.customer_name}</p>
                  {Array.isArray(order.items) && (
                    <p className="text-xs text-muted-foreground truncate">
                      {(order.items as any[]).map((i: any) => `${i.name} x${i.quantity}`).join(", ")}
                    </p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {preparing.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-4xl mb-2">👨‍🍳</p>
                <p>No orders being prepared</p>
              </div>
            )}
          </div>
        </div>

        {/* Ready Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-4 h-4 rounded-full animate-pulse" style={{ backgroundColor: "#22c55e" }} />
            <h2 className="font-heading text-2xl md:text-3xl font-bold">Ready for Pickup</h2>
            <span className="text-muted-foreground">({ready.length})</span>
          </div>
          <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-240px)] pr-2">
            <AnimatePresence>
              {ready.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    boxShadow: [
                      "0 0 0 0 hsl(24 30% 50% / 0)",
                      "0 0 20px 4px hsl(24 30% 50% / 0.3)",
                      "0 0 0 0 hsl(24 30% 50% / 0)",
                    ],
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    boxShadow: { duration: 2, repeat: 3, ease: "easeInOut" },
                  }}
                  layout
                  className="glass rounded-2xl p-5 space-y-2 border-2 border-primary/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-3xl md:text-4xl font-extrabold text-primary">
                      {order.order_number}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: "hsl(142 70% 45% / 0.2)", color: "#22c55e" }}>
                      ✅ Ready
                    </span>
                  </div>
                  <p className="font-bold text-lg text-foreground">{order.customer_name}</p>
                </motion.div>
              ))}
            </AnimatePresence>
            {ready.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-4xl mb-2">⏳</p>
                <p>No orders ready yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersDisplayPage;
