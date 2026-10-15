import React from 'react';
import {
  Columns2,
  Rows3,
  ShieldCheck,
  Zap,
  GitMerge,
  FileCode2,
  CheckCircle2,
  ArrowRight,
  Code,
  Laptop,
  Lock,
  Layers,
} from 'lucide-react';

export const SeoContent: React.FC = () => {
  return (
    <section
      aria-label="Code Diff Checker Overview and Guide"
      className="seo-content w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors"
    >
      {/* Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 mb-3">
            <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Developer-Grade Diff Utility</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 mb-4">
            What is Code Diff Checker?
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-neutral-600 dark:text-neutral-300 mb-4">
            <strong>Code Diff Checker</strong> is a free, high-performance online comparison tool built for software engineers, code reviewers, and technical writers to spot variances across codebases, configuration files, and text documents in real time.
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            By analyzing differences down to the exact word and character levels, our engine highlights added, modified, and deleted lines with surgical precision. Whether you are debugging unexpected regressions, auditing pull requests, or reconciling config files, you get instant visibility without installing heavyweight desktop applications.
          </p>
        </div>

        <div className="lg:col-span-5 bg-white dark:bg-neutral-900/90 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Zero Server Uploads & 100% Privacy
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
            All code diff algorithms, line tokenization, and merge routines execute <strong>entirely inside your local browser sandbox</strong>.
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>No proprietary code is sent to external servers or cloud logs</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Works seamlessly with sensitive API keys, SQL schemas, and JSON secrets</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Compliant with strict enterprise data confidentiality policies</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Key Features Grid */}
      <div className="mb-14">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
            Key Features
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Engineered specifically to solve everyday friction in code reviews and text reconciliation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800/80 shadow-xs hover:border-emerald-500/50 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Columns2 className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm mb-1.5">
              Side-by-Side & Inline Comparison
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Toggle fluidly between split two-column view and unified git-style inline view with synchronized row-by-row scrolling.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800/80 shadow-xs hover:border-emerald-500/50 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm mb-1.5">
              Instant Word & Token Highlighting
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Detect granular intra-line modifications instantly with sharp contrast tokens highlighting exact variables or typos.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800/80 shadow-xs hover:border-emerald-500/50 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/80 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm mb-1.5">
              Privacy-First Browser Execution
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Zero network latency and absolute data security. Everything runs offline in RAM without saving to any third-party database.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800/80 shadow-xs hover:border-emerald-500/50 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <FileCode2 className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm mb-1.5">
              Fast File Loading & Alt+Z Wrap
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Drag-and-drop code files directly or paste up to 10,000+ lines. Features VS Code IntelliCode word-wrapping without horizontal clipping.
            </p>
          </div>
        </div>
      </div>

      {/* How to Compare Code Online (Step-by-step) */}
      <div className="mb-14 bg-neutral-50 dark:bg-neutral-900/40 rounded-2xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
            How to Compare Code Online
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Follow three quick steps to audit and reconcile your code differences:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                1
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-base">
                Paste Original Code
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Paste the original source file, baseline script, or reference text into the left editor pane, or drag and drop a local file.
            </p>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                2
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-base">
                Paste Modified Code
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Insert the updated code, newly refactored version, or modified configuration into the right pane.
            </p>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                3
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-base">
                View Instant Highlighted Differences
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Click <strong>Find Diff</strong> or press <kbd className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-[11px] font-mono">Ctrl/Cmd + Enter</kbd> to inspect synchronized split views, merge chunks, or export patch files.
            </p>
          </div>
        </div>
      </div>

      {/* Supported Languages */}
      <div className="mb-14">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
            Supported Languages & Formats
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            CodeDiffChecker accurately parses formatting, whitespace, and structural indentation across modern development stacks:
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            'JavaScript (.js, .mjs)',
            'TypeScript (.ts, .tsx)',
            'Python (.py)',
            'JSON (.json)',
            'HTML (.html, .htm)',
            'CSS / SCSS / Tailwind',
            'SQL (PostgreSQL, MySQL, SQLite)',
            'YAML (.yml, .yaml)',
            'Rust (.rs)',
            'Go (.go)',
            'Java / Kotlin',
            'C / C++ / C#',
            'PHP',
            'Shell & Bash (.sh)',
            'Markdown (.md)',
            'Plain Text (.txt)',
          ].map((lang) => (
            <span
              key={lang}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 shadow-2xs"
            >
              <Code className="w-3.5 h-3.5 mr-1.5 text-neutral-400" />
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* Interactive Merge Changes Feature Highlight */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <GitMerge className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Interactive Merge Controls Included
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-1 max-w-2xl leading-relaxed">
              Merge individual difference chunks between original and changed code with one click. Selectively apply or reject changes, merge all left-to-right or right-to-left, and copy separate panes independently with safe undo snapshots.
            </p>
          </div>
        </div>
      </div>

      {/* Semantic Footer with Accessibility & Metadata Notes */}
      <footer className="pt-8 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>
          © {new Date().getFullYear()} <strong>Code Diff Checker</strong> — Fast, private, browser-based code comparison.
        </p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Laptop className="w-3.5 h-3.5" />
            <span>Client-side only</span>
          </span>
          <span>·</span>
          <span>No tracking</span>
          <span>·</span>
          <span>Open Web Standards</span>
        </div>
      </footer>
    </section>
  );
};
