import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, RotateCcw, Trophy, XCircle } from 'lucide-react';
import { renderInline } from '@/lib/inline';
import { cn } from '@/lib/utils';
import type { QuizQuestion } from '@/data/types';
import Reveal, { EASE_OUT } from '@/pages/lesson/Reveal';

function scoreMessage(correct: number, total: number): string {
  const ratio = total === 0 ? 0 : correct / total;
  if (ratio === 1) return 'Отлично! Всё верно — двигайтесь дальше.';
  if (ratio >= 0.6) return 'Хороший результат! Загляните в пояснения к ошибкам.';
  return 'Ничего страшного! Перечитайте теорию выше и попробуйте ещё раз.';
}

function QuestionCard({
  question,
  index,
  chosen,
  onChoose,
}: {
  question: QuizQuestion;
  index: number;
  chosen: number | undefined;
  onChoose: (optionIndex: number) => void;
}) {
  const answered = chosen !== undefined;

  return (
    <div className="rounded-2xl border border-[#E1D3DD] bg-white/70 p-5 shadow-[0_10px_36px_rgba(26,10,30,0.08)] sm:p-6">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#8A7484]">вопрос {index + 1}</p>
      <h3 className="mt-1.5 font-display text-lg font-bold leading-snug text-[#2C1428] [&_strong]:!text-current">
        {renderInline(question.question)}
      </h3>

      <div className="mt-4 space-y-2" role="radiogroup" aria-label={`Вопрос ${index + 1}`}>
        {question.options.map((option, oi) => {
          const isCorrect = oi === question.correctIndex;
          const isChosen = oi === chosen;
          return (
            <button
              key={oi}
              type="button"
              role="radio"
              aria-checked={isChosen}
              disabled={answered}
              onClick={() => onChoose(oi)}
              className={cn(
                'flex w-full items-center gap-3 rounded-[10px] border px-4 py-3 text-left text-[0.95rem] leading-relaxed transition-all duration-150 [&_strong]:!text-current',
                !answered &&
                  'border-[#E1D3DD] bg-white text-[#2C1428]/85 hover:-translate-y-0.5 hover:border-orange hover:shadow-[0_6px_18px_rgba(233,84,32,0.15)]',
                answered && isCorrect && 'border-terminal-green bg-terminal-green/10 text-[#1E7A46]',
                answered && isChosen && !isCorrect && 'border-error bg-error/10 text-[#B33232]',
                answered && !isChosen && !isCorrect && 'border-[#E1D3DD] bg-white/50 text-[#8A7484]',
                answered && 'cursor-default',
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                  answered && isCorrect
                    ? 'border-terminal-green bg-terminal-green text-aubergine-950'
                    : answered && isChosen && !isCorrect
                      ? 'border-error bg-error text-white'
                      : 'border-[#C9B8C4]',
                )}
              >
                {answered && isCorrect && <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={3} />}
                {answered && isChosen && !isCorrect && <XCircle className="h-3.5 w-3.5" strokeWidth={3} />}
              </span>
              <span>{renderInline(option)}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <p
              className={cn(
                'mt-3 rounded-[10px] border-l-[3px] px-4 py-3 text-sm leading-relaxed [&_strong]:!text-current',
                chosen === question.correctIndex
                  ? 'border-terminal-green bg-terminal-green/10 text-[#2C1428]/85'
                  : 'border-error bg-error/10 text-[#2C1428]/85',
              )}
            >
              <span className="mr-1.5 font-mono font-bold">
                {chosen === question.correctIndex ? 'Верно!' : 'Не совсем.'}
              </span>
              {renderInline(question.explanation)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Quiz({
  quiz,
  lessonId,
  savedResult,
  setQuizResult,
}: {
  quiz: QuizQuestion[];
  lessonId: string;
  savedResult?: { correct: number; total: number };
  setQuizResult: (lessonId: string, correct: number, total: number) => void;
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const answeredCount = Object.keys(answers).length;
  const finished = answeredCount === quiz.length && quiz.length > 0;
  const correct = quiz.reduce((acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0), 0);

  // Persist the result once the quiz is fully answered (hook keeps the best score).
  useEffect(() => {
    if (finished) setQuizResult(lessonId, correct, quiz.length);
  }, [finished, correct, lessonId, quiz.length, setQuizResult]);

  return (
    <div>
      <Reveal>
        <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-orange">// самопроверка</p>
        <h2 className="mt-2 font-display text-[clamp(1.75rem,3.5vw,2.25rem)] font-bold tracking-[-0.01em] text-[#2C1428]">
          Проверьте себя
        </h2>
        <p className="mt-2 text-[#2C1428]/75">
          {quiz.length} вопроса по уроку. Отвечайте не глядя в теорию — так мозг запоминает лучше.
          {savedResult && !finished && (
            <span className="ml-2 font-mono text-sm text-[#8A7484]">
              лучший результат: {savedResult.correct}/{savedResult.total}
            </span>
          )}
        </p>
      </Reveal>

      <div className="mt-8 space-y-5">
        {quiz.map((q, i) => (
          <Reveal key={i} delay={Math.min(i * 0.08, 0.3)}>
            <QuestionCard
              question={q}
              index={i}
              chosen={answers[i]}
              onChoose={(oi) => setAnswers((prev) => (prev[i] !== undefined ? prev : { ...prev, [i]: oi }))}
            />
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {finished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className={cn(
              'mt-8 rounded-2xl border-2 p-6 text-center shadow-[0_16px_50px_rgba(26,10,30,0.12)]',
              correct === quiz.length ? 'border-terminal-green bg-terminal-green/10' : 'border-orange bg-orange/10',
            )}
          >
            <div className="flex items-center justify-center gap-2 font-display text-2xl font-bold text-[#2C1428]">
              <Trophy className={cn('h-6 w-6', correct === quiz.length ? 'text-[#1E7A46]' : 'text-orange')} />
              {correct}/{quiz.length}
            </div>
            <p className="mt-2 text-[#2C1428]/85">{scoreMessage(correct, quiz.length)}</p>
            <button
              type="button"
              onClick={() => setAnswers({})}
              className="mt-4 inline-flex items-center gap-2 rounded-[10px] border border-aubergine-900/20 bg-white px-4 py-2 font-mono text-sm font-bold text-aubergine-700 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(26,10,30,0.15)]"
            >
              <RotateCcw className="h-4 w-4" />
              Пройти заново
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
