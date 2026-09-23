import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { localized } from '@/lib/localized';
import genetics from '@/data/genetics.json';
import type { Genetics, GeneticsType } from '@/types/genetics';

const TYPE_DOT: Record<GeneticsType, string> = {
  indica: 'bg-violet-500',
  sativa: 'bg-amber-500',
  hybrid: 'bg-primary',
};

type Filter = 'all' | GeneticsType;

export function Sortiment() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const items = genetics as Genetics[];
  const [filter, setFilter] = useState<Filter>('all');
  const [availableOnly, setAvailableOnly] = useState(false);

  const counts: Record<Filter, number> = {
    all: items.length,
    indica: items.filter((g) => g.type === 'indica').length,
    sativa: items.filter((g) => g.type === 'sativa').length,
    hybrid: items.filter((g) => g.type === 'hybrid').length,
  };

  const filtered = items
    .filter((g) => filter === 'all' || g.type === filter)
    .filter((g) => !availableOnly || g.status !== 'none');

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
              <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                {t('sortiment_page.tag')}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] text-balance">
              {t('sortiment_page.title_1')} <br />
              <span className="text-primary">{t('sortiment_page.title_2')}</span>
            </h1>
          </div>
          <div className="space-y-2 lg:text-right lg:max-w-xs">
            <p className="text-muted-foreground text-sm leading-relaxed">{t('sortiment_page.description')}</p>
          </div>
        </header>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 glass-card-premium">
          <div className="flex flex-wrap gap-2">
            {(['all', 'indica', 'sativa', 'hybrid'] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  filter === f
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background/60 text-muted-foreground hover:text-foreground border border-border'
                }`}
              >
                {f === 'all' ? t('sortiment_page.filter_all') : t(`sortiment_page.filter_${f}`)} {counts[f]}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs font-bold text-muted-foreground cursor-pointer">
            <Checkbox checked={availableOnly} onCheckedChange={(c) => setAvailableOnly(Boolean(c))} />
            {t('sortiment_page.filter_available_only')}
          </label>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="text-muted-foreground italic py-16 text-center">{t('sortiment_page.empty')}</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((g, i) => {
              const description = localized(g, 'description', currentLang);
              const terpenes = localized(g, 'terpenes', currentLang);
              return (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={`/sortiment/${g.id}`}
                    className="block h-full glass-card-premium hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-mono font-bold text-muted-foreground">
                        N&deg; {String(i + 1).padStart(2, '0')}
                      </span>
                      {g.status !== 'none' && (
                        <span
                          className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wide ${
                            g.status === 'available'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {t(`sortiment_page.status_${g.status}`)}
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-black text-foreground tracking-tighter">{g.name}</h3>
                    <div className="flex items-center gap-2 mt-1 mb-4">
                      <span className={`w-2 h-2 rounded-full ${TYPE_DOT[g.type]}`} />
                      <span className="text-xs text-muted-foreground font-bold">
                        {t(`sortiment_page.filter_${g.type}`)}
                        {g.genetics ? ` · ${g.genetics}` : ''}
                      </span>
                    </div>

                    {description && (
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                        {description}
                      </p>
                    )}

                    <div className="space-y-1.5 mb-4">
                      <div className="flex justify-between text-[10px] uppercase font-black tracking-wider">
                        <span className="text-violet-500">Indica {g.indica}%</span>
                        <span className="text-amber-500">Sativa {g.sativa}%</span>
                      </div>
                      <div className="stat-bar-bg">
                        <div className="h-full bg-violet-500/80" style={{ width: `${g.indica}%` }} />
                        <div className="h-full bg-amber-500/80" style={{ width: `${g.sativa}%` }} />
                      </div>
                    </div>

                    {terpenes.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {terpenes.slice(0, 3).map((terp, ti) => (
                          <span
                            key={ti}
                            className="text-[10px] font-bold text-foreground/70 bg-muted/30 px-2 py-1 rounded"
                          >
                            {terp}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-border/30 text-primary text-xs font-bold">
                      {t('sortiment_page.view_profile')}
                      <ArrowRight size={12} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
