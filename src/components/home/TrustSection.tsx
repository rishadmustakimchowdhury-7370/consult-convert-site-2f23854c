import { motion } from "framer-motion";

export const TrustSection = () => {
  const logos = ["TechCorp", "CloudBase", "DataSync", "SecureNet", "AIVentures", "ScalePro"];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center space-y-6 mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Engineered for Performance.{" "}
            <span className="gradient-text">Trusted for Security.</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We combine artificial intelligence, scalable cloud architecture, cybersecurity expertise, and technical SEO strategy to build digital systems that drive measurable business growth.
          </p>
        </motion.div>

        {/* Client logo placeholders */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-14"
        >
          {logos.map((name, idx) => (
            <div
              key={idx}
              className="text-muted-foreground/30 font-heading font-bold text-xl md:text-2xl tracking-wider hover:text-muted-foreground/60 transition-colors duration-300"
            >
              {name}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
