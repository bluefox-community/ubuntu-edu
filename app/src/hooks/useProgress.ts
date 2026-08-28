import { useCallback, useEffect, useState } from 'react';
import type { Rank } from '@/data/types';
import { allLessons } from '@/data/modules';

/**
 * LocalStorage-backed course progress store.
 * Shared across pages: every write dispatches a custom event (same tab)
 * and storage events cover other tabs, so the Navbar chip stays in sync.
 */

const STORAGE_KEY = 'ubuntukurs-progress-v1';
const EVENT = 'ubuntukurs:progress-changed';

export interface QuizResult {
  correct: number;
  total: number;
}

export interface ProgressState {
  /** ids of completed lessons */
  completedLessons: string[];
  /** lessonId -> indexes of done tasks */
  tasksDone: Record<string, number[]>;
  /** lessonId -> best quiz result */
  quizResults: Record<string, QuizResult>;
}

const EMPTY: ProgressState = { completedLessons: [], tasksDone: {}, quizResults: {} };

export function readProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
      tasksDone: parsed.tasksDone ?? {},
      quizResults: parsed.quizResults ?? {},
    };
  } catch {
    return EMPTY;
  }
}

function writeProgress(state: ProgressState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent(EVENT));
}

function update(mutator: (s: ProgressState) => ProgressState) {
  writeProgress(mutator(readProgress()));
}

/** Mark a lesson completed / not completed. */
export function setLessonComplete(lessonId: string, done: boolean) {
  update((s) => ({
    ...s,
    completedLessons: done
      ? Array.from(new Set([...s.completedLessons, lessonId]))
      : s.completedLessons.filter((id) => id !== lessonId),
  }));
}

export function toggleLessonComplete(lessonId: string) {
  const done = !readProgress().completedLessons.includes(lessonId);
  setLessonComplete(lessonId, done);
  return done;
}

export function isLessonComplete(lessonId: string): boolean {
  return readProgress().completedLessons.includes(lessonId);
}

/** Toggle a task (by index) done for a lesson. Returns the new state. */
export function toggleTaskDone(lessonId: string, taskIndex: number): boolean {
  const current = readProgress().tasksDone[lessonId] ?? [];
  const next = current.includes(taskIndex)
    ? current.filter((i) => i !== taskIndex)
    : [...current, taskIndex];
  update((s) => ({ ...s, tasksDone: { ...s.tasksDone, [lessonId]: next } }));
  return next.includes(taskIndex);
}

export function isTaskDone(lessonId: string, taskIndex: number): boolean {
  return (readProgress().tasksDone[lessonId] ?? []).includes(taskIndex);
}

/** Store quiz result (keeps the best score). */
export function setQuizResult(lessonId: string, correct: number, total: number) {
  update((s) => {
    const prev = s.quizResults[lessonId];
    if (prev && prev.correct >= correct) return s;
    return { ...s, quizResults: { ...s.quizResults, [lessonId]: { correct, total } } };
  });
}

export function getQuizResult(lessonId: string): QuizResult | undefined {
  return readProgress().quizResults[lessonId];
}

/** Course completion in percent (0..100), based on completed lessons. */
export function coursePercent(state?: ProgressState): number {
  const s = state ?? readProgress();
  const total = allLessons.length;
  if (total === 0) return 0;
  return Math.round((s.completedLessons.filter((id) => allLessons.some((l) => l.id === id)).length / total) * 100);
}

export const RANKS: Rank[] = ['Новичок', 'Пользователь', 'Уверенный', 'Администратор', 'Профессионал'];

/**
 * Current rank = highest rank whose lessons are ALL completed
 * (ranks span 2 modules: Новичок = m01–m02, …, Профессионал = m09–m10).
 * If no rank is fully completed, defaults to «Новичок».
 */
export function currentRank(state?: ProgressState): Rank {
  const s = state ?? readProgress();
  let best = 0;
  for (let idx = 0; idx < RANKS.length; idx++) {
    const rankLessons = allLessons.filter((l) => l.rank === RANKS[idx]);
    if (rankLessons.length > 0 && rankLessons.every((l) => s.completedLessons.includes(l.id))) {
      best = idx;
    }
  }
  return RANKS[best];
}

/** React hook: reactive progress state + helpers. Re-renders on any progress change. */
export function useProgress() {
  const [state, setState] = useState<ProgressState>(() => readProgress());

  useEffect(() => {
    const refresh = () => setState(readProgress());
    window.addEventListener(EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const isComplete = useCallback((id: string) => state.completedLessons.includes(id), [state]);
  const taskDone = useCallback(
    (lessonId: string, idx: number) => (state.tasksDone[lessonId] ?? []).includes(idx),
    [state],
  );

  return {
    state,
    percent: coursePercent(state),
    rank: currentRank(state),
    isLessonComplete: isComplete,
    isTaskDone: taskDone,
    setLessonComplete,
    toggleLessonComplete,
    toggleTaskDone,
    setQuizResult,
  };
}
