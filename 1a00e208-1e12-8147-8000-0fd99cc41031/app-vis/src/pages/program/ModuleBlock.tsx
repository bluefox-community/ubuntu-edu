import { Link } from 'react-router';
import { motion, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import type { CourseModule } from '@/data/types';
import RankBadge from '@/components/RankBadge';
import ProgressBar from '@/components/ProgressBar';
import { moduleHours, moduleIconSrc } from '@/components/ModuleCard';
import { useProgress } from '@/hooks/useProgress';
import { cn } from '@/lib/utils';
import { EASE } from './motion';

/** «Чему научитесь» bullets per module (page copy; module/lesson lists come from data). */
const SKILLS: Record<number, string[]> = {
  1: ['Что такое ОС и Linux', 'Попробовать Ubuntu без риска', 'Установить Ubuntu 22.04', 'Ориентироваться на рабочем столе'],
  2: ['Где что лежит в системе', 'Перемещаться командами pwd, ls, cd', 'Создавать, копировать, удалять файлы', 'Читать и редактировать тексты'],
  3: ['Потоки и перенаправление >, >>, |', 'Искать текст через grep', 'Обрабатывать данные: find, sort, wc', 'Архивы и справка: tar, man, history'],
  4: ['Управлять пользователями и группами', 'Осознанно использовать sudo', 'Читать и менять права rwx', 'Владельцы и специальные биты'],
  5: ['Ставить и обновлять пакеты через APT', 'Подключать репозитории и PPA', 'Три системы: dpkg, snap, flatpak', 'Собирать программу из исходников'],
  6: ['Следить за процессами: ps, top, htop', 'Завершать зависшие программы', 'Контролировать диски и монтирование', 'Оценивать память и нагрузку'],
  7: ['Понимать IP, DNS и шлюзы', 'Диагностировать сеть', 'Настраивать сеть через netplan', 'Подключаться по SSH с ключами'],
  8: ['Настраивать файрвол ufw', 'Автоматические обновления безопасности', 'Бэкапы: tar, rsync, автоматизация', 'Читать логи: journalctl, fail2ban'],
  9: ['Писать bash-скрипты с нуля', 'Условия и циклы: if, case, for', 'Функции и отладка скриптов', 'Автозапуск: cron и systemd timers'],
  10: ['Управлять службами systemd', 'Поднять nginx с HTTPS', 'LVM, swap и дисковые квоты', 'Финальный проект: свой сервер'],
};

function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

function makeRowVariants(reduced: boolean): Variants {
  return {
    hidden: { opacity: 0, y: reduced ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  };
}

/**
 * One module block: sticky left rail (icon, number, title, rank, skills, progress)
 * + right column of numbered lesson rows linking to /lesson/<id>.
 */
export default function ModuleBlock({
  module,
  index,
  startIndex,
}: {
  module: CourseModule;
  index: number;
  startIndex: number;
}) {
  const reduced = useReducedMotion();
  const { isLessonComplete } = useProgress();
  const hours = moduleHours(module);
  const doneCount = module.lessons.filter((l) => isLessonComplete(l.id)).length;
  const pct = Math.round((doneCount / module.lessons.length) * 100);
  const skills = SKILLS[module.number] ?? [];

  return (
    // overflow-x-clip: left rail enters with x:-40 via whileInView — clip avoids temporary horizontal overflow
    // (clip, not hidden: sticky left rail keeps working since clip creates no scroll container)
    <section id={`module-${module.number}`} className="scroll-mt-24 overflow-x-clip">
      {/* Hairline separator, draws scaleX 0→1 */}
      <motion.div
        className="h-px origin-left bg-line"
        initial={reduced ? { opacity: 0 } : { scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, margin: '-15% 0px' }}
        transition={{ duration: 0.8, ease: EASE }}
      />
      <div
        className={cn(
          'grid gap-10 px-6 py-16 lg:grid-cols-[320px_1fr] lg:gap-14 lg:px-8 lg:py-20',
          index % 2 === 1 && 'bg-aubergine-900/50',
        )}
      >
        {/* Left rail — sticky on desktop */}
        <motion.aside
          className="self-start lg:sticky lg:top-24"
          initial={reduced ? { opacity: 0 } : { opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <motion.img
            src={moduleIconSrc(module)}
            alt=""
            width={128}
            height={128}
            className="h-20 w-20 lg:h-28 lg:w-28"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.8, rotate: -4 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
          />
          <div className="mt-6 font-mono text-xs font-bold uppercase tracking-[0.18em] text-orange">
            Модуль {String(module.number).padStart(2, '0')}
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-[-0.01em] text-paper">{module.title}</h2>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <motion.span
              className="inline-flex"
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.2 }}
            >
              <RankBadge rank={module.rank} />
            </motion.span>
            <span className="font-mono text-xs text-muted-foreground">
              {module.lessons.length} {plural(module.lessons.length, 'урок', 'урока', 'уроков')} · ~{hours}{' '}
              {plural(hours, 'час', 'часа', 'часов')}
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{module.description}</p>
          {skills.length > 0 && (
            <div className="mt-6">
              <div className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Научитесь
              </div>
              <ul className="mt-3 space-y-2 text-sm text-paper/85">
                {skills.map((skill) => (
                  <li key={skill} className="flex items-baseline gap-2">
                    <span className="text-terminal-green">›</span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <ProgressBar className="mt-6" value={pct} label="пройдено модуля" />
        </motion.aside>

        {/* Right column — lesson rows */}
        <motion.ol
          className="space-y-3 self-start"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-15% 0px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
        >
          {module.lessons.map((lesson, i) => {
            const globalNumber = startIndex + i + 1;
            const complete = isLessonComplete(lesson.id);
            return (
              <motion.li key={lesson.id} variants={makeRowVariants(!!reduced)}>
                <Link
                  to={`/lesson/${lesson.id}`}
                  className="group flex items-center gap-4 rounded-xl border border-line bg-aubergine-900 p-4 transition-all duration-300 hover:border-orange/50 hover:bg-aubergine-700/30 sm:p-5"
                >
                  <span
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border font-mono text-sm font-bold',
                      complete
                        ? 'border-terminal-green/50 bg-terminal-green/10 text-terminal-green'
                        : 'border-line bg-code-bg text-orange',
                    )}
                  >
                    {complete ? <Check className="h-4 w-4" /> : String(globalNumber).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-base font-bold text-paper transition-colors duration-300 group-hover:text-orange sm:text-lg">
                      {lesson.title}
                    </span>
                    <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-muted-foreground">
                      {lesson.intro}
                    </span>
                  </span>
                  <span className="hidden shrink-0 font-mono text-xs text-muted-foreground sm:block">
                    ~{lesson.minutes} мин
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-orange" />
                </Link>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
}
