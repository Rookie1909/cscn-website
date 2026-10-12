import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { CannabisLeaf } from '@/components/icons/CannabisLeaf';
import { Button } from '@/components/ui/button';

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
  const { t } = useTranslation();

  const memberships = [
    {
      id: 'standard',
      name: t('membership_cards.standard.name'),
      price: '0,-€',
      priceNote: t('membership_cards.standard.priceNote'),
      monthly: t('membership_cards.standard.monthly'),
      description: t('membership_cards.standard.description'),
      features: t('membership_cards.standard.features', { returnObjects: true }) as string[],
      cta: t('membership_cards.standard.cta'),
      highlighted: false,
    },
    {
      id: 'supporter',
      name: t('membership_cards.supporter.name'),
      price: '300,-€',
      priceNote: t('membership_cards.supporter.priceNote'),
      monthly: t('membership_cards.supporter.monthly'),
      description: t('membership_cards.supporter.description'),
      features: t('membership_cards.supporter.features', { returnObjects: true }) as string[],
      cta: t('membership_cards.supporter.cta'),
      highlighted: true,
    },
  ];

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
            {t('membership_cards.badge')}
          </p>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-24 bg-border" />
            <CannabisLeaf size={24} className="text-primary" />
            <div className="h-px w-24 bg-border" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-headline font-black text-foreground">
            {t('membership_cards.title')}
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-8 pt-4"
        >
          {memberships.map((membership) => {
            const body = (
              <>
                {/* Cannabis leaf decoration */}
                <div className="absolute top-6 right-6">
                  <CannabisLeaf
                    size={32}
                    className={`transition-transform duration-700 group-hover:rotate-12 ${
                      membership.highlighted ? 'text-primary/30' : 'text-muted-foreground/10'
                    }`}
                  />
                </div>

                <h3 className="text-2xl font-headline font-black text-foreground mb-4 break-words hyphens-auto">
                  {membership.name}
                </h3>

                <p className="text-muted-foreground font-sans text-sm mb-6 leading-relaxed">
                  {membership.description}
                </p>

                <div className="mb-6">
                  <p className="text-primary font-bold font-sans">{membership.monthly}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {membership.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      {membership.highlighted ? (
                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/15">
                          <Check className="h-3.5 w-3.5 text-primary" strokeWidth={3} />
                        </span>
                      ) : (
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`font-sans text-sm font-medium ${
                          membership.highlighted ? 'text-foreground/90' : 'text-muted-foreground'
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="pt-6 border-t border-border">
                  <div className="text-center mb-6">
                    <span
                      className={`font-headline font-black ${
                        membership.highlighted ? 'text-5xl text-primary' : 'text-4xl text-muted-foreground'
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
                      membership.highlighted ? 'cta-shimmer relative overflow-hidden shadow-primary/30' : 'border-border'
                    }`}
                  >
                    <a
                      href="https://account.cannanas.club/register-frame/E_2wFxpO8552VfJEpC3Kt_nVI8u-5Pie"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 text-center"
                    >
                      {membership.cta}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </div>
              </>
            );

            // Supporter: Verlaufsrahmen, Leuchten, leicht angehoben, Abzeichen „Empfohlen“.
            if (membership.highlighted) {
              return (
                <motion.div key={membership.id} variants={itemVariants} className="group relative lg:-translate-y-3">
                  {/* weiches Leuchten hinter der Karte */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-2 rounded-[2.5rem] bg-primary/25 blur-2xl opacity-60 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <div className="relative h-full rounded-[2rem] bg-gradient-to-br from-primary via-primary/40 to-primary p-[2px] shadow-2xl shadow-primary/20">
                    <div className="relative h-full overflow-hidden rounded-[calc(2rem-2px)] bg-card p-5 pt-9 sm:p-8 sm:pt-10">
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/15 via-primary/5 to-transparent"
                      />
                      <div className="relative">{body}</div>
                    </div>
                  </div>
                  <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-4 py-1.5 font-sans text-[11px] font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/30">
                      <Sparkles className="h-3.5 w-3.5" />
                      {t('membership_cards.supporter.badge')}
                    </span>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={membership.id}
                variants={itemVariants}
                className="relative p-5 sm:p-8 rounded-[2rem] border border-border bg-card shadow-xl transition-all duration-500 hover:border-primary/40 group"
              >
                {body}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
