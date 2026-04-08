import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Clock, ExternalLink } from 'lucide-react';

export function LocationSection() {
  const { t } = useTranslation();

  const locations = [
    {
      title: t('locations.titles.dispensary'),
      address: "Bei den Kämpen 11a, 21220 Seevetal, Deutschland",
      mapUrl: "https://www.openstreetmap.org/export/embed.html?bbox=10.015,53.340,10.035,53.355&layer=mapnik&marker=53.347184,10.024412",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Bei+den+Kämpen+11a,+21220+Seevetal",
      hours: [
        { day: t('locations.days.Mo'), time: t('locations.closed') },
        { day: t('locations.days.Di'), time: t('locations.closed') },
        { day: t('locations.days.Mi'), time: "18:00 - 20:00 Uhr" },
        { day: t('locations.days.Do'), time: t('locations.closed') },
        { day: t('locations.days.Fr'), time: "15:00 - 17:00 Uhr" },
        { day: t('locations.days.Sa'), time: "16:00 - 18:00 Uhr" },
        { day: t('locations.days.So'), time: t('locations.closed') }
      ]
    },
    {
      title: t('locations.titles.club'),
      address: "Bahnhofstraße 1, 21244 Buchholz i.d. Nordheide, Deutschland",
      mapUrl: "https://www.openstreetmap.org/export/embed.html?bbox=9.865,53.315,9.885,53.335&layer=mapnik&marker=53.324417,9.876389",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Bahnhofstraße+1,+21244+Buchholz+i.d.+Nordheide"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-black uppercase tracking-widest mb-4"
          >
            <MapPin size={12} />
            {t('locations.badge')}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-headline font-black tracking-tighter mb-6"
          >
            {t('locations.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg leading-relaxed font-medium"
          >
            {t('locations.description')}
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {locations.map((loc, idx) => (
            <motion.div
              key={loc.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="glass-card-premium p-0 overflow-hidden flex flex-col group h-full"
            >
              {/* Header */}
              <div className="p-8 pb-4">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20 group-hover:bg-primary/20 transition-all duration-500">
                    <MapPin size={24} />
                  </div>
                  <a 
                    href={loc.googleMapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors py-2 px-4 bg-muted/50 rounded-xl border border-border"
                  >
                   Google Maps <ExternalLink size={12} />
                  </a>
                </div>
                <h3 className="text-2xl font-black tracking-tight mb-2 group-hover:text-primary transition-colors">
                  {loc.title}
                </h3>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                  {loc.address}
                </p>
              </div>

              {/* Map Layout */}
              <div className="px-8 mt-2">
                <div className="aspect-video w-full rounded-2xl overflow-hidden border border-border bg-muted relative group/map">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight={0} 
                    marginWidth={0} 
                    src={loc.mapUrl}
                    className="grayscale-[0.5] contrast-[1.1] hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 pointer-events-none border-2 border-primary/0 group-hover/map:border-primary/20 transition-all duration-700" />
                </div>
              </div>

              {/* Opening Hours or Spacer */}
              <div className="p-8 pt-6 flex-grow">
                {loc.hours ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                      <Clock size={16} />
                      <span className="text-xs font-black uppercase tracking-widest">{t('locations.hours_label')}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                      {loc.hours.map((h) => (
                        <div key={h.day} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0 group/hour">
                          <span className="text-sm font-black text-foreground group-hover/hour:text-primary transition-colors">{h.day}:</span>
                          <span className={`text-sm font-medium ${h.time === t('locations.closed') ? 'text-muted-foreground' : 'text-primary font-bold'}`}>
                            {h.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center">
                    <p className="text-sm text-muted-foreground italic leading-relaxed">
                      {t('locations.office_description')}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
