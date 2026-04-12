import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";
import { menuItems, categories } from "@/data/menuData";
import { useCart } from "@/context/CartContext";
import Footer from "@/components/Footer";
import type { Category } from "@/data/menuData";

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");
  const { addItem } = useCart();

  const filtered = useMemo(() => {
    let items = menuItems;
    if (activeCategory !== "All") items = items.filter((i) => i.category === activeCategory);
    if (search) items = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
    return items;
  }, [activeCategory, search]);

  return (
    <main className="pt-20 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 space-y-3"
        >
          <h1 className="font-heading text-4xl md:text-5xl font-bold">
            Our <span className="gradient-text">Menu</span>
          </h1>
          <p className="text-muted-foreground">Explore our curated collection of flavors</p>
        </motion.div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl glass text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 bg-transparent"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "gradient-warm-bg text-accent-foreground shadow-warm"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Items grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -3 }}
              className="glass rounded-2xl p-5 group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{item.image}</span>
                <div className="flex gap-1">
                  {item.isPopular && (
                    <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-medium">Popular</span>
                  )}
                  {item.isNew && (
                    <span className="px-2 py-0.5 rounded-full bg-caramel/20 text-caramel text-[10px] font-medium">New</span>
                  )}
                </div>
              </div>
              <h3 className="font-heading font-bold text-foreground">{item.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="font-heading font-bold text-lg text-primary">₹{item.price}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => addItem(item)}
                  className="w-9 h-9 rounded-full gradient-warm-bg flex items-center justify-center text-accent-foreground shadow-warm"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-muted-foreground">No items found</p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
};

export default MenuPage;
