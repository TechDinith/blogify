import { FileText } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[rgb(var(--border))] py-16 text-center">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-900/30">
      <FileText size={24} />
    </div>
    <h3 className="text-lg font-semibold">{title}</h3>
    {description && <p className="mt-1 max-w-sm text-sm text-[rgb(var(--muted))]">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
