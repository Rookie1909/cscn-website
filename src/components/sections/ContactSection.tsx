import { motion } from 'framer-motion';
import { MapPin, Mail, ArrowRight } from 'lucide-react';

export function ContactSection() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl lg:text-4xl font-headline font-bold text-foreground">
              Informier dich!
            </h2>

            <p className="text-muted-foreground font-sans leading-relaxed">
              Schreib uns einfach eine E-Mail und wir versuchen dir mit Rat und Tat zur Seite zu stehen.
            </p>

            <a
              href="mailto:info@csc-nordheide.de"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-bold font-sans group transition-colors"
            >
              Nimm Kontakt auf!
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <a
              href="https://www.google.de/maps/place/21244+Buchholz+in+der+Nordheide"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 bg-card border border-border rounded-xl hover:border-primary/50 transition-all duration-300 hover:shadow-lg group shadow-sm"
            >
              <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <span className="text-foreground font-sans font-medium transition-colors">
                21244 Buchholz
              </span>
            </a>

            <a
              href="mailto:info@csc-nordheide.de"
              className="flex items-center gap-4 p-5 bg-card border border-border rounded-xl hover:border-primary/50 transition-all duration-300 hover:shadow-lg group shadow-sm"
            >
              <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <span className="text-primary font-sans font-bold transition-colors">
                info@csc-nordheide.de
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
