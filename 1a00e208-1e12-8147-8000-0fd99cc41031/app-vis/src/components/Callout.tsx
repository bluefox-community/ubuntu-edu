import { Brain, CheckCircle2, Lightbulb, TriangleAlert } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { renderInline } from '@/lib/inline';

export type CalloutVariant = 'simple' | 'warning' | 'check' | 'remember';

const VARIANTS: Record<CalloutVariant, { label: string; Icon: LucideIcon; classes: string; iconClasses: string }> = {
  simple: {
    label: 'Простыми словами',
    Icon: Lightbulb,
    classes: 'border-orange bg-orange/10',
    iconClasses: 'text-orange',
  },
  warning: {
    label: 'Внимание',
    Icon: TriangleAlert,
    classes: 'border-amber-400 bg-amber-400/10',
    iconClasses: 'text-amber-400',
  },
  check: {
    label: 'Проверь себя',
    Icon: CheckCircle2,
    classes: 'border-terminal-green bg-terminal-green/10',
    iconClasses: 'text-terminal-green',
  },
  remember: {
    label: 'Запомни',
    Icon: Brain,
    classes: 'border-aubergine-700 bg-aubergine-700/25',
    iconClasses: 'text-aubergine-700',
  },
};

export default function Callout({
  variant,
  text,
  className,
}: {
  variant: CalloutVariant;
  text: string;
  className?: string;
}) {
  const { label, Icon, classes, iconClasses } = VARIANTS[variant];
  return (
    <aside className={cn('rounded-r-xl rounded-l-sm border-l-[3px] p-4 sm:p-5', classes, className)}>
      <div className={cn('mb-1.5 flex items-center gap-2 font-mono text-sm font-bold', iconClasses)}>
        <Icon className="h-4 w-4 shrink-0" />
        {label}
      </div>
      <p className="text-[0.95rem] leading-relaxed text-paper/90">{renderInline(text)}</p>
    </aside>
  );
}
