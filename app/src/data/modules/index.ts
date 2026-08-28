import type { CourseModule } from '../types';
import { m01 } from './m01';
import { m02 } from './m02';
import { m03 } from './m03';
import { m04 } from './m04';
import { m05 } from './m05';
import { m06 } from './m06';
import { m07 } from './m07';
import { m08 } from './m08';
import { m09 } from './m09';
import { m10 } from './m10';

export const modules: CourseModule[] = [m01, m02, m03, m04, m05, m06, m07, m08, m09, m10];

// хелперы, которые используются страницами:
export const allLessons = modules.flatMap((m) =>
  m.lessons.map((l) => ({ ...l, moduleId: m.id, moduleTitle: m.title, moduleNumber: m.number, rank: m.rank })),
);
export function findLesson(id: string) {
  return allLessons.find((l) => l.id === id);
}
