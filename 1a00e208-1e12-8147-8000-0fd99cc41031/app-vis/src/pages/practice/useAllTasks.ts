import { useMemo } from 'react';
import type { Rank, Task } from '@/data/types';
import { allLessons } from '@/data/modules';

/** Одно задание в плоском списке со всем контекстом (модуль + урок). */
export interface FlatTask {
  /** Уникальный ключ: `${lessonId}#${taskIndex}` */
  key: string;
  lessonId: string;
  lessonTitle: string;
  moduleId: string;
  moduleNumber: number;
  moduleTitle: string;
  rank: Rank;
  taskIndex: number;
  task: Task;
}

/** Агрегирует все задания из всех уроков всех модулей в плоский список. */
export function useAllTasks(): FlatTask[] {
  return useMemo(
    () =>
      allLessons.flatMap((lesson) =>
        lesson.tasks.map((task, taskIndex) => ({
          key: `${lesson.id}#${taskIndex}`,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          moduleId: lesson.moduleId,
          moduleNumber: lesson.moduleNumber,
          moduleTitle: lesson.moduleTitle,
          rank: lesson.rank,
          taskIndex,
          task,
        })),
      ),
    [],
  );
}

export type StatusFilter = 'all' | 'open' | 'done';

export interface TaskFilters {
  moduleId: string | 'all';
  difficulties: number[];
  status: StatusFilter;
  query: string;
}

export function filterTasks(
  tasks: FlatTask[],
  filters: TaskFilters,
  isDone: (lessonId: string, idx: number) => boolean,
): FlatTask[] {
  const q = filters.query.trim().toLowerCase();
  return tasks.filter((t) => {
    if (filters.moduleId !== 'all' && t.moduleId !== filters.moduleId) return false;
    if (filters.difficulties.length > 0 && !filters.difficulties.includes(t.task.difficulty)) return false;
    const done = isDone(t.lessonId, t.taskIndex);
    if (filters.status === 'done' && !done) return false;
    if (filters.status === 'open' && done) return false;
    if (q) {
      const haystack = `${t.task.title} ${t.task.description} ${t.task.solution} ${t.lessonTitle}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

/** Детерминированный «задание дня»: одинаковый выбор для всех в течение суток. */
export function dailyTaskIndex(date: Date, total: number): number {
  if (total <= 0) return 0;
  const stamp = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  let hash = 0;
  for (let i = 0; i < stamp.length; i++) {
    hash = (hash * 31 + stamp.charCodeAt(i)) >>> 0;
  }
  return hash % total;
}
