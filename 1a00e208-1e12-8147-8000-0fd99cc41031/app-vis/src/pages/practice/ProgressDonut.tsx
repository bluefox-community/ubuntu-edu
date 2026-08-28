import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/** SVG progress donut (74px, orange stroke). Animates stroke on mount / value change. */
export default function ProgressDonut({ done, total }: { done: number; total: number }) {
  const reduce = useReducedMotion();
  const percent = total > 0 ? done / total : 0;
  const size = 74;
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const offset = c * (1 - (mounted || reduce ? percent : 0));

  return (
    <div className="relative h-[74px] w-[74px] shrink-0">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2C1428" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#E95420"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: offset }}
          transition={reduce ? { duration: 0 } : { duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold text-paper">
        {Math.round(percent * 100)}%
      </div>
    </div>
  );
}
