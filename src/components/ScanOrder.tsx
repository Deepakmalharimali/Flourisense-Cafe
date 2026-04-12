import { motion } from "framer-motion";
import { QrCode, Smartphone, CreditCard } from "lucide-react";

const steps = [
  { icon: QrCode, title: "Scan QR Code", desc: "Scan the QR on your table" },
  { icon: Smartphone, title: "Browse & Order", desc: "Pick your favorites from the menu" },
  { icon: CreditCard, title: "Pay & Enjoy", desc: "Pay via UPI and relax" },
];

const ScanOrder = () => (
  <section className="py-24 relative">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
    <div className="container mx-auto px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 space-y-3"
      >
        <span className="text-primary text-sm font-medium uppercase tracking-wider">How It Works</span>
        <h2 className="font-heading text-4xl md:text-5xl font-bold">
          Scan & <span className="gradient-text">Order</span>
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          No app download needed. Just scan and order from your table.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-2xl gradient-warm-bg mx-auto flex items-center justify-center shadow-warm">
              <step.icon className="w-7 h-7 text-accent-foreground" />
            </div>
            <div className="w-8 h-8 rounded-full glass mx-auto flex items-center justify-center font-heading font-bold text-sm text-primary">
              {i + 1}
            </div>
            <h3 className="font-heading font-bold text-lg">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ScanOrder;
