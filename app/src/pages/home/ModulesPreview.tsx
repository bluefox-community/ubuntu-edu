import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ModuleCard from '@/components/ModuleCard';
import { modules } from '@/data/modules';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function ModulesPreview() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-display font-bold tracking-[-0.01em] text-paper [font-size:clamp(2rem,4vw,3rem)]">
            Программа курса
          </h2>
          <Link
            to="/program"
            className="group hidden items-center gap-1.5 font-mono text-sm text-orange sm:inline-flex"
          >
            вся программа
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module, i) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1, ease: EASE }}
              className={i === 0 ? 'lg:col-span-2' : undefined}
            >
              <ModuleCard module={module} className="h-full" />
            </motion.div>
          ))}
        </div>
        <Link to="/program" className="mt-8 inline-flex items-center gap-1.5 font-mono text-sm text-orange sm:hidden">
          вся программа <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
