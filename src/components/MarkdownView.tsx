import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownViewProps {
  content: string;
  className?: string;
}

const MarkdownView = ({ content, className = "" }: MarkdownViewProps) => (
  <div
    className={`prose prose-sm max-w-none dark:prose-invert prose-headings:text-brand-600 dark:prose-headings:text-brand-400 prose-a:text-brand-600 ${className}`}
  >
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
  </div>
);

export default MarkdownView;
