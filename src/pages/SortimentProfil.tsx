import { useTranslation } from 'react-i18next';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Dna, Thermometer, Activity } from 'lucide-react';
import { localized } from '@/lib/localized';
import genetics from '@/data/genetics.json';
import type { Genetics, GeneticsType } from '@/types/genetics';

const TYPE_DOT: Record<GeneticsType, string> = {
  indica: 'bg-violet-500',
  sativa: 'bg-amber-500',
  hybrid: 'bg-primary',
};

export function SortimentProfil() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const items = genetics as Genetics[];
  const { id } = useParams<{ id: string }>();

  const index = items.findIndex((g) => g.id === id);
  if (index === -1) {
    return <Navigate to="/sortiment" replace />;
  }

  const g = items[index];
  const next = items[(index + 1) % items.length];

  const description = localized(g, 'description', currentLang);
  const terpenes = localized(g, 'terpenes', currentLang);

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <Link
          to="/sortiment"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft size={14} strokeWidth={3} />
          {t('sortiment_page.back_to_overview')}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card-premium overflow-hidden"
        >
          {g.image && (
            <img src={g.image} alt={g.name} className="w-full h-72 md:h-96 object-cover rounded-xl mb-6" />
          )}

          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-mono font-bold text-muted-foreground">
              N&deg; {String(index + 1).padStart(2, '0')}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider">
              <span className={`w-2 h-2 rounded-full ${TYPE_DOT[g.type]}`} />
              {t(`sortiment_page.filter_${g.type}`)}
            </span>
            {g.status !== 'none' && (
              <span
                className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wide ${
                  g.status === 'available' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                }`}
              >
                {t(`sortiment_page.status_${g.status}`)}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground">{g.name}</h1>
          {g.genetics && <p className="text-primary font-bold mt-2">{g.genetics}</p>}

          <p className="text-base text-foreground/80 leading-relaxed font-medium mt-6 whitespace-pre-line">
            {description || t('sortiment_page.no_description')}
          </p>

          <div className="flex flex-wrap gap-8 mt-8 pt-8 border-t border-border/30">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase font-black tracking-widest">{t('strains.thc')}</span>
              <span className="text-3xl font-mono font-black text-primary leading-none mt-1.5">{g.thc}</span>
            </div>
            <div className="flex flex-col border-l border-border pl-8">
              <span className="text-xs text-muted-foreground uppercase font-black tracking-widest">{t('strains.cbd')}</span>
              <span className="text-3xl font-mono font-black text-emerald-500 leading-none mt-1.5">{g.cbd}</span>
            </div>
          </div>
          {(g.thc !== '-' || g.cbd !== '-') && (
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-2">
              {t('sortiment_page.typical_range')}
            </p>
          )}

          <div className="space-y-2 max-w-sm mt-6">
            <div className="flex justify-between text-xs uppercase font-black tracking-wider">
              <span className="text-violet-500">Indica {g.indica}%</span>
              <span className="text-amber-500">Sativa {g.sativa}%</span>
            </div>
            <div className="stat-bar-bg">
              <div className="h-full bg-violet-500/80" style={{ width: `${g.indica}%` }} />
              <div className="h-full bg-amber-500/80" style={{ width: `${g.sativa}%` }} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 mt-10">
            {terpenes.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <Thermometer size={18} strokeWidth={2.5} />
                  <span className="text-xs uppercase font-black tracking-[0.1em]">{t('sortiment_page.terpene_profile')}</span>
                </div>
                <div className="flex flex-wrap gap-y-1.5 gap-x-2">
                  {terpenes.map((terpene, i) => (
                    <span key={i} className="text-xs text-foreground/70 font-bold tracking-tight bg-muted/30 px-2 py-1 rounded">
                      {terpene}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {g.breeder && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-500">
                  <Dna size={18} strokeWidth={2.5} />
                  <span className="text-xs uppercase font-black tracking-[0.1em]">{t('sortiment_page.origin')}</span>
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed font-bold">
                  {t('sortiment_page.breeder_label')}: {g.breeder}
                </p>
              </div>
            )}
          </div>

          {g.status !== 'none' && (
            <div className="flex items-center gap-2 mt-10 pt-6 border-t border-border/30 text-muted-foreground">
              <Activity size={14} />
              <span className="text-[10px] uppercase font-black tracking-widest">
                {t(`sortiment_page.status_${g.status}`)}
              </span>
            </div>
          )}
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <Link
            to="/sortiment"
            className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            {t('sortiment_page.all_genetics')}
          </Link>
          <Link
            to={`/sortiment/${next.id}`}
            className="inline-flex items-center gap-2 px-5 py-3 glass-card-premium hover:border-primary/50 transition-all"
          >
            <span className="text-left">
              <span className="block text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                {t('sortiment_page.next_in_lineup')}
              </span>
              <span className="block text-sm font-black text-foreground">{next.name}</span>
            </span>
            <ArrowRight size={16} className="text-primary" />
          </Link>
        </div>
      </div>
    </div>
  );
}
