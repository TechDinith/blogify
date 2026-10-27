interface TagBadgeProps {
  tag: string;
  onClick?: () => void;
  active?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

const TagBadge = ({ tag, onClick, active, removable, onRemove }: TagBadgeProps) => (
  <span
    onClick={onClick}
    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
      active
        ? "bg-brand-600 text-white"
        : "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
    } ${onClick ? "cursor-pointer hover:bg-brand-100 dark:hover:bg-brand-900/50" : ""}`}
  >
    #{tag}
    {removable && (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove?.();
        }}
        className="ml-1 rounded-full hover:bg-black/10"
      >
        ×
      </button>
    )}
  </span>
);

export default TagBadge;
