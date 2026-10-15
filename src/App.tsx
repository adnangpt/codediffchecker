import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { InputPane } from './components/InputPane';
import { DiffStatsBar } from './components/DiffStatsBar';
import { ViewMode, DiffOptions, DiffChunk } from './types/diff';
import { computeDiff, generatePatchText, mergeChunk } from './utils/diffEngine';
import { SAMPLE_PRESETS, SamplePreset } from './utils/sampleData';
import { Undo2, CheckCircle2, ArrowRight } from 'lucide-react';

// Code-split heavy below-the-fold and on-demand components for high mobile Lighthouse score
const SplitDiffView = lazy(() =>
  import('./components/SplitDiffView').then((m) => ({ default: m.SplitDiffView }))
);
const UnifiedDiffView = lazy(() =>
  import('./components/UnifiedDiffView').then((m) => ({ default: m.UnifiedDiffView }))
);
const SeoContent = lazy(() =>
  import('./components/SeoContent').then((m) => ({ default: m.SeoContent }))
);
const KeyboardShortcutsModal = lazy(() =>
  import('./components/KeyboardShortcutsModal').then((m) => ({ default: m.KeyboardShortcutsModal }))
);

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('codediffchecker_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Code contents
  const [originalText, setOriginalText] = useState<string>('');
  const [changedText, setChangedText] = useState<string>('');
  const [activePresetId, setActivePresetId] = useState<string | undefined>();

  // Mobile editor tab toggle (both, original, changed)
  const [mobileEditorTab, setMobileEditorTab] = useState<'both' | 'original' | 'changed'>('both');

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [isDiffActive, setIsDiffActive] = useState<boolean>(false);
  const [currentDiffIndex, setCurrentDiffIndex] = useState<number>(1);
  const [shortcutsOpen, setShortcutsOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Undo snapshot for hassle-free clear and merge
  const [lastUndoSnapshot, setLastUndoSnapshot] = useState<{
    original: string;
    changed: string;
    description: string;
  } | null>(null);

  // Diff Options with wordWrap: true by default (VS Code Alt+Z experience)
  const [diffOptions, setDiffOptions] = useState<DiffOptions>({
    ignoreWhitespace: false,
    ignoreCase: false,
    showLineNumbers: true,
    wordWrap: true,
    collapseUnchanged: false,
    contextLines: 3,
    mergeMode: true, // Default merge mode active so users can merge changes hassle-free
  });

  // Sync theme with document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('codediffchecker_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('codediffchecker_theme', 'light');
    }
  }, [darkMode]);

  // Load first preset by default on initial mount for instant interactive preview
  useEffect(() => {
    const initial = SAMPLE_PRESETS[0];
    if (initial) {
      setOriginalText(initial.original);
      setChangedText(initial.changed);
      setActivePresetId(initial.id);
    }
  }, []);

  // Compute differences
  const { splitRows, unifiedRows, summary } = useMemo(() => {
    return computeDiff(originalText, changedText, diffOptions);
  }, [originalText, changedText, diffOptions]);

  // Keep diff index bounded
  useEffect(() => {
    if (summary.totalDiffChunks === 0) {
      setCurrentDiffIndex(0);
    } else if (currentDiffIndex > summary.totalDiffChunks) {
      setCurrentDiffIndex(1);
    } else if (currentDiffIndex === 0 && summary.totalDiffChunks > 0) {
      setCurrentDiffIndex(1);
    }
  }, [summary.totalDiffChunks, currentDiffIndex]);

  // Scroll to diff chunk
  const scrollToDiff = useCallback((index: number) => {
    if (index <= 0) return;
    setCurrentDiffIndex(index);
    const element = document.getElementById(`diff-chunk-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const handleNextDiff = useCallback(() => {
    if (summary.totalDiffChunks === 0) return;
    const next = currentDiffIndex >= summary.totalDiffChunks ? 1 : currentDiffIndex + 1;
    scrollToDiff(next);
  }, [currentDiffIndex, summary.totalDiffChunks, scrollToDiff]);

  const handlePrevDiff = useCallback(() => {
    if (summary.totalDiffChunks === 0) return;
    const prev = currentDiffIndex <= 1 ? summary.totalDiffChunks : currentDiffIndex - 1;
    scrollToDiff(prev);
  }, [currentDiffIndex, summary.totalDiffChunks, scrollToDiff]);

  // Merge Chunk Handler (interactive single-chunk merge like Diffchecker)
  const handleMergeChunk = useCallback(
    (chunk: DiffChunk, direction: 'left-to-right' | 'right-to-left') => {
      setLastUndoSnapshot({
        original: originalText,
        changed: changedText,
        description: `Merged difference #${chunk.index}`,
      });

      const result = mergeChunk(chunk, direction, originalText, changedText);
      setOriginalText(result.newOriginal);
      setChangedText(result.newChanged);

      setToastMessage(
        direction === 'left-to-right'
          ? `Applied diff #${chunk.index} from Left to Right`
          : `Applied diff #${chunk.index} from Right to Left`
      );
      setTimeout(() => setToastMessage(null), 3000);
    },
    [originalText, changedText]
  );

  // Merge All Left to Right
  const handleMergeAllLeftToRight = useCallback(() => {
    setLastUndoSnapshot({
      original: originalText,
      changed: changedText,
      description: 'Merged all changes (Left → Right)',
    });
    setChangedText(originalText);
    setToastMessage('Merged all differences: Original → Changed');
    setTimeout(() => setToastMessage(null), 3000);
  }, [originalText, changedText]);

  // Merge All Right to Left
  const handleMergeAllRightToLeft = useCallback(() => {
    setLastUndoSnapshot({
      original: originalText,
      changed: changedText,
      description: 'Merged all changes (Right → Left)',
    });
    setOriginalText(changedText);
    setToastMessage('Merged all differences: Changed → Original');
    setTimeout(() => setToastMessage(null), 3000);
  }, [originalText, changedText]);

  // Clear handlers with non-intrusive Undo option
  const handleClearAll = () => {
    if (!originalText && !changedText) return;
    setLastUndoSnapshot({
      original: originalText,
      changed: changedText,
      description: 'Cleared all code panes',
    });
    setOriginalText('');
    setChangedText('');
    setActivePresetId(undefined);
    setIsDiffActive(false);
  };

  const handleClearOriginal = () => {
    if (!originalText) return;
    setLastUndoSnapshot({
      original: originalText,
      changed: changedText,
      description: 'Cleared original code pane',
    });
    setOriginalText('');
    setActivePresetId(undefined);
  };

  const handleClearChanged = () => {
    if (!changedText) return;
    setLastUndoSnapshot({
      original: originalText,
      changed: changedText,
      description: 'Cleared changed code pane',
    });
    setChangedText('');
    setActivePresetId(undefined);
  };

  const handleUndo = () => {
    if (!lastUndoSnapshot) return;
    setOriginalText(lastUndoSnapshot.original);
    setChangedText(lastUndoSnapshot.changed);
    setLastUndoSnapshot(null);
  };

  const handleSwap = () => {
    const temp = originalText;
    setOriginalText(changedText);
    setChangedText(temp);
  };

  const handleSelectPreset = (preset: SamplePreset) => {
    setOriginalText(preset.original);
    setChangedText(preset.changed);
    setActivePresetId(preset.id);
    setLastUndoSnapshot(null);
  };

  const handleCopyPatch = () => {
    const patch = generatePatchText(
      'original.txt',
      'changed.txt',
      originalText,
      changedText
    );
    navigator.clipboard.writeText(patch);
  };

  const handleDownloadPatch = () => {
    const patch = generatePatchText(
      'original.txt',
      'changed.txt',
      originalText,
      changedText
    );
    const blob = new Blob([patch], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'changes.patch';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Keyboard shortcut listener (including Alt+Z for Word Wrap)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement;

      // Alt + Z toggles word wrap everywhere (like VS Code Alt+Z)
      if (e.altKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        setDiffOptions((prev) => {
          const next = !prev.wordWrap;
          setToastMessage(`Word Wrap: ${next ? 'Enabled' : 'Disabled'} (Alt+Z)`);
          setTimeout(() => setToastMessage(null), 2500);
          return { ...prev, wordWrap: next };
        });
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        setIsDiffActive((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (shortcutsOpen) {
          setShortcutsOpen(false);
        } else if (isDiffActive) {
          setIsDiffActive(false);
        }
      } else if (!isInput) {
        if (e.key === 'j' || e.key === 'ArrowDown') {
          e.preventDefault();
          handleNextDiff();
        } else if (e.key === 'k' || e.key === 'ArrowUp') {
          e.preventDefault();
          handlePrevDiff();
        } else if (e.key === 'm') {
          e.preventDefault();
          setDiffOptions((prev) => ({ ...prev, mergeMode: !prev.mergeMode }));
        } else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'S') {
          e.preventDefault();
          handleSwap();
        } else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'X') {
          e.preventDefault();
          handleClearAll();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isDiffActive,
    shortcutsOpen,
    handleNextDiff,
    handlePrevDiff,
    originalText,
    changedText,
  ]);

  const hasOriginal = originalText.length > 0;
  const hasChanged = changedText.length > 0;
  const hasAnyContent = hasOriginal || hasChanged;

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-neutral-100/50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* Top Header */}
      <Header
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        onSelectPreset={handleSelectPreset}
        onOpenShortcuts={() => setShortcutsOpen(true)}
        onClearAll={handleClearAll}
        hasContent={hasAnyContent}
        activePresetId={activePresetId}
      />

      {/* Main Workspace Toolbar */}
      <Toolbar
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        diffOptions={diffOptions}
        onChangeOptions={setDiffOptions}
        isDiffActive={isDiffActive}
        onToggleDiffActive={() => setIsDiffActive(!isDiffActive)}
        onSwap={handleSwap}
        onClearAll={handleClearAll}
        onClearOriginal={handleClearOriginal}
        onClearChanged={handleClearChanged}
        onCopyPatch={handleCopyPatch}
        onDownloadPatch={handleDownloadPatch}
        onMergeAllLeftToRight={handleMergeAllLeftToRight}
        onMergeAllRightToLeft={handleMergeAllRightToLeft}
        hasOriginal={hasOriginal}
        hasChanged={hasChanged}
        diffCount={summary.totalDiffChunks}
      />

      {/* Hassle-Free Undo / Toast Notification */}
      {(lastUndoSnapshot || toastMessage) && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-40 max-w-md w-full px-4 pointer-events-none">
          <div className="pointer-events-auto flex items-center justify-between py-2 px-3.5 bg-neutral-900/95 dark:bg-neutral-800/95 text-white text-xs rounded-xl shadow-xl border border-neutral-700/80 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150">
            <span className="flex items-center gap-2 truncate">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">
                {toastMessage || lastUndoSnapshot?.description}
              </span>
            </span>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              {lastUndoSnapshot && (
                <button
                  onClick={handleUndo}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>Undo</span>
                </button>
              )}
              <button
                onClick={() => {
                  setLastUndoSnapshot(null);
                  setToastMessage(null);
                }}
                className="text-neutral-400 hover:text-white px-1 text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Area (Workspace with inner scrolling for large codefiles) */}
      <main className="w-full max-w-7xl mx-auto p-2.5 sm:p-4 flex flex-col h-[calc(100vh-140px)] min-h-[580px] max-h-[880px] shrink-0">
        {!isDiffActive ? (
          /* Editor Mode: Side-by-side or Tabbed for Mobile */
          <div className="flex-1 min-h-0 flex flex-col gap-2">
            {/* Mobile Tab Switcher for Small Screens */}
            <div className="flex lg:hidden items-center justify-between gap-2 shrink-0">
              <div className="flex items-center bg-neutral-200/80 dark:bg-neutral-800 p-0.5 rounded-lg text-xs">
                <button
                  onClick={() => setMobileEditorTab('both')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    mobileEditorTab === 'both'
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  Both
                </button>
                <button
                  onClick={() => setMobileEditorTab('original')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    mobileEditorTab === 'original'
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  Original
                </button>
                <button
                  onClick={() => setMobileEditorTab('changed')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    mobileEditorTab === 'changed'
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  Changed
                </button>
              </div>

              <button
                onClick={() => setIsDiffActive(true)}
                disabled={!hasAnyContent}
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 text-xs disabled:opacity-40"
              >
                <span>Find Diff</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Desktop / Responsive Editor Grid */}
            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div
                className={`h-full min-h-0 ${
                  mobileEditorTab === 'changed' ? 'hidden lg:block' : 'block'
                }`}
              >
                <InputPane
                  title="Original Code / Text"
                  badgeText="Original"
                  badgeColor="rose"
                  value={originalText}
                  onChange={(val) => {
                    setOriginalText(val);
                    setActivePresetId(undefined);
                  }}
                  onClear={handleClearOriginal}
                  placeholder="Paste original code or text here..."
                  showLineNumbers={diffOptions.showLineNumbers}
                  wordWrap={diffOptions.wordWrap}
                />
              </div>

              <div
                className={`h-full min-h-0 ${
                  mobileEditorTab === 'original' ? 'hidden lg:block' : 'block'
                }`}
              >
                <InputPane
                  title="Changed Code / Text"
                  badgeText="Changed"
                  badgeColor="emerald"
                  value={changedText}
                  onChange={(val) => {
                    setChangedText(val);
                    setActivePresetId(undefined);
                  }}
                  onClear={handleClearChanged}
                  placeholder="Paste modified or new code here..."
                  showLineNumbers={diffOptions.showLineNumbers}
                  wordWrap={diffOptions.wordWrap}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Difference Inspector Mode (Inner Synchronized Scroll) */
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {viewMode === 'split' ? (
              <Suspense
                fallback={
                  <div className="h-full flex items-center justify-center p-8 text-neutral-400 font-mono text-xs">
                    Loading diff viewer...
                  </div>
                }
              >
                <SplitDiffView
                  rows={splitRows}
                  options={diffOptions}
                  activeDiffIndex={currentDiffIndex}
                  originalText={originalText}
                  changedText={changedText}
                  onMergeChunk={handleMergeChunk}
                />
              </Suspense>
            ) : (
              <Suspense
                fallback={
                  <div className="h-full flex items-center justify-center p-8 text-neutral-400 font-mono text-xs">
                    Loading diff viewer...
                  </div>
                }
              >
                <UnifiedDiffView
                  rows={unifiedRows}
                  options={diffOptions}
                  activeDiffIndex={currentDiffIndex}
                  originalText={originalText}
                  changedText={changedText}
                  onMergeChunk={handleMergeChunk}
                />
              </Suspense>
            )}
          </div>
        )}
      </main>

      {/* Bottom Diff Stats & Navigation Bar */}
      {isDiffActive && (
        <DiffStatsBar
          summary={summary}
          currentDiffIndex={currentDiffIndex}
          mergeMode={diffOptions.mergeMode}
          onToggleMergeMode={() =>
            setDiffOptions((prev) => ({ ...prev, mergeMode: !prev.mergeMode }))
          }
          onMergeAllLeftToRight={handleMergeAllLeftToRight}
          onMergeAllRightToLeft={handleMergeAllRightToLeft}
          onPrevDiff={handlePrevDiff}
          onNextDiff={handleNextDiff}
          onBackToEdit={() => setIsDiffActive(false)}
          onClearAll={handleClearAll}
          onCopyPatch={handleCopyPatch}
          onDownloadPatch={handleDownloadPatch}
        />
      )}

      {/* On-Page SEO & Information Content Section */}
      <Suspense fallback={<div className="h-40" />}>
        <SeoContent />
      </Suspense>

      {/* Keyboard Shortcuts Modal */}
      {shortcutsOpen && (
        <Suspense fallback={null}>
          <KeyboardShortcutsModal
            isOpen={shortcutsOpen}
            onClose={() => setShortcutsOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
}
