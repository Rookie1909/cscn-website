import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export interface NavChild {
  label: string;
  href: string;
}

export interface PriorityNavItem {
  id: string;
  label: string;
  href: string;
  /** Kleinere Zahl = wichtiger. Bei Platzmangel verschwindet zuerst, was die größte Zahl hat. */
  priority: number;
  /** Immer sichtbar, auch wenn der Platz knapp wird. */
  pinned?: boolean;
  children?: NavChild[];
}

interface PriorityNavProps {
  items: PriorityNavItem[];
  isActive: (href: string) => boolean;
}

const itemClass = (active: boolean) =>
  `relative flex items-center gap-1.5 whitespace-nowrap text-sm font-headline font-black uppercase tracking-wider transition-colors hover:text-primary ${
    active ? 'text-primary' : 'text-foreground/70'
  }`;

const dropdownLinkClass =
  'block px-5 py-3 text-xs font-headline font-bold uppercase tracking-wider text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all';

// Aufklappmenü per Hover (Desktop) oder Klick/Tastatur. Der Abstand zwischen
// Knopf und Liste ist Innenabstand (pt-4) statt Außenabstand, damit die Maus auf
// dem Weg nach unten nie den Hover-Bereich verlässt.
function Dropdown({
  label,
  active,
  width,
  align,
  children,
}: {
  label: string;
  active: boolean;
  width: string;
  align: 'center' | 'right';
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={close}
      onKeyDown={(e) => e.key === 'Escape' && close()}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={itemClass(active)}
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <div
            className={`absolute top-full z-10 pt-4 ${width} ${
              align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2'
            }`}
          >
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="overflow-hidden rounded-2xl border border-border bg-card/95 py-2 shadow-2xl backdrop-blur-xl"
            >
              {children(close)}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Menüleiste, die sich der verfügbaren Breite anpasst: Die wichtigsten Punkte
 * (priority) bleiben sichtbar, was nicht mehr passt, wandert in „Mehr“. Je mehr
 * Platz da ist, desto mehr Punkte erscheinen direkt in der Leiste. Die Breite
 * wird gemessen (nicht über feste Schwellen geschätzt), damit es mit jeder
 * Sprache und jedem Browser-Zoom stimmt.
 */
export function PriorityNav({ items, isActive }: PriorityNavProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const [visibleIds, setVisibleIds] = useState<string[] | null>(null);

  // Ändert sich nur, wenn sich Einträge oder Texte (Sprache) ändern.
  const signature = items.map((i) => `${i.id}:${i.label}`).join('|');

  const compute = useCallback(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const available = container.clientWidth;
    const gap = parseFloat(getComputedStyle(measure).columnGap) || 0;
    const widthOf = (selector: string) => (measure.querySelector(selector) as HTMLElement | null)?.offsetWidth ?? 0;
    const moreWidth = widthOf('[data-nav-more]');

    const order = [...itemsRef.current].sort((a, b) => a.priority - b.priority);
    const shown = new Set<string>();
    let used = 0;
    for (let i = 0; i < order.length; i++) {
      const item = order[i];
      const next = used + (shown.size ? gap : 0) + widthOf(`[data-nav-id="${item.id}"]`);
      // Bleibt danach noch etwas übrig, muss auch der „Mehr“-Knopf Platz haben.
      const total = next + (i < order.length - 1 ? gap + moreWidth : 0);
      if (item.pinned || total <= available) {
        shown.add(item.id);
        used = next;
      } else {
        break;
      }
    }

    const ids = itemsRef.current.filter((i) => shown.has(i.id)).map((i) => i.id);
    setVisibleIds((prev) => (prev && prev.join('|') === ids.join('|') ? prev : ids));
  }, []);

  useLayoutEffect(() => {
    compute();
  }, [compute, signature]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => compute());
    observer.observe(container);
    // Schriftart wird oft erst nach dem ersten Rendern geladen und ändert die Textbreiten.
    document.fonts?.ready.then(compute);
    return () => observer.disconnect();
  }, [compute]);

  const visible = visibleIds ? items.filter((i) => visibleIds.includes(i.id)) : items;
  const hidden = visibleIds ? items.filter((i) => !visibleIds.includes(i.id)) : [];
  const moreActive = hidden.some((i) => isActive(i.href) || i.children?.some((c) => isActive(c.href)));

  return (
    <div ref={containerRef} className="relative flex min-w-0 flex-1 items-center justify-end">
      <nav aria-label={t('header.menu')} className="flex items-center gap-5 xl:gap-6">
        {visible.map((item) =>
          item.children ? (
            <Dropdown
              key={item.id}
              label={item.label}
              active={isActive(item.href) || item.children.some((c) => isActive(c.href))}
              width="w-60"
              align="center"
            >
              {(close) =>
                item.children!.map((child) => (
                  <Link key={child.href} to={child.href} onClick={close} className={dropdownLinkClass}>
                    {child.label}
                  </Link>
                ))
              }
            </Dropdown>
          ) : (
            <Link key={item.id} to={item.href} className={itemClass(isActive(item.href))}>
              {item.label}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-primary transition-all duration-500 ${
                  isActive(item.href) ? 'w-full' : 'w-0'
                }`}
              />
            </Link>
          ),
        )}

        {hidden.length > 0 && (
          <Dropdown label={t('nav.more')} active={moreActive} width="w-72" align="right">
            {(close) =>
              hidden.map((item) =>
                item.children ? (
                  <div key={item.id} className="py-1">
                    <p className="px-5 pb-1 pt-2 font-headline text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                      {item.label}
                    </p>
                    {item.children.map((child) => (
                      <Link key={child.href} to={child.href} onClick={close} className={dropdownLinkClass}>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link key={item.id} to={item.href} onClick={close} className={dropdownLinkClass}>
                    {item.label}
                  </Link>
                ),
              )
            }
          </Dropdown>
        )}
      </nav>

      {/* Unsichtbare Messzeile: alle Einträge in Originalgröße, nur zum Ausmessen. */}
      <div
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute left-0 top-0 flex h-0 items-center gap-5 overflow-hidden xl:gap-6"
      >
        {items.map((item) => (
          <span key={item.id} data-nav-id={item.id} className={itemClass(false)}>
            {item.label}
            {item.children && <ChevronDown className="h-4 w-4" />}
          </span>
        ))}
        <span data-nav-more className={itemClass(false)}>
          {t('nav.more')}
          <ChevronDown className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}
