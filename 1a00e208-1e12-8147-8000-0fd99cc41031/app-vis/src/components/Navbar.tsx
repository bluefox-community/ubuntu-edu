import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useProgress } from '@/hooks/useProgress';
import { cn } from '@/lib/utils';

export const NAV_LINKS = [
  { to: '/', label: 'Главная', end: true },
  { to: '/program', label: 'Программа' },
  { to: '/lesson/m01-l01', label: 'Уроки', match: '/lesson' },
  { to: '/practice', label: 'Практика' },
  { to: '/cheatsheet', label: 'Шпаргалка' },
  { to: '/faq', label: 'FAQ' },
] as const;

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <img src="/logo.svg" alt="UbuntuКурс" width={34} height={34} className="rounded-lg" />
      <span className="font-display text-lg font-bold tracking-tight text-paper">UbuntuКурс</span>
      <span className="hidden rounded-md border border-line bg-aubergine-900 px-1.5 py-0.5 font-mono text-[10px] font-bold text-muted-foreground sm:inline-block">
        22.04 LTS
      </span>
    </Link>
  );
}

function ProgressChip() {
  const { rank, percent } = useProgress();
  return (
    <span
      className="hidden items-center gap-2 rounded-[10px] border border-line bg-aubergine-900 px-3 py-1.5 font-mono text-xs text-muted-foreground lg:inline-flex"
      title={`Пройдено ${percent}% курса`}
    >
      Уровень: <span className="font-bold text-orange">{rank}</span>
    </span>
  );
}

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Hide on scroll down (>200px), reveal on scroll up (design.md §7)
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastY && y > 200);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 h-16 border-b border-line bg-[rgba(26,10,30,0.75)] backdrop-blur-md transition-transform duration-300',
        hidden && '-translate-y-full',
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Основная навигация">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={'end' in link ? link.end : false}
              className={({ isActive }) => {
                const active = isActive || ('match' in link && location.pathname.startsWith(link.match as string));
                return cn(
                  'group relative font-mono text-sm text-muted-foreground transition-colors hover:text-paper',
                  active && 'text-paper',
                );
              }}
            >
              {({ isActive }) => {
                const active = isActive || ('match' in link && location.pathname.startsWith(link.match as string));
                return (
                  <>
                    {active && <span className="mr-1 text-orange">•</span>}
                    {link.label}
                    <span
                      className={cn(
                        'absolute -bottom-1 left-0 h-px w-0 bg-orange transition-all duration-250 group-hover:w-full',
                        active && 'w-full',
                      )}
                    />
                  </>
                );
              }}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ProgressChip />
          <Link
            to="/lesson/m01-l01"
            className="hidden rounded-[10px] bg-gradient-to-br from-orange to-orange-soft px-4 py-2 font-mono text-sm font-bold text-paper transition-all duration-200 hover:scale-[1.03] hover:shadow-glow-lg sm:inline-block"
          >
            Начать курс
          </Link>

          {/* Mobile nav */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Открыть меню"
                className="rounded-md p-2 text-paper hover:bg-aubergine-700/50 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 border-line bg-aubergine-950 p-6">
              <SheetTitle className="sr-only">Навигация</SheetTitle>
              <nav className="mt-8 flex flex-col gap-2" aria-label="Мобильная навигация">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * i, duration: 0.3 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-3 font-mono text-lg text-paper transition-colors hover:bg-aubergine-900 hover:text-orange"
                    >
                      <span className="mr-2 text-orange">›</span>
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * NAV_LINKS.length, duration: 0.3 }}
                  className="mt-4"
                >
                  <Link
                    to="/lesson/m01-l01"
                    onClick={() => setOpen(false)}
                    className="block rounded-[10px] bg-gradient-to-br from-orange to-orange-soft px-4 py-3 text-center font-mono text-base font-bold text-paper"
                  >
                    Начать курс
                  </Link>
                </motion.div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
