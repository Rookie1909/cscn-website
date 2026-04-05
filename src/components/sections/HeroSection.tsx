import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Users, Leaf, Scale, Star, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const infographics = [
  { title: "Cannabis-Blüten", src: "/images/infographics/blueten.jpg" },
  { title: "Hash (Dry Sift)", src: "/images/infographics/dry-sift.jpg" },
  { title: "Bubble Hash", src: "/images/infographics/bubble-hash.jpg" },
  { title: "Hash Rosin", src: "/images/infographics/hash-rosin.jpg" },
  { title: "WPFF Rosin", src: "/images/infographics/wpff-rosin.jpg" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
};

const stats = [
  { icon: Award, label: "1. CSC", sub: "In Niedersachsen", color: "text-primary" },
  { icon: Users, label: "170+", sub: "Mitglieder", color: "text-blue-400" },
  { icon: Leaf, label: "500+", sub: "Bio-Pflanzen", color: "text-emerald-400" },
  { icon: Scale, label: "2500g+", sub: "Erfolgreiche Abgabe", color: "text-amber-400" },
];

const highlights = [
  { icon: Zap, title: "Experten-Support", text: "Best Practices & Wissensaustausch." },
  { icon: Leaf, title: "100% Bio-Anbau", text: "0% Chemie, rein biologisch." },
  { icon: ShieldCheck, title: "Rechtssicher", text: "Garantierte Compliance & Legalität." },
];

export function HeroSection() {
  return (
    <section className="py-16 lg:py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10"
          >
            <div className="space-y-6">
              <motion.h1
                variants={itemVariants}
                className="text-5xl lg:text-7xl font-headline font-black text-foreground leading-[0.95] tracking-tight"
              >
                Pioniere des <br />
                <span className="text-primary italic">biologischen</span> <br />
                Anbaus in Niedersachsen
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-xl text-muted-foreground font-sans leading-relaxed max-w-xl"
              >
                Der erste CSC in Niedersachsen mit über 170 engagierten Mitgliedern – Qualität, die überzeugt.
              </motion.p>
            </div>

            {/* Stats Grid */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {stats.map((stat, i) => (
                <div key={i} className="group relative p-4 rounded-3xl bg-secondary/5 border border-border/50 backdrop-blur-sm transition-all hover:bg-secondary/10 hover:border-primary/30 flex flex-col items-center text-center">
                  <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
                  <div className="text-2xl font-headline font-extrabold text-foreground">{stat.label}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-1">{stat.sub}</div>
                </div>
              ))}
            </motion.div>

            {/* Product Card (Special 5th Item) with Pop-up Infographics */}
            <motion.div variants={itemVariants} className="mx-auto max-w-lg w-full">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="relative w-full p-6 rounded-[2rem] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-primary/20 overflow-hidden group hover:border-primary/40 hover:bg-primary/5 transition-all duration-500 flex flex-col items-center text-center lg:items-start lg:text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
                    <div className="absolute top-4 right-6 text-primary/20 rotate-12 group-hover:rotate-45 transition-transform duration-700">
                      <Star className="w-20 h-20 fill-current" />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20">
                        <Star className="w-6 h-6 text-white fill-current" />
                      </div>
                      <h3 className="text-xl font-headline font-black text-foreground">Exklusive Auswahl</h3>
                    </div>
                    <p className="text-sm font-sans text-muted-foreground leading-relaxed font-medium">
                      Blüten, Hash (Dry Sift), Bubble Hash, Hash Rosin, Piattella, WPFF Rosin.
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-headline font-black uppercase tracking-widest">
                      <Zap className="w-3 h-3 fill-current" />
                      Nur bei uns erhältlich
                    </div>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] md:max-w-5xl max-h-[95vh] border-none bg-white/80 dark:bg-black/60 backdrop-blur-2xl p-0 overflow-hidden sm:rounded-[2rem] [&>button]:text-primary [&>button]:bg-secondary/40 [&>button:hover]:bg-primary [&>button:hover]:text-white dark:[&>button]:bg-black/40">
                  <div className="p-4 sm:p-8 flex flex-col h-full w-full justify-center">
                    <h2 className="text-2xl font-headline font-black text-zinc-900 dark:text-white text-center mb-6 drop-shadow-sm dark:drop-shadow-md">
                      Botanische Extraktionskunst
                    </h2>
                    <Carousel className="w-full">
                      <CarouselContent>
                        {infographics.map((info, idx) => (
                          <CarouselItem key={idx} className="flex justify-center items-center">
                            <div className="relative flex justify-center items-center rounded-2xl overflow-hidden border border-primary/20 dark:border-white/10 shadow-[0_0_40px_-10px_rgba(20,184,166,0.2)] dark:shadow-[0_0_40px_-10px_rgba(20,184,166,0.3)] bg-secondary/10 dark:bg-black/40 w-full md:w-auto min-h-[40vh]">
                              <img 
                                src={info.src} 
                                alt={info.title} 
                                className="w-full md:max-w-3xl max-h-[65vh] object-contain dark:invert dark:hue-rotate-180 dark:brightness-110 transition-all duration-300"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  target.nextElementSibling?.classList.remove('hidden');
                                  target.nextElementSibling?.classList.add('flex');
                                }}
                              />
                              <div className="hidden absolute inset-0 flex-col items-center justify-center p-8 text-center text-foreground/50 dark:text-white/50 space-y-4">
                                <Leaf className="w-16 h-16 opacity-30" />
                                <p className="font-headline font-bold text-lg">{info.title}</p>
                                <p className="text-sm">Bilddatei fehlt:<br/><code className="text-primary/70">{info.src}</code></p>
                                <p className="text-xs max-w-sm mt-4 leading-relaxed">Bitte stelle sicher, dass du die Chat-Anhänge in diesem öffentlichen Ordner deines Projektes gespeichert hast.</p>
                              </div>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-2 md:-left-12 h-12 w-12 border-primary/50 text-foreground dark:text-white hover:border-primary backdrop-blur-md" />
                      <CarouselNext className="right-2 md:-right-12 h-12 w-12 border-primary/50 text-foreground dark:text-white hover:border-primary backdrop-blur-md" />
                    </Carousel>
                    <div className="text-center mt-6 text-sm font-sans text-zinc-500 dark:text-white/60">
                      Nutze die Pfeile oder wische, um die Übersicht zu erkunden
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>

            {/* Feature Highlights */}
            <motion.div 
              variants={itemVariants}
              className="grid sm:grid-cols-3 gap-6 pt-2"
            >
              {highlights.map((h, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <h.icon className="w-5 h-5 text-foreground/70" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-xs font-headline font-black uppercase tracking-tight text-foreground">{h.title}</h4>
                    <p className="text-xs sm:text-[11px] text-muted-foreground font-sans mt-0.5 leading-tight">{h.text}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4">
              <Button
                size="lg"
                asChild
                className="group relative overflow-hidden rounded-full shadow-2xl shadow-primary/20 transition-all hover:shadow-primary/40 hover:scale-105 active:scale-95 px-10 h-16 text-lg font-headline font-black bg-zinc-950 border border-primary/40 hover:border-primary text-white"
              >
                <Link to="/mitgliedsbeitraege" className="flex items-center gap-3">
                  <motion.div 
                    initial={{ x: "-150%" }}
                    animate={{ x: "200%" }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 2.5, repeatDelay: 1.5 }}
                    className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[30deg]"
                  />
                  <span className="relative z-10 flex items-center gap-3 drop-shadow-md">
                    Jetzt Teil der Bewegung werden
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform text-primary" />
                  </span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-primary/20 blur-[100px] rounded-full mix-blend-screen opacity-50 animate-pulse" />
            <div className="relative rounded-[3.5rem] overflow-hidden aspect-[4/5] border-[12px] border-secondary shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] group">
              <img
                src="/images/hero-indoor-grow.webp"
                alt="Cannabis Anbau"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                <p className="text-white font-headline font-black text-2xl tracking-tight">Biologischer Anbau</p>
                <p className="text-primary font-sans text-sm mt-2">100% Reinheit ohne Kompromisse</p>
              </div>
            </div>
            
            {/* Float Badge */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-4 lg:-right-8 bg-card border-2 border-primary/20 backdrop-blur-xl p-6 rounded-3xl shadow-2xl z-10"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-xl font-headline font-black text-foreground leading-none">100% Legal</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1 font-bold">Regulierter Anbau</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
