import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Zap,
  Droplets,
  Activity,
  ChevronDown,
  Dna,
  Thermometer,
  X
} from 'lucide-react';
import { CannabisLeaf } from '@/components/icons/CannabisLeaf';
import { STRAINS } from '@/constants/strains';
import type { Strain } from '@/types/strains';
import { localized } from '@/lib/localized';

interface StrainCardProps {
  strain: Strain;
}

const StrainCard: React.FC<StrainCardProps> = ({ strain }) => {
  const { t, i18n } = useTranslation();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const currentLang = i18n.language;

  useEffect(() => {
    if (!isImageOpen && !isDetailsOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsImageOpen(false);
        setIsDetailsOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isImageOpen, isDetailsOpen]);

  const description = localized(strain, 'description', currentLang);
  const effects = localized(strain, 'effects', currentLang);
  const terpenes = localized(strain, 'terpenes', currentLang);
  const medicalEffects = localized(strain, 'medicalEffects', currentLang);

  return (
    <motion.div 
      layout
      className={`glass-card-premium flex flex-col gap-4 transition-all duration-500 hover:border-primary/50 group relative overflow-hidden ${strain.isSoldOut ? 'opacity-80' : ''}`}
    >
      {/* Sold Out Overlay - Option 2 (Stencil Stamp) */}
      {strain.isSoldOut && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
          <div className="absolute -rotate-12 bg-black/80 text-emerald-500/90 border-y border-emerald-500/30 uppercase font-black tracking-[0.2em] text-3xl py-2 w-[150%] text-center shadow-2xl mix-blend-hard-light flex justify-center items-center gap-4">
            <span className="opacity-50">{t('strains.sold_out')}</span>
            <span className="opacity-100">{t('strains.sold_out')}</span>
            <span className="opacity-50">{t('strains.sold_out')}</span>
          </div>
        </div>
      )}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {strain.image && (
            <button
              type="button"
              onClick={() => setIsImageOpen(true)}
              className="shrink-0 rounded-xl overflow-hidden border border-primary/20 hover:border-primary/60 transition-colors duration-300"
              aria-label={t('strains.view_image')}
            >
              <img
                src={strain.image}
                alt={strain.name}
                className="w-14 h-14 object-cover transition-transform duration-300 hover:scale-125 cursor-zoom-in"
                loading="lazy"
              />
            </button>
          )}
          <div>
            <h3 className="text-2xl font-black text-primary tracking-tighter group-hover:scale-[1.02] transition-transform duration-500">{strain.name}</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold mt-1">{strain.breeder}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{t('strains.thc')}</span>
            <span className="text-lg font-mono font-black text-primary leading-none">{strain.thc}</span>
          </div>
          <div className="flex flex-col items-end border-l border-border pl-3">
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{t('strains.cbd')}</span>
            <span className="text-lg font-mono font-black text-emerald-500 leading-none">{strain.cbd}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] uppercase font-black tracking-wider">
            <span className="text-emerald-600 dark:text-emerald-400">Indica {strain.indica}%</span>
            <span className="text-primary">Sativa {strain.sativa}%</span>
          </div>
          <div className="stat-bar-bg">
            <div 
              className="h-full bg-emerald-500/80 transition-all duration-1000 ease-out" 
              style={{ width: `${strain.indica}%` }} 
            />
            <div 
              className="h-full bg-primary/80 transition-all duration-1000 ease-out" 
              style={{ width: `${strain.sativa}%` }} 
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {effects.slice(0, 3).map((effect, idx) => (
            <span key={idx} className="px-2.5 py-1 bg-primary/5 text-primary text-[10px] rounded-lg border border-primary/10 font-black uppercase tracking-wider">
              {effect}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={() => setIsDetailsOpen(true)}
        className="mt-4 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all duration-300 border-t border-border/30 hover:bg-primary/5 rounded-b-xl"
      >
        {t('strains.show_more')} <ChevronDown size={14} strokeWidth={3} />
      </button>

      <AnimatePresence>
        {isImageOpen && strain.image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"
            onClick={() => setIsImageOpen(false)}
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              src={strain.image}
              alt={strain.name}
              className="max-w-full max-h-full rounded-2xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={() => setIsImageOpen(false)}
              aria-label={t('strains.close')}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-300"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDetailsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsDetailsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full h-full max-w-5xl overflow-y-auto bg-card backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsDetailsOpen(false)}
                aria-label={t('strains.close')}
                className="absolute top-5 right-5 z-10 p-2.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors duration-300"
              >
                <X size={20} strokeWidth={2.5} />
              </button>

              {/* Full-width banner image */}
              {strain.image && (
                <img
                  src={strain.image}
                  alt={strain.name}
                  className="w-full h-64 md:h-80 object-cover rounded-t-2xl"
                />
              )}

              {/* Centered, readable text column */}
              <div className="max-w-2xl mx-auto px-6 md:px-8 py-10 md:py-12 space-y-8">
                  <div>
                    <h3 className="text-3xl md:text-5xl font-black text-primary tracking-tighter">{strain.name}</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold mt-2">{strain.breeder}</p>
                  </div>

                  <div className="flex flex-wrap gap-8">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase font-black tracking-widest">{t('strains.thc')}</span>
                      <span className="text-2xl font-mono font-black text-primary leading-none mt-1.5">{strain.thc}</span>
                    </div>
                    <div className="flex flex-col border-l border-border pl-8">
                      <span className="text-xs text-muted-foreground uppercase font-black tracking-widest">{t('strains.cbd')}</span>
                      <span className="text-2xl font-mono font-black text-emerald-500 leading-none mt-1.5">{strain.cbd}</span>
                    </div>
                  </div>

                  <div className="space-y-2 max-w-sm">
                    <div className="flex justify-between text-xs uppercase font-black tracking-wider">
                      <span className="text-emerald-600 dark:text-emerald-400">Indica {strain.indica}%</span>
                      <span className="text-primary">Sativa {strain.sativa}%</span>
                    </div>
                    <div className="stat-bar-bg">
                      <div className="h-full bg-emerald-500/80" style={{ width: `${strain.indica}%` }} />
                      <div className="h-full bg-primary/80" style={{ width: `${strain.sativa}%` }} />
                    </div>
                  </div>

                  {effects.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {effects.map((effect, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-primary/5 text-primary text-xs rounded-lg border border-primary/10 font-black uppercase tracking-wider">
                          {effect}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-base text-foreground/80 leading-relaxed font-medium whitespace-pre-line">
                    {description}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-primary">
                        <Thermometer size={18} strokeWidth={2.5} />
                        <span className="text-xs uppercase font-black tracking-[0.1em]">{t('strains.terpenes')}</span>
                      </div>
                      <div className="flex flex-wrap gap-y-1.5 gap-x-2">
                        {terpenes.map((terpene, i) => (
                          <span key={i} className="text-xs text-foreground/70 font-bold tracking-tight bg-muted/30 px-2 py-1 rounded">
                            {terpene}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-emerald-500">
                        <Dna size={18} strokeWidth={2.5} />
                        <span className="text-xs uppercase font-black tracking-[0.1em]">{t('strains.genetics')}</span>
                      </div>
                      <p className="text-sm text-foreground/70 leading-relaxed font-bold">{strain.genetics}</p>
                    </div>
                  </div>

                  {medicalEffects && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-500">
                        <Activity size={18} strokeWidth={2.5} />
                        <span className="text-xs uppercase font-black tracking-[0.1em]">{t('strains.medical_effects')}</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {medicalEffects.map((me, i) => (
                          <span key={i} className="text-sm text-foreground/70 font-medium flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {me}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export function StrainLibrary() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <header className="space-y-8 relative">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
              <CannabisLeaf size={14} className="text-primary" />
              <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">{t('strains.library_tag')}</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] text-balance">
              {t('strains.library_title_1')} <br />
              <span className="text-primary">{t('strains.library_title_2')}</span>
            </h1>
            <p className="max-w-2xl text-muted-foreground text-lg md:text-xl font-medium leading-relaxed">
              {t('strains.library_desc')}
            </p>
          </div>
        </header>

        {/* Search & Stats */}
        <div className="flex flex-col md:flex-row gap-8 items-center justify-end glass-card-premium border-primary/20 p-8">
          <div className="flex gap-12 w-full justify-center md:justify-end">
            <div className="text-center md:text-left">
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground">{t('strains.stats_available')}</p>
              <div className="flex items-baseline gap-1 mt-1">
                <p className="text-4xl font-black text-primary">{STRAINS.length}</p>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
            </div>
            <div className="text-center md:text-left border-l border-border pl-12">
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground">{t('strains.stats_avg_thc')}</p>
              <p className="text-4xl font-black text-primary mt-1">~20%</p>
            </div>
          </div>
        </div>

        {/* Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {STRAINS.map((strain) => (
              <StrainCard key={strain.id} strain={strain} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Footer Info */}
        <footer className="pt-20 border-t border-border flex flex-col md:flex-row justify-between items-center gap-8 text-muted-foreground/40 text-[10px] font-black uppercase tracking-[0.3em]">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center gap-2 group hover:text-primary transition-colors cursor-default text-emerald-500">
              <CannabisLeaf size={14} className="group-hover:scale-125 transition-transform" /> 
              <span>{t('strains.footer_bio')}</span>
            </div>
            <div className="flex items-center gap-2 group hover:text-primary transition-colors cursor-default">
              <Activity size={14} className="group-hover:scale-125 transition-transform" /> 
              <span>{t('strains.footer_local')}</span>
            </div>
            <div className="flex items-center gap-2 group hover:text-primary transition-colors cursor-default text-primary">
              <Zap size={14} className="group-hover:scale-125 transition-transform" /> 
              <span>{t('strains.footer_growth')}</span>
            </div>
            <div className="flex items-center gap-2 group hover:text-primary transition-colors cursor-default text-blue-500">
              <Droplets size={14} className="group-hover:scale-125 transition-transform" /> 
              <span>{t('strains.footer_breeding')}</span>
            </div>
          </div>
          <p>{t('strains.footer_copyright')}</p>
        </footer>
      </div>
    </div>
  );
}
