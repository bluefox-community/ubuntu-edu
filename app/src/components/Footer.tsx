import { Link } from 'react-router';
import { motion } from 'framer-motion';
import TerminalBlock from '@/components/TerminalBlock';

const COLUMNS: { title: string; links: { label: string; to: string; external?: boolean }[] }[] = [
  {
    title: 'Курс',
    links: [
      { label: 'Программа', to: '/program' },
      { label: 'Уроки', to: '/lesson/m01-l01' },
      { label: 'Практика', to: '/practice' },
    ],
  },
  {
    title: 'Ресурсы',
    links: [
      { label: 'Шпаргалка', to: '/cheatsheet' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Официальная документация Ubuntu', to: 'https://help.ubuntu.com', external: true },
    ],
  },
  {
    title: 'Сообщество',
    links: [
      { label: 'Ask Ubuntu', to: 'https://askubuntu.com', external: true },
      { label: 'Ubuntu Forums', to: 'https://ubuntuforums.org', external: true },
      { label: 'RU.UBUNTU — русское сообщество', to: 'https://forum.ubuntu.ru', external: true },
    ],
  },
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="border-t border-line bg-aubergine-900"
    >
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/logo.svg" alt="UbuntuКурс" width={34} height={34} className="rounded-lg" />
              <span className="font-display text-lg font-bold text-paper">UbuntuКурс</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Linux — это проще, чем кажется</p>
            <TerminalBlock
              className="mt-5 max-w-xs [&_div]:whitespace-pre-wrap [&_div]:break-words"
              title="bash"
              code={'$ echo "спасибо, что дошли до конца"\nспасибо, что дошли до конца'}
            />
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-orange">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.to}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-muted-foreground transition-colors hover:text-orange"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.to} className="text-sm text-muted-foreground transition-colors hover:text-orange">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">© 2025 UbuntuКурс · Сделано с ♥ для новичков</p>
          <span className="rounded-md border border-line bg-aubergine-950 px-2.5 py-1 font-mono text-xs text-muted-foreground">
            jammy 22.04.5 LTS
          </span>
        </div>
      </div>
    </motion.footer>
  );
}
