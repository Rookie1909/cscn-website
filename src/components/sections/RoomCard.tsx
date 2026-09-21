import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import type { GrowRoom, FillLevel, GrowStage } from '@/types/growRoom';

const STAGE_STYLES: Record<GrowStage, string> = {
  cutting: 'bg-muted text-muted-foreground border-border',
  vegetative: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  flowering: 'bg-primary/10 text-primary border-primary/20',
};

const FILL_DOTS: Record<FillLevel, number> = { few: 1, moderate: 2, many: 3 };

interface RoomCardProps {
  room: GrowRoom;
  compact?: boolean;
}

export function RoomCard({ room, compact = false }: RoomCardProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
    >
      {room.image && !compact && (
        <div className="relative w-full h-40 overflow-hidden">
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover grayscale contrast-125"
          />
          {/* Duotone tint: mix-blend-color takes this gradient's hue while
              keeping the photo's luminance, so it reads as styled branding
              rather than a literal "this is what's in there right now" shot. */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/70 to-black mix-blend-color" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-black text-primary tracking-tighter">{room.name}</h3>
        {!compact && room.description && (
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{room.description}</p>
        )}

        {room.strains.length === 0 ? (
          <p className={`text-xs text-muted-foreground italic ${compact ? 'mt-4' : 'mt-5'}`}>
            {t('grow_rooms.page.room_empty')}
          </p>
        ) : (
        <div className={`flex flex-wrap gap-2 ${compact ? 'mt-4' : 'mt-5'}`}>
          {room.strains.slice(0, compact ? 4 : undefined).map((s, i) => (
            <div
              key={i}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-bold ${STAGE_STYLES[s.stage]}`}
            >
              <span>{s.name}</span>
              <span className="opacity-60">·</span>
              <span className="uppercase tracking-wide">{t(`grow_rooms.stage.${s.stage}`)}</span>
              <span className="flex items-center gap-0.5 ml-1" title={t(`grow_rooms.fill.${s.fillLevel}`)}>
                {[1, 2, 3].map((n) => (
                  <span
                    key={n}
                    className={`w-1.5 h-1.5 rounded-full ${n <= FILL_DOTS[s.fillLevel] ? 'bg-current' : 'bg-current opacity-20'}`}
                  />
                ))}
              </span>
            </div>
          ))}
          {compact && room.strains.length > 4 && (
            <div className="flex items-center px-2.5 py-1.5 rounded-lg border border-border text-[11px] font-bold text-muted-foreground">
              +{room.strains.length - 4}
            </div>
          )}
        </div>
        )}
      </div>
    </motion.div>
  );
}
