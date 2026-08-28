import { Link } from 'react-router';
import { motion } from 'framer-motion';

const STEPS = [
  { n: '01', title: 'Читаете теорию', text: 'простыми словами, с картинками и аналогиями из жизни' },
  { n: '02', title: 'Повторяете в терминале', text: 'каждая команда — с объяснением построчно' },
  { n: '03', title: 'Выполняете задания', text: '3–5 практических задач с подсказками и решениями' },
  { n: '04', title: 'Проверяете себя', text: 'мини-квиз закрепляет урок, прогресс сохраняется' },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Methodology() {
  return (
    <section className="border-y border-line bg-aubergine-900/40 py-16 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[1fr_1.2fr] lg:px-8">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-orange">// методология</p>
          <h2 className="mt-4 font-display font-bold tracking-[-0.01em] text-paper [font-size:clamp(2rem,4vw,3rem)]">
            Как проходит обучение
          </h2>
          <p className="mt-5 max-w-md leading-[1.7] text-muted-foreground">
            Каждый урок устроен одинаково — вы всегда знаете, что будет дальше. Теория, практика, задания,
            самопроверка. Так мозг запоминает надёжно.
          </p>
          <Link
            to="/lesson/m01-l01"
            className="mt-8 inline-block rounded-[10px] bg-gradient-to-br from-orange to-orange-soft px-6 py-3 font-mono font-bold text-paper transition-all duration-200 hover:scale-[1.03] hover:shadow-glow-lg"
          >
            Попробовать первый урок
          </Link>
        </div>
        <ol className="space-y-6">
          {STEPS.map((step, i) => (
            <motion.li
              key={step.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
              className="flex items-center gap-6 rounded-2xl border border-line bg-aubergine-900 p-6"
            >
              <span
                className="font-mono text-5xl font-bold text-transparent"
                style={{ WebkitTextStroke: '1.5px #E95420' }}
              >
                {step.n}
              </span>
              <div>
                <h3 className="font-display text-xl font-bold text-paper">{step.title}</h3>
                <p className="mt-1 text-muted-foreground">{step.text}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
