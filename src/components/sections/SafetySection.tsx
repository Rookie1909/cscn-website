import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';

export function SafetySection() {
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
            <div>
              <h2 className="text-3xl lg:text-4xl font-headline font-bold text-foreground mb-2">
                sicher unterwegs
              </h2>
              <p className="text-primary font-medium text-xl">geschützter Raum</p>
            </div>

            <p className="text-muted-foreground font-sans leading-relaxed">
              Als Cannabis Social Club Nordheide legen wir großen Wert auf Prävention, Jugendschutz und Gesundheitsschutz. Unsere Präventionsbeauftragte stellt sicher, dass alle Maßnahmen zum Schutz der Mitglieder eingehalten werden und bietet Unterstützung für Mitglieder mit problematischem Konsumverhalten.
            </p>

            <div className="p-6 bg-muted border border-border rounded-xl">
              <p className="text-muted-foreground text-sm font-sans leading-relaxed italic">
                Bitte beachte, dass der Bezug von Cannabisprodukten exklusiv unseren geschätzten Mitgliedern vorbehalten sein wird. Anfragen bezüglich des Erwerbs von Cannabisprodukten ohne der Absicht unserem Verein beizutreten, bleiben unsererseits unbeantwortet. Als verantwortungsbewusster Verein legen wir größten Wert auf die Sicherheit und Zufriedenheit unserer Mitglieder. Wir distanzieren uns entschieden von illegalen Aktivitäten und verpflichten uns, die strengen Vorgaben des Cannabisgesetzes gewissenhaft einzuhalten.
              </p>
            </div>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/gesundheitsschutz" className="block group">
              <div className="p-8 border border-border rounded-2xl hover:border-primary/50 transition-all duration-500 bg-card hover:shadow-xl hover:shadow-primary/5 group-hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-headline font-bold text-foreground">
                      Gesundheits- & Jugendschutz
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-primary font-bold font-sans">
                  <span className="text-sm">Mehr erfahren</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
