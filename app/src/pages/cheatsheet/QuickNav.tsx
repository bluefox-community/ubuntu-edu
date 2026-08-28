import { motion } from 'framer-motion';
import type { CheatCategory } from '@/data/cheatsheet';
import { cn } from '@/lib/utils';

/** Sticky chip row with scrollspy-driven active category. */
export default function QuickNav({
  categories,
  activeId,
  onSelect,
}: {
  /** Только видимые (после фильтра) категории. */
  categories: CheatCategory[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="sticky top-[var(--nav-h,64px)] z-40 border-b border-line bg-aubergine-950/80 backdrop-blur-md transition-[top] duration-300">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="scroll-fade-x scroll-fade-x--dark scrollbar-thin-x -mx-1 overflow-x-auto py-3">
          <div className="flex w-max items-center gap-1.5 px-1" role="tablist" aria-label="Категории команд">
            {categories.map((cat, i) => {
              const active = activeId === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                  onClick={() => onSelect(cat.id)}
                  className={cn(
                    'relative whitespace-nowrap rounded-full px-3.5 py-1.5 font-mono text-xs transition-colors',
                    active ? 'text-paper' : 'text-muted-foreground hover:text-paper',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="quicknav-pill"
                      className="absolute inset-0 rounded-full bg-orange"
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                  <span className="relative">{cat.title}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
        {/* edge fades handled by .scroll-fade-x on the scroller (only shown when scrollable) */}
      </div>
    </div>
  );
}
