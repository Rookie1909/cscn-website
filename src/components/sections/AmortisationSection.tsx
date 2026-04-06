import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { TrendingDown, Zap, X } from 'lucide-react';
import { CannabisLeaf } from '@/components/icons/CannabisLeaf';

const data = [
  {
    category: 'Blüten / Hash',
    marketPrice: '10,00 €',
    saving: '2,50 €',
    breakEven: '120 g',
    breakEvenGrams: 120,
    highlight: false,
    infographic: '/images/infographics/1.png',
  },
  {
    category: 'Bubble Hash',
    marketPrice: '20,00 €',
    saving: '5,00 €',
    breakEven: '60 g',
    breakEvenGrams: 60,
    highlight: false,
    infographic: '/images/infographics/2.png',
  },
  {
    category: 'Hash Rosin',
    marketPrice: '40,00 €',
    saving: '10,00 €',
    breakEven: '30 g',
    breakEvenGrams: 30,
    highlight: true,
    infographic: '/images/infographics/3.png',
  },
  {
    category: 'Piattella',
    marketPrice: '60,00 €',
    saving: '15,00 €',
    breakEven: '20 g',
    breakEvenGrams: 20,
    highlight: false,
    infographic: '/images/infographics/4.png',
  },
  {
    category: 'WPFF Rosin',
    marketPrice: '80,00 €',
    saving: '20,00 €',
    breakEven: '15 g',
    breakEvenGrams: 15,
    highlight: false,
    infographic: '/images/infographics/5.jpg',
  },
];

/** Maximum break-even grams – used to scale the progress bar. */
const MAX_GRAMS = Math.max(...data.map((d) => d.breakEvenGrams));

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] as const } },
};

export function AmortisationSection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-primary text-sm font-bold tracking-widest uppercase mb-4 font-sans">
            Supporter-Mitgliedschaft
          </p>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-24 bg-border" />
            <CannabisLeaf size={24} className="text-primary" />
            <div className="h-px w-24 bg-border" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-headline font-black text-foreground mb-4">
            Amortisationsdauer
          </h2>
          <p className="text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
            Ab wann rechnet sich die <span className="text-foreground font-semibold">Supporter-Aufnahmegebühr von 300,–&nbsp;€</span>?
            Mit der 25&nbsp;% Ersparnis auf alle Produkte ist der Break-even je nach Produktkategorie
            schnell erreicht.
          </p>
        </motion.div>

        {/* Table – desktop */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="hidden md:block rounded-2xl border border-border overflow-hidden bg-card shadow-xl"
        >
          {/* Table header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] bg-primary/5 border-b border-border px-6 py-3">
            {['Produktkategorie', 'Preis / g\u00a0(Markt)', 'Ersparnis / g', 'Break-even'].map((h) => (
              <span key={h} className="text-[11px] font-black uppercase tracking-widest text-muted-foreground font-sans">
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {data.map((row, i) => (
            <motion.div
              key={row.category}
              variants={rowVariants}
              onClick={() => row.infographic && setSelectedImage(row.infographic)}
              className={`grid grid-cols-[2fr_1fr_1fr_1fr] items-center px-6 py-5 gap-4 border-b last:border-b-0 border-border transition-all duration-300 hover:bg-primary/5 cursor-pointer group ${
                row.highlight ? 'bg-primary/5' : ''
              }`}
            >
              {/* Category */}
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg transition-transform duration-500 group-hover:scale-110 ${row.highlight ? 'bg-primary/20' : 'bg-muted'}`}>
                  <CannabisLeaf size={16} className={row.highlight ? 'text-primary' : 'text-muted-foreground'} />
                </div>
                <span className={`font-headline font-bold text-base transition-colors group-hover:text-primary ${row.highlight ? 'text-primary' : 'text-foreground'}`}>
                  {row.category}
                </span>
                {row.highlight && (
                  <span className="hidden lg:inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-primary/15 text-primary px-2 py-0.5 rounded-full">
                    <Zap size={10} /> Beliebt
                  </span>
                )}
              </div>

              {/* Market price */}
              <span className="font-mono font-semibold text-muted-foreground text-sm group-hover:text-foreground transition-colors">
                {row.marketPrice}
              </span>

              {/* Saving */}
              <div className="flex items-center gap-1.5">
                <TrendingDown size={14} className="text-emerald-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="font-mono font-bold text-emerald-500 text-sm">
                  {row.saving}
                </span>
              </div>

              {/* Break-even with bar */}
              <div className="space-y-1.5">
                <span className={`font-mono font-black text-sm ${row.highlight ? 'text-primary' : 'text-foreground'}`}>
                  {row.breakEven}
                </span>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(row.breakEvenGrams / MAX_GRAMS) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Cards – mobile */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="md:hidden space-y-4"
        >
          {data.map((row, i) => (
            <motion.div
              key={row.category}
              variants={rowVariants}
              onClick={() => row.infographic && setSelectedImage(row.infographic)}
              className={`p-5 rounded-2xl border border-border bg-card shadow-md cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/50 group ${
                row.highlight ? 'border-primary/40 bg-primary/5' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-muted group-hover:bg-primary/10 transition-colors duration-300">
                    <CannabisLeaf size={18} className={`transition-transform duration-500 group-hover:scale-110 ${row.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <span className={`font-headline font-black text-base group-hover:text-primary transition-colors ${row.highlight ? 'text-primary' : 'text-foreground'}`}>
                    {row.category}
                  </span>
                </div>
                {row.highlight && (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-primary/15 text-primary px-2 py-0.5 rounded-full">
                    Beliebt
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 text-center mb-4">
                {[
                  { label: 'Marktpreis', value: row.marketPrice, color: 'text-muted-foreground' },
                  { label: 'Ersparnis', value: row.saving, color: 'text-emerald-500' },
                  { label: 'Break-even', value: row.breakEven, color: row.highlight ? 'text-primary' : 'text-foreground' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-muted/40 rounded-xl p-2 group-hover:bg-muted/60 transition-colors">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">{label}</p>
                    <p className={`font-mono font-black text-sm ${color}`}>{value}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    Amortisation
                  </p>
                  <span className="text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity font-bold">Klicken für Info</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full group-hover:brightness-110 transition-all"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(row.breakEvenGrams / MAX_GRAMS) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-muted-foreground/60 font-sans text-xs mt-8 leading-relaxed"
        >
          * Berechnung basiert auf der einmaligen Supporter-Aufnahmegebühr von 300,–&nbsp;€ sowie einem
          pauschalen Marktpreis-Abschlag von 25&nbsp;%. Individuelle Bezugsmengen können variieren.
        </motion.p>

        {/* Infographic Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm cursor-pointer"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative max-w-2xl w-full max-h-[90vh] flex flex-col bg-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl cursor-default"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 z-10 p-2.5 bg-black/50 hover:bg-primary text-white rounded-full backdrop-blur-md transition-all hover:scale-110"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
                <div className="overflow-y-auto w-full h-full p-1 bg-black/95">
                  <img src={selectedImage} alt="Amortisation Infografik" className="w-full h-auto object-contain rounded-2xl" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
