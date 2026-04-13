import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Clock, CheckCircle2, Loader2, Star } from "lucide-react";
import Footer from "@/components/Footer";

type PaymentMethod = "gpay" | "phonepe" | "amazonpay";

const paymentOptions: { id: PaymentMethod; label: string; icon: string }[] = [
  { id: "gpay", label: "Google Pay", icon: "💳" },
  { id: "phonepe", label: "PhonePe", icon: "📱" },
  { id: "amazonpay", label: "Amazon Pay", icon: "🛒" },
];

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isAuthenticated && items.length > 0) {
      navigate('/login');
    }
  }, [isAuthenticated, items.length, navigate]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [orderState, setOrderState] = useState<"checkout" | "processing" | "success" | "feedback">("checkout");
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderId, setOrderId] = useState("");
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const estimatedTime = Math.max(10, items.reduce((sum, i) => sum + i.quantity * 3, 0) + 5);

  const handlePayment = async () => {
    if (!selectedPayment) {
      toast({ title: "Please select a payment method", variant: "destructive" });
      return;
    }

    setLoading(true);
    setOrderState("processing");

    try {
      // Create order in database
      const orderItems = items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      }));

      const { data, error } = await supabase
        .from("orders")
        .insert({
          order_number: "TEMP", // Will be overwritten by trigger
          customer_name: user?.name || "Guest",
          customer_phone: user?.phone || "",
          items: orderItems,
          total_amount: totalPrice,
          payment_method: selectedPayment,
          payment_status: "paid",
          user_id: user?.userId || null,
        })
        .select()
        .single();

      if (error) throw error;

      setOrderNumber(data.order_number);
      setOrderId(data.id);

      // Try UPI deep link on mobile
      const upiId = "flourisense@upi";
      const upiUrl = `upi://pay?pa=${upiId}&pn=Flourisense%20Cafe&am=${totalPrice}&cu=INR&tn=${encodeURIComponent(`Order ${data.order_number}`)}`;
      if (/android|iphone|ipad/i.test(navigator.userAgent)) {
        window.location.href = upiUrl;
      }

      setTimeout(() => {
        setOrderState("success");
        setLoading(false);
        clearCart();
        toast({ title: "Payment Successful! ✅" });
      }, 2000);
    } catch (err: any) {
      console.error("Order error:", err);
      setLoading(false);
      setOrderState("checkout");
      toast({ title: "Failed to place order", description: err.message, variant: "destructive" });
    }
  };

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      toast({ title: "Please select a rating", variant: "destructive" });
      return;
    }
    try {
      await supabase.from("feedback").insert({
        order_id: orderId,
        rating,
        comment: feedbackText || null,
        user_id: user?.userId || null,
      });
      setFeedbackSubmitted(true);
      toast({ title: "Thank you for your feedback! 🎉" });
    } catch {
      toast({ title: "Failed to submit feedback", variant: "destructive" });
    }
  };

  const isEmpty = items.length === 0 && orderState === "checkout";
  useEffect(() => {
    if (isEmpty) navigate("/menu");
  }, [isEmpty, navigate]);

  if (isEmpty) return null;

  // Success + Feedback screen
  if (orderState === "success" || orderState === "feedback") {
    return (
      <main className="min-h-screen flex items-center justify-center pt-16 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 max-w-md w-full"
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
            <CheckCircle2 className="w-20 h-20 mx-auto" style={{ color: "#22c55e" }} />
          </motion.div>
          <h1 className="font-heading text-3xl font-bold">Payment Successful!</h1>
          <p className="text-muted-foreground">Thank you, {user?.name}!</p>

          {/* Order ID */}
          <div className="glass rounded-2xl p-6 space-y-2">
            <p className="text-sm text-muted-foreground">Your Order ID</p>
            <p className="font-heading text-4xl font-extrabold text-primary">{orderNumber}</p>
          </div>

          <div className="glass rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Clock className="w-5 h-5" />
              <span className="font-heading font-bold">~{estimatedTime} mins</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Watch the display screen for your order status
            </p>
          </div>

          {/* Feedback Section */}
          {!feedbackSubmitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-2xl p-6 space-y-4 text-left"
            >
              <h3 className="font-heading font-bold text-center">How was your experience?</h3>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)}>
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= rating ? "fill-caramel text-caramel" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Tell us about your experience..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmitFeedback}
                className="w-full py-3 rounded-xl gradient-warm-bg font-heading font-semibold text-sm text-accent-foreground shadow-warm"
              >
                Submit Feedback
              </motion.button>
            </motion.div>
          ) : (
            <div className="glass rounded-2xl p-6 text-center space-y-2">
              <p className="text-primary font-heading font-bold">Thanks for your feedback! 🎉</p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm text-caramel underline"
              >
                Leave a review on Google →
              </a>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/")}
            className="px-8 py-3 rounded-xl glass font-heading font-semibold text-sm"
          >
            Back to Home
          </motion.button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="pt-20 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/menu")} className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-heading text-2xl font-bold">Checkout</h1>
              <p className="text-sm text-muted-foreground">Hi {user?.name}, confirm your order</p>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 space-y-4">
            <h2 className="font-heading font-bold text-lg">Order Summary</h2>
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.image}</span>
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                  </div>
                </div>
                <p className="font-heading font-semibold text-primary">₹{item.price * item.quantity}</p>
              </div>
            ))}
            <div className="flex justify-between pt-2">
              <span className="font-heading font-bold">Total</span>
              <span className="font-heading font-bold text-xl text-primary">₹{totalPrice}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Estimated preparation: ~{estimatedTime} mins</span>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading font-bold text-lg">Select Payment Method</h2>
            <div className="grid gap-3">
              {paymentOptions.map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedPayment(option.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    selectedPayment === option.id
                      ? "glass ring-2 ring-primary shadow-warm"
                      : "glass hover:ring-1 hover:ring-border"
                  }`}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="font-medium text-sm">{option.label}</span>
                  {selectedPayment === option.id && (
                    <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePayment}
            disabled={loading || !selectedPayment}
            className="w-full py-4 rounded-xl gradient-warm-bg font-heading font-bold text-accent-foreground shadow-warm flex items-center justify-center gap-2 disabled:opacity-50 text-lg"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Pay ₹{totalPrice}</>}
          </motion.button>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
};

export default CheckoutPage;
