import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroCoffee from "@/assets/hero-coffee.jpeg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-espresso/30" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-1.5 rounded-full glass text-xs font-medium tracking-wider uppercase text-primary"
              >
                Welcome to Flourisense
              </motion.span>
              <h1 className="font-heading text-5xl md:text-7xl font-extrabold leading-[0.95] tracking-tight">
                Brewed to{" "}
                <span className="gradient-text">Perfection</span>
                <span className="text-primary"> ☕</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                Artisan coffee crafted with passion. Scan, order, and savor — no waiting, just pure bliss.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/menu">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3.5 rounded-xl gradient-warm-bg font-heading font-semibold text-sm text-accent-foreground shadow-warm flex items-center gap-2"
                >
                  Order Now <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link to="/menu">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3.5 rounded-xl glass font-heading font-semibold text-sm text-foreground"
                >
                  View Menu
                </motion.button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              {[
                { value: "50+", label: "Menu Items" },
                { value: "4.9★", label: "Rating" },
                { value: "10k+", label: "Happy Customers" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-primary/10 blur-3xl" />
              <div className="relative w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] rounded-3xl shadow-warm bg-gradient-to-br from-mocha to-caramel flex items-center justify-center">
                <img
                  src={heroCoffee}
                  alt="Premium artisan coffee with latte art"
                  width={500}
                  height={500}
                  className="object-cover w-full h-full rounded-3xl"
                />
              </div>

              {/* Steam effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-2">
                {[0, 0.4, 0.8].map((delay, i) => (
                  <div
                    key={i}
                    className="w-1 h-6 rounded-full bg-foreground/20 animate-steam"
                    style={{ animationDelay: `${delay}s` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

