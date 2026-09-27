import { useEffect, useState } from 'react';

const COLORS = ['#22c55e', '#f59e0b', '#3b82f6', '#ec4899', '#a855f7', '#eab308'];
const PIECE_COUNT = 120;
const BURST_DURATION_MS = 3600;

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
}

function makePieces(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.4,
    duration: 2.2 + Math.random() * 1.2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 6 + Math.random() * 6,
  }));
}

interface ConfettiBurstProps {
  active: boolean;
  onDone?: () => void;
}

// Fires a one-shot full-screen confetti rain. Mount once near the page root;
// toggling `active` from false -> true starts a new burst.
export function ConfettiBurst({ active, onDone }: ConfettiBurstProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!active) return;
    setPieces(makePieces(PIECE_COUNT));
    const timeout = setTimeout(() => {
      setPieces([]);
      onDone?.();
    }, BURST_DURATION_MS);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (pieces.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.4,
            backgroundColor: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
