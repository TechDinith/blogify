import { useState } from "react";
import { Eye, Edit3 } from "lucide-react";
import MarkdownView from "./MarkdownView";

interface MarkdownEditorProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}

const MarkdownEditor = ({ value, onChange, placeholder, rows = 12 }: MarkdownEditorProps) => {
  const [tab, setTab] = useState<"write" | "preview">("write");

  return (
    <div className="overflow-hidden rounded-lg border border-[rgb(var(--border))]">
      <div className="flex border-b border-[rgb(var(--border))] bg-gray-50 dark:bg-gray-800/50">
        <button
          type="button"
          onClick={() => setTab("write")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            tab === "write"
              ? "border-b-2 border-brand-600 text-brand-600"
              : "text-[rgb(var(--muted))]"
          }`}
        >
          <Edit3 size={14} /> Write
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            tab === "preview"
              ? "border-b-2 border-brand-600 text-brand-600"
              : "text-[rgb(var(--muted))]"
          }`}
        >
          <Eye size={14} /> Preview
        </button>
        <span className="ml-auto px-4 py-2 text-xs text-[rgb(var(--muted))]">Markdown supported</span>
      </div>
      {tab === "write" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full resize-y border-0 bg-transparent p-4 font-mono text-sm outline-none"
        />
      ) : (
        <div className="min-h-[200px] p-4">
          {value.trim() ? (
            <MarkdownView content={value} />
          ) : (
            <p className="text-sm text-[rgb(var(--muted))]">Nothing to preview yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;
