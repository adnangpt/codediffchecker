import React, { useState } from 'react';
import { SplitDiffRow, DiffOptions, DiffChunk } from '../types/diff';
import { ArrowRight, ArrowLeft, Copy, Check } from 'lucide-react';

interface SplitDiffViewProps {
  rows: SplitDiffRow[];
  options: DiffOptions;
  activeDiffIndex: number;
  originalText: string;
  changedText: string;
  onMergeChunk?: (chunk: DiffChunk, direction: 'left-to-right' | 'right-to-left') => void;
}

export const SplitDiffView: React.FC<SplitDiffViewProps> = ({
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
      <div
        className={`grid ${
          showMerge ? 'grid-cols-[1fr_84px_1fr] sm:grid-cols-[1fr_96px_1fr]' : 'grid-cols-2'
        } bg-neutral-100/95 dark:bg-neutral-800/95 border-b border-neutral-200 dark:border-neutral-800 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 shrink-0 select-none min-w-[620px]`}
      >
        <div className="px-3 sm:px-4 py-2 border-r border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span className="truncate">Original</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono lowercase opacity-75 hidden md:inline">
              deletions & modifications
            </span>
            <button
              onClick={handleCopyOriginal}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors shadow-xs active:scale-95"
              title="Copy current Original code to clipboard"
            >
              {copiedOriginal ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {showMerge && (
          <div className="px-1 py-2 text-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border-r border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-center">
            Merge
          </div>
        )}

        <div className="px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="truncate">Changed</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono lowercase opacity-75 hidden md:inline">
              additions & updates
            </span>
            <button
              onClick={handleCopyChanged}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors shadow-xs active:scale-95"
              title="Copy current Changed code to clipboard"
            >
              {copiedChanged ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Synchronized Diff Rows Table (Inner Scrollable Container) */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
        <div className="min-w-[620px] font-mono text-xs leading-5">
          {rows.map((row, rIdx) => {
            const isTarget = row.isDiffStart && row.diffIndex === activeDiffIndex;
            const isHovered = row.diffIndex !== undefined && row.diffIndex === hoveredChunkIndex;
            const hasChunk = Boolean(row.chunk && row.isDiffStart);

            // Check if this row is the start or end of its chunk
            const isChunkStart = row.isDiffStart;
            const nextRow = rows[rIdx + 1];
            const isChunkEnd = row.diffIndex !== undefined && (!nextRow || nextRow.diffIndex !== row.diffIndex);

            return (
              <div
                key={row.id}
                id={row.isDiffStart && row.diffIndex ? `diff-chunk-${row.diffIndex}` : undefined}
                className={`grid ${
                  showMerge ? 'grid-cols-[1fr_84px_1fr] sm:grid-cols-[1fr_96px_1fr]' : 'grid-cols-2'
                } border-b border-neutral-100 dark:border-neutral-800/60 transition-colors ${
                  isChunkStart ? 'border-t border-t-emerald-500/30' : ''
                } ${
                  isChunkEnd ? 'border-b-2 border-b-emerald-500/30' : ''
                } ${
                  isHovered
                    ? 'bg-emerald-500/10 dark:bg-emerald-500/15 z-10 relative'
                    : isTarget
                    ? 'ring-2 ring-emerald-500/80 bg-emerald-500/5 dark:bg-emerald-500/10 z-10 relative'
                    : ''
                }`}
              >
                {/* Left Side (Original) */}
                <div
                  className={`flex border-r border-neutral-200 dark:border-neutral-800 min-w-0 transition-colors ${
                    row.left?.type === 'removed'
                      ? 'bg-rose-500/10 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100'
                      : row.left?.type === 'modified'
                      ? 'bg-amber-500/10 dark:bg-amber-950/30 text-neutral-900 dark:text-neutral-100'
                      : !row.left
                      ? 'bg-neutral-100/40 dark:bg-neutral-950/40 text-transparent select-none'
                      : 'text-neutral-800 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                  } ${
                    isHovered && row.left ? 'ring-1 ring-inset ring-emerald-500/40' : ''
                  }`}
                >
                  {options.showLineNumbers && (
                    <div className="w-10 sm:w-12 py-1 px-1.5 text-right select-none text-[11px] font-mono tabular-nums text-neutral-400 dark:text-neutral-600 bg-neutral-50/50 dark:bg-neutral-900/50 border-r border-neutral-200/50 dark:border-neutral-800/50 shrink-0">
                      {row.left?.lineNumber ?? ''}
                    </div>
                  )}

                  <div className="w-5 py-1 text-center select-none font-bold text-[11px] shrink-0">
                    {row.left?.type === 'removed' ? (
                      <span className="text-rose-600 dark:text-rose-400">-</span>
                    ) : row.left?.type === 'modified' ? (
                      <span className="text-amber-600 dark:text-amber-400">~</span>
                    ) : null}
                  </div>

                  <div
                    className={`py-1 px-2 flex-1 min-w-0 ${
                      options.wordWrap
                        ? 'whitespace-pre-wrap break-words [tab-size:2]'
                        : 'whitespace-pre overflow-x-auto [tab-size:2]'
                    }`}
                  >
                    {row.left ? (
                      row.left.segments ? (
                        row.left.segments.map((seg, sIdx) => (
                          <span
                            key={sIdx}
                            className={
                              seg.type === 'removed'
                                ? 'bg-rose-400/35 dark:bg-rose-700/60 rounded px-0.5 text-rose-950 dark:text-rose-100 font-medium'
                                : ''
                            }
                          >
                            {seg.text}
                          </span>
                        ))
                      ) : (
                        row.left.text || ' '
                      )
                    ) : (
                      <span className="inline-block h-4" />
                    )}
                  </div>
                </div>

                {/* Center Merge Gutter (High Visibility & Crisp Night Mode) */}
                {showMerge && (
                  <div
                    className={`border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center justify-center p-0.5 select-none transition-colors ${
                      isHovered ? 'bg-emerald-50 dark:bg-emerald-950/40' : ''
                    }`}
                  >
                    {hasChunk && row.chunk ? (
                      <div
                        className="my-1 flex flex-col items-center gap-1 py-1 px-1.5 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-700 shadow-sm transition-all"
                        onMouseEnter={() => setHoveredChunkIndex(row.chunk!.index)}
                        onMouseLeave={() => setHoveredChunkIndex(null)}
                      >
                        <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          <span>#{row.chunk.index}</span>
                        </div>

                        {/* High-visibility directional merge buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onMergeChunk && onMergeChunk(row.chunk!, 'right-to-left')}
                            className="p-1 rounded bg-neutral-100 dark:bg-neutral-700 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-neutral-700 dark:text-neutral-100 hover:text-white dark:hover:text-black border border-neutral-300 dark:border-neutral-600 shadow-xs transition-all active:scale-90"
                            title={`Apply Changed into Original: Replaces ${row.chunk.origLineCount} line(s) in left pane with ${row.chunk.changedLineCount} line(s) from right pane`}
                            aria-label="Apply changed to original"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onMergeChunk && onMergeChunk(row.chunk!, 'left-to-right')}
                            className="p-1 rounded bg-neutral-100 dark:bg-neutral-700 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-neutral-700 dark:text-neutral-100 hover:text-white dark:hover:text-black border border-neutral-300 dark:border-neutral-600 shadow-xs transition-all active:scale-90"
                            title={`Apply Original into Changed: Replaces ${row.chunk.changedLineCount} line(s) in right pane with ${row.chunk.origLineCount} line(s) from left pane`}
                            aria-label="Apply original to changed"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-[9px] font-mono text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                          {row.chunk.origLineCount}L ⇄ {row.chunk.changedLineCount}L
                        </span>
                      </div>
                    ) : row.diffIndex !== undefined ? (
                      /* Continuation line showing the visual span of the difference chunk */
                      <div
                        className={`w-0.5 h-full rounded transition-colors ${
                          isHovered ? 'bg-emerald-500 w-1' : 'bg-emerald-500/20 dark:bg-emerald-500/30'
                        }`}
                      />
                    ) : null}
                  </div>
                )}

                {/* Right Side (Changed) */}
                <div
                  className={`flex min-w-0 transition-colors ${
                    row.right?.type === 'added'
                      ? 'bg-emerald-500/10 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100'
                      : row.right?.type === 'modified'
                      ? 'bg-emerald-500/10 dark:bg-emerald-950/30 text-neutral-900 dark:text-neutral-100'
                      : !row.right
                      ? 'bg-neutral-100/40 dark:bg-neutral-950/40 text-transparent select-none'
                      : 'text-neutral-800 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                  } ${
                    isHovered && row.right ? 'ring-1 ring-inset ring-emerald-500/40' : ''
                  }`}
                >
                  {options.showLineNumbers && (
                    <div className="w-10 sm:w-12 py-1 px-1.5 text-right select-none text-[11px] font-mono tabular-nums text-neutral-400 dark:text-neutral-600 bg-neutral-50/50 dark:bg-neutral-900/50 border-r border-neutral-200/50 dark:border-neutral-800/50 shrink-0">
                      {row.right?.lineNumber ?? ''}
                    </div>
                  )}

                  <div className="w-5 py-1 text-center select-none font-bold text-[11px] shrink-0">
                    {row.right?.type === 'added' ? (
                      <span className="text-emerald-600 dark:text-emerald-400">+</span>
                    ) : row.right?.type === 'modified' ? (
                      <span className="text-emerald-600 dark:text-emerald-400">~</span>
                    ) : null}
                  </div>

                  <div
                    className={`py-1 px-2 flex-1 min-w-0 ${
                      options.wordWrap
                        ? 'whitespace-pre-wrap break-words [tab-size:2]'
                        : 'whitespace-pre overflow-x-auto [tab-size:2]'
                    }`}
                  >
                    {row.right ? (
                      row.right.segments ? (
                        row.right.segments.map((seg, sIdx) => (
                          <span
                            key={sIdx}
                            className={
                              seg.type === 'added'
                                ? 'bg-emerald-400/35 dark:bg-emerald-700/60 rounded px-0.5 text-emerald-950 dark:text-emerald-100 font-medium'
                                : ''
                            }
                          >
                            {seg.text}
                          </span>
                        ))
                      ) : (
                        row.right.text || ' '
                      )
                    ) : (
                      <span className="inline-block h-4" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
