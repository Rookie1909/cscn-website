import { motion, useReducedMotion } from 'framer-motion';

const BLADES = [
  { rotate: -88, scale: 0.42, delayOuter: 0.75, delayInner: 1.0 },
  { rotate: 88, scale: 0.42, delayOuter: 0.75, delayInner: 1.0 },
  { rotate: -60, scale: 0.68, delayOuter: 0.6, delayInner: 0.85 },
  { rotate: 60, scale: 0.68, delayOuter: 0.6, delayInner: 0.85 },
  { rotate: -30, scale: 0.88, delayOuter: 0.45, delayInner: 0.7 },
  { rotate: 30, scale: 0.88, delayOuter: 0.45, delayInner: 0.7 },
  { rotate: 0, scale: 1, delayOuter: 0.3, delayInner: 0.55 },
];

const BLADE_PATH = 'M0 0 C 28 -70, 32 -190, 0 -290 C -32 -190, -28 -70, 0 0';

/**
 * A decorative, self-drawing cannabis-leaf illustration meant to sit behind
 * foreground content (low opacity, pointer-events-none). Uses currentColor
 * so it inherits whatever text color class the caller applies.
 *
 * The one-time "draw in" of the paths runs through framer-motion (it
 * finishes in ~2.5s and never runs again). The continuous ripple/sway loops
 * are plain CSS animations (see index.css) instead of framer-motion loops,
 * because a JS animation loop that keeps writing styles every frame competes
 * with touch-scroll handling on Android and makes this element visibly lag
 * behind the page while a fixed-position wrapper (see HeroSection) tries to
 * hold it in place.
 */
export function AnimatedLeafBackground({ className }: { className?: string }) {
  const reduced = Boolean(useReducedMotion());

  const drawTransition = (delay: number) =>
    reduced ? { duration: 0 } : { duration: 1.4, delay, ease: [0.6, 0, 0.2, 1] as const };

  return (
    <svg
      viewBox="-340 -340 680 680"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {[0, 2, 4].map((i) => (
        <circle
          key={i}
          className="leaf-ripple"
          cx={0}
          cy={-20}
          r={300}
          stroke="currentColor"
          strokeWidth={1}
          style={{ animationDelay: `${2.4 + i}s` }}
        />
      ))}
      <g className="leaf-sway">
        <g transform="translate(0 60)" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <motion.path
            d="M0 0 C 4 60, -8 150, 12 250"
            initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={drawTransition(0.1)}
          />
          {BLADES.map((b, i) => (
            <g key={i} transform={`rotate(${b.rotate}) scale(${b.scale})`}>
              <motion.path
                d={BLADE_PATH}
                vectorEffect="non-scaling-stroke"
                initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={drawTransition(b.delayOuter)}
              />
              <motion.path
                d="M0 -6 L0 -270"
                vectorEffect="non-scaling-stroke"
                initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={drawTransition(b.delayInner)}
              />
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}
