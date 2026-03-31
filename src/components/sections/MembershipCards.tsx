import { motion } from 'framer-motion';
import { Check, ArrowRight, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

const memberships = [
  {
    name: 'Standard-Mitgliedschaft',
    price: '0,-€',
    priceNote: 'Aufnahmegebühr!',
    monthly: 'Monatlicher Mindestbeitrag 50€',
    features: [
      'Zugriff auf das Standardsortiment (Blüten- und Haschischprodukte)',
      'Bezug von Stecklingen für den Eigenanbau (demnächst)',
      'kein Zugriff auf Testgenetiken (Cannabisblüten)',
      'keine Reservierungsmöglichkeit',
      'Upgrade zur Supporter-Mitgliedschaft ist jederzeit möglich',
    ],
    cta: 'Mitgliedsantrag Standard-Mitgliedschaft',
    highlighted: false,
  },
  {
    name: 'Supporter-Mitgliedschaft',
    price: '300,-€',
    priceNote: 'einmalige Aufnahmegebühr!',
    monthly: 'Monatlicher Mindestbeitrag 50€',
    features: [
      '25% Vergünstigung auf alle Pauschalen/Beiträge/TopUps',
      'Alle 6 Monate ein Premium-Steckling für den Homegrow (optional)',
      'Exklusiver Zugriff auf limitierte Testgenetiken (Cannabisblüten)',
      'Reservierungsmöglichkeit für Lieblingssorten (demnächst)',
      'ein offizielles CSC Nordheide e.V. Polo-Shirt/T-Shirt',
    ],
    cta: 'Mitgliedsantrag Supporter-Mitgliedschaft',
    highlighted: true,
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

export function MembershipCards() {
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
          <p className="text-primary text-sm font-bold tracking-widest uppercase mb-4 font-sans">
            Gemeinsam ans Ziel
          </p>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-24 bg-border" />
            <Leaf className="w-6 h-6 text-primary" />
            <div className="h-px w-24 bg-border" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-headline font-black text-foreground">
            Unsere Mitgliedschaften
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-8"
        >
          {memberships.map((membership) => (
            <motion.div
              key={membership.name}
              variants={itemVariants}
              className={`relative p-8 rounded-[2rem] border transition-all duration-500 shadow-xl ${
                membership.highlighted
                  ? 'border-primary/50 bg-primary/5 ring-4 ring-primary/5'
                  : 'border-border bg-card'
              } hover:border-primary/40 group`}
            >
               {/* Cannabis leaf decoration */}
               <div className="absolute top-6 right-6">
                 <Leaf className={`w-8 h-8 transition-transform duration-700 group-hover:rotate-12 ${
                   membership.highlighted ? 'text-primary/20' : 'text-muted-foreground/10'
                 }`} />
               </div>

               <h3 className="text-2xl font-headline font-black text-foreground mb-4">
                 {membership.name}
               </h3>

               <p className="text-muted-foreground font-sans text-sm mb-6 leading-relaxed">
                 Für die {membership.name} ist eine{' '}
                 <span className={membership.highlighted ? 'text-foreground font-bold' : ''}>
                   {membership.highlighted ? 'einmalige' : 'entfällt die'}
                 </span>{' '}
                 Aufnahmegebühr von {membership.highlighted ? '300,-€' : 'komplett'} zu zahlen.
                 {membership.highlighted
                   ? ' Die Supporter-Mitgliedschaft enthält:'
                   : ' In der Standard-Mitgliedschaft enthalten:'}
               </p>

               <div className="mb-6">
                 <p className="text-primary font-bold font-sans">{membership.monthly}</p>
               </div>

              <ul className="space-y-3 mb-8">
                 {membership.features.map((feature) => (
                   <li key={feature} className="flex items-start gap-3">
                     <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                     <span className="text-muted-foreground font-sans text-sm font-medium">{feature}</span>
                   </li>
                 ))}
              </ul>

               <div className="pt-6 border-t border-border">
                 <div className="text-center mb-6">
                   <span
                     className={`text-4xl font-headline font-black ${
                       membership.highlighted ? 'text-primary' : 'text-muted-foreground'
                     }`}
                   >
                     {membership.price}
                   </span>
                   <p className="text-muted-foreground/60 font-sans text-xs mt-1 uppercase tracking-widest">{membership.priceNote}</p>
                 </div>

                 <Button
                    asChild
                    variant={membership.highlighted ? 'default' : 'outline'}
                    size="lg"
                    className={`w-full rounded-xl font-bold font-sans h-12 shadow-lg transition-all active:scale-[0.98] ${
                      membership.highlighted ? 'shadow-primary/20' : 'border-border'
                    }`}
                  >
                   <a 
                     href="https://easyverein.com/public/CSCN/applicationform/9895"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex items-center gap-2"
                   >
                     {membership.cta}
                     <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                   </a>
                 </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
