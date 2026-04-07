import { motion } from 'framer-motion';
import { Calendar, Image as ImageIcon, Newspaper, ArrowRight } from 'lucide-react';
import { CannabisLeaf } from '@/components/icons/CannabisLeaf';
import newsData from '@/data/news.json';

interface NewsItem {
  id: string;
  week: string;
  month: string;
  title: string;
  description: string;
  content: string;
  images: string[];
  date: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as any },
  },
};

export function NewsSection() {
  const news = newsData as NewsItem[];

  return (
    <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <Newspaper size={14} />
            <span>Club Tagebuch</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-headline font-black text-foreground mb-6">
            Aktuelle News & Updates
          </h2>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-border" />
            <CannabisLeaf size={24} className="text-primary" />
            <div className="h-px w-16 bg-border" />
          </div>
          <p className="text-muted-foreground font-sans max-w-2xl mx-auto text-lg leading-relaxed">
            Begleite uns auf unserem Weg. Hier posten wir wöchentlich Updates zu Baufortschritten, Züchtungen und Events im CSC Nordheide.
          </p>
        </motion.div>

        {/* Timeline Feed */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative space-y-16 lg:space-y-24"
        >
          {/* Central Timeline Line (Hidden on small mobile) */}
          <div className="absolute left-0 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-border to-transparent hidden sm:block" />

          {news.map((item, index) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="relative grid lg:grid-cols-2 gap-8 lg:gap-16 items-start"
            >
              {/* Week Label - Large and striking */}
              <div className={`lg:flex flex-col ${index % 2 === 0 ? 'lg:items-end lg:text-right' : 'lg:order-2 lg:items-start lg:text-left'} hidden`}>
                <div className="sticky top-32">
                  <span className="block text-6xl lg:text-8xl font-headline font-black text-primary/20 transition-colors group-hover:text-primary/30 leading-none">
                    {item.week}
                  </span>
                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border shadow-sm">
                    <Calendar size={16} className="text-primary" />
                    <span className="font-sans font-bold text-foreground text-sm uppercase tracking-tight">
                      {item.month}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile Week Label */}
              <div className="lg:hidden flex items-center gap-3 mb-2">
                <span className="text-3xl font-headline font-black text-primary">
                  {item.week}
                </span>
                <span className="text-muted-foreground font-sans font-medium text-sm">
                  — {item.month}
                </span>
              </div>

              {/* Content Card */}
              <div className={`${index % 2 === 0 ? '' : 'lg:order-1'}`}>
                <div className="glass-card-premium group hover:border-primary/30 transition-all duration-500 overflow-hidden">
                  <div className="p-6 lg:p-8">
                    <h3 className="text-2xl lg:text-3xl font-headline font-black text-foreground mb-4 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground font-sans leading-relaxed mb-6">
                      {item.description}
                    </p>
                    <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 mb-8">
                      <p className="text-foreground/80 font-sans italic text-sm leading-loose">
                        "{item.content}"
                      </p>
                    </div>

                    {/* Image Collage Grid */}
                    <div className={`grid gap-3 ${item.images.length === 1 ? 'grid-cols-1' : item.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                      {item.images.map((img, imgIndex) => (
                        <div 
                          key={imgIndex} 
                          className={`relative rounded-xl overflow-hidden shadow-md aspect-video ${
                            item.images.length === 3 && imgIndex === 2 ? 'col-span-2' : ''
                          }`}
                        >
                          <img 
                            src={img} 
                            alt={`${item.title} view ${imgIndex + 1}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground/60 text-xs font-bold uppercase tracking-widest">
                        <ImageIcon size={14} />
                        <span>{item.images.length} Impressionen</span>
                      </div>
                      <button className="flex items-center gap-2 text-primary font-bold text-sm group/btn">
                        <span>Details lesen</span>
                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Dot */}
              <div className="absolute left-0 lg:left-1/2 top-0 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-background bg-primary shadow-[0_0_15px_rgba(34,197,94,0.5)] hidden sm:block" />
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <p className="text-muted-foreground font-sans text-sm">
            Möchtest du keine Neuigkeiten verpassen? <br className="sm:hidden" />
            Abonniere auch unseren <a href="#newsletter" className="text-primary font-bold hover:underline">Newsletter</a>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
