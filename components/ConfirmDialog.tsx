'use client';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open, title, message, confirmLabel = 'Yes', cancelLabel = 'No', onConfirm, onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-lg">
        <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
        <p className="mt-2 text-sm text-ink/70">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-full border border-tint px-5 py-2 font-display text-sm font-semibold text-ink hover:bg-tint"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="rounded-full bg-accent px-5 py-2 font-display text-sm font-semibold text-white hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}