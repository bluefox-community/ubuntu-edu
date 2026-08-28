import { useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import type { CheatCommand } from '@/data/cheatsheet';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

/** Copyable command row: click anywhere → copy command, ripple + checkmark swap + tooltip. */
export default function CommandRow({ item }: { item: CheatCommand }) {
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rowRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const copy = async (e: ReactMouseEvent) => {
    try {
      await navigator.clipboard.writeText(item.command);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = item.command;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);

    if (!reduce && rowRef.current) {
      const rect = rowRef.current.getBoundingClientRect();
      const ripple = { id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top };
      setRipples((r) => [...r, ripple]);
      setTimeout(() => setRipples((r) => r.filter((x) => x.id !== ripple.id)), 500);
    }
  };

  return (
    <div className="group relative">
      <button
        ref={rowRef}
        type="button"
        onClick={copy}
        title={item.example ? `пример: ${item.example}` : 'Нажмите, чтобы скопировать'}
        aria-label={`Скопировать команду ${item.command}`}
        className="relative flex w-full cursor-copy items-start gap-3 overflow-hidden rounded-xl border border-line/60 bg-code-bg/50 px-4 py-3 text-left transition-colors hover:border-aubergine-700 hover:bg-aubergine-700/25"
      >
        {/* ripple */}
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className="pointer-events-none absolute h-3 w-3 rounded-full bg-orange/30"
            style={{ left: r.x, top: r.y }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 12, opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          />
        ))}

        <span className="min-w-0 flex-1">
          <motion.code
            animate={copied ? { color: '#4ADE80' } : { color: '#E95420' }}
            transition={{ duration: 0.2 }}
            className="block truncate font-mono text-sm font-bold transition-transform group-hover:-translate-y-px"
          >
            {item.command}
          </motion.code>
          <span className="mt-0.5 block text-sm text-muted-foreground">{item.description}</span>
          {item.example && (
            <span className="mt-1 hidden font-mono text-xs text-muted-foreground/60 group-hover:block">
              $ {item.example}
            </span>
          )}
        </span>

        <span className="relative mt-0.5 shrink-0 text-muted-foreground">
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.4, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                className="block"
              >
                <Check className="h-4 w-4 text-terminal-green" />
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.4, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="block"
              >
                <Copy className="h-4 w-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </button>

      {/* tooltip */}
      <AnimatePresence>
        {copied && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute -top-8 right-2 z-10 rounded-md border border-terminal-green/40 bg-code-bg px-2 py-1 font-mono text-xs text-terminal-green shadow-lg"
          >
            Скопировано!
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
