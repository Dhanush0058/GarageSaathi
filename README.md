# Z9 Automotive — Vehicle Inspection & Quality Assessment Mobile App

Production-ready mobile application for **Z9 Automotive**, engineered for authorized workshop managers, vehicle inspection specialists, and automotive technicians. 

Built with **React Native**, **Expo (SDK 58)**, **TypeScript**, **Supabase PostgreSQL with Row Level Security (RLS)**, offline persistent storage, mobile camera evidence collection, and professional PDF inspection report generation matching the official 22-page reference inspection certificate (`PDI-000028`).

---

## 🌟 Visual & Functional Identity

- **Brand Identity**: Z9 Automotive Workshop & Inspection Suite
- **Brand Colors**:
  - Primary Brand Orange: `#FF643C`
  - Deep Brand Accent: `#B02E0C`
  - Brand Surface Tint: `#FFF2EE` / `#F5EAE7`
  - Workshop Slate Neutral: `#0F172A`
  - PASS Green: `#16A34A`
  - FAIL Red: `#DC2626`
  - PENDING Amber: `#D97706`
- **Workshop-Optimized UX**:
  - High-contrast visual hierarchy tested for harsh workshop lighting and dim inspection pits
  - Large, tactile tap targets designed for one-handed operation
  - Instant autosave with offline fallback across app restarts

---

## 📋 Exact 336-Point Inspection Checklist Engine

Directly extracted and verified against the official reference report `PDI-000028`:

| # | Inspection Category | Code | Subsections | Total Checks | Reference Scored |
|---|---------------------|------|-------------|--------------|------------------|
| 1 | **Exterior** | `EXT` | 6 subsections | **67** items | 67 / 67 PASS |
| 2 | **Interior** | `INT` | 7 subsections | **71** items | 71 / 71 PASS |
| 3 | **Electronics** | `ELEC` | 6 subsections | **66** items | 66 / 66 PASS |
| 4 | **Engine Bay** | `ENG` | 6 subsections | **42** items | 42 / 42 PASS |
| 5 | **Underbody & Chassis** | `CHS` | 6 subsections | **48** items | 48 / 48 PASS |
| 6 | **Road Test** | `ROAD` | 5 subsections | **14** items | Unscored (Pending) |
| 7 | **Tyres & Wheels** | `TYRE` | 5 subsections | **15** items | 15 / 15 PASS |
| 8 | **Documents & Compliance** | `DOC` | 5 subsections | **13** items | Unscored (Pending) |
| **TOTAL** | **8 Categories** | — | **46 Subsections** | **336 Items** | **309 / 309 PASS** |

### Transparent Scoring Logic:
$$\text{PASS Percentage} = \left(\frac{\text{Passed Applicable Items}}{\text{All Scored Applicable Items}}\right) \times 100$$
- `PENDING` items are **never** treated as passed.
- If 0 items have been scored, the app explicitly displays an **Unscored state (`—` / `0%`)**, avoiding misleading 100% scores.

---

## 📱 Implemented Application Screens

1. **Screen A: Authentication & Staff Profiles** (`src/screens/AuthScreen.tsx`)
   - Role-based access control (Admin, Garage Owner, Workshop Manager, Lead Inspector, Quality Reviewer)
   - Profile view with organization and branch details
   - Quick role switcher for rapid workshop testing
2. **Screen B: Home Dashboard** (`src/screens/HomeScreen.tsx`)
   - Live metrics derived from persisted records: Total Inspections, In Progress, Completed, Vehicles with Failures
   - Quick Action "Start New Inspection" button
   - Recent vehicle inspections list with progress bars
3. **Screen C: Customer Management** (`src/screens/CustomersScreen.tsx`)
   - Search by client name, phone number, and city
   - Register new customers with validation
   - Link multiple vehicles to a single customer
4. **Screen D: Vehicle Registration & Profiles** (`src/screens/VehiclesScreen.tsx`)
   - Register vehicle with Reg No, Make, Model, Variant, Fuel Type, Transmission, VIN, Odometer, Fuel Level
   - Immediate vehicle photo capture from camera or gallery
   - Direct "Inspect" launcher for any registered vehicle
5. **Screen E: Create Inspection Workflow** (`src/screens/CreateInspectionScreen.tsx`)
   - Guided 3-step wizard: Client $\to$ Vehicle $\to$ Metadata & Initial Evidence $\to$ Checklist Launch
   - Auto-generated unique Report IDs (`PDI-000028`, `PDI-000029`...)
   - Collision prevention against duplicate reports
6. **Screen F: Inspection Checklist (Core Screen)** (`src/screens/InspectionChecklistScreen.tsx`)
   - 8 Category horizontal navigation tabs with failure counter badges
   - 46 Subsection grouping headers
   - 336 native check rows with tactile PASS and FAIL buttons
   - Mandatory defect observation modal upon marking FAIL
   - Direct camera / gallery photographic evidence attachment per checklist item
   - Autosave feedback indicator ("Saved ✓")
   - "Jump to Next Pending Item" shortcut
7. **Screen G: Camera & Evidence Capture** (`src/services/storage/imageService.ts`)
   - High-resolution compression optimized for defect evidence
   - Offline persistent upload queue with retry mechanism
8. **Screen H: Inspection Summary & Scorecard** (`src/screens/InspectionSummaryScreen.tsx`)
   - Executive scorecard with overall PASS percentage
   - Category-wise quality breakdown table
   - Defect observations list with failure remarks
   - Attached evidence thumbnails gallery
   - Official completion & certification validation
9. **Screen I: Professional PDF Report Generator** (`src/screens/ReportViewScreen.tsx`)
   - Generated using `expo-print` and `expo-sharing`
   - Executive cover page with Z9 Automotive branding, Report ID, and confidential watermark
   - Client and Vehicle metadata grid (VIN, Odometer, Fuel Level, Dealer, Inspector)
   - Quality Assessment score tiles across all 8 categories
   - Detailed inspection checklist table with status chips and defect notes
   - Photographic evidence gallery
   - Official Certificate of Inspection verification document matching Page 22 of `PDI-000028`
   - Native OS sharing sheet (`Share via WhatsApp, Email, AirDrop, Save to Files`) and print support
10. **Screen J: Inspection History & Search** (`src/screens/InspectionHistoryScreen.tsx`)
    - Search by Report ID, Registration, Make, Model, Client, Inspector
    - Status filtering: All, Completed, In Progress, Draft
    - Chronological history for each vehicle

---

## 🗄️ Database Architecture & Migrations

The database schema is located at:
`supabase/migrations/20261028000000_init_garagesaarthi_inspection.sql`

- **Tables**: `organizations`, `branches`, `profiles`, `customers`, `vehicles`, `inspections`, `inspection_item_results`, `inspection_photos`, `inspection_activity_logs`.
- **Automatic Score Recalculation Trigger**: Database trigger `trigger_recalculate_inspection_scores` updates `inspections.pass_percentage`, `passed_items`, `failed_items`, and `pending_items` whenever check rows change.
- **Row-Level Security (RLS)**: Enforces strict organization isolation so garages cannot see or access other organizations' records or private photos.

---

## 🧪 Automated Test Suite

A complete verification suite is located at `tests/inspection.test.ts`.

Run tests:
```bash
npx -y tsx tests/inspection.test.ts
```

Output:
```
🚀 Running Z9 Automotive Vehicle Inspection Logic Tests...

Test Suite 1: Checklist Configuration Validation
  ✓ PASS: Has exactly 8 major categories
  ✓ PASS: Total items is exactly 336 (got 336)
  ✓ PASS: Exterior has 67 items (got 67)
  ✓ PASS: Interior has 71 items (got 71)
  ✓ PASS: Electronics has 66 items (got 66)
  ✓ PASS: Engine Bay has 42 items (got 42)
  ✓ PASS: Underbody & Chassis has 48 items (got 48)
  ✓ PASS: Tyres & Wheels has 15 items (got 15)
  ✓ PASS: Road Test has 14 items (got 14)
  ✓ PASS: Documents & Compliance has 13 items (got 13)

Test Suite 2: Unscored State Calculation
  ✓ PASS: Initial scored items is 0
  ✓ PASS: Initial pending items is 336
  ✓ PASS: Initial passed items is 0
  ✓ PASS: Initial failed items is 0
  ✓ PASS: Initial pass percentage is 0% (NOT 100%)
  ✓ PASS: Initial completion percentage is 0%
  ✓ PASS: Empty inspection is not marked complete

Test Suite 3: Scoring Formula & Pending Checks Isolation
  ✓ PASS: Passed count is exactly 9
  ✓ PASS: Failed count is exactly 1
  ✓ PASS: Scored count is 10 (9 + 1)
  ✓ PASS: Pending count is 326 (336 - 10)
  ✓ PASS: Pass percentage is 90% (got 90%)
  ✓ PASS: Completion is 3% (10 / 336 rounded)
  ✓ PASS: Inspection with 326 pending checks is NOT fully complete

Test Suite 4: Reference PDI-000028 Report Simulation
  ✓ PASS: Reference report has 309 passed items (got 309)
  ✓ PASS: Reference report has 0 failed items
  ✓ PASS: Reference report has 309 scored items
  ✓ PASS: Reference report has 27 pending items: 14 Road + 13 Docs (got 27)
  ✓ PASS: Scored pass percentage is 100%
  ✓ PASS: Completion is 92% (309/336) (got 92%)

Results: 30 passed, 0 failed
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional for Supabase Cloud)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Provide your `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
*(Note: If omitted, the app automatically runs in robust offline persistent mode using AsyncStorage).*

### 3. Run the Mobile App
- Start Metro bundler:
  ```bash
  npm start
  ```
- Run on Android:
  ```bash
  npm run android
  ```
- Run on iOS:
  ```bash
  npm run ios
  ```
- Run on Web preview:
  ```bash
  npm run web
  ```

---

## 🔒 Security & Privacy

- **Zero Client Secrets**: No service-role key or admin secrets are bundled into the mobile code.
- **Evidence Protection**: Photos and inspection records belong to private buckets with signed URL access and organization-scoped RLS policies.

