import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const requirements = [
  'Vollendung des 18. Lebensjahres',
  'Mindestens 6 Monate Wohnsitz oder gewöhnlicher Aufenthalt in Deutschland',
  'Keine Doppelmitgliedschaften in anderen Anbauvereinigungen',
  'Monatlicher Mindestbeitrag 50€',
];

export function RequirementsSection() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-5xl font-headline font-black text-foreground tracking-tight">
            Anforderungen
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto"
        >
          {requirements.map((requirement, index) => (
            <motion.div
              key={requirement}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-5 bg-card border border-border rounded-2xl shadow-sm hover:border-primary/30 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <span className="text-muted-foreground font-sans text-sm font-medium leading-tight">{requirement}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
