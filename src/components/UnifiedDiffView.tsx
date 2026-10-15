import React, { useState } from 'react';
import { UnifiedDiffRow, DiffOptions, DiffChunk } from '../types/diff';
import { ArrowRight, ArrowLeft, Copy, Check } from 'lucide-react';

interface UnifiedDiffViewProps {
  rows: UnifiedDiffRow[];
  options: DiffOptions;
  activeDiffIndex: number;
  originalText: string;
  changedText: string;
  onMergeChunk?: (chunk: DiffChunk, direction: 'left-to-right' | 'right-to-left') => void;
}

export const UnifiedDiffView: React.FC<UnifiedDiffViewProps> = ({
  rows,
  options,
  activeDiffIndex,
  originalText,
  changedText,
  onMergeChunk,
}) => {
  const [hoveredChunkIndex, setHoveredChunkIndex] = useState<number | null>(null);
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedChanged, setCopiedChanged] = useState(false);

  const handleCopyOriginal = async () => {
    try {
      await navigator.clipboard.writeText(originalText);
      setCopiedOriginal(true);
      setTimeout(() => setCopiedOriginal(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyChanged = async () => {
    try {
      await navigator.clipboard.writeText(changedText);
      setCopiedChanged(true);
      setTimeout(() => setCopiedChanged(false), 2000);
    } catch {
      // fallback
    }
  };

  if (rows.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-neutral-400 dark:text-neutral-600 font-mono text-xs sm:text-sm">
        No differences found. Both files are identical.
      </div>
    );
  }

  const showMerge = Boolean(options.mergeMode && onMergeChunk);

  return (
    <div className="h-full min-h-0 flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
      {/* Pane Subheader */}
      <div className="bg-neutral-100/95 dark:bg-neutral-800/95 border-b border-neutral-200 dark:border-neutral-800 px-3 sm:px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex flex-wrap items-center justify-between gap-2 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <span>Unified Diff (Inline View)</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono lowercase opacity-75">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>- removed</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>+ added</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyOriginal}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors shadow-xs active:scale-95"
              title="Copy current Original code to clipboard"
            >
              {copiedOriginal ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400">Original Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Original</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyChanged}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors shadow-xs active:scale-95"
              title="Copy current Changed code to clipboard"
            >
              {copiedChanged ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400">Changed Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Changed</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Unified Lines Table (Inner Scroll Container) */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
        <div className="min-w-full font-mono text-xs leading-5">
          {rows.map((row, rIdx) => {
            const isTarget = row.isDiffStart && row.diffIndex === activeDiffIndex;
            const isHovered = row.diffIndex !== undefined && row.diffIndex === hoveredChunkIndex;
            const isRemoved = row.type === 'removed';
            const isAdded = row.type === 'added';
            const isUnchanged = row.type === 'unchanged';

            const isChunkStart = row.isDiffStart;
            const nextRow = rows[rIdx + 1];
            const isChunkEnd = row.diffIndex !== undefined && (!nextRow || nextRow.diffIndex !== row.diffIndex);

            return (
              <div
                key={row.id}
                id={row.isDiffStart && row.diffIndex ? `diff-chunk-${row.diffIndex}` : undefined}
                className={`flex border-b border-neutral-100 dark:border-neutral-800/60 transition-colors ${
                  isChunkStart ? 'border-t border-t-emerald-500/30' : ''
                } ${
                  isChunkEnd ? 'border-b-2 border-b-emerald-500/30' : ''
                } ${
                  isRemoved
                    ? 'bg-rose-500/10 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100'
                    : isAdded
                    ? 'bg-emerald-500/10 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100'
                    : 'text-neutral-800 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                } ${
                  isHovered
                    ? 'bg-emerald-500/15 dark:bg-emerald-500/20 z-10 relative'
                    : isTarget
                    ? 'ring-2 ring-emerald-500/80 bg-emerald-500/5 dark:bg-emerald-500/10 z-10 relative'
                    : ''
                }`}
              >
                {/* Original Line Number */}
                {options.showLineNumbers && (
                  <div className="w-10 sm:w-12 py-1 px-1.5 text-right select-none text-[11px] font-mono tabular-nums text-neutral-400 dark:text-neutral-600 bg-neutral-50/50 dark:bg-neutral-900/50 border-r border-neutral-200/50 dark:border-neutral-800/50 shrink-0">
                    {row.leftLineNumber ?? ''}
                  </div>
                )}

                {/* Changed Line Number */}
                {options.showLineNumbers && (
                  <div className="w-10 sm:w-12 py-1 px-1.5 text-right select-none text-[11px] font-mono tabular-nums text-neutral-400 dark:text-neutral-600 bg-neutral-50/50 dark:bg-neutral-900/50 border-r border-neutral-200/50 dark:border-neutral-800/50 shrink-0">
                    {row.rightLineNumber ?? ''}
                  </div>
                )}

                {/* Diff Marker Sign */}
                <div className="w-5 py-1 text-center select-none font-bold text-xs shrink-0">
                  {isRemoved && <span className="text-rose-600 dark:text-rose-400">-</span>}
                  {isAdded && <span className="text-emerald-600 dark:text-emerald-400">+</span>}
                  {isUnchanged && <span className="text-neutral-300 dark:text-neutral-700"> </span>}
                </div>

                {/* Merge Action handle on Diff Start (High Contrast & Visible) */}
                {showMerge && (
                  <div className="w-20 sm:w-24 py-0.5 px-1 shrink-0 flex items-center justify-center border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/60">
                    {row.isDiffStart && row.chunk ? (
                      <div
                        className="flex items-center gap-1 bg-white dark:bg-neutral-800 px-1.5 py-0.5 rounded-lg border border-neutral-300 dark:border-neutral-700 shadow-xs"
                        onMouseEnter={() => setHoveredChunkIndex(row.chunk!.index)}
                        onMouseLeave={() => setHoveredChunkIndex(null)}
                      >
                        <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 mr-0.5">
                          #{row.chunk.index}
                        </span>
                        <button
                          onClick={() => onMergeChunk && onMergeChunk(row.chunk!, 'right-to-left')}
                          className="p-1 rounded hover:bg-emerald-600 text-neutral-700 dark:text-neutral-200 hover:text-white dark:hover:text-black transition-colors"
                          title={`Apply Changed into Original: Replaces ${row.chunk.origLineCount} line(s) in left pane with ${row.chunk.changedLineCount} line(s) from right pane`}
                          aria-label="Apply changed to original"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onMergeChunk && onMergeChunk(row.chunk!, 'left-to-right')}
                          className="p-1 rounded hover:bg-emerald-600 text-neutral-700 dark:text-neutral-200 hover:text-white dark:hover:text-black transition-colors"
                          title={`Apply Original into Changed: Replaces ${row.chunk.changedLineCount} line(s) in right pane with ${row.chunk.origLineCount} line(s) from left pane`}
                          aria-label="Apply original to changed"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : row.diffIndex !== undefined ? (
                      <div
                        className={`w-0.5 h-full rounded ${
                          isHovered ? 'bg-emerald-500 w-1' : 'bg-emerald-500/20 dark:bg-emerald-500/30'
                        }`}
                      />
                    ) : null}
                  </div>
                )}

                {/* Code text with VS Code wrap */}
                <div
                  className={`py-1 px-2.5 flex-1 min-w-0 ${
                    options.wordWrap
                      ? 'whitespace-pre-wrap break-words [tab-size:2]'
                      : 'whitespace-pre overflow-x-auto [tab-size:2]'
                  }`}
                >
                  {row.segments ? (
                    row.segments.map((seg, sIdx) => {
                      const isSegHighlight =
                        (isRemoved && seg.type === 'removed') ||
                        (isAdded && seg.type === 'added');

                      return (
                        <span
                          key={sIdx}
                          className={
                            isSegHighlight
                              ? isRemoved
                                ? 'bg-rose-400/35 dark:bg-rose-700/60 rounded px-0.5 text-rose-950 dark:text-rose-100 font-medium'
                                : 'bg-emerald-400/35 dark:bg-emerald-700/60 rounded px-0.5 text-emerald-950 dark:text-emerald-100 font-medium'
                              : ''
                          }
                        >
                          {seg.text}
                        </span>
                      );
                    })
                  ) : (
                    row.text || ' '
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
