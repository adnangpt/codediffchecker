export type ViewMode = 'split' | 'unified';

export type DiffGranularity = 'words' | 'chars' | 'lines';

export interface DiffOptions {
  ignoreWhitespace: boolean;
  ignoreCase: boolean;
  showLineNumbers: boolean;
  wordWrap: boolean;
  collapseUnchanged: boolean;
  contextLines: number;
  mergeMode: boolean;
}

export type DiffChangeType = 'added' | 'removed' | 'unchanged' | 'modified';

export interface InlineSegment {
  text: string;
  type: 'added' | 'removed' | 'unchanged';
}

export interface DiffChunk {
  index: number;
  type: 'modification' | 'addition' | 'deletion';
  origStartLine: number; // 1-indexed in original document
  origLineCount: number;
  origLines: string[];
  changedStartLine: number; // 1-indexed in changed document
  changedLineCount: number;
  changedLines: string[];
}

export interface SplitDiffRow {
  id: string;
  diffIndex?: number; // assigned to rows that represent a difference
  isDiffStart?: boolean;
  chunk?: DiffChunk;
  left?: {
    lineNumber: number;
    text: string;
    type: 'removed' | 'modified' | 'unchanged';
    segments?: InlineSegment[];
  };
  right?: {
    lineNumber: number;
    text: string;
    type: 'added' | 'modified' | 'unchanged';
    segments?: InlineSegment[];
  };
}

export interface UnifiedDiffRow {
  id: string;
  diffIndex?: number;
  isDiffStart?: boolean;
  chunk?: DiffChunk;
  leftLineNumber?: number;
  rightLineNumber?: number;
  type: 'added' | 'removed' | 'unchanged' | 'context-separator';
  text: string;
  segments?: InlineSegment[];
}

export interface DiffSummary {
  additions: number;
  deletions: number;
  modifications: number;
  totalDiffChunks: number;
  unchangedLines: number;
}
