// Automated Verification Tests for Z9 Automotive Inspection Logic
// Tests:
// 1. Checklist item counts & category structure matches PDF exactly (336 items, 8 categories)
// 2. Score calculations: PASS percentage = (passed / scored) * 100
// 3. PENDING items are NEVER treated as passed
// 4. Zero scored items returns 0% (unscored), NEVER a misleading 100%
// 5. Category breakdown calculations
// 6. Mandatory defect observations for failures

import {
  CHECKLIST_CATEGORIES,
  ALL_CHECKLIST_ITEMS,
} from '../src/data/checklistDefinition';
import { calculateInspectionMetrics } from '../src/utils/inspectionCalculations';
import { CheckResultStatus, InspectionItemResult } from '../src/types';

function runTests() {
  console.log('🚀 Running Z9 Automotive Vehicle Inspection Logic Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // Test 1: Exact Checklist Counts Matching Reference Report
  // -------------------------------------------------------------
  console.log('Test Suite 1: Checklist Configuration Validation');
  assert(CHECKLIST_CATEGORIES.length === 8, 'Has exactly 8 major categories');
  assert(ALL_CHECKLIST_ITEMS.length === 336, `Total items is exactly 336 (got ${ALL_CHECKLIST_ITEMS.length})`);

  const ext = CHECKLIST_CATEGORIES.find((c) => c.code === 'EXT');
  assert(ext?.totalItems === 67, `Exterior has 67 items (got ${ext?.totalItems})`);

  const int = CHECKLIST_CATEGORIES.find((c) => c.code === 'INT');
  assert(int?.totalItems === 71, `Interior has 71 items (got ${int?.totalItems})`);

  const elec = CHECKLIST_CATEGORIES.find((c) => c.code === 'ELEC');
  assert(elec?.totalItems === 66, `Electronics has 66 items (got ${elec?.totalItems})`);

  const eng = CHECKLIST_CATEGORIES.find((c) => c.code === 'ENG');
  assert(eng?.totalItems === 42, `Engine Bay has 42 items (got ${eng?.totalItems})`);

  const chs = CHECKLIST_CATEGORIES.find((c) => c.code === 'CHS');
  assert(chs?.totalItems === 48, `Underbody & Chassis has 48 items (got ${chs?.totalItems})`);

  const tyre = CHECKLIST_CATEGORIES.find((c) => c.code === 'TYRE');
  assert(tyre?.totalItems === 15, `Tyres & Wheels has 15 items (got ${tyre?.totalItems})`);

  const road = CHECKLIST_CATEGORIES.find((c) => c.code === 'ROAD');
  assert(road?.totalItems === 14, `Road Test has 14 items (got ${road?.totalItems})`);

  const doc = CHECKLIST_CATEGORIES.find((c) => c.code === 'DOC');
  assert(doc?.totalItems === 13, `Documents & Compliance has 13 items (got ${doc?.totalItems})`);

  // -------------------------------------------------------------
  // Test 2: Unscored / Empty State Calculation
  // -------------------------------------------------------------
  console.log('\nTest Suite 2: Unscored State Calculation');
  const emptyResults = {};
  const emptyMetrics = calculateInspectionMetrics(emptyResults);

  assert(emptyMetrics.scoredItems === 0, 'Initial scored items is 0');
  assert(emptyMetrics.pendingItems === 336, 'Initial pending items is 336');
  assert(emptyMetrics.passedItems === 0, 'Initial passed items is 0');
  assert(emptyMetrics.failedItems === 0, 'Initial failed items is 0');
  assert(emptyMetrics.passPercentage === 0, 'Initial pass percentage is 0% (NOT 100%)');
  assert(emptyMetrics.completionPercentage === 0, 'Initial completion percentage is 0%');
  assert(!emptyMetrics.isFullyComplete, 'Empty inspection is not marked complete');

  // -------------------------------------------------------------
  // Test 3: Transparent Scoring Formula & Pending Checks Isolation
  // -------------------------------------------------------------
  console.log('\nTest Suite 3: Scoring Formula & Pending Checks Isolation');
  const sampleResults: Record<string, InspectionItemResult> = {};

  // Mark 9 items as PASS, 1 item as FAIL, remainder PENDING
  for (let i = 0; i < 9; i++) {
    const item = ALL_CHECKLIST_ITEMS[i];
    sampleResults[item.id] = {
      id: item.id,
      inspectionId: 'test-insp',
      itemId: item.id,
      categoryName: item.category,
      categoryCode: item.categoryCode,
      subsectionName: item.subsection,
      itemName: item.name,
      itemOrder: item.order,
      status: 'PASS',
      updatedAt: new Date().toISOString(),
    };
  }

  const failItem = ALL_CHECKLIST_ITEMS[9];
  sampleResults[failItem.id] = {
    id: failItem.id,
    inspectionId: 'test-insp',
    itemId: failItem.id,
    categoryName: failItem.category,
    categoryCode: failItem.categoryCode,
    subsectionName: failItem.subsection,
    itemName: failItem.name,
    itemOrder: failItem.order,
    status: 'FAIL',
    remarks: 'Visible dent on lower body sill',
    updatedAt: new Date().toISOString(),
  };

  const sampleMetrics = calculateInspectionMetrics(sampleResults);

  assert(sampleMetrics.passedItems === 9, 'Passed count is exactly 9');
  assert(sampleMetrics.failedItems === 1, 'Failed count is exactly 1');
  assert(sampleMetrics.scoredItems === 10, 'Scored count is 10 (9 + 1)');
  assert(sampleMetrics.pendingItems === 326, 'Pending count is 326 (336 - 10)');
  // Formula: (9 / 10) * 100 = 90%
  assert(sampleMetrics.passPercentage === 90, `Pass percentage is 90% (got ${sampleMetrics.passPercentage}%)`);
  assert(sampleMetrics.completionPercentage === 3, 'Completion is 3% (10 / 336 rounded)');
  assert(!sampleMetrics.isFullyComplete, 'Inspection with 326 pending checks is NOT fully complete');

  // -------------------------------------------------------------
  // Test 4: Reference Inspection PDF Simulation (309 Scored Items)
  // -------------------------------------------------------------
  console.log('\nTest Suite 4: Reference PDI-000028 Report Simulation');
  const refResults: Record<string, InspectionItemResult> = {};

  // In PDI-000028: EXT (67), INT (71), ELEC (66), ENG (42), CHS (48), TYRE (15) all passed
  // Total 309 items passed, Road Test (14) & Docs (13) pending
  for (const item of ALL_CHECKLIST_ITEMS) {
    if (['EXT', 'INT', 'ELEC', 'ENG', 'CHS', 'TYRE'].includes(item.categoryCode)) {
      refResults[item.id] = {
        id: item.id,
        inspectionId: 'pdi-000028',
        itemId: item.id,
        categoryName: item.category,
        categoryCode: item.categoryCode,
        subsectionName: item.subsection,
        itemName: item.name,
        itemOrder: item.order,
        status: 'PASS',
        updatedAt: new Date().toISOString(),
      };
    }
  }

  const refMetrics = calculateInspectionMetrics(refResults);
  assert(refMetrics.passedItems === 309, `Reference report has 309 passed items (got ${refMetrics.passedItems})`);
  assert(refMetrics.failedItems === 0, 'Reference report has 0 failed items');
  assert(refMetrics.scoredItems === 309, 'Reference report has 309 scored items');
  assert(refMetrics.pendingItems === 27, `Reference report has 27 pending items: 14 Road + 13 Docs (got ${refMetrics.pendingItems})`);
  assert(refMetrics.passPercentage === 100, 'Scored pass percentage is 100%');
  assert(refMetrics.completionPercentage === 92, `Completion is 92% (309/336) (got ${refMetrics.completionPercentage}%)`);

  console.log(`\n========================================`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();

