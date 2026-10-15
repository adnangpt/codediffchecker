import React, { useState, useRef, useEffect } from 'react';
import {
  Columns2,
  Rows3,
  ArrowLeftRight,
  RotateCcw,
  SlidersHorizontal,
  Copy,
  Download,
  Check,
  Code2,
  Eye,
  GitMerge,
  WrapText,
  ArrowRight,
  ArrowLeft,
  Settings2,
} from 'lucide-react';
import { ViewMode, DiffOptions } from '../types/diff';

interface ToolbarProps {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  diffOptions: DiffOptions;
  onChangeOptions: (options: DiffOptions) => void;
  isDiffActive: boolean;
  onToggleDiffActive: () => void;
  onSwap: () => void;
  onClearAll: () => void;
  onClearOriginal: () => void;
  onClearChanged: () => void;
  onCopyPatch: () => void;
  onDownloadPatch: () => void;
  onMergeAllLeftToRight?: () => void;
  onMergeAllRightToLeft?: () => void;
  hasOriginal: boolean;
  hasChanged: boolean;
  diffCount?: number;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  viewMode,
  onChangeViewMode,
  diffOptions,
  onChangeOptions,
  isDiffActive,
  onToggleDiffActive,
  onSwap,
  onClearAll,
  onClearOriginal,
  onClearChanged,
  onCopyPatch,
  onDownloadPatch,
  onMergeAllLeftToRight,
  onMergeAllRightToLeft,
  hasOriginal,
  hasChanged,
  diffCount = 0,
}) => {
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [showMergeMenu, setShowMergeMenu] = useState(false);
  const [copiedPatch, setCopiedPatch] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mergeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowOptionsDropdown(false);
      }
      if (
        mergeMenuRef.current &&
        !mergeMenuRef.current.contains(event.target as Node)
      ) {
        setShowMergeMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = () => {
    onCopyPatch();
    setCopiedPatch(true);
    setTimeout(() => setCopiedPatch(false), 2000);
  };

  const hasAnyContent = hasOriginal || hasChanged;

  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 py-2 px-2.5 sm:px-6 shrink-0 relative z-30 shadow-xs w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        {/* ========================================================= */}
        {/* ZONE 1: Primary View & Compare (Left)                      */}
        {/* ========================================================= */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Main Action: Compare vs Edit */}
          <button
            onClick={onToggleDiffActive}
            disabled={!hasAnyContent}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all whitespace-nowrap active:scale-95 ${
              isDiffActive
                ? 'bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-300'
                : 'bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
            title="Toggle between difference inspector and editor (Ctrl+Enter)"
          >
            {isDiffActive ? (
              <>
                <Code2 className="w-4 h-4" />
                <span>Edit Code</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>Find Diff</span>
              </>
            )}
            <kbd className="hidden lg:inline-block ml-0.5 px-1 py-0.2 text-[9px] bg-black/20 rounded font-mono">
              ⌘↵
            </kbd>
          </button>

          {/* View Mode Segmented Control: Split / Unified */}
          <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => onChangeViewMode('split')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
              title="Side-by-side comparison"
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>Split</span>
            </button>
            <button
              onClick={() => onChangeViewMode('unified')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                viewMode === 'unified'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
              title="Unified inline comparison"
            >
              <Rows3 className="w-3.5 h-3.5" />
              <span>Unified</span>
            </button>
          </div>

          {/* Swap Panes */}
          <button
            onClick={onSwap}
            disabled={!hasAnyContent}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors border border-neutral-200 dark:border-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            title="Swap Original and Changed code"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
            <span className="hidden sm:inline">Swap</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* ZONE 2: Diff Modifiers & Options (Center)                 */}
        {/* ========================================================= */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Merge Changes Feature Button */}
          <div className="relative" ref={mergeMenuRef}>
            <button
              onClick={() => {
                const nextMerge = !diffOptions.mergeMode;
                onChangeOptions({ ...diffOptions, mergeMode: nextMerge });
                if (nextMerge) setShowMergeMenu(true);
              }}
              disabled={!hasAnyContent}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed ${
                diffOptions.mergeMode
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500/60 text-emerald-800 dark:text-emerald-300 font-semibold shadow-xs'
                  : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
              title="Toggle interactive merge buttons on diff chunks"
            >
              <GitMerge className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Merge</span>
              {diffOptions.mergeMode && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>

            {/* Merge Operations Popover */}
            {diffOptions.mergeMode && showMergeMenu && diffCount > 0 && (
              <div className="absolute left-0 top-full mt-2 w-72 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-700 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black/5 dark:ring-white/10">
                <div className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider px-2 py-1">
                  Batch Merge ({diffCount} differences)
                </div>
                <div className="space-y-1 mt-1">
                  <button
                    onClick={() => {
                      onMergeAllLeftToRight?.();
                      setShowMergeMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs text-neutral-800 dark:text-neutral-200 text-left transition-colors font-medium"
                  >
                    <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Apply all Original into Changed</span>
                  </button>
                  <button
                    onClick={() => {
                      onMergeAllRightToLeft?.();
                      setShowMergeMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs text-neutral-800 dark:text-neutral-200 text-left transition-colors font-medium"
                  >
                    <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Apply all Changed into Original</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Word Wrap Toggle (like VS Code Alt+Z) */}
          <button
            onClick={() =>
              onChangeOptions({
                ...diffOptions,
                wordWrap: !diffOptions.wordWrap,
              })
            }
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all whitespace-nowrap ${
              diffOptions.wordWrap
                ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 font-semibold'
                : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
            title="Toggle word wrap (Alt+Z)"
          >
            <WrapText className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
            <span>Wrap</span>
            <kbd className="hidden lg:inline px-1 py-0.2 bg-black/5 dark:bg-white/10 rounded text-[9px] font-mono text-neutral-500">
              Alt+Z
            </kbd>
          </button>

          {/* Options Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all whitespace-nowrap ${
                showOptionsDropdown ||
                diffOptions.ignoreWhitespace ||
                diffOptions.ignoreCase ||
                !diffOptions.showLineNumbers
                  ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-400 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 font-semibold'
                  : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <Settings2 className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
              <span>Options</span>
              {(diffOptions.ignoreWhitespace || diffOptions.ignoreCase) && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>

            {/* Options Dropdown Box */}
            {showOptionsDropdown && (
              <div className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-700 p-3.5 z-50 animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black/5 dark:ring-white/10">
                <div className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2.5 px-1">
                  Diff Settings
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer text-xs transition-colors">
                    <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                      Ignore Whitespace
                    </span>
                    <input
                      type="checkbox"
                      checked={diffOptions.ignoreWhitespace}
                      onChange={(e) =>
                        onChangeOptions({
                          ...diffOptions,
                          ignoreWhitespace: e.target.checked,
                        })
                      }
                      className="rounded border-neutral-300 dark:border-neutral-600 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer text-xs transition-colors">
                    <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                      Ignore Case
                    </span>
                    <input
                      type="checkbox"
                      checked={diffOptions.ignoreCase}
                      onChange={(e) =>
                        onChangeOptions({
                          ...diffOptions,
                          ignoreCase: e.target.checked,
                        })
                      }
                      className="rounded border-neutral-300 dark:border-neutral-600 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer text-xs transition-colors">
                    <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                      Line Numbers
                    </span>
                    <input
                      type="checkbox"
                      checked={diffOptions.showLineNumbers}
                      onChange={(e) =>
                        onChangeOptions({
                          ...diffOptions,
                          showLineNumbers: e.target.checked,
                        })
                      }
                      className="rounded border-neutral-300 dark:border-neutral-600 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer text-xs transition-colors">
                    <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                      Word Wrap (Alt+Z)
                    </span>
                    <input
                      type="checkbox"
                      checked={diffOptions.wordWrap}
                      onChange={(e) =>
                        onChangeOptions({
                          ...diffOptions,
                          wordWrap: e.target.checked,
                        })
                      }
                      className="rounded border-neutral-300 dark:border-neutral-600 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* ZONE 3: Actions & Output (Right)                          */}
        {/* ========================================================= */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap">
          {/* Export Group */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              disabled={!hasAnyContent}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shadow-xs"
              title="Copy Unified Diff patch to clipboard"
            >
              {copiedPatch ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                  <span>Patch</span>
                </>
              )}
            </button>

            <button
              onClick={onDownloadPatch}
              disabled={!hasAnyContent}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shadow-xs"
              title="Download .patch file"
              aria-label="Download patch file"
            >
              <Download className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>

          <div className="h-4 w-px bg-neutral-200 dark:border-neutral-800 hidden sm:block" />

          {/* Clear Controls Group (Responsive & Accessible) */}
          <div className="flex items-center gap-0.5 bg-neutral-100 dark:bg-neutral-800/80 p-0.5 rounded-lg border border-neutral-200/80 dark:border-neutral-700/80">
            <button
              onClick={onClearOriginal}
              disabled={!hasOriginal}
              className="px-2 py-1 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-white dark:hover:bg-neutral-700 rounded-md transition-all disabled:opacity-30 disabled:pointer-events-none whitespace-nowrap font-medium"
              title="Clear Original Code Pane"
            >
              Left
            </button>
            <button
              onClick={onClearChanged}
              disabled={!hasChanged}
              className="px-2 py-1 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-white dark:hover:bg-neutral-700 rounded-md transition-all disabled:opacity-30 disabled:pointer-events-none whitespace-nowrap font-medium"
              title="Clear Changed Code Pane"
            >
              Right
            </button>
            <button
              onClick={onClearAll}
              disabled={!hasAnyContent}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md transition-all disabled:opacity-30 disabled:pointer-events-none whitespace-nowrap border border-transparent hover:border-rose-200 dark:hover:border-rose-900/60"
              title="Clear Both Panes (Reset All)"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
