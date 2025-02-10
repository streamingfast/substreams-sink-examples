export type ProgressRange = [from: bigint, to: bigint];
/**
 * Merges progress ranges.
 *
 * @param ranges The ranges to merge.
 * @returns The merged ranges.
 */
export declare function mergeProgressRanges(ranges: ProgressRange[]): ProgressRange[];
/**
 * Merges progress ranges that are already sorted.
 *
 * @param ranges The ranges to merge.
 * @returns The merged ranges.
 */
export declare function mergeSortedProgressRanges(ranges: ProgressRange[]): ProgressRange[];
//# sourceMappingURL=merge-progress-ranges.d.ts.map