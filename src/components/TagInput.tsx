import { useState } from "react";
import { Plus, X } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

const TagInput = ({ tags, onChange }: TagInputProps) => {
  const [input, setInput] = useState("");

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase().replace(/^#/, "");
    if (!tag || tags.includes(tag)) return;
    onChange([...tags, tag]);
    setInput("");
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-2 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
      {tags.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
        >
          #{t}
          <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))}>
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => addTag(input)}
        placeholder="Add tags (press Enter)"
        className="min-w-[120px] flex-1 border-0 bg-transparent text-sm outline-none"
      />
      {input && (
        <button type="button" onClick={() => addTag(input)} className="text-brand-600">
          <Plus size={16} />
        </button>
      )}
    </div>
  );
};

export default TagInput;
