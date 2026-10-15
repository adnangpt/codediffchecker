import React from 'react';
import {
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Edit3,
  Copy,
  Download,
  Check,
  GitMerge,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { DiffSummary } from '../types/diff';

interface DiffStatsBarProps {
  summary: DiffSummary;
  currentDiffIndex: number;
  mergeMode: boolean;
  onToggleMergeMode: () => void;
  onMergeAllLeftToRight?: () => void;
  onMergeAllRightToLeft?: () => void;
  onPrevDiff: () => void;
  onNextDiff: () => void;
  onBackToEdit: () => void;
  onClearAll: () => void;
  onCopyPatch: () => void;
  onDownloadPatch: () => void;
}

export const DiffStatsBar: React.FC<DiffStatsBarProps> = ({
  summary,
  currentDiffIndex,
  mergeMode,
  onToggleMergeMode,
  onMergeAllLeftToRight,
  onMergeAllRightToLeft,
  onPrevDiff,
  onNextDiff,
  onBackToEdit,
  onClearAll,
  onCopyPatch,
  onDownloadPatch,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    onCopyPatch();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasDiffs = summary.totalDiffChunks > 0;

  return (
    <div className="shrink-0 p-2 sm:px-4 bg-neutral-900 dark:bg-neutral-950 text-white border-t border-neutral-800 z-20">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5 text-xs">
        {/* Left: Diff Metrics (clean unboxed text, tabular figures) */}
        <div className="flex items-center gap-2 sm:gap-3 font-mono tabular-nums overflow-x-auto">
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span>+{summary.additions}</span>
            <span className="text-[10px] text-emerald-400/70 font-sans font-normal uppercase hidden sm:inline">
              added
            </span>
          </span>

          <span className="text-neutral-500">·</span>

          <span className="text-rose-400 font-semibold flex items-center gap-1">
            <span>-{summary.deletions}</span>
            <span className="text-[10px] text-rose-400/70 font-sans font-normal uppercase hidden sm:inline">
              deleted
            </span>
          </span>

          {summary.modifications > 0 && (
            <>
              <span className="text-neutral-500">·</span>
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <span>~{summary.modifications}</span>
                <span className="text-[10px] text-amber-400/70 font-sans font-normal uppercase hidden sm:inline">
                  modified
                </span>
              </span>
            </>
          )}

          <span className="text-neutral-500">·</span>

          <span className="text-neutral-400 whitespace-nowrap">
            {summary.totalDiffChunks} {summary.totalDiffChunks === 1 ? 'diff' : 'diffs'}
          </span>
        </div>

        {/* Center: Jump navigation & Merge mode controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {hasDiffs && (
            <div className="flex items-center gap-1 bg-neutral-800/80 px-2 py-1 rounded-lg border border-neutral-700">
              <span className="text-[11px] text-neutral-300 font-mono mr-1">
                {currentDiffIndex} / {summary.totalDiffChunks}
              </span>
              <button
                onClick={onPrevDiff}
                className="p-1 hover:bg-neutral-700 rounded transition-colors text-neutral-300 hover:text-white"
                title="Previous difference (shortcut: k or Up)"
                aria-label="Previous difference"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onNextDiff}
                className="p-1 hover:bg-neutral-700 rounded transition-colors text-neutral-300 hover:text-white"
                title="Next difference (shortcut: j or Down)"
                aria-label="Next difference"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Merge shortcuts in bar */}
          {mergeMode && hasDiffs && (
            <div className="hidden md:flex items-center gap-1 bg-neutral-800 px-2 py-1 rounded-lg border border-neutral-700 text-[11px]">
              <span className="text-neutral-400 mr-1 flex items-center gap-1">
                <GitMerge className="w-3 h-3 text-emerald-400" />
                Merge all:
              </span>
              <button
                onClick={onMergeAllLeftToRight}
                className="hover:text-emerald-300 font-medium px-1.5 py-0.5 rounded hover:bg-neutral-700 transition-colors flex items-center gap-1"
                title="Merge all left into right"
              >
                <span>Left → Right</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <span className="text-neutral-600">|</span>
              <button
                onClick={onMergeAllRightToLeft}
                className="hover:text-emerald-300 font-medium px-1.5 py-0.5 rounded hover:bg-neutral-700 transition-colors flex items-center gap-1"
                title="Merge all right into left"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Right → Left</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onToggleMergeMode}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors font-medium text-xs ${
              mergeMode
                ? 'bg-emerald-700 text-white'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
            }`}
            title="Toggle merge mode"
          >
            <GitMerge className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Merge</span>
          </button>

          <button
            onClick={onBackToEdit}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors font-medium text-xs"
            title="Edit code (Esc)"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
            title="Copy diff patch"
            aria-label="Copy patch"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            onClick={onDownloadPatch}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
            title="Download .patch"
            aria-label="Download patch"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClearAll}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800/60 transition-colors font-medium text-xs ml-1"
            title="Clear all code to compare again"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>
    </div>
  );
};
