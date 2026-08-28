import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router';
import { BookOpen, FlaskConical, ListChecks, ListTree, CircleHelp } from 'lucide-react';
import ProgressBar from '@/components/ProgressBar';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { EASE_OUT } from '@/pages/lesson/Reveal';

const ANCHORS = [
  { id: 'theory', label: 'Теория', Icon: BookOpen },
  { id: 'sandbox', label: 'Терминал-песочница', Icon: FlaskConical },
  { id: 'tasks', label: 'Задания', Icon: ListChecks },
  { id: 'quiz', label: 'Самопроверка', Icon: CircleHelp },
];

/**
 * Lesson top bar (under the global Navbar): breadcrumb, course progress,
 * and a «Содержание урока» sheet with section anchors.
 */
export default function TopBar({
  moduleNumber,
  lessonNumber,
  lessonIndex,
  totalLessons,
  percent,
}: {
  moduleNumber: number;
  lessonNumber: number;
  lessonIndex: number;
  totalLessons: number;
  percent: number;
}) {
  const reduced = useReducedMotion();
  const [sheetOpen, setSheetOpen] = useState(false);
  const pad = (n: number) => String(n).padStart(2, '0');

  const goTo = (id: string) => {
    setSheetOpen(false);
    // Wait for the sheet to close before jumping to the anchor.
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView(reduced ? { behavior: 'auto' } : { behavior: 'smooth' });
    }, 250);
  };

  return (
    <motion.div
      initial={reduced ? false : { y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: EASE_OUT }}
      className="sticky top-16 z-30 border-b border-line bg-aubergine-900/95 backdrop-blur"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-6 lg:px-8">
        {/* breadcrumb */}
        <Link
          to="/program"
          className="hidden shrink-0 font-mono text-xs text-muted-foreground transition-colors hover:text-orange sm:block"
        >
          ~/<span className="text-paper">модуль-{pad(moduleNumber)}</span>/
          <span className="text-orange">урок-{pad(lessonNumber)}</span>
        </Link>

        {/* center progress */}
        <div className="mx-auto flex min-w-0 flex-1 items-center justify-center gap-3 sm:max-w-md">
          <span className="shrink-0 whitespace-nowrap font-mono text-xs text-muted-foreground">
            Урок <span className="text-paper">{lessonIndex + 1}</span> из {totalLessons}
          </span>
          <ProgressBar value={percent} className="w-32 sm:w-48 [&>div:last-child]:h-1" />
        </div>

        {/* contents sheet */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="flex shrink-0 items-center gap-2 rounded-[10px] border border-line px-3 py-1.5 font-mono text-xs font-bold text-paper transition-colors hover:border-orange hover:text-orange"
            >
              <ListTree className="h-4 w-4" />
              <span className="hidden sm:inline">Содержание урока</span>
            </button>
          </SheetTrigger>
          <SheetContent className="border-line bg-aubergine-900 text-paper">
            <SheetHeader>
              <SheetTitle className="font-display text-paper">Содержание урока</SheetTitle>
              <SheetDescription>Перейдите сразу к нужной части.</SheetDescription>
            </SheetHeader>
            <nav className="mt-2 flex flex-col gap-1">
              {ANCHORS.map(({ id, label, Icon }, i) => (
                <motion.button
                  key={id}
                  type="button"
                  onClick={() => goTo(id)}
                  initial={reduced ? false : { opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * i, ease: EASE_OUT }}
                  className="flex items-center gap-3 rounded-[10px] border border-line/60 px-4 py-3 text-left font-mono text-sm text-paper transition-colors hover:border-orange hover:bg-aubergine-700/40 hover:text-orange"
                >
                  <Icon className="h-4 w-4 text-orange" />
                  {label}
                </motion.button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </motion.div>
  );
}
