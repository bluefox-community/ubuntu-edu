import TerminalBlock from '@/components/TerminalBlock';
import Callout from '@/components/Callout';
import { renderInline } from '@/lib/inline';
import type { LessonBlock } from '@/data/types';
import Reveal from '@/pages/lesson/Reveal';

/**
 * Renders the theory blocks of a lesson in «paper» reading mode:
 * light background (#F7F4F6) with dark text, while terminals and callouts
 * stay dark — a deliberate contrast (design.md §3, lesson.md §2).
 *
 * The wrapper uses `[&_strong]:!text-current` so that `renderInline`'s
 * <strong> (text-paper, meant for dark pages) inherits the dark paper-mode
 * text color instead.
 */

function Paragraph({ text }: { text: string }) {
  return (
    <p className="text-[1.0625rem] leading-[1.7] text-[#2C1428]/90 [&_strong]:!text-current">{renderInline(text)}</p>
  );
}

function Heading({ text }: { text: string }) {
  return (
    <h2 className="pt-4 font-display text-[clamp(1.5rem,3vw,1.875rem)] font-bold tracking-[-0.01em] text-[#2C1428]">
      <span className="mr-2 select-none font-mono font-normal text-orange" aria-hidden>
        ##
      </span>
      {text}
    </h2>
  );
}

function CodeBlock({ title, code }: { title?: string; code: string }) {
  return <TerminalBlock code={code} title={title ?? 'student@ubuntu: ~'} className="shadow-[0_16px_50px_rgba(26,10,30,0.25)]" />;
}

function CalloutBlock({ variant, text }: { variant: 'simple' | 'warning' | 'check' | 'remember'; text: string }) {
  // Callout is styled for dark backgrounds — on paper it becomes a dark island,
  // same contrast trick as the terminal blocks.
  return (
    <div className="rounded-xl bg-aubergine-900 p-3 shadow-[0_16px_50px_rgba(26,10,30,0.22)] sm:p-4">
      <Callout variant={variant} text={text} />
    </div>
  );
}

function ListBlock({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5 [&_strong]:!text-current">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-[1.0625rem] leading-[1.7] text-[#2C1428]/90">
          <span className="mt-[0.1em] shrink-0 select-none font-mono font-bold text-orange" aria-hidden>
            {'>'}
          </span>
          <span>{renderInline(item)}</span>
        </li>
      ))}
    </ul>
  );
}

function TableBlock({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="scroll-fade-x overflow-x-auto rounded-xl border border-[#E1D3DD] bg-white/60 shadow-[0_10px_30px_rgba(26,10,30,0.08)] [&_strong]:!text-current">
      <table className="w-full min-w-[480px] border-collapse text-left text-[0.95rem]">
        <thead>
          <tr className="bg-aubergine-900">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-paper">
                {renderInline(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className={r % 2 === 0 ? 'bg-transparent' : 'bg-aubergine-900/[0.045]'}>
              {row.map((cell, c) => (
                <td
                  key={c}
                  className="border-t border-[#E1D3DD] px-4 py-3 align-top leading-relaxed text-[#2C1428]/90 first:font-medium first:text-[#2C1428]"
                >
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Block({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case 'paragraph':
      return <Paragraph text={block.text} />;
    case 'heading':
      return <Heading text={block.text} />;
    case 'code':
      return <CodeBlock title={block.title} code={block.code} />;
    case 'callout':
      return <CalloutBlock variant={block.variant} text={block.text} />;
    case 'list':
      return <ListBlock items={block.items} />;
    case 'table':
      return <TableBlock headers={block.headers} rows={block.rows} />;
    default:
      return null;
  }
}

/** Full theory body: every block type from the content contract. */
export default function TheoryBlocks({ blocks }: { blocks: LessonBlock[] }) {
  return (
    <div className="space-y-7">
      {blocks.map((block, i) => (
        <Reveal key={i}>
          <Block block={block} />
        </Reveal>
      ))}
    </div>
  );
}
