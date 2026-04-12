import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, User, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const [step, setStep] = useState<"info" | "otp">("info");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSendOtp = async () => {
    if (!name.trim() || !phone.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      toast({ title: "Please enter a valid 10-digit mobile number", variant: "destructive" });
      return;
    }

    setLoading(true);
    const result = await login(name.trim(), phone.replace(/\D/g, ""));
    setLoading(false);

    if (result.success) {
      setStep("otp");
      toast({ title: "OTP sent!", description: "Check your phone for the verification code" });
    } else {
      toast({ title: "Failed to send OTP", description: result.error, variant: "destructive" });
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      toast({ title: "Please enter the 6-digit OTP", variant: "destructive" });
      return;
    }

    setLoading(true);
    const result = await verifyOtp(phone.replace(/\D/g, ""), otp);
    setLoading(false);

    if (result.success) {
      toast({ title: "Welcome to Flourisense! ☕", description: `Hey ${name}, let's get your order started.` });
      navigate("/menu");
    } else {
      toast({ title: "Invalid OTP", description: result.error, variant: "destructive" });
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center pt-16 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-espresso/20" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="glass rounded-3xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-16 h-16 rounded-2xl gradient-warm-bg mx-auto flex items-center justify-center shadow-warm mb-4"
            >
              <span className="text-2xl">☕</span>
            </motion.div>
            <h1 className="font-heading text-3xl font-bold">
              {step === "info" ? "Let's Get Started" : "Verify OTP"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {step === "info"
                ? "Enter your details to place an order"
                : `We've sent a code to +91${phone.replace(/\D/g, "")}`}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === "info" ? (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-5"
              >
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Your Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-secondary/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <span className="absolute left-11 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">+91</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="9876543210"
                      maxLength={10}
                      className="w-full pl-[5.5rem] pr-4 py-3.5 rounded-xl bg-secondary/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl gradient-warm-bg font-heading font-semibold text-sm text-accent-foreground shadow-warm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>Send OTP <ArrowRight className="w-4 h-4" /></>
                  )}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                {/* OTP Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Enter 6-digit OTP</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="000000"
                      maxLength={6}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-secondary/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 tracking-[0.5em] text-center font-mono text-lg"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl gradient-warm-bg font-heading font-semibold text-sm text-accent-foreground shadow-warm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>Verify & Continue <ArrowRight className="w-4 h-4" /></>
                  )}
                </motion.button>

                <button
                  onClick={() => { setStep("info"); setOtp(""); }}
                  className="w-full text-center text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  ← Change number
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </main>
  );
};

export default LoginPage;
