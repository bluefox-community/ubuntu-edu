import { motion } from 'framer-motion';

const QUOTES = [
  {
    text: 'Я бухгалтер и никогда не видела Linux. Через месяц я настроила офисный сервер сама.',
    name: 'Ольга, 34',
    initials: 'О',
  },
  {
    text: 'Боялся терминала как огня. Теперь открываю его первым делом утром.',
    name: 'Тимур, 22',
    initials: 'Т',
  },
  {
    text: 'Прошёл курс → написал bash-скрипты на работе → получил повышение. Совпадение?',
    name: 'Дмитрий, 29',
    initials: 'Д',
  },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Testimonials() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="font-display font-bold tracking-[-0.01em] text-paper [font-size:clamp(2rem,4vw,3rem)]">
          Что говорят ученики
        </h2>
        <div className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
          {QUOTES.map((quote, i) => (
            <motion.figure
              key={quote.name}
              initial={{ opacity: 0, x: 60, rotate: 1.5 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: EASE }}
              whileHover={{ y: -6 }}
              className="min-w-[80vw] snap-center rounded-2xl bg-[#F7F4F6] p-7 text-aubergine-900 shadow-lg transition-shadow hover:shadow-2xl sm:min-w-[24rem] lg:min-w-0"
            >
              <span className="font-display text-5xl font-bold leading-none text-orange">«</span>
              <blockquote className="mt-2 leading-[1.7]">{quote.text}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-aubergine font-display font-bold text-paper">
                  {quote.initials}
                </span>
                <span className="font-mono text-sm font-bold text-aubergine-700">— {quote.name}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
