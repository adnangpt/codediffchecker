import * as Diff from 'diff';
import {
  DiffChunk,
  DiffOptions,
  DiffSummary,
  InlineSegment,
  SplitDiffRow,
  UnifiedDiffRow,
} from '../types/diff';

/**
 * Preprocess text according to user options
 */
function normalizeText(text: string, options: DiffOptions): string {
  let result = text;
  if (options.ignoreCase) {
    result = result.toLowerCase();
  }
  if (options.ignoreWhitespace) {
    result = result
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n');
  }
  return result;
}

/**
 * Calculates word-level intra-line difference between an original line and changed line
 */
export function computeInlineDiff(
  oldLine: string,
  newLine: string,
  options: DiffOptions
): { leftSegments: InlineSegment[]; rightSegments: InlineSegment[] } {
  const compOld = options.ignoreCase ? oldLine.toLowerCase() : oldLine;
  const compNew = options.ignoreCase ? newLine.toLowerCase() : newLine;

  const wordDiff = Diff.diffWordsWithSpace(compOld, compNew);

  const leftSegments: InlineSegment[] = [];
  const rightSegments: InlineSegment[] = [];

  let oldIdx = 0;
  let newIdx = 0;

  for (const part of wordDiff) {
    if (part.added) {
      const actualText = newLine.substring(newIdx, newIdx + part.value.length);
      newIdx += part.value.length;
      rightSegments.push({ text: actualText, type: 'added' });
    } else if (part.removed) {
      const actualText = oldLine.substring(oldIdx, oldIdx + part.value.length);
      oldIdx += part.value.length;
      leftSegments.push({ text: actualText, type: 'removed' });
    } else {
      const actualOld = oldLine.substring(oldIdx, oldIdx + part.value.length);
      const actualNew = newLine.substring(newIdx, newIdx + part.value.length);
      oldIdx += part.value.length;
      newIdx += part.value.length;
      leftSegments.push({ text: actualOld, type: 'unchanged' });
      rightSegments.push({ text: actualNew, type: 'unchanged' });
    }
  }

  if (leftSegments.length === 0) {
    leftSegments.push({ text: oldLine, type: 'removed' });
  }
  if (rightSegments.length === 0) {
    rightSegments.push({ text: newLine, type: 'added' });
  }

  return { leftSegments, rightSegments };
}

/**
 * Generates Split rows, Unified rows, Diff chunks and summary
 */
export function computeDiff(
  originalText: string,
  changedText: string,
  options: DiffOptions
): {
  splitRows: SplitDiffRow[];
  unifiedRows: UnifiedDiffRow[];
  chunks: DiffChunk[];
  summary: DiffSummary;
} {
  const normOriginal = normalizeText(originalText, options);
  const normChanged = normalizeText(changedText, options);

  const rawOriginalLines = originalText.split('\n');
  const rawChangedLines = changedText.split('\n');

  // Perform line-level diff
  const lineChanges: Diff.Change[] = Diff.diffLines(normOriginal, normChanged, {
    ignoreWhitespace: options.ignoreWhitespace,
  });

  const splitRows: SplitDiffRow[] = [];
  const unifiedRows: UnifiedDiffRow[] = [];
  const chunks: DiffChunk[] = [];

  let originalLineNum = 1;
  let changedLineNum = 1;

  let totalAdditions = 0;
  let totalDeletions = 0;
  let totalModifications = 0;
  let totalUnchanged = 0;
  let diffChunkCounter = 0;

  let i = 0;
  while (i < lineChanges.length) {
    const current = lineChanges[i];
    const next = lineChanges[i + 1];

    // Case 1: In-place modification (removed immediately followed by added)
    if (current.removed && next && next.added) {
      diffChunkCounter++;
      const currentLinesCount = current.count || 1;
      const nextLinesCount = next.count || 1;

      const removedLines: string[] = [];
      for (let k = 0; k < currentLinesCount; k++) {
        removedLines.push(rawOriginalLines[originalLineNum - 1 + k] ?? '');
      }

      const addedLines: string[] = [];
      for (let k = 0; k < nextLinesCount; k++) {
        addedLines.push(rawChangedLines[changedLineNum - 1 + k] ?? '');
      }

      const chunk: DiffChunk = {
        index: diffChunkCounter,
        type: 'modification',
        origStartLine: originalLineNum,
        origLineCount: currentLinesCount,
        origLines: removedLines,
        changedStartLine: changedLineNum,
        changedLineCount: nextLinesCount,
        changedLines: addedLines,
      };
      chunks.push(chunk);

      const maxPairs = Math.max(removedLines.length, addedLines.length);

      for (let p = 0; p < maxPairs; p++) {
        const hasLeft = p < removedLines.length;
        const hasRight = p < addedLines.length;
        const isStart = p === 0;

        let leftSegments: InlineSegment[] | undefined;
        let rightSegments: InlineSegment[] | undefined;

        if (hasLeft && hasRight) {
          totalModifications++;
          const inline = computeInlineDiff(removedLines[p], addedLines[p], options);
          leftSegments = inline.leftSegments;
          rightSegments = inline.rightSegments;
        } else if (hasLeft) {
          totalDeletions++;
        } else if (hasRight) {
          totalAdditions++;
        }

        const splitRow: SplitDiffRow = {
          id: `row-mod-${diffChunkCounter}-${p}`,
          diffIndex: diffChunkCounter,
          isDiffStart: isStart,
          chunk: isStart ? chunk : undefined,
          left: hasLeft
            ? {
                lineNumber: originalLineNum + p,
                text: removedLines[p],
                type: hasRight ? 'modified' : 'removed',
                segments: leftSegments,
              }
            : undefined,
          right: hasRight
            ? {
                lineNumber: changedLineNum + p,
                text: addedLines[p],
                type: hasLeft ? 'modified' : 'added',
                segments: rightSegments,
              }
            : undefined,
        };
        splitRows.push(splitRow);
      }

      // Add to unified rows
      for (let p = 0; p < removedLines.length; p++) {
        const pairRight = p < addedLines.length ? addedLines[p] : undefined;
        const inline = pairRight
          ? computeInlineDiff(removedLines[p], pairRight, options)
          : undefined;

        unifiedRows.push({
          id: `uni-rem-${diffChunkCounter}-${p}`,
          diffIndex: diffChunkCounter,
          isDiffStart: p === 0,
          chunk: p === 0 ? chunk : undefined,
          leftLineNumber: originalLineNum + p,
          type: 'removed',
          text: removedLines[p],
          segments: inline?.leftSegments,
        });
      }

      for (let p = 0; p < addedLines.length; p++) {
        const pairLeft = p < removedLines.length ? removedLines[p] : undefined;
        const inline = pairLeft
          ? computeInlineDiff(pairLeft, addedLines[p], options)
          : undefined;

        unifiedRows.push({
          id: `uni-add-${diffChunkCounter}-${p}`,
          diffIndex: diffChunkCounter,
          isDiffStart: removedLines.length === 0 && p === 0,
          chunk: removedLines.length === 0 && p === 0 ? chunk : undefined,
          rightLineNumber: changedLineNum + p,
          type: 'added',
          text: addedLines[p],
          segments: inline?.rightSegments,
        });
      }

      originalLineNum += currentLinesCount;
      changedLineNum += nextLinesCount;
      i += 2;
    } else if (current.removed) {
      // Case 2: Pure deletion
      diffChunkCounter++;
      const count = current.count || 1;
      totalDeletions += count;

      const removedLines: string[] = [];
      for (let k = 0; k < count; k++) {
        removedLines.push(rawOriginalLines[originalLineNum - 1 + k] ?? '');
      }

      const chunk: DiffChunk = {
        index: diffChunkCounter,
        type: 'deletion',
        origStartLine: originalLineNum,
        origLineCount: count,
        origLines: removedLines,
        changedStartLine: changedLineNum,
        changedLineCount: 0,
        changedLines: [],
      };
      chunks.push(chunk);

      for (let k = 0; k < count; k++) {
        const lineText = removedLines[k];
        splitRows.push({
          id: `row-rem-${diffChunkCounter}-${k}`,
          diffIndex: diffChunkCounter,
          isDiffStart: k === 0,
          chunk: k === 0 ? chunk : undefined,
          left: {
            lineNumber: originalLineNum,
            text: lineText,
            type: 'removed',
          },
          right: undefined,
        });

        unifiedRows.push({
          id: `uni-rem-${diffChunkCounter}-${k}`,
          diffIndex: diffChunkCounter,
          isDiffStart: k === 0,
          chunk: k === 0 ? chunk : undefined,
          leftLineNumber: originalLineNum,
          type: 'removed',
          text: lineText,
        });

        originalLineNum++;
      }
      i++;
    } else if (current.added) {
      // Case 3: Pure addition
      diffChunkCounter++;
      const count = current.count || 1;
      totalAdditions += count;

      const addedLines: string[] = [];
      for (let k = 0; k < count; k++) {
        addedLines.push(rawChangedLines[changedLineNum - 1 + k] ?? '');
      }

      const chunk: DiffChunk = {
        index: diffChunkCounter,
        type: 'addition',
        origStartLine: originalLineNum,
        origLineCount: 0,
        origLines: [],
        changedStartLine: changedLineNum,
        changedLineCount: count,
        changedLines: addedLines,
      };
      chunks.push(chunk);

      for (let k = 0; k < count; k++) {
        const lineText = addedLines[k];
        splitRows.push({
          id: `row-add-${diffChunkCounter}-${k}`,
          diffIndex: diffChunkCounter,
          isDiffStart: k === 0,
          chunk: k === 0 ? chunk : undefined,
          left: undefined,
          right: {
            lineNumber: changedLineNum,
            text: lineText,
            type: 'added',
          },
        });

        unifiedRows.push({
          id: `uni-add-${diffChunkCounter}-${k}`,
          diffIndex: diffChunkCounter,
          isDiffStart: k === 0,
          chunk: k === 0 ? chunk : undefined,
          rightLineNumber: changedLineNum,
          type: 'added',
          text: lineText,
        });

        changedLineNum++;
      }
      i++;
    } else {
      // Case 4: Unchanged lines
      const count = current.count || 1;
      totalUnchanged += count;

      for (let k = 0; k < count; k++) {
        const lineText = rawOriginalLines[originalLineNum - 1] ?? '';

        splitRows.push({
          id: `row-unc-${originalLineNum}-${changedLineNum}`,
          left: {
            lineNumber: originalLineNum,
            text: lineText,
            type: 'unchanged',
          },
          right: {
            lineNumber: changedLineNum,
            text: lineText,
            type: 'unchanged',
          },
        });

        unifiedRows.push({
          id: `uni-unc-${originalLineNum}-${changedLineNum}`,
          leftLineNumber: originalLineNum,
          rightLineNumber: changedLineNum,
          type: 'unchanged',
          text: lineText,
        });

        originalLineNum++;
        changedLineNum++;
      }
      i++;
    }
  }

  const summary: DiffSummary = {
    additions: totalAdditions,
    deletions: totalDeletions,
    modifications: totalModifications,
    totalDiffChunks: diffChunkCounter,
    unchangedLines: totalUnchanged,
  };

  return { splitRows, unifiedRows, chunks, summary };
}

/**
 * Merges a single difference chunk from one side to the other
 */
export function mergeChunk(
  chunk: DiffChunk,
  direction: 'left-to-right' | 'right-to-left',
  originalText: string,
  changedText: string
): { newOriginal: string; newChanged: string } {
  const origLines = originalText.split('\n');
  const changedLines = changedText.split('\n');

  if (direction === 'left-to-right') {
    // Apply left (original) into right (changed)
    const targetIndex = Math.max(0, chunk.changedStartLine - 1);
    changedLines.splice(targetIndex, chunk.changedLineCount, ...chunk.origLines);
    return {
      newOriginal: originalText,
      newChanged: changedLines.join('\n'),
    };
  } else {
    // Apply right (changed) into left (original)
    const targetIndex = Math.max(0, chunk.origStartLine - 1);
    origLines.splice(targetIndex, chunk.origLineCount, ...chunk.changedLines);
    return {
      newOriginal: origLines.join('\n'),
      newChanged: changedText,
    };
  }
}

/**
 * Creates standard patch text for downloading or copying
 */
export function generatePatchText(
  originalName: string,
  changedName: string,
  originalText: string,
  changedText: string
): string {
  return Diff.createPatch(
    originalName || 'original.txt',
    originalText,
    changedText,
    'Original',
    'Modified'
  );
}
