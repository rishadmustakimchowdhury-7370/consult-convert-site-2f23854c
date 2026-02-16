import { motion } from "framer-motion";
import { Bot, Shield, Cloud, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI-First Architecture",
    description: "Every solution is engineered with intelligent automation at its core, driving efficiency and innovation.",
  },
  {
    icon: Shield,
    title: "Security-Integrated Systems",
    description: "Enterprise-grade security baked into every layer — from authentication to infrastructure protection.",
  },
  {
    icon: Cloud,
    title: "Cloud-Scalable Infrastructure",
    description: "Built on cloud-native architecture that scales seamlessly from startup to enterprise workloads.",
  },
  {
    icon: BarChart3,
    title: "Data-Driven SEO Optimization",
    description: "Technical SEO strategies powered by analytics to maximize organic visibility and search performance.",
  },
];

export const FeatureHighlight = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-section-bg via-background to-section-bg" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Built for Scale. Designed for Growth.{" "}
            <span className="gradient-text">Secured by Architecture.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card p-8 text-center group hover:bg-white/10 hover:border-primary/30 transition-all duration-500"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-6 group-hover:from-primary/25 group-hover:to-accent/25 transition-all">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
