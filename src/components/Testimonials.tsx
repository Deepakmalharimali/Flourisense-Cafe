import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  { name: "Priya S.", text: "Best coffee in town! The ambience and QR ordering makes it so effortless.", rating: 5 },
  { name: "Rahul M.", text: "Love the mocha and the grilled sandwich combo. Quick service, no waiter hassle!", rating: 5 },
  { name: "Ananya K.", text: "Such a premium vibe. The latte art is Instagram-worthy. Will visit again!", rating: 4 },
];

const Testimonials = () => (
  <section className="py-24">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 space-y-3"
      >
        <span className="text-primary text-sm font-medium uppercase tracking-wider">Reviews</span>
        <h2 className="font-heading text-4xl md:text-5xl font-bold">
          What Our <span className="gradient-text">Guests</span> Say
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {reviews.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-6 space-y-4"
          >
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star
                  key={j}
                  className={`w-4 h-4 ${j < r.rating ? "fill-caramel text-caramel" : "text-muted-foreground"}`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">"{r.text}"</p>
            <p className="font-heading font-semibold text-sm text-foreground">{r.name}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
