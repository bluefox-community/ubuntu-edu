export type Rank = 'Новичок' | 'Пользователь' | 'Уверенный' | 'Администратор' | 'Профессионал';

// Блоки теории. Текстовые поля поддерживают **жирный** и `инлайн-код`.
export type LessonBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }                       // подзаголовок внутри урока
  | { type: 'code'; title?: string; code: string }          // терминал-блок, см. формат ниже
  | { type: 'callout'; variant: 'simple' | 'warning' | 'check' | 'remember'; text: string }
  // simple = 💡 Простыми словами, warning = ⚠️ Внимание, check = ✅ Проверь себя, remember = 🧠 Запомни
  | { type: 'list'; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] };

export interface Task {
  title: string;          // короткое имя, напр. "Создай свою первую папку"
  difficulty: 1 | 2 | 3;  // 1 = легко, 2 = средне, 3 = сложно (звёзды)
  description: string;    // что нужно сделать; поддерживает ** ** и ` `
  hint?: string;          // подсказка (не решение!)
  solution: string;       // формат как у code: строки '$ ...' + комментарии '# ...'
}

export interface QuizQuestion {
  question: string;
  options: string[];      // ровно 4 варианта
  correctIndex: number;   // 0..3
  explanation: string;    // почему ответ верный (1-3 предложения)
}

export interface Lesson {
  id: string;             // формат 'm01-l01' (модуль m01, урок 01)
  title: string;
  minutes: number;        // оценка времени прохождения, 15-35
  intro: string;          // 1-2 предложения: чему научитесь
  blocks: LessonBlock[];  // теория, 10-18 блоков
  tasks: Task[];          // 3-5 заданий
  quiz: QuizQuestion[];   // 3-5 вопросов
}

export interface CourseModule {
  id: string;             // 'm01'
  number: number;         // 1..10
  title: string;
  rank: Rank;
  description: string;    // 2-3 предложения о модуле
  lessons: Lesson[];
}
