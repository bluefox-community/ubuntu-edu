import { Rocket, Shield, SlidersHorizontal, Keyboard, Sprout } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Rank } from '@/data/types';
import { cn } from '@/lib/utils';

export const RANK_META: Record<Rank, { Icon: LucideIcon; classes: string }> = {
  Новичок: { Icon: Sprout, classes: 'border-terminal-green/40 bg-terminal-green/10 text-terminal-green' },
  Пользователь: { Icon: Keyboard, classes: 'border-amber-400/40 bg-amber-400/10 text-amber-400' },
  Уверенный: { Icon: SlidersHorizontal, classes: 'border-orange-soft/40 bg-orange-soft/10 text-orange-soft' },
  Администратор: { Icon: Shield, classes: 'border-orange/40 bg-orange/10 text-orange' },
  Профессионал: { Icon: Rocket, classes: 'border-aubergine bg-aubergine/25 text-paper' },
};

/** Rank chip with icon + Ubuntu Mono label. */
export default function RankBadge({ rank, className }: { rank: Rank; className?: string }) {
  const { Icon, classes } = RANK_META[rank];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[10px] border px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-wider',
        classes,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {rank}
    </span>
  );
}
