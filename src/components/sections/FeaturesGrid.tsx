import { motion } from 'framer-motion';
import { FileCheck, Zap, Microscope, Sprout, Flower2, Gem } from 'lucide-react';

const features = [
  {
    icon: FileCheck,
    title: 'Anbauerlaubnis',
    description:
      'Wir haben unsere offizielle Anbauerlaubnis nach §11 KCanG erhalten und bereits mit dem Anbau begonnen.',
  },
  {
    icon: Zap,
    title: 'Energie',
    description:
      'Wir verwenden nur erneuerbare Energie für unseren Verein und die Anbauflächen und streben an zu gegebener Zeit Cannabis auch im Gewächshaus anzubauen.',
  },
  {
    icon: Microscope,
    title: 'Qualitätskontrollen',
    description:
      'Wir bieten unseren Mitgliedern eine konstant hohe Qualität. Daher haben wir hohe Standarts eingeführt und unterziehen uns selbst strengen Kontrollen.',
  },
  {
    icon: Sprout,
    title: 'Anbauform',
    description:
      'Wir haben uns bewusst für eine möglichst nachhaltige und ressourcenschonende Anbauform entschieden. Pestizide und chemische Dünger kommen uns nicht in die Tüte.',
  },
  {
    icon: Flower2,
    title: 'Sortenvielfalt',
    description:
      'Wir bieten über 40+ rotierende Premiumsorten für unsere Mitglieder an. Von beständiger Oldschoolgenetik, bis zu den neusten Cali-Sorten ist alles vertreten.',
  },
  {
    icon: Gem,
    title: 'Exklusive Produkte',
    description:
      'Neben Cannabis als Blütenware bieten wir auch die Möglichkeit exklusive Haschischprodukte, wie Live-Extrakte zu erwerben.',
  },
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
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group p-8 border border-border rounded-2xl flex flex-col items-center text-center hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 bg-card/50 backdrop-blur-sm"
            >
              <div className="p-3 bg-primary/10 rounded-xl mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-headline font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
