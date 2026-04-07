import { motion } from 'framer-motion';
import { Check, ArrowRight, Flame, Timer } from 'lucide-react';
import { CannabisLeaf } from '@/components/icons/CannabisLeaf';
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

// Ticker text – plain string so it never causes layout inflation
const TICKER_TEXT =
  '\u{1F33F}\u00a0 Nur noch \u00a0wenige Pl\u00e4tze\u00a0 verf\u00fcgbar \u00a0\u00b7\u00a0 Sichere dir jetzt deinen \u00a0Early-Bird-Vorteil\u00a0 und profitiere als eines der ersten Mitglieder von der \u00a025\u00a0% Ersparnis\u00a0 \u00a0\u00b7\u00a0 Exklusiver Zugriff auf \u00a0limitierte Testgenetiken\u00a0 \u00a0\u00b7\u00a0 Jetzt Mitglied werden und dabei sein \u00a0\u{1F525}\u00a0\u00a0\u00a0\u00a0';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
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
            <CannabisLeaf size={24} className="text-primary" />
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
              className={`relative p-5 sm:p-8 rounded-[2rem] border transition-all duration-500 shadow-xl ${
                membership.highlighted
                  ? 'border-primary/50 bg-primary/5 ring-4 ring-primary/5'
                  : 'border-border bg-card'
              } hover:border-primary/40 group`}
            >
              {/* Cannabis leaf decoration */}
              <div className="absolute top-6 right-6">
                <CannabisLeaf size={32} className={`transition-transform duration-700 group-hover:rotate-12 ${
                  membership.highlighted ? 'text-primary/20' : 'text-muted-foreground/10'
                }`} />
              </div>

              <h3 className="text-2xl font-headline font-black text-foreground mb-4 break-words hyphens-auto">
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

              {/* ── Early-Bird urgency banner (Supporter only) ── */}
              {membership.highlighted && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="mb-8 rounded-xl border border-amber-600 w-full overflow-hidden dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10"
                  style={{ overflow: 'hidden' }}
                >
                  {/* Top flash bar */}
                  <div className="flex items-center justify-center text-center gap-2 px-3 sm:px-4 py-2 bg-amber-500 dark:bg-amber-500/20 border-b border-amber-600 dark:border-amber-500/30">
                    <motion.div
                      animate={{ scale: [1, 1.25, 1] }}
                      transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                    >
                      <Flame className="w-4 h-4 text-white dark:text-amber-400" />
                    </motion.div>
                    <span className="text-white dark:text-amber-400 font-black text-xs uppercase tracking-widest font-sans text-center leading-tight">
                      Limitiertes Kontingent – Nur noch wenige Plätze!
                    </span>
                    <motion.div
                      animate={{ scale: [1, 1.25, 1] }}
                      transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut', delay: 0.7 }}
                    >
                      <Flame className="w-4 h-4 text-white dark:text-amber-400" />
                    </motion.div>
                  </div>

                  <style>{`
                    @keyframes cscn-marquee {
                      0%   { transform: translateX(0); }
                      100% { transform: translateX(-50%); }
                    }
                    .cscn-ticker {
                      position: absolute;
                      top: 0; left: 0;
                      display: inline-flex;
                      white-space: nowrap;
                      animation: cscn-marquee 22s linear infinite;
                      will-change: transform;
                    }
                  `}</style>
                  <div
                    className="relative w-full"
                    style={{ height: '32px', overflow: 'hidden' }}
                  >
                    <div className="absolute inset-y-0 left-0 w-8 z-10 bg-gradient-to-r from-amber-50 dark:from-[#1c1200] to-transparent pointer-events-none" style={{ zIndex: 2 }} />
                    <div className="absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-amber-50 dark:from-[#1c1200] to-transparent pointer-events-none" style={{ zIndex: 2 }} />
                    <div
                      className="cscn-ticker text-amber-800 dark:text-amber-300/90 font-sans text-xs items-center"
                      style={{ paddingTop: '7px' }}
                    >
                      <span aria-hidden="true">{TICKER_TEXT}</span>
                      <span>{TICKER_TEXT}</span>
                    </div>
                  </div>

                  <div className="px-4 pb-3 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-black tracking-widest text-amber-700 dark:text-amber-400/80 font-sans">
                        Verfügbare Plätze
                      </span>
                      <span className="text-[10px] font-black text-amber-700 dark:text-amber-400 font-mono">
                        Schnell sein!
                      </span>
                    </div>
                    <div className="h-2 w-full bg-amber-200 dark:bg-amber-950/50 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400 dark:from-amber-500 dark:to-amber-300"
                        initial={{ width: '95%' }}
                        animate={{ width: ['72%', '68%', '72%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Timer className="w-3 h-3 text-amber-600 dark:text-amber-400/70 flex-shrink-0" />
                      <span className="text-[10px] text-amber-700 dark:text-amber-400/70 font-sans">
                        Plätze werden laufend vergeben – jetzt Early Bird sein!
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

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
                  <p className="text-muted-foreground/60 font-sans text-xs mt-1 uppercase tracking-widest">
                    {membership.priceNote}
                  </p>
                </div>

                <Button
                  asChild
                  variant={membership.highlighted ? 'default' : 'outline'}
                  size="lg"
                  className={`w-full rounded-xl font-bold font-sans h-auto min-h-[3rem] py-3 whitespace-normal text-center shadow-lg transition-all active:scale-[0.98] ${
                    membership.highlighted ? 'shadow-primary/20' : 'border-border'
                  }`}
                >
                  <a
                    href="https://easyverein.com/public/CSCN/applicationform/9895"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-center"
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
