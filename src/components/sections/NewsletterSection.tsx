import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

export function NewsletterSection() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && consent) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
        setConsent(false);
      }, 3000);
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-6"
        >
          <h2 className="text-3xl lg:text-4xl font-headline font-bold text-foreground">
            {t('home.newsletter.title')}
          </h2>

          <p className="text-muted-foreground font-sans text-lg">
            {t('home.newsletter.subtitle')}
          </p>

          <p className="text-muted-foreground/80 font-sans text-sm leading-relaxed">
            {t('home.newsletter.description')}
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 p-6 bg-primary/10 border border-primary/30 rounded-2xl"
            >
              <Check className="w-6 h-6 text-primary" />
              <span className="text-primary font-bold font-sans">
                {t('home.newsletter.success')}
              </span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder={t('home.newsletter.email_placeholder')}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-12 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked as boolean)}
                  className="mt-1 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label htmlFor="consent" className="text-muted-foreground font-sans text-sm text-left leading-snug">
                  <span className="text-destructive">*</span> {t('home.newsletter.consent_label')}
                </label>
              </div>

              <Button
                type="submit"
                disabled={!consent}
                className="w-full sm:w-auto px-10 h-12 rounded-full font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                {t('home.newsletter.button')}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
