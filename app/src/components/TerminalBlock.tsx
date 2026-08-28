import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TerminalBlockProps {
  /** Contract format: lines "$ cmd" are commands, "# ..." comments, rest is output. */
  code: string;
  /** Optional window title (defaults to "student@ubuntu: ~"). */
  title?: string;
  /** Extra classes for the outer wrapper. */
  className?: string;
  /** Show blinking block cursor on a final prompt line. */
  cursor?: boolean;
}

type Line = { kind: 'cmd' | 'comment' | 'out'; text: string };

function parse(code: string): Line[] {
  return code.split('\n').map((raw) => {
    if (raw.startsWith('$ ')) return { kind: 'cmd', text: raw.slice(2) };
    if (raw === '$') return { kind: 'cmd', text: '' };
    if (raw.startsWith('# ')) return { kind: 'comment', text: raw };
    if (raw === '#') return { kind: 'comment', text: '#' };
    return { kind: 'out', text: raw };
  });
}

/** Terminal window with Ubuntu traffic-light header, prompt coloring and copy button. */
export default function TerminalBlock({ code, title = 'student@ubuntu: ~', className, cursor = false }: TerminalBlockProps) {
  const [copied, setCopied] = useState(false);
  const lines = parse(code);

  const copy = async () => {
    // Copy only the commands (without "$ ") so they can be pasted straight into a shell.
    const commands = lines.filter((l) => l.kind === 'cmd' && l.text.trim() !== '').map((l) => l.text);
    const textToCopy = commands.length > 0 ? commands.join('\n') : code;
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = textToCopy;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-line bg-code-bg shadow-[0_20px_60px_rgba(0,0,0,0.45)]',
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-line/70 bg-[#1E0E1A] px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-orange" />
        <span className="h-3 w-3 rounded-full bg-amber-400" />
        <span className="h-3 w-3 rounded-full bg-terminal-green" />
        <span className="mx-auto font-mono text-xs text-muted-foreground">{title}</span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? 'Скопировано' : 'Скопировать команды'}
          title={copied ? 'Скопировано!' : 'Скопировать команды'}
          className="cursor-copy rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-aubergine-700/50 hover:text-paper"
        >
          {copied ? <Check className="h-4 w-4 text-terminal-green" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <div className="scroll-fade-x scroll-fade-x--code scrollbar-thin-x overflow-x-auto p-4 font-mono text-sm leading-relaxed">
        {lines.map((line, i) => {
          const isLast = i === lines.length - 1;
          if (line.kind === 'cmd') {
            return (
              <div key={i} className="whitespace-pre">
                <span className="text-terminal-green">student@ubuntu:~$ </span>
                <span className="text-paper">{line.text}</span>
                {cursor && isLast && <span className="ml-1 inline-block animate-blink text-orange">▮</span>}
              </div>
            );
          }
          if (line.kind === 'comment') {
            return (
              <div key={i} className="whitespace-pre italic text-muted-foreground/80">
                {line.text}
              </div>
            );
          }
          return (
            <div key={i} className="whitespace-pre text-muted-foreground">
              {line.text || '\u00A0'}
            </div>
          );
        })}
      </div>
    </div>
  );
}
