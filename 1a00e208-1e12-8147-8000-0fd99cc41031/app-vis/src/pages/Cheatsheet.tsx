import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BookOpen, Search, SearchX } from 'lucide-react';
import { cheatCategories, totalCommands } from '@/data/cheatsheet';
import QuickNav from './cheatsheet/QuickNav';
import CategorySection from './cheatsheet/CategorySection';
import Hotkeys from './cheatsheet/Hotkeys';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Cheatsheet() {
  const reduce = useReducedMotion();
  const [rawQuery, setRawQuery] = useState('');
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Live search with 200ms debounce
  useEffect(() => {
    const t = setTimeout(() => setQuery(rawQuery), 200);
    return () => clearTimeout(t);
  }, [rawQuery]);

  // Ctrl+K / Cmd+K focuses search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Categories that have at least one match under the current query
  const visibleCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cheatCategories;
    return cheatCategories.filter((cat) =>
      cat.commands.some(
        (c) =>
          c.command.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          (c.example ?? '').toLowerCase().includes(q) ||
          cat.title.toLowerCase().includes(q),
      ),
    );
  }, [query]);

  // Scrollspy: highlight the chip of the category currently scrolled to
  useEffect(() => {
    const ids = visibleCategories.map((c) => c.id);
    if (ids.length === 0) return;
    const onScroll = () => {
      const threshold = 170; // navbar (64) + quick-nav (~60) + small margin
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(`cat-${id}`);
        if (el && el.getBoundingClientRect().top <= threshold) current = id;
      }
      // Если ничего выше порога нет — первая видимая категория
      setActiveId(current ?? ids[0]);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [visibleCategories]);

  const scrollTo = (id: string) => {
    setActiveId(id);
    document
      .getElementById(`cat-${id}`)
      ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <div>
      {/* Section 1 — Page Hero + Search */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center lg:px-8">
        <p className="font-mono text-sm text-muted-foreground">~/шпаргалка</p>
        <p className="mt-2 font-mono text-sm font-bold uppercase tracking-[0.18em] text-orange">
          // справочник команд
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">
          <WordSplit text="Все команды — под рукой" reduce={reduce ?? false} />
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 0.35, duration: 0.5 }}
          className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted-foreground"
        >
          {totalCommands} команд по 10 категориям. Не обязательно помнить всё наизусть — профессионалы тоже
          подглядывают. Ищите, копируйте, возвращайтесь к делу.
        </motion.p>

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          transition={{ delay: reduce ? 0 : 0.5, duration: 0.4, ease: EASE }}
          className="relative mx-auto mt-8 max-w-xl"
        >
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={searchRef}
            type="search"
            value={rawQuery}
            onChange={(e) => setRawQuery(e.target.value)}
            placeholder="например: удалить, права, сеть…"
            aria-label="Поиск по командам"
            className="w-full rounded-2xl border border-line bg-code-bg py-4 pl-12 pr-24 font-mono text-lg text-paper placeholder:text-muted-foreground/60 focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/40"
          />
          <kbd className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-md border border-line bg-aubergine-900 px-2 py-1 font-mono text-xs text-muted-foreground sm:block">
            Ctrl+K
          </kbd>
        </motion.div>
      </section>

      {/* Section 2 — Category quick-nav (sticky, scrollspy) */}
      <QuickNav categories={visibleCategories} activeId={activeId} onSelect={scrollTo} />

      {/* Section 3 — Command categories */}
      <div className="mx-auto max-w-7xl space-y-14 px-6 py-14 lg:px-8">
        {visibleCategories.length === 0 ? (
          <div className="mx-auto max-w-md py-16 text-center">
            <SearchX className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <p className="mt-4 font-mono text-lg text-paper">grep: совпадений не найдено</p>
            <p className="mt-2 text-sm text-muted-foreground">
              По запросу «{query}» ничего нет. Попробуйте одно из этого:
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {['удалить', 'права', 'сеть', 'архив', 'служба'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setRawQuery(s);
                    setQuery(s);
                  }}
                  className="rounded-full border border-line bg-aubergine-900 px-3.5 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-orange hover:text-orange"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          visibleCategories.map((cat) => (
            <CategorySection key={cat.id} category={cat} query={query} />
          ))
        )}

        {/* Section 4 — Hotkeys */}
        <Hotkeys />

        {/* Section 5 — CTA */}
        <motion.section
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.5, ease: EASE }}
          className="rounded-2xl border border-line bg-aubergine-900/60 p-8 text-center sm:p-10"
        >
          <p className="font-display text-xl font-medium text-paper sm:text-2xl">
            Забыли, что делает команда? Пройдите урок →
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/program"
              className="inline-flex items-center gap-2 rounded-[10px] bg-gradient-to-br from-orange to-orange-soft px-5 py-2.5 font-mono text-sm font-bold text-paper transition-transform hover:scale-[1.03] hover:shadow-glow-lg"
            >
              <BookOpen className="h-4 w-4" />
              Уроки
            </Link>
            <Link
              to="/practice"
              className="group inline-flex items-center gap-2 rounded-[10px] border border-line bg-code-bg px-5 py-2.5 font-mono text-sm text-muted-foreground transition-colors hover:border-aubergine-700 hover:text-paper"
            >
              Задания на эти команды
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

function WordSplit({ text, reduce }: { text: string; reduce: boolean }) {
  const words = text.split(' ');
  if (reduce) return <>{text}</>;
  return (
    <>
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07 * i, duration: 0.45, ease: EASE }}
        >
          {w}
          {i < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </>
  );
}
