// Inspection Score & Progress Calculation Utilities
// Enforces:
// 1. Transparent formula: PASS % = (passed / scored) * 100
// 2. Scored items = passed + failed
// 3. PENDING items are NEVER treated as passed
// 4. If 0 items are scored, pass % is 0% (unscored state), NEVER a false 100%
// 5. Completion % = (scored / total) * 100

import { CHECKLIST_CATEGORIES, ALL_CHECKLIST_ITEMS } from '../data/checklistDefinition';
import { CheckResultStatus, InspectionItemResult, CategorySummary } from '../types';

export interface CalculatedInspectionMetrics {
  totalItems: number;
  scoredItems: number;
  passedItems: number;
  failedItems: number;
  pendingItems: number;
  passPercentage: number;
  completionPercentage: number;
  isFullyComplete: boolean;
  categorySummaries: CategorySummary[];
}

export function calculateInspectionMetrics(
  results: Record<string, InspectionItemResult> | undefined
): CalculatedInspectionMetrics {
  const resMap = results || {};
  let passedItems = 0;
  let failedItems = 0;
  let pendingItems = 0;

  const categorySummaries: CategorySummary[] = CHECKLIST_CATEGORIES.map((cat) => {
    let catPassed = 0;
    let catFailed = 0;
    let catPending = 0;

    for (const sub of cat.subsections) {
      for (const item of sub.items) {
        const itemResult = resMap[item.id];
        const status: CheckResultStatus = itemResult ? itemResult.status : 'PENDING';

        if (status === 'PASS') {
          catPassed++;
          passedItems++;
        } else if (status === 'FAIL') {
          catFailed++;
          failedItems++;
        } else {
          catPending++;
          pendingItems++;
        }
      }
    }

    const catScored = catPassed + catFailed;
    const catPassPercentage = catScored > 0 ? Math.round((catPassed / catScored) * 100) : 0;
    const catCompletionPercentage =
      cat.totalItems > 0 ? Math.round((catScored / cat.totalItems) * 100) : 0;

    return {
      code: cat.code,
      name: cat.name,
      shortLabel: cat.shortLabel,
      total: cat.totalItems,
      passed: catPassed,
      failed: catFailed,
      pending: catPending,
      passPercentage: catPassPercentage,
      completionPercentage: catCompletionPercentage,
    };
  });

  const totalItems = ALL_CHECKLIST_ITEMS.length;
  const scoredItems = passedItems + failedItems;

  // Formula as specified in Prompt:
  // PASS percentage = passed applicable items divided by all scored applicable items, multiplied by 100.
  // If no item has been scored, return 0 (not 100%).
  const passPercentage = scoredItems > 0 ? Math.round((passedItems / scoredItems) * 100) : 0;
  const completionPercentage =
    totalItems > 0 ? Math.round((scoredItems / totalItems) * 100) : 0;

  const isFullyComplete = pendingItems === 0 && totalItems > 0;

  return {
    totalItems,
    scoredItems,
    passedItems,
    failedItems,
    pendingItems,
    passPercentage,
    completionPercentage,
    isFullyComplete,
    categorySummaries,
  };
}
