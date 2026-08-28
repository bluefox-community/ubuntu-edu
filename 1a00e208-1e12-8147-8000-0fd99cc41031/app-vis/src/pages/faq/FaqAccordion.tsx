import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { EASE, Reveal, WordRise } from './motion';

interface FaqItem {
  id: string;
  q: string;
  a: string;
}

interface FaqCategory {
  title: string;
  items: FaqItem[];
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    title: 'Для начинающих',
    items: [
      {
        id: 'b1',
        q: 'Я никогда не видел(а) Linux. Это точно для меня?',
        a: 'Да. Курс начинается с вопроса «что вообще такое операционная система». Каждый термин объясняется на бытовых примерах — от ресторанной кухни до шкафа с папками.',
      },
      {
        id: 'b2',
        q: 'Мне за 40 / я гуманитарий / я боюсь компьютеров.',
        a: 'Среди учеников — бухгалтеры, учителя и музыканты. Возраст и профессия не важны: важны 40 минут в день и готовность пробовать.',
      },
      {
        id: 'b3',
        q: 'Чем Ubuntu отличается от Windows и почему именно Ubuntu 22.04?',
        a: 'Ubuntu — самый дружелюбный дистрибутив Linux: бесплатный, с огромным сообществом. 22.04 LTS — версия с 5-летней поддержкой: то, что выучите, не устареет.',
      },
      {
        id: 'b4',
        q: 'А если я что-то сломаю?',
        a: 'Первые модули проходят в виртуальной машине — безопасной песочнице. Сломали? Откат за минуту. Ломать и чинить — лучший способ учиться.',
      },
    ],
  },
  {
    title: 'Про процесс',
    items: [
      {
        id: 'p1',
        q: 'Сколько времени нужно?',
        a: '~18 часов чистого времени. По 40 минут в день — это 3–4 недели. Но темп ваш: можно за выходные «запоем», можно по воскресеньям.',
      },
      {
        id: 'p2',
        q: 'Курс правда бесплатный? В чём подвох?',
        a: 'Подвоха нет. Все уроки, задания и шпаргалки открыты. Мы верим, что базовая цифровая грамотность должна быть доступной.',
      },
      {
        id: 'p3',
        q: 'Будет ли сертификат?',
        a: 'Формального диплома нет — но будет кое-что ценнее: финальный проект (настроенный сервер), который не стыдно показать работодателю.',
      },
      {
        id: 'p4',
        q: 'Что делать, если застрял на задании?',
        a: 'У каждого задания есть подсказка и эталонное решение. Правило курса: 20 минут сам → подсказка → ещё 20 минут → решение с разбором.',
      },
    ],
  },
  {
    title: 'Про техническое',
    items: [
      {
        id: 't1',
        q: 'Какой нужен компьютер?',
        a: 'Любой с 4 ГБ RAM (хватит и старого ноутбука). Ubuntu 22.04 работает там, где современная Windows уже задыхается.',
      },
      {
        id: 't2',
        q: 'Можно ли не удалять Windows?',
        a: 'Конечно: виртуальная машина (нулевой риск) или dual boot (две системы на одном ПК). Урок 2 разбирает оба способа по шагам.',
      },
      {
        id: 't3',
        q: 'Нужен ли интернет постоянно?',
        a: 'Для установки пакетов — да. Сами уроки можно читать офлайн, сохранив страницу.',
      },
      {
        id: 't4',
        q: 'Что после курса? Куда расти дальше?',
        a: 'Дорожная карта в финальном уроке: Docker, облака, администрирование, DevOps. Курс даёт фундамент, на котором строится всё остальное.',
      },
    ],
  },
];

export default function FaqAccordion({ query }: { query: string }) {
  const reduced = useReducedMotion();
  const [openValue, setOpenValue] = useState<string | undefined>(undefined);

  const normalized = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!normalized) return FAQ_CATEGORIES;
    return FAQ_CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) => item.q.toLowerCase().includes(normalized) || item.a.toLowerCase().includes(normalized),
      ),
    })).filter((cat) => cat.items.length > 0);
  }, [normalized]);

  const totalShown = filtered.reduce((s, c) => s + c.items.length, 0);

  return (
    <div>
      {filtered.map((cat) => (
        <div key={cat.title} className="mt-12 first:mt-0">
          <h2 className="font-display text-xl font-bold tracking-[-0.01em] text-paper sm:text-2xl">
            <span className="mr-2 font-mono text-orange">##</span>
            <WordRise text={cat.title} />
          </h2>
          <Accordion
            type="single"
            collapsible
            value={openValue}
            onValueChange={setOpenValue}
            className="mt-5 space-y-3"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {cat.items.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout="position"
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, ease: EASE, delay: normalized ? 0 : 0.06 * i }}
                >
                  <AccordionItem
                    value={item.id}
                    className="rounded-xl border border-line bg-aubergine-900 px-5 transition-colors data-[state=open]:border-orange/50"
                  >
                    <AccordionTrigger className="py-5 text-left font-display text-lg font-medium text-paper hover:text-orange hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 leading-relaxed text-muted-foreground">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </Accordion>
        </div>
      ))}

      {totalShown === 0 && (
        <Reveal>
          <div className="rounded-xl border border-dashed border-line bg-code-bg p-8 text-center">
            <p className="font-mono text-sm text-muted-foreground">
              <span className="text-terminal-green">student@ubuntu:~$ </span>
              grep -i "{query}" ./faq.txt
            </p>
            <p className="mt-3 font-mono text-sm text-error">grep: вопрос не найден</p>
            <p className="mt-4 text-muted-foreground">
              Задайте его сообществу — ответим и дополним страницу.
            </p>
          </div>
        </Reveal>
      )}
    </div>
  );
}

export function FaqSearch({ query, onChange }: { query: string; onChange: (v: string) => void }) {
  return (
    <motion.div
      className="relative mx-auto mt-9 max-w-xl"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: EASE, delay: 0.45 }}
    >
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Найти вопрос: «сертификат», «windows», «время»…"
        aria-label="Поиск по вопросам"
        className="w-full rounded-xl border border-line bg-aubergine-900 py-3.5 pl-12 pr-4 font-mono text-sm text-paper placeholder:text-muted-foreground/70 outline-none transition-all duration-300 focus:border-orange/60 focus:shadow-glow"
      />
    </motion.div>
  );
}
