import { motion } from 'framer-motion';
import { Lightbulb, Wind, Ruler } from 'lucide-react';
import type { GrowRoom } from '@/types/growRoom';

interface RoomCardProps {
  room: GrowRoom;
  compact?: boolean;
}

export function RoomCard({ room, compact = false }: RoomCardProps) {
  const facts = [
    room.size && { icon: Ruler, label: room.size },
    room.lighting && { icon: Lightbulb, label: room.lighting },
    room.ventilation && { icon: Wind, label: room.ventilation },
  ].filter((f): f is { icon: typeof Ruler; label: string } => Boolean(f));

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
        {room.description && (
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{room.description}</p>
        )}

        {!compact && facts.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5">
            {facts.map(({ icon: Icon, label }, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background/60"
              >
                <Icon size={13} className="text-primary shrink-0" />
                <span className="text-[11px] font-bold text-foreground">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
