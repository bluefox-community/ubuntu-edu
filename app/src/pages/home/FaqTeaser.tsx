import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const ITEMS = [
  {
    q: 'Я вообще гуманитарий. Справлюсь?',
    a: 'Курс написан для людей, которые не знают ничего. Каждый термин объясняется на бытовых примерах.',
  },
  {
    q: 'Нужен ли мощный компьютер?',
    a: 'Нет: виртуальная машина с 2 ГБ RAM — и даже старый ноутбук справится.',
  },
  {
    q: 'Сколько времени займёт курс?',
    a: '~18 часов. В комфортном темпе — 3–4 недели по 40 минут в день.',
  },
  {
    q: 'Это правда бесплатно?',
    a: 'Да. Все уроки, задания и шпаргалки — открыты.',
  },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function FaqTeaser() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-center font-display font-bold tracking-[-0.01em] text-paper [font-size:clamp(2rem,4vw,3rem)]">
          Остались вопросы?
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-12"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {ITEMS.map((item, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-xl border border-line bg-aubergine-900 px-5 data-[state=open]:border-orange/50"
              >
                <AccordionTrigger className="py-5 text-left font-display text-lg font-medium text-paper hover:text-orange hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
        <div className="mt-8 text-center">
          <Link to="/faq" className="group inline-flex items-center gap-1.5 font-mono text-sm text-orange">
            Все вопросы
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
