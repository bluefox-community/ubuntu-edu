import { motion } from 'framer-motion';
import { Terminal, PackageCheck, Map } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const CARDS: { Icon: LucideIcon; title: string; text: string }[] = [
  {
    Icon: Terminal,
    title: '«Терминал — это для хакеров»',
    text: 'На самом деле это просто текстовый чат с компьютером. Покажем каждую команду.',
  },
  {
    Icon: PackageCheck,
    title: '«Боюсь всё сломать»',
    text: 'Учимся в безопасной песочнице. Сломать виртуальную машину невозможно — а восстановить её дело минуты.',
  },
  {
    Icon: Map,
    title: '«Не знаю, с чего начать»',
    text: 'Готовый маршрут: 40 уроков от установки до администрирования. Просто идите по шагам.',
  },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function PainPoints() {
  const words = 'Чёрный экран с буквами пугает? Мы понимаем.'.split(' ');
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center font-display font-bold tracking-[-0.01em] text-paper [font-size:clamp(2rem,4vw,3rem)]">
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20% 0px' }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
            >
              {word}
              {i < words.length - 1 ? '\u00A0' : ''}
            </motion.span>
          ))}
        </h2>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
              whileHover={{ y: -6 }}
              className="group rounded-2xl border border-line bg-aubergine-900 p-7 transition-shadow duration-300 hover:border-orange/50 hover:shadow-glow"
            >
              <card.Icon className="h-9 w-9 text-orange transition-transform duration-300 group-hover:rotate-[8deg]" />
              <h3 className="mt-4 font-display text-xl font-bold text-paper">{card.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{card.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
