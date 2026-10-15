import React, { useRef, useState } from 'react';
import {
  Upload,
  ClipboardPaste,
  Trash2,
  Copy,
  Check,
  FileCode,
} from 'lucide-react';

interface InputPaneProps {
  title: string;
  badgeText: string;
  badgeColor: 'rose' | 'emerald';
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  showLineNumbers?: boolean;
  wordWrap?: boolean;
}

export const InputPane: React.FC<InputPaneProps> = ({
  title,
  badgeText,
  badgeColor,
  value,
  onChange,
  onClear,
  placeholder,
  showLineNumbers = true,
  wordWrap = true,
}) => {
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lines = value ? value.split('\n') : [''];
  const lineCount = value.length === 0 ? 0 : lines.length;
  const charCount = value.length;

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(text);
        setFileName(null);
      }
    } catch {
      textareaRef.current?.focus();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const loadFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        onChange(content);
        setFileName(file.name);
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      loadFile(file);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  return (
    <div
      className={`flex flex-col h-full min-h-0 bg-white dark:bg-neutral-900 border rounded-xl overflow-hidden transition-all shadow-xs ${
        isDragging
          ? 'border-emerald-500 ring-2 ring-emerald-500/20'
          : 'border-neutral-200 dark:border-neutral-800'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Pane Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              badgeColor === 'rose' ? 'bg-rose-500' : 'bg-emerald-500'
            }`}
          />
          <h2 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider truncate">
            {title}
          </h2>
          {fileName && (
            <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 bg-neutral-200/60 dark:bg-neutral-700/60 px-1.5 py-0.5 rounded flex items-center gap-1 truncate max-w-[120px] sm:max-w-[200px]">
              <FileCode className="w-3 h-3 shrink-0" />
              <span className="truncate">{fileName}</span>
            </span>
          )}
        </div>

        {/* Stats & Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-[11px] font-mono tabular-nums text-neutral-500 dark:text-neutral-400 hidden sm:flex items-center gap-1.5">
            <span>{lineCount} lines</span>
            <span>·</span>
            <span>{charCount.toLocaleString()} chars</span>
          </div>

          <div className="flex items-center gap-0.5">
            <button
              onClick={handlePaste}
              className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60 rounded-md transition-colors"
              title="Paste from clipboard"
              aria-label="Paste"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60 rounded-md transition-colors"
              title="Upload file"
              aria-label="Upload file"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".txt,.js,.jsx,.ts,.tsx,.json,.py,.html,.css,.scss,.md,.yaml,.yml,.xml,.sql,.sh,.c,.cpp,.go,.rs,.java"
            />

            <button
              onClick={handleCopy}
              disabled={!value}
              className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60 rounded-md transition-colors disabled:opacity-30 disabled:pointer-events-none"
              title="Copy pane text"
              aria-label="Copy"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              onClick={() => {
                onClear();
                setFileName(null);
              }}
              disabled={!value}
              className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md transition-colors disabled:opacity-30 disabled:pointer-events-none"
              title={`Clear ${badgeText}`}
              aria-label={`Clear ${badgeText}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Textarea Workspace with Synchronized Gutter and Viewport Constraint */}
      <div className="relative flex-1 min-h-0 flex overflow-hidden">
        {/* Synchronized Line Numbers Gutter */}
        {showLineNumbers && (
          <div
            ref={lineNumbersRef}
            className="w-10 sm:w-12 select-none py-3 text-right pr-2 text-xs font-mono tabular-nums text-neutral-400 dark:text-neutral-600 bg-neutral-50/50 dark:bg-neutral-900/50 border-r border-neutral-100 dark:border-neutral-800/80 overflow-hidden shrink-0 pointer-events-none"
          >
            {lines.map((_, idx) => (
              <div key={idx} className="h-6 leading-6">
                {idx + 1}
              </div>
            ))}
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          placeholder={placeholder || 'Paste or type text here, or drag & drop a file...'}
          spellCheck={false}
          className={`flex-1 p-3 bg-transparent text-neutral-900 dark:text-neutral-100 font-mono text-xs sm:text-sm leading-6 resize-none focus:outline-none focus:ring-0 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 overflow-y-auto ${
            wordWrap
              ? 'whitespace-pre-wrap break-words overflow-x-hidden'
              : 'whitespace-pre overflow-x-auto'
          }`}
        />

        {/* Drag and drop active overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center border-2 border-dashed border-emerald-500 rounded-lg pointer-events-none z-10">
            <Upload className="w-10 h-10 text-emerald-600 dark:text-emerald-400 animate-bounce mb-2" />
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              Drop file here to upload
            </p>
          </div>
        )}
      </div>

      {/* Pane Footer Quick Tip */}
      <div className="px-3 py-1.5 bg-neutral-50/60 dark:bg-neutral-900/60 border-t border-neutral-100 dark:border-neutral-800/60 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between shrink-0">
        <span className="truncate">
          {value.length === 0 ? (
            'Drag & drop code file or paste directly'
          ) : (
            <span className="text-neutral-600 dark:text-neutral-400">
              {lineCount} lines ready
            </span>
          )}
        </span>
        {value.length > 0 && (
          <button
            onClick={() => {
              onClear();
              setFileName(null);
            }}
            className="text-neutral-400 hover:text-rose-500 transition-colors text-[11px] ml-2 shrink-0"
          >
            Clear this panel
          </button>
        )}
      </div>
    </div>
  );
};
