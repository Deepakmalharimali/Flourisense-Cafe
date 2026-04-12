import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { menuItems } from "@/data/menuData";
import { useCart } from "@/context/CartContext";
import { Plus } from "lucide-react";

const FeaturedMenu = () => {
  const { addItem } = useCart();
  const featured = menuItems.filter((i) => i.isPopular).slice(0, 6);

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-3"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Our Menu</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold">
            Popular <span className="gradient-text">Picks</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Customer favorites, handpicked for you
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{item.image}</span>
                {item.isPopular && (
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
                    Popular
                  </span>
                )}
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground">{item.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="font-heading font-bold text-xl text-primary">₹{item.price}</span>
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

        <div className="text-center mt-12">
          <Link to="/menu">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 rounded-xl glass font-heading font-semibold text-sm"
            >
              View Full Menu →
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMenu;
