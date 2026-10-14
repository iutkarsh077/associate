import { type Stage, STAGES } from '../types/contact';

interface StageBadgeProps {
  stage: Stage;
  size?: 'sm' | 'md';
  onClick?: () => void;
  className?: string;
}

export const StageBadge: React.FC<StageBadgeProps> = ({
  stage,
  size = 'md',
  onClick,
  className = '',
}) => {
  const meta = STAGES.find((s) => s.id === stage) || STAGES[0];

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs font-medium gap-1'
      : 'px-2.5 py-1 text-xs font-semibold gap-1.5';

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center rounded-md border transition-all select-none ${meta.bg} ${meta.border} ${meta.text} ${sizeClasses} ${
        onClick ? 'cursor-pointer hover:opacity-85 active:scale-95' : ''
      } ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot} shrink-0`} />
      <span>{meta.label}</span>
    </span>
  );
};

// Notion tag colors
const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Enterprise: { bg: 'bg-purple-100/70', text: 'text-purple-800', border: 'border-purple-200' },
  'High Priority': { bg: 'bg-rose-100/70', text: 'text-rose-800', border: 'border-rose-200' },
  Inbound: { bg: 'bg-blue-100/70', text: 'text-blue-800', border: 'border-blue-200' },
  'Warm Intro': { bg: 'bg-amber-100/70', text: 'text-amber-800', border: 'border-amber-200' },
  'Product Qualified': { bg: 'bg-emerald-100/70', text: 'text-emerald-800', border: 'border-emerald-200' },
  'Mid-Market': { bg: 'bg-indigo-100/70', text: 'text-indigo-800', border: 'border-indigo-200' },
  Advisor: { bg: 'bg-teal-100/70', text: 'text-teal-800', border: 'border-teal-200' },
  Security: { bg: 'bg-red-100/70', text: 'text-red-800', border: 'border-red-200' },
  Partner: { bg: 'bg-orange-100/70', text: 'text-orange-800', border: 'border-orange-200' },
  'Cloud Native': { bg: 'bg-cyan-100/70', text: 'text-cyan-800', border: 'border-cyan-200' },
};

export const LabelBadge: React.FC<{ label: string; onRemove?: () => void }> = ({
  label,
  onRemove,
}) => {
  const style = TAG_COLORS[label] || {
    bg: 'bg-stone-100',
    text: 'text-stone-700',
    border: 'border-stone-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${style.bg} ${style.text} ${style.border}`}
    >
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:text-stone-900 rounded-full w-3.5 h-3.5 flex items-center justify-center opacity-60 hover:opacity-100"
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  );
};
