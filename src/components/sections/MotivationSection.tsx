import { motion } from 'framer-motion';
import { FlaskConical, Leaf, Sprout } from 'lucide-react';

const features = [
  {
    icon: FlaskConical,
    title: 'Qualitätsansprüche',
    subtitle: 'ausgiebig getestet',
    description: 'wir testen in umfangreichen Probenahmen auf THC/CBD Gehalte und Qualität',
  },
  {
    icon: Leaf,
    title: 'Sortenvielfalt',
    subtitle: 'vielfältige Auswahl',
    description: 'wir wollen eine ansprechende Sortenauswahl - immer das richtige Kraut',
  },
  {
    icon: Sprout,
    title: '100% Organisch',
    subtitle: 'natürlicher Anbau',
    description: 'wir werden keine chemischen oder synthetischen Dünger in der Zucht verwenden',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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

export function MotivationSection() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-headline font-bold text-foreground mb-2">
            Unsere Motivation
          </h2>
          <p className="text-primary font-medium text-lg">saubere Blüten</p>
        </motion.div>

        {/* Intro Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-muted-foreground font-sans text-center max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Unsere Motivation ist es, jedem Mitglied den freien Zugang zu kontrolliert angebautem, qualitativ hochwertigem Cannabis zu ermöglichen, ohne dabei auf den Schwarzmarkt und die damit einhergehenden Risiken zurückgreifen zu müssen.
        </motion.p>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group p-8 border border-border rounded-2xl hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 bg-card/50 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-foreground font-headline font-semibold text-lg">{feature.title}</h3>
                  <p className="text-primary text-sm font-medium">{feature.subtitle}</p>
                </div>
              </div>
              <p className="text-muted-foreground font-sans text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
