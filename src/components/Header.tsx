import React from 'react';
import { GitCompare, Sparkles, Moon, Sun, Keyboard, RotateCcw } from 'lucide-react';
import { SAMPLE_PRESETS, SamplePreset } from '../utils/sampleData';

interface HeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onSelectPreset: (preset: SamplePreset) => void;
  onOpenShortcuts: () => void;
  onClearAll: () => void;
  hasContent: boolean;
  activePresetId?: string;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleTheme,
  onSelectPreset,
  onOpenShortcuts,
  onClearAll,
  hasContent,
  activePresetId,
}) => {
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md sticky top-0 z-30 transition-colors w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Brand wordmark with single clean H1 for SEO */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
            <GitCompare className="w-4 h-4" />
          </div>
          <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 truncate m-0 p-0 leading-tight">
            <a
              href="/"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              title="Online Code Diff Checker - Free Code & Text Comparison Tool"
            >
              <span className="hidden sm:inline">Online Code Diff Checker</span>
              <span className="sm:hidden font-extrabold">Code Diff</span>
            </a>
          </h1>
        </div>

        {/* Zone 2: Preset samples & fast quick-load links (Desktop) */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
          <span className="text-neutral-400 dark:text-neutral-500 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Samples:
          </span>
          {SAMPLE_PRESETS.map((preset) => {
            const isActive = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap font-medium ${
                  isActive
                    ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400'
                }`}
                title={`Load sample ${preset.name}`}
              >
                {preset.name}
              </button>
            );
          })}
        </div>

        {/* Mobile/Tablet Sample select dropdown */}
        <div className="flex lg:hidden items-center shrink-0">
          <select
            value={activePresetId || ''}
            onChange={(e) => {
              const selected = SAMPLE_PRESETS.find(p => p.id === e.target.value);
              if (selected) onSelectPreset(selected);
            }}
            className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg px-2 py-1.5 border border-neutral-200 dark:border-neutral-700 focus:outline-hidden max-w-[100px] xs:max-w-[130px] sm:max-w-none truncate"
            aria-label="Select sample code"
          >
            <option value="" disabled>Load Sample...</option>
            {SAMPLE_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Zone 3: Actions - Clear all, shortcuts, theme */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {hasContent && (
            <button
              onClick={onClearAll}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors whitespace-nowrap border border-rose-200 dark:border-rose-900/60"
              title="Clear both original and changed code"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear All</span>
            </button>
          )}

          <button
            onClick={onOpenShortcuts}
            className="hidden sm:flex p-1.5 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors items-center justify-center"
            title="Keyboard shortcuts"
            aria-label="Keyboard shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleTheme}
            className="p-1.5 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
