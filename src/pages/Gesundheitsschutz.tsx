import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Shield, FileText, Mail, Heart, UserCheck, AlertTriangle, EyeOff, MapPin, Search } from 'lucide-react';
import { PageHero } from '@/components/sections/PageHero';
import { Button } from '@/components/ui/button';

export function Gesundheitsschutz() {
  const { t } = useTranslation();

  const sections = [
    {
      title: t('gesundheitsschutz.sections.child_protection.title'),
      icon: Shield,
      content: t('gesundheitsschutz.sections.child_protection.content'),
    },
    {
      title: t('gesundheitsschutz.sections.signage.title'),
      icon: EyeOff,
      content: t('gesundheitsschutz.sections.signage.content'),
    },
    {
      title: t('gesundheitsschutz.sections.applications.title'),
      icon: FileText,
      content: t('gesundheitsschutz.sections.applications.content'),
    },
    {
      title: t('gesundheitsschutz.sections.brochures.title'),
      icon: Search,
      content: t('gesundheitsschutz.sections.brochures.content'),
    },
    {
      title: t('gesundheitsschutz.sections.entrance_controls.title'),
      icon: UserCheck,
      content: t('gesundheitsschutz.sections.entrance_controls.content'),
    },
    {
      title: t('gesundheitsschutz.sections.advertising_ban.title'),
      icon: AlertTriangle,
      content: t('gesundheitsschutz.sections.advertising_ban.content'),
    },
    {
      title: t('gesundheitsschutz.sections.minimum_distance.title'),
      icon: MapPin,
      content: t('gesundheitsschutz.sections.minimum_distance.content'),
    },
    {
      title: t('gesundheitsschutz.sections.property_protection.title'),
      icon: Shield,
      content: t('gesundheitsschutz.sections.property_protection.content'),
    },
    {
      title: t('gesundheitsschutz.sections.product_protection.title'),
      icon: Heart,
      content: t('gesundheitsschutz.sections.product_protection.content'),
    },
    {
      title: t('gesundheitsschutz.sections.child_welfare.title'),
      icon: AlertTriangle,
      content: t('gesundheitsschutz.sections.child_welfare.content'),
    },
    {
      title: t('gesundheitsschutz.sections.youth_institutions.title'),
      icon: Mail,
      content: t('gesundheitsschutz.sections.youth_institutions.content'),
    },
    {
      title: t('gesundheitsschutz.sections.entry_ban.title'),
      icon: EyeOff,
      content: t('gesundheitsschutz.sections.entry_ban.content'),
    },
    {
      title: t('gesundheitsschutz.sections.instruction.title'),
      icon: UserCheck,
      content: t('gesundheitsschutz.sections.instruction.content'),
    },
    {
      title: t('gesundheitsschutz.sections.special_measures.title'),
      icon: Shield,
      content: t('gesundheitsschutz.sections.special_measures.content'),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-background min-h-screen">
      <PageHero
        title={t('gesundheitsschutz.hero.title')}
        description={t('gesundheitsschutz.hero.description')}
        backgroundImage="/images/prevention.jpg"
      />

      <section className="py-24 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid lg:grid-cols-2 gap-8 mb-20">
            {/* Prevention Document Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 border border-border rounded-3xl bg-card hover:border-primary/50 transition-all duration-300 shadow-xl shadow-black/5 flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-headline font-bold text-foreground mb-4">
                  {t('gesundheitsschutz.prevention.title')}
                </h3>
                <p className="text-muted-foreground font-sans leading-relaxed mb-8">
                  {t('gesundheitsschutz.prevention.description')}
                </p>
              </div>
              <Button asChild size="lg" className="w-full sm:w-auto font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                <a href="/documents/Kurzinformation_Praevention.pdf" target="_blank" rel="noopener noreferrer">
                  {t('gesundheitsschutz.prevention.button')}
                </a>
              </Button>
            </motion.div>

            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 border border-border rounded-3xl bg-card hover:border-primary/50 transition-all duration-300 shadow-xl shadow-black/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10" />
              
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 relative">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-headline font-bold text-foreground mb-4">
                {t('gesundheitsschutz.contact.title')}
              </h3>
              <div className="space-y-4 text-muted-foreground font-sans relative">
                <p className="font-bold text-foreground text-lg">Rike Koop</p>
                <div className="space-y-1">
                  <p className="text-sm uppercase tracking-wider text-primary font-bold">{t('gesundheitsschutz.contact.role')}</p>
                  <p>c/o Bahnhofsstraße 1</p>
                  <p>21244 Buchholz</p>
                </div>
                <div className="pt-4 mt-4 border-t border-border">
                  <a href="mailto:praevention@csc-nordheide.de" className="text-primary hover:text-primary/80 transition-colors font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    praevention@csc-nordheide.de
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Detailed Content */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-headline font-black text-foreground mb-6">{t('gesundheitsschutz.concept.title')}</h2>
              <p className="text-xl text-primary font-bold">{t('gesundheitsschutz.concept.subtitle')}</p>
              <p className="mt-4 text-muted-foreground font-sans">{t('gesundheitsschutz.concept.intro')}</p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-6"
            >
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="p-6 sm:p-8 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start gap-4 sm:gap-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <h4 className="text-xl font-headline font-bold text-foreground">
                          {section.title}
                        </h4>
                        <div className="text-muted-foreground font-sans leading-relaxed space-y-2 whitespace-pre-line text-sm sm:text-base">
                          {section.content}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
