import { useTranslation } from 'react-i18next';
import { CannabisLeaf } from '@/components/icons/CannabisLeaf';
import { RoomCard } from '@/components/sections/RoomCard';
import growRoomsData from '@/data/grow-rooms.json';
import type { GrowRoom } from '@/types/growRoom';

export function Anbau() {
  const { t } = useTranslation();
  const rooms = growRoomsData as GrowRoom[];

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        <header className="space-y-8 relative">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
              <CannabisLeaf size={14} className="text-primary" />
              <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                {t('grow_rooms.page.tag')}
              </span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] text-balance">
              {t('grow_rooms.page.title_1')} <br />
              <span className="text-primary">{t('grow_rooms.page.title_2')}</span>
            </h1>
            <p className="max-w-2xl text-muted-foreground text-lg md:text-xl font-medium leading-relaxed">
              {t('grow_rooms.page.description')}
            </p>
          </div>
        </header>

        {rooms.length === 0 ? (
          <p className="text-muted-foreground text-center py-20">{t('grow_rooms.page.empty')}</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
