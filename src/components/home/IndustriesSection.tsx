import { motion } from "framer-motion";
import { Layers, ShoppingCart, Landmark, Building2, Palette } from "lucide-react";

const industries = [
  { icon: Layers, title: "SaaS & Startups" },
  { icon: ShoppingCart, title: "eCommerce & Retail" },
  { icon: Landmark, title: "FinTech & Technology" },
  { icon: Building2, title: "Corporate Enterprises" },
  { icon: Palette, title: "Digital Agencies" },
];

export const IndustriesSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-section-bg to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">Industries</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Industries <span className="gradient-text">We Serve</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {industries.map((industry, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card p-6 text-center group hover:bg-white/10 hover:border-primary/30 transition-all duration-500"
            >
              <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
                <industry.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-sm">{industry.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
