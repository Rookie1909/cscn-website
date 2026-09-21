import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CannabisLeaf } from '@/components/icons/CannabisLeaf';
import { RoomCard } from '@/components/sections/RoomCard';
import growRoomsData from '@/data/grow-rooms.json';
import type { GrowRoom } from '@/types/growRoom';

export function GrowRoomsTeaser() {
  const { t } = useTranslation();
  const rooms = (growRoomsData as GrowRoom[]).slice(0, 3);

  if (rooms.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
              <CannabisLeaf size={14} className="text-primary" />
              <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                {t('grow_rooms.teaser.tag')}
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-headline font-bold text-foreground">
              {t('grow_rooms.teaser.title')}
            </h2>
            <p className="text-muted-foreground font-sans leading-relaxed max-w-xl">
              {t('grow_rooms.teaser.description')}
            </p>
          </div>
          <Link
            to="/anbau"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-background/50 hover:border-primary/50 hover:bg-primary/5 text-sm font-bold text-foreground hover:text-primary transition-all duration-300 group"
          >
            {t('grow_rooms.teaser.cta')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Link key={room.id} to="/anbau" className="block">
              <RoomCard room={room} compact />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
