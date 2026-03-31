import { motion } from 'framer-motion';
import { Shield, FileText, Mail, Heart, UserCheck, AlertTriangle, EyeOff, MapPin, Search } from 'lucide-react';
import { PageHero } from '@/components/sections/PageHero';
import { Button } from '@/components/ui/button';

const sections = [
  {
    title: 'Kinder- und Jugendschutz',
    icon: Shield,
    content: 'Hinweise innerhalb der Anbauvereinigung auf das KCanG in Bezug auf Kinder und Jugendschutz.',
  },
  {
    title: 'Beschilderungen',
    icon: EyeOff,
    content: 'Um wenig Aufmerksamkeit zu erregen, wird auf Außenbeschilderung weitestgehend verzichtet und auf das nötigste beschränkt. In jedem Eingangsbereich der befriedeten Besitztümer der Anbauvereinigung wird durch Beschilderung darauf hingewiesen, dass der Zutritt der Räumlichkeiten nach KCanG erst ab 18 Jahren und für Kinder und Jugendliche verboten ist.',
  },
  {
    title: 'Mitgliedsanträge',
    icon: FileText,
    content: 'Beim Mitgliedsantrag wird der Antragstellende sowohl explizit auf das Präventionskonzept, sowie auch auf die Vorschriften des KCanG und auf die Dokumente "Informationen zu Cannabis & Wichtige Hinweise zum Konsum von Cannabis" der BzgA hingewiesen. Dies geschieht durch die Vorlage dessen in Papierform oder als digitales Dokument beim Online-Antrag. Das Mitglied unterzeichnet mit dem Mitgliedsantrag, dass es diese Informationen gelesen hat und akzeptiert.',
  },
  {
    title: 'Broschüren',
    icon: Search,
    content: 'In der Anbauvereinigung werden sowohl das KCanG, sowie auch die Infomaterialien der BzgA gut sichtbar ausgelegt.',
  },
  {
    title: 'Eingangskontrollen',
    icon: UserCheck,
    content: 'An jedes Mitglied unserer Anbauvereinigung wird ein Mitgliedsausweis ausgegeben. Dieser Mitgliederausweis wird sowohl für den Zugang zu den Ausgaberäumen, sowie für die Überprüfung der Abholdaten genutzt.\nBei Betreten eines befriedeten Besitztums der Anbauvereinigung, wird das betretende Mitglied zusätzlich und bei Zweifel an der Identität von einem ausgebenden Mitglied oder einem Vertreter der Anbauvereinigung durch die Überprüfung des Lichtbildausweises kontrolliert.',
  },
  {
    title: 'Werbungsverbot',
    icon: AlertTriangle,
    content: 'Keine Beschilderungen. Keine Werbung oder Sponsoring. Die Anbauvereinigung schaltet keine Werbung. Über bestehende Social Media Konten wird lediglich informiert.',
  },
  {
    title: 'Mindestabstand',
    icon: MapPin,
    content: 'Jedes befriedete Besitztum der Anbauvereinigung befindet sich mehr als 200m von Schulen, Kinder- und Jugendeinrichtungen sowie Kinderspielplätzen entfernt.',
  },
  {
    title: 'Schutzmaßnahmen der Immobilie(n)',
    icon: Shield,
    content: 'Auf eine Beschilderung der befriedeten Besitztümer der Anbauvereinigung wird vollständig verzichtet. Die befriedeten Besitztümer unserer Anbauvereinigung haben ein Klingelschild, welches an den Eingängen zu den Räumen der Anbauvereinigung angebracht wird. Auf jede andere Außenbeschilderung wird verzichtet.',
  },
  {
    title: 'Schutzmaßnahmen bei Cannabisprodukten',
    icon: Heart,
    content: 'Die Cannabiskonsumgüter (Cannabisblüte und Haschisch), werden in einem kindersicheren, neutralen Behälter ausgegeben. Zudem liegt dem Produkt eine jeweilige Produktbeschreibung bei, welche neben den genauen Inhaltsstoffen THC/CBD Gehalt, den gesundheitlichen Risiken und Hinweise zu Verwendung und Anwendung des Cannabis-Produktes, explizit auffordern, das Produkt von Kindern fernzuhalten und außerhalb der Reichweite von Kindern und Jugendlichen aufzubewahren.\nDas zur Ausgabe bereitgestellte Vermehrungsmaterial stellt bis auf die Saat keine aktive Gefahr für Kinder und Jugendliche dar. Auf der Verpackung der Saat, ist ein Hinweis, dass Kleinkinder sich daran verschlucken könnten. Auf den Verpackungen von allen Vermehrungsmaterialien ist vermerkt, dass das Produkt von Kindern und Jugendlichen fern zu halten ist.',
  },
  {
    title: 'Umgang mit Kindeswohlgefährdung',
    icon: AlertTriangle,
    content: 'Die Cannabis Anbauvereinigung hat im Ablauf ihrer Tätigkeiten keinen Kontakt zu Kindern und Minderjährigen. Sollte im Ablaufverfahren der Tätigkeit, die Anbauvereinigung darauf aufmerksam werden, dass Mitglieder das gemeinschaftlich hergestellte Cannabis und Vermehrungsmaterial an Minderjährige weitergeben, ist in der Satzung des Vereins festgelegt, dass die Weitergabe an Dritte und vor allem an Minderjährige zum sofortigen Ausschluss aus der Anbauvereinigung führt.\nDie ausgebenden Mitglieder werden, über die Meldekette und Maßnahmen innerhalb der Anbauvereinigung in einem Falle von Kindeswohlgefährdung aufgeklärt. Zudem liegen im Arbeitsbereich der ausgebenden Mitglieder, Dokumente, welche noch einmal die notwendigen Aktionen in so einem Falle klar erläutern.\nDas ausgebende Mitglied stellt sicher, dass es in so einem Falle unverzüglich den Präventionsbeauftragten oder bei dessen Abwesenheit ein Vorstandsmitglied der Anbauvereinigung benachrichtigt. Diese Instanzen der Anbauvereinigung sind dann dafür zuständig sofortige Maßnahmen einzuleiten, welche aus der Inanspruchnahme der niedrigschwelligen Verbindung zur lokalen Jugendhilfe besteht.\nJede dieser Maßnahmen wird ordnungsgemäß dokumentiert.',
  },
  {
    title: 'Kontakt zu Jugendschutzeinrichtung',
    icon: Mail,
    content: 'Die Anbauvereinigung hat keinen regulären oder regelmäßigen Kontakt mit Jugendhilfe Einrichtungen. Mit der lokalen Jugendhilfe wird eine Absprache erarbeitet, wie ein niederschwelliger Kontakt zwischen Anbauvereinigung, betroffenem Mitglied oder Kind und der Judenshilfestelle im Bedarfsfall hergestellt werden kann.\nDieser Kontakt wird dokumentiert.',
  },
  {
    title: 'Eintrittsverbot für befriedetes Besitztum',
    icon: EyeOff,
    content: 'Die Unterweisung, welche die in der Ausgabe tätigen Mitglieder unserer Cannabis Anbauvereinigung absolvieren müssen, soll sicherstellen, dass sie über das notwendige Wissen und die Fähigkeiten verfügen, um die geltenden Gesetze und Richtlinien einzuhalten, sowie das Eintrittsverbot für Kinder und Jugendliche sicherzustellen.',
  },
  {
    title: 'Unterweisung der Mitglieder',
    icon: UserCheck,
    content: 'Alle ausgebenden Mitglieder, sowie auch Vorstände und andere Verantwortungsträger der Anbauvereinigung werden von dem extern geschulten Präventionsbeauftragten in den Bereichen Kinder- und Jugendschutz, Gesundheitsschutz und Prävention unterwiesen.',
  },
  {
    title: 'Besondere Maßnahmen (18-21 Jährige)',
    icon: Shield,
    content: 'Die 18–21-jährigen Mitglieder haben eine Mitgliedsnummer, unter welcher klar vermerkt ist, dass maximal 30 Gramm Cannabis im Monat (maximal 25g pro Tag) mit maximal 10% THC Wert weitergegeben werden darf.',
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

export function Gesundheitsschutz() {
  return (
    <div className="bg-background min-h-screen">
      <PageHero
        title="Gesundheits- & Jugendschutz"
        description="Verantwortungsvoller Umgang und höchste Sicherheitsstandards im CSC Nordheide."
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
                  Präventionskonzept
                </h3>
                <p className="text-muted-foreground font-sans leading-relaxed mb-8">
                  Laden Sie sich unsere detaillierte Kurzinformation zur Prävention als PDF herunter, um alle wichtigen Informationen auf einen Blick zu haben.
                </p>
              </div>
              <Button asChild size="lg" className="w-full sm:w-auto font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                <a href="/documents/Kurzinformation_Praevention.pdf" target="_blank" rel="noopener noreferrer">
                  Kurzinformation zur Prävention PDF
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
                Präventionsverantwortliche
              </h3>
              <div className="space-y-4 text-muted-foreground font-sans relative">
                <p className="font-bold text-foreground text-lg">Rike Koop</p>
                <div className="space-y-1">
                  <p className="text-sm uppercase tracking-wider text-primary font-bold">Verbraucherschutz & Suchtprävention</p>
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
              <h2 className="text-3xl lg:text-5xl font-headline font-black text-foreground mb-6">Jugend- und Gesundheitsschutzkonzept</h2>
              <p className="text-xl text-primary font-bold">Hinweise des KCAng zum Kinder und Jugendschutz</p>
              <p className="mt-4 text-muted-foreground font-sans">Auszug aus unserem Konzept (§2). Wir verpflichten uns zur Einhaltung folgender Punkte:</p>
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
