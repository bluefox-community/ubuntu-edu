import { Fragment } from 'react';
import type { ReactNode } from 'react';

/**
 * Renders the contract's inline markup: **bold** and `inline code`.
 * Used for lesson paragraphs, callouts, task descriptions, etc.
 */
export function renderInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-paper">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="code-inline">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
