import { useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion';
import { FlaskConical, RotateCcw } from 'lucide-react';
import Reveal from '@/pages/lesson/Reveal';

/**
 * Scripted mini-sandbox: a playful fake terminal (NOT a real shell).
 * Understands only `pwd`, `ls`, `cd <folder>`, `clear`, `help` against a tiny
 * fake filesystem. Content-neutral: works identically on any lesson.
 */

type DirName = '~' | 'documents' | 'downloads' | 'music';

const FS: Record<DirName, { dirs: string[]; files: string[] }> = {
  '~': { dirs: ['documents', 'downloads', 'music'], files: ['notes.txt', 'readme.md'] },
  documents: { dirs: [], files: ['homework.txt', 'report.odt'] },
  downloads: { dirs: [], files: ['ubuntu-22.04.iso', 'photo.png'] },
  music: { dirs: [], files: ['song.mp3'] },
};

const ABS: Record<DirName, string> = {
  '~': '/home/student',
  documents: '/home/student/documents',
  downloads: '/home/student/downloads',
  music: '/home/student/music',
};

interface Line {
  kind: 'cmd' | 'out' | 'err';
  cwd: DirName;
  text: string;
}

const WELCOME: Line[] = [
  { kind: 'out', cwd: '~', text: 'Добро пожаловать в мини-песочницу! Это игрушечный терминал.' },
  { kind: 'out', cwd: '~', text: 'Он понимает команды: pwd, ls, cd, clear, help. Попробуйте: ls' },
];

function PromptLabel({ cwd }: { cwd: DirName }) {
  return (
    <span className="shrink-0 font-mono text-sm text-terminal-green">
      student@ubuntu:<span className="text-orange-soft">{cwd === '~' ? '~' : `~/${cwd}`}</span>$
    </span>
  );
}

export default function Sandbox() {
  const reduced = useReducedMotion();
  const [cwd, setCwd] = useState<DirName>('~');
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [value, setValue] = useState('');
  const [flashOk, setFlashOk] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const shake = useAnimationControls();

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const print = (newLines: Line[]) => setLines((prev) => [...prev, ...newLines]);

  const fail = (text: string) => {
    print([
      { kind: 'err', cwd, text },
      { kind: 'err', cwd, text: 'подсказка: попробуйте команду help' },
    ]);
    if (!reduced) {
      shake.start({ x: [0, -5, 5, -4, 4, 0], transition: { duration: 0.3 } });
    }
  };

  const succeed = () => {
    setFlashOk(true);
    window.setTimeout(() => setFlashOk(false), 350);
  };

  const run = (rawInput: string) => {
    const input = rawInput.trim();
    print([{ kind: 'cmd', cwd, text: rawInput }]);
    if (input === '') return;

    const [cmd, ...args] = input.split(/\s+/);
    const arg = args.join(' ');

    switch (cmd) {
      case 'pwd':
        print([{ kind: 'out', cwd, text: ABS[cwd] }]);
        succeed();
        break;
      case 'ls': {
        const { dirs, files } = FS[cwd];
        const listing = [...dirs.map((d) => `${d}/`), ...files].join('  ');
        print([{ kind: 'out', cwd, text: listing || '(пусто)' }]);
        succeed();
        break;
      }
      case 'cd': {
        if (arg === '' || arg === '~' || arg === '/home/student') {
          setCwd('~');
          succeed();
        } else if (arg === '..') {
          setCwd('~');
          succeed();
        } else if (arg === '/') {
          print([{ kind: 'out', cwd, text: 'Корневая папка — за пределами песочницы. Вернём вас домой: cd ~' }]);
        } else if (cwd === '~' && ['documents', 'downloads', 'music'].includes(arg.replace(/^~\//, '').replace(/\/$/, ''))) {
          setCwd(arg.replace(/^~\//, '').replace(/\/$/, '') as DirName);
          succeed();
        } else {
          fail(`cd: нет такого файла или каталога: ${arg}`);
        }
        break;
      }
      case 'clear':
        setLines([]);
        break;
      case 'help':
        print([
          { kind: 'out', cwd, text: 'Доступные команды песочницы:' },
          { kind: 'out', cwd, text: '  pwd            — где я нахожусь' },
          { kind: 'out', cwd, text: '  ls             — что лежит в текущей папке' },
          { kind: 'out', cwd, text: '  cd <папка>     — перейти в папку (documents, downloads, music)' },
          { kind: 'out', cwd, text: '  cd ..          — вернуться назад' },
          { kind: 'out', cwd, text: '  cd ~           — вернуться домой' },
          { kind: 'out', cwd, text: '  clear          — очистить экран' },
          { kind: 'out', cwd, text: '  help           — эта справка' },
        ]);
        succeed();
        break;
      default:
        fail(`${cmd}: команда не найдена`);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    run(value);
    setValue('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <Reveal>
      <motion.div animate={shake} className="overflow-hidden rounded-xl border border-line bg-code-bg shadow-[0_24px_70px_rgba(26,10,30,0.35)]">
        {/* window header */}
        <div className="flex items-center gap-2 border-b border-line/70 bg-[#1E0E1A] px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-orange" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-terminal-green" />
          <span className="mx-auto flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <FlaskConical className="h-3.5 w-3.5 text-orange" />
            песочница — не настоящий терминал
          </span>
          <button
            type="button"
            onClick={() => {
              setLines(WELCOME);
              setCwd('~');
              inputRef.current?.focus();
            }}
            aria-label="Начать заново"
            title="Начать заново"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-aubergine-700/50 hover:text-paper"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {/* output + input */}
        <div
          className="h-[320px] cursor-text overflow-y-auto p-4"
          onClick={() => inputRef.current?.focus()}
          ref={scrollRef}
        >
          {lines.map((line, i) => {
            if (line.kind === 'cmd') {
              return (
                <div key={i} className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  <PromptLabel cwd={line.cwd} /> <span className="text-paper">{line.text}</span>
                </div>
              );
            }
            if (line.kind === 'err') {
              return (
                <div key={i} className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-error">
                  {line.text}
                </div>
              );
            }
            return (
              <div key={i} className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-muted-foreground">
                {line.text}
              </div>
            );
          })}
          <form onSubmit={onSubmit} className="flex items-center gap-2 pt-1">
            <span className={flashOk ? 'transition-colors duration-300 [&_span]:!text-terminal-green' : ''}>
              <PromptLabel cwd={cwd} />
            </span>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              className="w-full bg-transparent font-mono text-sm text-paper caret-orange outline-none placeholder:text-muted-foreground/50"
              placeholder="введите команду и нажмите Enter…"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              aria-label="Командная строка песочницы"
            />
            <span className="hidden select-none font-mono text-sm text-orange animate-blink sm:inline" aria-hidden>
              ▮
            </span>
          </form>
        </div>
      </motion.div>
    </Reveal>
  );
}
