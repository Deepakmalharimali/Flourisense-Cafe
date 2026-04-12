import { motion } from "framer-motion";
import Footer from "@/components/Footer";

const About = () => (
  <main className="pt-20 min-h-screen">
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-16"
      >
        {/* Story */}
        <div className="text-center space-y-4">
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Our Story</span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold">
            About <span className="gradient-text">Flourisense</span>
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Born from a passion for exceptional coffee and seamless experiences, Flourisense Cafe reimagines the way you dine. 
            We blend artisan craftsmanship with modern technology — no waiting, no friction, just pure enjoyment.
          </p>
        </div>

        {/* Vision */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 space-y-3"
          >
            <h3 className="font-heading font-bold text-xl text-primary">Our Vision</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To become the most loved neighborhood cafe — where every sip tells a story and every visit feels like home.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 space-y-3"
          >
            <h3 className="font-heading font-bold text-xl text-primary">Our Mission</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Craft the finest coffee, serve with warmth, and leverage technology to make dining effortless and delightful.
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <div className="space-y-8">
          <h2 className="font-heading text-2xl font-bold text-center">What We Stand For</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { emoji: "☕", title: "Quality First", desc: "Single-origin beans, ethically sourced" },
              { emoji: "💡", title: "Innovation", desc: "QR ordering, digital payments, zero wait" },
              { emoji: "❤️", title: "Community", desc: "A space for connection and creativity" },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-3"
              >
                <span className="text-3xl">{v.emoji}</span>
                <h3 className="font-heading font-bold">{v.title}</h3>
                <p className="text-xs text-muted-foreground">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
    <Footer />
  </main>
);

export default About;
