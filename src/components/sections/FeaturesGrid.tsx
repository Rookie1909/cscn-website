import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FileCheck, Zap, Microscope, Sprout, Flower2, Gem } from 'lucide-react';

const featuresList = [
  { id: 'perm', icon: FileCheck },
  { id: 'energy', icon: Zap },
  { id: 'quality', icon: Microscope },
  { id: 'farming', icon: Sprout },
  { id: 'variety', icon: Flower2 },
  { id: 'exclusive', icon: Gem },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export function FeaturesGrid() {
  const { t } = useTranslation();

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuresList.map((feature) => (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              className="group p-8 border border-border rounded-2xl flex flex-col items-center text-center hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 bg-card/50 backdrop-blur-sm"
            >
              <div className="p-3 bg-primary/10 rounded-xl mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-headline font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                {t(`features.${feature.id}.title`)}
              </h3>
              <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                {t(`features.${feature.id}.desc`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
