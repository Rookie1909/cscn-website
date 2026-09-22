import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CannabisLeaf } from '@/components/icons/CannabisLeaf';
import type { GrowRoom } from '@/types/growRoom';

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
            {room.strains.slice(0, compact ? 6 : undefined).map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border border-border bg-background/60"
              >
                {s.image ? (
                  <img src={s.image} alt={s.name} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <CannabisLeaf size={11} className="text-primary" />
                  </div>
                )}
                <span className="text-[11px] font-bold text-foreground">{s.name}</span>
              </div>
            ))}
            {compact && room.strains.length > 6 && (
              <div className="flex items-center px-2.5 py-1.5 rounded-full border border-border text-[11px] font-bold text-muted-foreground">
                +{room.strains.length - 6}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
