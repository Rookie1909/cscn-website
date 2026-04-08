import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export function ImpressumContent() {
  const { t } = useTranslation();

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Impressum */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-headline font-bold text-foreground mb-6 border-b border-border pb-2">
                {t('impressum.imprint.title')}
              </h2>

              <div className="space-y-4 text-muted-foreground font-sans">
                <div>
                  <p className="font-bold text-foreground">Cannabis Social Club Nordheide e.V.</p>
                  <p>Bahnhofstraße 1</p>
                  <p>21244 Buchholz</p>
                </div>

                <div>
                  <p>{t('impressum.imprint.labels.phone')}</p>
                  <p>
                    {t('impressum.imprint.labels.email')}{" "}
                    <a
                      href="mailto:info@csc-nordheide.de"
                      className="text-primary hover:text-primary/80 font-bold underline underline-offset-4"
                    >
                      info@csc-nordheide.de
                    </a>
                  </p>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <p className="font-bold text-foreground mb-3">
                    {t('impressum.imprint.labels.auth_rep')}
                  </p>

                  <div className="space-y-6">
                    <div>
                      <p className="font-bold text-primary mb-1 text-sm uppercase tracking-wider">{t('impressum.imprint.labels.board')}</p>
                      <p className="text-foreground font-medium">Joel Grospitz</p>
                      <p>c/o Bahnhofstraße 1</p>
                      <p>21244 Buchholz in der Nordheide</p>
                      <p>
                        {t('impressum.imprint.labels.email')}{" "}
                        <a
                          href="mailto:vorstand@csc-nordheide.de"
                          className="text-primary hover:text-primary/80 font-bold"
                        >
                          vorstand@csc-nordheide.de
                        </a>
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-primary mb-1 text-sm uppercase tracking-wider">{t('impressum.imprint.labels.deputy_board')}</p>
                      <p className="text-foreground font-medium">Nils M. Matthiesen</p>
                      <p>c/o Bahnhofstraße 1</p>
                      <p>21244 Buchholz in der Nordheide</p>
                      <p>
                        {t('impressum.imprint.labels.email')}{" "}
                        <a
                          href="mailto:nmatthiesen@csc-nordheide.de"
                          className="text-primary hover:text-primary/80 font-bold"
                        >
                          nmatthiesen@csc-nordheide.de
                        </a>
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-primary mb-1 text-sm uppercase tracking-wider">{t('impressum.imprint.labels.treasurer')}</p>
                      <p className="text-foreground font-medium">Konstantin Seitz</p>
                      <p>c/o Bahnhofstraße 1</p>
                      <p>21244 Buchholz in der Nordheide</p>
                      <p>
                        {t('impressum.imprint.labels.email')}{" "}
                        <a
                          href="mailto:kseitz@csc-nordheide.de"
                          className="text-primary hover:text-primary/80 font-bold"
                        >
                          kseitz@csc-nordheide.de
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <p><span className="font-bold text-foreground">{t('impressum.imprint.labels.court')}</span> Amtsgericht Tostedt</p>
                  <p><span className="font-bold text-foreground">{t('impressum.imprint.labels.reg_num')}</span> VR 201607</p>
                </div>

                <div className="pt-4 border-t border-border/50 text-sm">
                  <p className="italic underline underline-offset-4 mb-2">{t('impressum.imprint.labels.responsible')}</p>
                  <p className="text-foreground font-medium">Joel Grospitz</p>
                  <p>Bahnhofstraße 1</p>
                  <p>21244 Buchholz in der Nordheide</p>
                </div>

                <div className="pt-4 border-t border-primary/20 bg-primary/5 p-4 rounded-xl">
                  <p className="font-bold text-primary mb-1 uppercase tracking-wider text-xs">{t('gesundheitsschutz.contact.role')}</p>
                  <p className="text-foreground">c/o Bahnhofsstraße 1</p>
                  <p className="text-foreground">21244 Buchholz</p>
                  <p className="mt-2">
                    {t('impressum.imprint.labels.email')}{" "}
                    <a
                      href="mailto:praevention@csc-nordheide.de"
                      className="text-primary hover:text-primary/80 font-bold underline"
                    >
                      praevention@csc-nordheide.de
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:flex items-center justify-center"
          >
            <img
              src="/images/cannabis-branch.png"
              alt="Cannabis Zweig"
              className="max-w-sm opacity-80"
            />
          </motion.div>
        </div>

        {/* Datenschutzerklärung */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 pt-16 border-t border-border"
        >
          <h2 className="text-3xl font-headline font-bold text-foreground mb-10 border-b border-border pb-2">
            {t('impressum.privacy.title')}
          </h2>

          <div className="space-y-12 text-muted-foreground font-sans leading-relaxed">
            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
              <h3 className="text-xl font-headline font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                {t('impressum.privacy.preamble.title')}
              </h3>
              <p>
                {t('impressum.privacy.preamble.content')}
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
              <h3 className="text-xl font-headline font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                {t('impressum.privacy.responsible.title')}
              </h3>
              <div className="text-foreground font-medium">
                <p className="font-bold">Cannabis Social Club Nordheide e.V.</p>
                <p>Bahnhofstraße 1</p>
                <p>21244 Buchholz</p>
                <p className="mt-2">{t('impressum.imprint.labels.email')} <span className="text-primary">info@csc-nordheide.de</span></p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-muted/30 p-8 rounded-2xl border border-border">
                <h3 className="text-lg font-headline font-bold text-foreground mb-4">
                  {t('impressum.privacy.data_types.title')}
                </h3>
                <ul className="space-y-2">
                  {(t('impressum.privacy.data_types.list', { returnObjects: true }) as string[]).map(item => (
                    <li key={item} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-muted/30 p-8 rounded-2xl border border-border">
                <h3 className="text-lg font-headline font-bold text-foreground mb-4">
                  {t('impressum.privacy.subjects.title')}
                </h3>
                <ul className="space-y-2">
                  {(t('impressum.privacy.subjects.list', { returnObjects: true }) as string[]).map(item => (
                    <li key={item} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-primary/5 p-8 rounded-2xl border border-primary/20">
              <h3 className="text-xl font-headline font-bold text-primary mb-6">
                {t('impressum.privacy.purposes.title')}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {(t('impressum.privacy.purposes.list', { returnObjects: true }) as string[]).map(item => (
                  <div key={item} className="flex items-start gap-3 p-3 bg-background rounded-xl border border-primary/10">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-foreground leading-tight">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
