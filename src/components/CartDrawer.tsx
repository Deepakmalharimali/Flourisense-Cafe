import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const CartDrawer = () => {
const { items, isOpen, toggleCart, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleProceed = () => {
    toggleCart();
    if (isAuthenticated) {
      navigate("/checkout");
    } else {
      navigate("/login");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
onClick={() => toggleCart()}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md glass-strong z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <h2 className="font-heading font-bold text-lg flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" /> Your Cart
              </h2>
  <button onClick={() => toggleCart()} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <p className="text-4xl">☕</p>
                  <p className="text-muted-foreground text-sm">Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50"
                  >
                    <span className="text-2xl">{item.image}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-semibold text-sm truncate">{item.name}</p>
                      <p className="text-primary font-semibold text-sm">₹{item.price * item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-destructive"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full gradient-warm-bg flex items-center justify-center text-accent-foreground"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-7 h-7 rounded-full bg-destructive/10 hover:bg-destructive text-destructive hover:text-destructive-foreground flex items-center justify-center"
                        title="Remove item"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-border/50 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Total</span>
                  <span className="font-heading font-bold text-2xl text-primary">₹{totalPrice}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleProceed}
                  className="w-full py-3.5 rounded-xl gradient-warm-bg font-heading font-semibold text-sm text-accent-foreground shadow-warm"
                >
                  {isAuthenticated ? "Proceed to Payment" : "Login to Order"}
                </motion.button>
                <button
                  onClick={clearCart}
                  className="w-full text-center text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
