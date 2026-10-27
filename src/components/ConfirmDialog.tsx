import { AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmDialogProps) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-xl bg-[rgb(var(--card))] p-6 shadow-2xl">
        <button onClick={onCancel} className="absolute right-4 top-4 text-[rgb(var(--muted))]">
          <X size={18} />
        </button>
        <div className="flex items-start gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${danger ? "bg-red-100 text-red-600" : "bg-brand-50 text-brand-600"}`}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && <p className="mt-1 text-sm text-[rgb(var(--muted))]">{description}</p>}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onCancel} className="btn-ghost">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={danger ? "btn-danger" : "btn-primary"}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
