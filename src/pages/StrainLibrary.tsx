import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Leaf, 
  Droplets, 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  Dna,
  Thermometer
} from 'lucide-react';
import { STRAINS } from '@/constants/strains';
import type { Strain } from '@/types/strains';

interface StrainCardProps {
  strain: Strain;
}

const StrainCard: React.FC<StrainCardProps> = ({ strain }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      layout
      className="glass-card-premium flex flex-col gap-4 transition-all duration-500 hover:border-primary/50 group"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-black text-primary tracking-tighter group-hover:scale-[1.02] transition-transform duration-500">{strain.name}</h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold mt-1">{strain.breeder}</p>
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">THC</span>
            <span className="text-lg font-mono font-black text-primary leading-none">{strain.thc}</span>
          </div>
          <div className="flex flex-col items-end border-l border-border pl-3">
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">CBD</span>
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
          {strain.effects.slice(0, 3).map((effect, idx) => (
            <span key={idx} className="px-2.5 py-1 bg-primary/5 text-primary text-[10px] rounded-lg border border-primary/10 font-black uppercase tracking-wider">
              {effect}
            </span>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden space-y-6 pt-4 border-t border-border/50"
          >
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground leading-relaxed italic font-medium">
                "{strain.description}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <Thermometer size={16} strokeWidth={2.5} />
                  <span className="text-[10px] uppercase font-black tracking-[0.1em]">Terpene</span>
                </div>
                <div className="flex flex-wrap gap-y-1 gap-x-2">
                  {strain.terpenes.map((t, i) => (
                    <span key={i} className="text-[11px] text-foreground/70 font-bold tracking-tight bg-muted/30 px-1.5 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-500">
                  <Dna size={16} strokeWidth={2.5} />
                  <span className="text-[10px] uppercase font-black tracking-[0.1em]">Genetik</span>
                </div>
                <p className="text-[11px] text-foreground/70 leading-snug font-bold">{strain.genetics}</p>
              </div>
            </div>

            {strain.medicalEffects && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-500">
                  <Activity size={16} strokeWidth={2.5} />
                  <span className="text-[10px] uppercase font-black tracking-[0.1em]">Medizinischer Fokus</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {strain.medicalEffects.map((me, i) => (
                    <span key={i} className="text-[11px] text-foreground/70 font-medium flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-blue-500" /> {me}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-4 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all duration-300 border-t border-border/30 hover:bg-primary/5 rounded-b-xl"
      >
        {isExpanded ? (
          <>Weniger anzeigen <ChevronUp size={14} strokeWidth={3} /></>
        ) : (
          <>Mehr Details <ChevronDown size={14} strokeWidth={3} /></>
        )}
      </button>
    </motion.div>
  );
};

export function StrainLibrary() {
  // Removed search logic as requested

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <header className="space-y-8 relative">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
              <Leaf size={14} className="text-primary" />
              <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">Raised on Living Soil</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] text-balance">
              AKTUELLES CSCN <br />
              <span className="text-primary">SORTIMENT</span>
            </h1>
            <p className="max-w-2xl text-muted-foreground text-lg md:text-xl font-medium leading-relaxed">
              Entdecke die genetische Vielfalt und das komplexe Terpenprofil unserer exklusiven Auswahl an Premium-Sorten. Wissenschaftlich basiert & transparent.
            </p>
          </div>
        </header>

        {/* Search & Stats */}
        <div className="flex flex-col md:flex-row gap-8 items-center justify-end glass-card-premium border-primary/20 p-8">
          <div className="flex gap-12 w-full justify-center md:justify-end">
            <div className="text-center md:text-left">
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground">Verfügbare Sorten</p>
              <div className="flex items-baseline gap-1 mt-1">
                <p className="text-4xl font-black text-primary">{STRAINS.length}</p>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
            </div>
            <div className="text-center md:text-left border-l border-border pl-12">
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground">Durchschnitt THC</p>
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

        {/* Empty State Removed as Search is gone */}

        {/* Footer Info */}
        <footer className="pt-20 border-t border-border flex flex-col md:flex-row justify-between items-center gap-8 text-muted-foreground/40 text-[10px] font-black uppercase tracking-[0.3em]">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center gap-2 group hover:text-primary transition-colors cursor-default text-emerald-500">
              <Leaf size={14} className="group-hover:scale-125 transition-transform" /> 
              <span>100% Bio</span>
            </div>
            <div className="flex items-center gap-2 group hover:text-primary transition-colors cursor-default">
              <Activity size={14} className="group-hover:scale-125 transition-transform" /> 
              <span>100% Local aus Niedersachsen</span>
            </div>
            <div className="flex items-center gap-2 group hover:text-primary transition-colors cursor-default text-primary">
              <Zap size={14} className="group-hover:scale-125 transition-transform" /> 
              <span>Kontrollierter Anbau</span>
            </div>
            <div className="flex items-center gap-2 group hover:text-primary transition-colors cursor-default text-blue-500">
              <Droplets size={14} className="group-hover:scale-125 transition-transform" /> 
              <span>Transparente Aufzucht</span>
            </div>
          </div>
          <p>© 2026 CSC Nordheide E.V. Sortiment</p>
        </footer>
      </div>
    </div>
  );
}
