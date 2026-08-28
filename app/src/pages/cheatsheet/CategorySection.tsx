import { motion, useReducedMotion } from 'framer-motion';
import {
  Archive,
  Compass,
  Cpu,
  FileText,
  Folder,
  HardDrive,
  Network,
  Package,
  Settings,
  Shield,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { CheatCategory } from '@/data/cheatsheet';
import CommandRow from './CommandRow';

export const CATEGORY_ICONS: Record<CheatCategory['icon'], LucideIcon> = {
  compass: Compass,
  folder: Folder,
  'file-text': FileText,
  shield: Shield,
  package: Package,
  cpu: Cpu,
  'hard-drive': HardDrive,
  network: Network,
  settings: Settings,
  archive: Archive,
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function CategorySection({
  category,
  query,
}: {
  category: CheatCategory;
  /** Текущий поисковый запрос — подсвечиваем, сколько строк попало под фильтр. */
  query: string;
}) {
  const reduce = useReducedMotion();
  const Icon = CATEGORY_ICONS[category.icon];
  const q = query.trim().toLowerCase();
  const rows = q
    ? category.commands.filter(
        (c) =>
          c.command.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          (c.example ?? '').toLowerCase().includes(q),
      )
    : category.commands;

  if (rows.length === 0) return null;

  return (
    <section id={`cat-${category.id}`} className="scroll-mt-36" aria-label={category.title}>
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
        whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.4, ease: EASE }}
        className="flex items-center gap-3"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-orange/30 bg-orange/10">
          <Icon className="h-[18px] w-[18px] text-orange" />
        </span>
        <h2 className="font-display text-xl font-semibold tracking-tight text-paper sm:text-2xl">
          {category.title}
        </h2>
        <span className="rounded-full border border-line bg-aubergine-900 px-2 py-0.5 font-mono text-xs text-muted-foreground">
          {rows.length}
        </span>
      </motion.div>

      <motion.div
        initial={reduce ? false : 'hidden'}
        whileInView="show"
        viewport={{ once: true, margin: '-5% 0px' }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduce ? 0 : 0.04 } },
        }}
        className="mt-4 grid gap-2.5 lg:grid-cols-2"
      >
        {rows.map((cmd) => (
          <motion.div
            key={cmd.command}
            variants={{
              hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
            }}
          >
            <CommandRow item={cmd} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
