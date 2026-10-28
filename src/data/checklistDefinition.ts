// Z9 Automotive Vehicle Inspection Checklist Definition
// Generated directly from reference PDI-000028 (1).pdf
// 8 Categories, 46 Subsections, 336 Total Inspection Items

export type InspectionStatus = "PASS" | "FAIL" | "PENDING";

export interface ChecklistItemDefinition {
  id: string;
  name: string;
  category: string;
  categoryCode: string;
  subsection: string;
  order: number;
  defaultStatus: InspectionStatus;
  referenceStatus?: InspectionStatus;
  referenceValue?: string;
}

export interface ChecklistSubsectionDefinition {
  name: string;
  category: string;
  items: ChecklistItemDefinition[];
}

export interface ChecklistCategoryDefinition {
  code: string;
  name: string;
  shortLabel: string;
  subsections: ChecklistSubsectionDefinition[];
  totalItems: number;
}

export const CHECKLIST_CATEGORIES: ChecklistCategoryDefinition[] = [
  {
    code: "EXT",
    name: "Exterior",
    shortLabel: "EXT",
    totalItems: 67,
    subsections: [
      {
        name: "Body Panels",
        category: "Exterior",
        items: [
          { id: "EXT-01-01", name: "Left front fender paint uniformity", category: "Exterior", categoryCode: "EXT", subsection: "Body Panels", order: 1, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-01-02", name: "Check for dents on body panels", category: "Exterior", categoryCode: "EXT", subsection: "Body Panels", order: 2, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-01-03", name: "Check for scratches on body panels", category: "Exterior", categoryCode: "EXT", subsection: "Body Panels", order: 3, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-01-04", name: "Check for paint color mismatch between panels", category: "Exterior", categoryCode: "EXT", subsection: "Body Panels", order: 4, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-01-05", name: "Check for uneven panel gaps", category: "Exterior", categoryCode: "EXT", subsection: "Body Panels", order: 5, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-01-06", name: "Check for signs of repainting or touch-up", category: "Exterior", categoryCode: "EXT", subsection: "Body Panels", order: 6, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-01-07", name: "Check for rust or corrosion on panels", category: "Exterior", categoryCode: "EXT", subsection: "Body Panels", order: 7, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-01-08", name: "Check for waviness or surface distortion", category: "Exterior", categoryCode: "EXT", subsection: "Body Panels", order: 8, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-01-09", name: "Check alignment of doors with body panels", category: "Exterior", categoryCode: "EXT", subsection: "Body Panels", order: 9, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-01-10", name: "Check alignment of bonnet with fenders", category: "Exterior", categoryCode: "EXT", subsection: "Body Panels", order: 10, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-01-11", name: "Check alignment of boot lid with rear panels", category: "Exterior", categoryCode: "EXT", subsection: "Body Panels", order: 11, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-01-12", name: "Check for adhesive residue or protective film marks", category: "Exterior", categoryCode: "EXT", subsection: "Body Panels", order: 12, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
      {
        name: "Doors / Bonnet / Boot",
        category: "Exterior",
        items: [
          { id: "EXT-02-01", name: "Check door opening and closing operation", category: "Exterior", categoryCode: "EXT", subsection: "Doors / Bonnet / Boot", order: 13, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-02-02", name: "Check bonnet opening and closing operation", category: "Exterior", categoryCode: "EXT", subsection: "Doors / Bonnet / Boot", order: 14, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-02-03", name: "Check boot opening and closing operation", category: "Exterior", categoryCode: "EXT", subsection: "Doors / Bonnet / Boot", order: 15, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-02-04", name: "Check door alignment with body panels", category: "Exterior", categoryCode: "EXT", subsection: "Doors / Bonnet / Boot", order: 16, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-02-05", name: "Check bonnet alignment with fenders", category: "Exterior", categoryCode: "EXT", subsection: "Doors / Bonnet / Boot", order: 17, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-02-06", name: "Check boot lid alignment with rear panels", category: "Exterior", categoryCode: "EXT", subsection: "Doors / Bonnet / Boot", order: 18, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-02-07", name: "Check door hinges for noise or stiffness", category: "Exterior", categoryCode: "EXT", subsection: "Doors / Bonnet / Boot", order: 19, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-02-08", name: "Check door locking and unlocking operation", category: "Exterior", categoryCode: "EXT", subsection: "Doors / Bonnet / Boot", order: 20, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-02-09", name: "Check bonnet stay or gas strut operation", category: "Exterior", categoryCode: "EXT", subsection: "Doors / Bonnet / Boot", order: 21, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-02-10", name: "Check boot gas strut or support rod operation", category: "Exterior", categoryCode: "EXT", subsection: "Doors / Bonnet / Boot", order: 22, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-02-11", name: "Check weather seals on doors, bonnet, and boot", category: "Exterior", categoryCode: "EXT", subsection: "Doors / Bonnet / Boot", order: 23, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
      {
        name: "Glass & Mirrors",
        category: "Exterior",
        items: [
          { id: "EXT-03-01", name: "Check windshield for cracks or chips", category: "Exterior", categoryCode: "EXT", subsection: "Glass & Mirrors", order: 24, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-03-02", name: "Check windshield for scratches or distortions", category: "Exterior", categoryCode: "EXT", subsection: "Glass & Mirrors", order: 25, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-03-03", name: "Check front side windows for cracks or chips", category: "Exterior", categoryCode: "EXT", subsection: "Glass & Mirrors", order: 26, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-03-04", name: "Check rear side windows for cracks or chips", category: "Exterior", categoryCode: "EXT", subsection: "Glass & Mirrors", order: 27, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-03-05", name: "Check rear windshield for cracks or defogger line damage", category: "Exterior", categoryCode: "EXT", subsection: "Glass & Mirrors", order: 28, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-03-06", name: "Check operation of power windows", category: "Exterior", categoryCode: "EXT", subsection: "Glass & Mirrors", order: 29, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-03-07", name: "Check exterior mirrors for cracks or damage", category: "Exterior", categoryCode: "EXT", subsection: "Glass & Mirrors", order: 30, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-03-08", name: "Check mirror adjustment controls", category: "Exterior", categoryCode: "EXT", subsection: "Glass & Mirrors", order: 31, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-03-09", name: "Check mirror folding mechanism", category: "Exterior", categoryCode: "EXT", subsection: "Glass & Mirrors", order: 32, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-03-10", name: "Check glass seals and beading condition", category: "Exterior", categoryCode: "EXT", subsection: "Glass & Mirrors", order: 33, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-03-11", name: "Check for tint film bubbles or peeling", category: "Exterior", categoryCode: "EXT", subsection: "Glass & Mirrors", order: 34, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
      {
        name: "Lights & Indicators",
        category: "Exterior",
        items: [
          { id: "EXT-04-01", name: "Check headlamp lenses for cracks or damage", category: "Exterior", categoryCode: "EXT", subsection: "Lights & Indicators", order: 35, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-04-02", name: "Check headlamp illumination (low beam)", category: "Exterior", categoryCode: "EXT", subsection: "Lights & Indicators", order: 36, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-04-03", name: "Check headlamp illumination (high beam)", category: "Exterior", categoryCode: "EXT", subsection: "Lights & Indicators", order: 37, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-04-04", name: "Check headlamp alignment", category: "Exterior", categoryCode: "EXT", subsection: "Lights & Indicators", order: 38, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-04-05", name: "Check daytime running lights operation", category: "Exterior", categoryCode: "EXT", subsection: "Lights & Indicators", order: 39, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-04-06", name: "Check front turn indicators operation", category: "Exterior", categoryCode: "EXT", subsection: "Lights & Indicators", order: 40, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-04-07", name: "Check rear turn indicators operation", category: "Exterior", categoryCode: "EXT", subsection: "Lights & Indicators", order: 41, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-04-08", name: "Check tail lamps for cracks or moisture", category: "Exterior", categoryCode: "EXT", subsection: "Lights & Indicators", order: 42, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-04-09", name: "Check brake light operation", category: "Exterior", categoryCode: "EXT", subsection: "Lights & Indicators", order: 43, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-04-10", name: "Check reverse light operation", category: "Exterior", categoryCode: "EXT", subsection: "Lights & Indicators", order: 44, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-04-11", name: "Check hazard lights operation", category: "Exterior", categoryCode: "EXT", subsection: "Lights & Indicators", order: 45, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
      {
        name: "Paint & Finish",
        category: "Exterior",
        items: [
          { id: "EXT-05-01", name: "Check for paint scratches", category: "Exterior", categoryCode: "EXT", subsection: "Paint & Finish", order: 46, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-05-02", name: "Check for paint swirl marks", category: "Exterior", categoryCode: "EXT", subsection: "Paint & Finish", order: 47, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-05-03", name: "Check for paint chips on panels", category: "Exterior", categoryCode: "EXT", subsection: "Paint & Finish", order: 48, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-05-04", name: "Check for uneven paint finish or orange peel effect", category: "Exterior", categoryCode: "EXT", subsection: "Paint & Finish", order: 49, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-05-05", name: "Check for paint color consistency across panels", category: "Exterior", categoryCode: "EXT", subsection: "Paint & Finish", order: 50, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-05-06", name: "Check for clear coat peeling or defects", category: "Exterior", categoryCode: "EXT", subsection: "Paint & Finish", order: 51, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-05-07", name: "Check for overspray on trims or glass", category: "Exterior", categoryCode: "EXT", subsection: "Paint & Finish", order: 52, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-05-08", name: "Check for polish residue in panel gaps", category: "Exterior", categoryCode: "EXT", subsection: "Paint & Finish", order: 53, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-05-09", name: "Check for stains or water spots on paint surface", category: "Exterior", categoryCode: "EXT", subsection: "Paint & Finish", order: 54, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-05-10", name: "Check paint finish under direct light for imperfections", category: "Exterior", categoryCode: "EXT", subsection: "Paint & Finish", order: 55, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-05-11", name: "Check for protective coating or wax application consistency", category: "Exterior", categoryCode: "EXT", subsection: "Paint & Finish", order: 56, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
      {
        name: "Rust & Corrosion",
        category: "Exterior",
        items: [
          { id: "EXT-06-01", name: "Check for rust on visible body panels", category: "Exterior", categoryCode: "EXT", subsection: "Rust & Corrosion", order: 57, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-06-02", name: "Check for corrosion on door edges and seams", category: "Exterior", categoryCode: "EXT", subsection: "Rust & Corrosion", order: 58, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-06-03", name: "Check for rust on bonnet edges", category: "Exterior", categoryCode: "EXT", subsection: "Rust & Corrosion", order: 59, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-06-04", name: "Check for rust on boot lid edges", category: "Exterior", categoryCode: "EXT", subsection: "Rust & Corrosion", order: 60, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-06-05", name: "Check for corrosion around windshield edges", category: "Exterior", categoryCode: "EXT", subsection: "Rust & Corrosion", order: 61, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-06-06", name: "Check for corrosion around rear glass edges", category: "Exterior", categoryCode: "EXT", subsection: "Rust & Corrosion", order: 62, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-06-07", name: "Check for rust on wheel arches", category: "Exterior", categoryCode: "EXT", subsection: "Rust & Corrosion", order: 63, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-06-08", name: "Check for corrosion on under-door sill areas", category: "Exterior", categoryCode: "EXT", subsection: "Rust & Corrosion", order: 64, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-06-09", name: "Check for rust on fuel filler area", category: "Exterior", categoryCode: "EXT", subsection: "Rust & Corrosion", order: 65, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-06-10", name: "Check for signs of rust repair or cover-up", category: "Exterior", categoryCode: "EXT", subsection: "Rust & Corrosion", order: 66, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "EXT-06-11", name: "Check for corrosion on exposed metal fasteners", category: "Exterior", categoryCode: "EXT", subsection: "Rust & Corrosion", order: 67, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
    ]
  },
  {
    code: "INT",
    name: "Interior",
    shortLabel: "INT",
    totalItems: 71,
    subsections: [
      {
        name: "Air Conditioning & HVAC",
        category: "Interior",
        items: [
          { id: "INT-01-01", name: "Check air conditioner cooling performance", category: "Interior", categoryCode: "INT", subsection: "Air Conditioning & HVAC", order: 68, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-01-02", name: "Check heater operation and warm air output", category: "Interior", categoryCode: "INT", subsection: "Air Conditioning & HVAC", order: 69, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-01-03", name: "Check blower fan operation at all speed levels", category: "Interior", categoryCode: "INT", subsection: "Air Conditioning & HVAC", order: 70, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-01-04", name: "Check air flow direction control operation", category: "Interior", categoryCode: "INT", subsection: "Air Conditioning & HVAC", order: 71, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-01-05", name: "Check temperature control response", category: "Interior", categoryCode: "INT", subsection: "Air Conditioning & HVAC", order: 72, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-01-06", name: "Check AC compressor noise during operation", category: "Interior", categoryCode: "INT", subsection: "Air Conditioning & HVAC", order: 73, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-01-07", name: "Check automatic climate control function (if equipped)", category: "Interior", categoryCode: "INT", subsection: "Air Conditioning & HVAC", order: 74, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-01-08", name: "Check rear AC vents air flow (if equipped)", category: "Interior", categoryCode: "INT", subsection: "Air Conditioning & HVAC", order: 75, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-01-09", name: "Check cabin air filter condition", category: "Interior", categoryCode: "INT", subsection: "Air Conditioning & HVAC", order: 76, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-01-10", name: "Check for unusual odor from HVAC system", category: "Interior", categoryCode: "INT", subsection: "Air Conditioning & HVAC", order: 77, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-01-11", name: "Check defogger air flow from front vents", category: "Interior", categoryCode: "INT", subsection: "Air Conditioning & HVAC", order: 78, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
      {
        name: "Cabin Cleanliness & Odour",
        category: "Interior",
        items: [
          { id: "INT-02-01", name: "Check cabin for overall cleanliness", category: "Interior", categoryCode: "INT", subsection: "Cabin Cleanliness & Odour", order: 79, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-02-02", name: "Check seats and upholstery for dust or stains", category: "Interior", categoryCode: "INT", subsection: "Cabin Cleanliness & Odour", order: 80, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-02-03", name: "Check floor mats and carpeting cleanliness", category: "Interior", categoryCode: "INT", subsection: "Cabin Cleanliness & Odour", order: 81, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-02-04", name: "Check dashboard and trims for dust or smudges", category: "Interior", categoryCode: "INT", subsection: "Cabin Cleanliness & Odour", order: 82, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-02-05", name: "Check for unpleasant odour inside cabin", category: "Interior", categoryCode: "INT", subsection: "Cabin Cleanliness & Odour", order: 83, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
      {
        name: "Dashboard & Trims",
        category: "Interior",
        items: [
          { id: "INT-03-01", name: "Check dashboard surface for scratches or cracks", category: "Interior", categoryCode: "INT", subsection: "Dashboard & Trims", order: 84, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-03-02", name: "Check dashboard fitment and panel gaps", category: "Interior", categoryCode: "INT", subsection: "Dashboard & Trims", order: 85, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-03-03", name: "Check dashboard color and finish consistency", category: "Interior", categoryCode: "INT", subsection: "Dashboard & Trims", order: 86, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-03-04", name: "Check center console for damage or looseness", category: "Interior", categoryCode: "INT", subsection: "Dashboard & Trims", order: 87, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-03-05", name: "Check interior trim panels for scratches or marks", category: "Interior", categoryCode: "INT", subsection: "Dashboard & Trims", order: 88, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-03-06", name: "Check glove box opening, closing, and latch operation", category: "Interior", categoryCode: "INT", subsection: "Dashboard & Trims", order: 89, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-03-07", name: "Check air vent condition and adjustment operation", category: "Interior", categoryCode: "INT", subsection: "Dashboard & Trims", order: 90, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-03-08", name: "Check trim rattling or abnormal noise while stationary", category: "Interior", categoryCode: "INT", subsection: "Dashboard & Trims", order: 91, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-03-09", name: "Check dashboard warning lights illumination at ignition", category: "Interior", categoryCode: "INT", subsection: "Dashboard & Trims", order: 92, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-03-10", name: "Check steering column trim fitment", category: "Interior", categoryCode: "INT", subsection: "Dashboard & Trims", order: 93, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-03-11", name: "Check interior trims for signs of prior removal", category: "Interior", categoryCode: "INT", subsection: "Dashboard & Trims", order: 94, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
      {
        name: "Interior Lighting",
        category: "Interior",
        items: [
          { id: "INT-04-01", name: "Check cabin dome light operation", category: "Interior", categoryCode: "INT", subsection: "Interior Lighting", order: 95, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-04-02", name: "Check front map reading lights operation", category: "Interior", categoryCode: "INT", subsection: "Interior Lighting", order: 96, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-04-03", name: "Check rear cabin light operation", category: "Interior", categoryCode: "INT", subsection: "Interior Lighting", order: 97, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-04-04", name: "Check dashboard backlight illumination", category: "Interior", categoryCode: "INT", subsection: "Interior Lighting", order: 98, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-04-05", name: "Check instrument cluster illumination consistency", category: "Interior", categoryCode: "INT", subsection: "Interior Lighting", order: 99, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-04-06", name: "Check steering wheel control backlight illumination", category: "Interior", categoryCode: "INT", subsection: "Interior Lighting", order: 100, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-04-07", name: "Check center console illumination", category: "Interior", categoryCode: "INT", subsection: "Interior Lighting", order: 101, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-04-08", name: "Check footwell lighting operation (if equipped)", category: "Interior", categoryCode: "INT", subsection: "Interior Lighting", order: 102, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-04-09", name: "Check glove box light operation", category: "Interior", categoryCode: "INT", subsection: "Interior Lighting", order: 103, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-04-10", name: "Check boot interior light operation", category: "Interior", categoryCode: "INT", subsection: "Interior Lighting", order: 104, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-04-11", name: "Check interior lighting auto-off function", category: "Interior", categoryCode: "INT", subsection: "Interior Lighting", order: 105, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
      {
        name: "Seat Belts & Safety",
        category: "Interior",
        items: [
          { id: "INT-05-01", name: "Check driver seat belt condition for cuts or fraying", category: "Interior", categoryCode: "INT", subsection: "Seat Belts & Safety", order: 106, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-05-02", name: "Check front passenger seat belt condition for cuts or fraying", category: "Interior", categoryCode: "INT", subsection: "Seat Belts & Safety", order: 107, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-05-03", name: "Check rear seat belts condition for cuts or fraying", category: "Interior", categoryCode: "INT", subsection: "Seat Belts & Safety", order: 108, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-05-04", name: "Check driver seat belt retraction operation", category: "Interior", categoryCode: "INT", subsection: "Seat Belts & Safety", order: 109, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-05-05", name: "Check front passenger seat belt retraction operation", category: "Interior", categoryCode: "INT", subsection: "Seat Belts & Safety", order: 110, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-05-06", name: "Check rear seat belt retraction operation", category: "Interior", categoryCode: "INT", subsection: "Seat Belts & Safety", order: 111, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-05-07", name: "Check seat belt buckle locking and release function", category: "Interior", categoryCode: "INT", subsection: "Seat Belts & Safety", order: 112, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-05-08", name: "Check seat belt height adjuster operation (if equipped)", category: "Interior", categoryCode: "INT", subsection: "Seat Belts & Safety", order: 113, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-05-09", name: "Check seat belt warning indicator operation", category: "Interior", categoryCode: "INT", subsection: "Seat Belts & Safety", order: 114, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-05-10", name: "Check child seat anchor points condition", category: "Interior", categoryCode: "INT", subsection: "Seat Belts & Safety", order: 115, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-05-11", name: "Check airbag warning light status on ignition", category: "Interior", categoryCode: "INT", subsection: "Seat Belts & Safety", order: 116, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
      {
        name: "Seats & Upholstery",
        category: "Interior",
        items: [
          { id: "INT-06-01", name: "Check driver seat upholstery for tears or damage", category: "Interior", categoryCode: "INT", subsection: "Seats & Upholstery", order: 117, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-06-02", name: "Check front passenger seat upholstery for tears or damage", category: "Interior", categoryCode: "INT", subsection: "Seats & Upholstery", order: 118, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-06-03", name: "Check rear seat upholstery for tears or damage", category: "Interior", categoryCode: "INT", subsection: "Seats & Upholstery", order: 119, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-06-04", name: "Check seat fabric or leather for stains or discoloration", category: "Interior", categoryCode: "INT", subsection: "Seats & Upholstery", order: 120, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-06-05", name: "Check seat cushioning firmness and shape", category: "Interior", categoryCode: "INT", subsection: "Seats & Upholstery", order: 121, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-06-06", name: "Check driver seat adjustment controls operation", category: "Interior", categoryCode: "INT", subsection: "Seats & Upholstery", order: 122, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-06-07", name: "Check front passenger seat adjustment controls operation", category: "Interior", categoryCode: "INT", subsection: "Seats & Upholstery", order: 123, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-06-08", name: "Check rear seat folding mechanism operation", category: "Interior", categoryCode: "INT", subsection: "Seats & Upholstery", order: 124, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-06-09", name: "Check seat rails for smooth movement and noise", category: "Interior", categoryCode: "INT", subsection: "Seats & Upholstery", order: 125, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-06-10", name: "Check headrests condition and adjustment", category: "Interior", categoryCode: "INT", subsection: "Seats & Upholstery", order: 126, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-06-11", name: "Check seat covers fitted correctly (if applicable)", category: "Interior", categoryCode: "INT", subsection: "Seats & Upholstery", order: 127, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
      {
        name: "Steering & Controls",
        category: "Interior",
        items: [
          { id: "INT-07-01", name: "Check steering wheel surface for wear or damage", category: "Interior", categoryCode: "INT", subsection: "Steering & Controls", order: 128, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-07-02", name: "Check steering wheel alignment (center position)", category: "Interior", categoryCode: "INT", subsection: "Steering & Controls", order: 129, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-07-03", name: "Check steering wheel tilt and telescopic adjustment operation", category: "Interior", categoryCode: "INT", subsection: "Steering & Controls", order: 130, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-07-04", name: "Check steering for abnormal free play", category: "Interior", categoryCode: "INT", subsection: "Steering & Controls", order: 131, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-07-05", name: "Check horn operation", category: "Interior", categoryCode: "INT", subsection: "Steering & Controls", order: 132, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-07-06", name: "Check steering-mounted audio controls operation", category: "Interior", categoryCode: "INT", subsection: "Steering & Controls", order: 133, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-07-07", name: "Check steering-mounted phone controls operation", category: "Interior", categoryCode: "INT", subsection: "Steering & Controls", order: 134, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-07-08", name: "Check indicator stalk operation and return action", category: "Interior", categoryCode: "INT", subsection: "Steering & Controls", order: 135, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-07-09", name: "Check wiper stalk operation", category: "Interior", categoryCode: "INT", subsection: "Steering & Controls", order: 136, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-07-10", name: "Check cruise control switches operation (if equipped)", category: "Interior", categoryCode: "INT", subsection: "Steering & Controls", order: 137, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "INT-07-11", name: "Check steering column for abnormal noise during rotation", category: "Interior", categoryCode: "INT", subsection: "Steering & Controls", order: 138, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
    ]
  },
  {
    code: "ELEC",
    name: "Electronics",
    shortLabel: "ELEC",
    totalItems: 66,
    subsections: [
      {
        name: "Battery & Electrical Health",
        category: "Electronics",
        items: [
          { id: "ELEC-01-01", name: "Check battery manufacturing date", category: "Electronics", categoryCode: "ELEC", subsection: "Battery & Electrical Health", order: 139, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-01-02", name: "Check battery terminals for corrosion", category: "Electronics", categoryCode: "ELEC", subsection: "Battery & Electrical Health", order: 140, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-01-03", name: "Check battery terminal tightness", category: "Electronics", categoryCode: "ELEC", subsection: "Battery & Electrical Health", order: 141, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-01-04", name: "Check battery voltage at rest", category: "Electronics", categoryCode: "ELEC", subsection: "Battery & Electrical Health", order: 142, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-01-05", name: "Check battery voltage during engine start", category: "Electronics", categoryCode: "ELEC", subsection: "Battery & Electrical Health", order: 143, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-01-06", name: "Check alternator charging voltage", category: "Electronics", categoryCode: "ELEC", subsection: "Battery & Electrical Health", order: 144, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-01-07", name: "Check battery warning light status", category: "Electronics", categoryCode: "ELEC", subsection: "Battery & Electrical Health", order: 145, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-01-08", name: "Check visible wiring for damage or looseness", category: "Electronics", categoryCode: "ELEC", subsection: "Battery & Electrical Health", order: 146, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-01-09", name: "Check main fuse box cover and condition", category: "Electronics", categoryCode: "ELEC", subsection: "Battery & Electrical Health", order: 147, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-01-10", name: "Check spare fuse availability", category: "Electronics", categoryCode: "ELEC", subsection: "Battery & Electrical Health", order: 148, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-01-11", name: "Check electrical system for abnormal fluctuation", category: "Electronics", categoryCode: "ELEC", subsection: "Battery & Electrical Health", order: 149, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
      {
        name: "Electrical Controls & Switches",
        category: "Electronics",
        items: [
          { id: "ELEC-02-01", name: "Check headlamp switch operation", category: "Electronics", categoryCode: "ELEC", subsection: "Electrical Controls & Switches", order: 150, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-02-02", name: "Check indicator switch operation", category: "Electronics", categoryCode: "ELEC", subsection: "Electrical Controls & Switches", order: 151, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-02-03", name: "Check hazard light switch operation", category: "Electronics", categoryCode: "ELEC", subsection: "Electrical Controls & Switches", order: 152, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-02-04", name: "Check wiper and washer switch operation", category: "Electronics", categoryCode: "ELEC", subsection: "Electrical Controls & Switches", order: 153, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-02-05", name: "Check rear defogger switch operation", category: "Electronics", categoryCode: "ELEC", subsection: "Electrical Controls & Switches", order: 154, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-02-06", name: "Check power mirror adjustment switch", category: "Electronics", categoryCode: "ELEC", subsection: "Electrical Controls & Switches", order: 155, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-02-07", name: "Check power mirror folding switch (if equipped)", category: "Electronics", categoryCode: "ELEC", subsection: "Electrical Controls & Switches", order: 156, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-02-08", name: "Check engine start/stop button operation (if equipped)", category: "Electronics", categoryCode: "ELEC", subsection: "Electrical Controls & Switches", order: 157, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-02-09", name: "Check interior illumination dimmer control", category: "Electronics", categoryCode: "ELEC", subsection: "Electrical Controls & Switches", order: 158, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-02-10", name: "Check traction control or drive mode switch operation", category: "Electronics", categoryCode: "ELEC", subsection: "Electrical Controls & Switches", order: 159, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-02-11", name: "Check all dashboard switches for proper tactile feedback", category: "Electronics", categoryCode: "ELEC", subsection: "Electrical Controls & Switches", order: 160, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
      {
        name: "Infotainment System",
        category: "Electronics",
        items: [
          { id: "ELEC-03-01", name: "Check infotainment system powers on", category: "Electronics", categoryCode: "ELEC", subsection: "Infotainment System", order: 161, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-03-02", name: "Check touchscreen responsiveness", category: "Electronics", categoryCode: "ELEC", subsection: "Infotainment System", order: 162, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-03-03", name: "Check display clarity and brightness", category: "Electronics", categoryCode: "ELEC", subsection: "Infotainment System", order: 163, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-03-04", name: "Check audio output from all speakers", category: "Electronics", categoryCode: "ELEC", subsection: "Infotainment System", order: 164, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-03-05", name: "Check volume control operation", category: "Electronics", categoryCode: "ELEC", subsection: "Infotainment System", order: 165, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-03-06", name: "Check radio FM/AM reception", category: "Electronics", categoryCode: "ELEC", subsection: "Infotainment System", order: 166, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-03-07", name: "Check Bluetooth pairing and audio streaming", category: "Electronics", categoryCode: "ELEC", subsection: "Infotainment System", order: 167, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-03-08", name: "Check USB media playback", category: "Electronics", categoryCode: "ELEC", subsection: "Infotainment System", order: 168, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-03-09", name: "Check Apple CarPlay / Android Auto operation (if equipped)", category: "Electronics", categoryCode: "ELEC", subsection: "Infotainment System", order: 169, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-03-10", name: "Check steering-mounted infotainment controls", category: "Electronics", categoryCode: "ELEC", subsection: "Infotainment System", order: 170, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-03-11", name: "Check system response time and lag", category: "Electronics", categoryCode: "ELEC", subsection: "Infotainment System", order: 171, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
      {
        name: "Instrument Cluster",
        category: "Electronics",
        items: [
          { id: "ELEC-04-01", name: "Check instrument cluster powers on during ignition", category: "Electronics", categoryCode: "ELEC", subsection: "Instrument Cluster", order: 172, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-04-02", name: "Check speedometer operation", category: "Electronics", categoryCode: "ELEC", subsection: "Instrument Cluster", order: 173, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-04-03", name: "Check tachometer operation", category: "Electronics", categoryCode: "ELEC", subsection: "Instrument Cluster", order: 174, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-04-04", name: "Check fuel gauge accuracy", category: "Electronics", categoryCode: "ELEC", subsection: "Instrument Cluster", order: 175, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-04-05", name: "Check engine temperature gauge operation", category: "Electronics", categoryCode: "ELEC", subsection: "Instrument Cluster", order: 176, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-04-06", name: "Check odometer reading visibility", category: "Electronics", categoryCode: "ELEC", subsection: "Instrument Cluster", order: 177, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-04-07", name: "Check trip meter reset and operation", category: "Electronics", categoryCode: "ELEC", subsection: "Instrument Cluster", order: 178, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-04-08", name: "Check warning lights illuminate during self-test", category: "Electronics", categoryCode: "ELEC", subsection: "Instrument Cluster", order: 179, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-04-09", name: "Check warning lights turn off after engine start", category: "Electronics", categoryCode: "ELEC", subsection: "Instrument Cluster", order: 180, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-04-10", name: "Check instrument cluster backlight brightness control", category: "Electronics", categoryCode: "ELEC", subsection: "Instrument Cluster", order: 181, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-04-11", name: "Check digital display clarity and pixel condition", category: "Electronics", categoryCode: "ELEC", subsection: "Instrument Cluster", order: 182, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
      {
        name: "Power Windows & Locks",
        category: "Electronics",
        items: [
          { id: "ELEC-05-01", name: "Check driver side power window operation", category: "Electronics", categoryCode: "ELEC", subsection: "Power Windows & Locks", order: 183, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-05-02", name: "Check front passenger power window operation", category: "Electronics", categoryCode: "ELEC", subsection: "Power Windows & Locks", order: 184, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-05-03", name: "Check rear left power window operation", category: "Electronics", categoryCode: "ELEC", subsection: "Power Windows & Locks", order: 185, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-05-04", name: "Check rear right power window operation", category: "Electronics", categoryCode: "ELEC", subsection: "Power Windows & Locks", order: 186, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-05-05", name: "Check one-touch up/down function (if equipped)", category: "Electronics", categoryCode: "ELEC", subsection: "Power Windows & Locks", order: 187, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-05-06", name: "Check power window switches illumination", category: "Electronics", categoryCode: "ELEC", subsection: "Power Windows & Locks", order: 188, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-05-07", name: "Check central locking operation from key fob", category: "Electronics", categoryCode: "ELEC", subsection: "Power Windows & Locks", order: 189, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-05-08", name: "Check central locking operation from door switch", category: "Electronics", categoryCode: "ELEC", subsection: "Power Windows & Locks", order: 190, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-05-09", name: "Check child lock function on rear doors", category: "Electronics", categoryCode: "ELEC", subsection: "Power Windows & Locks", order: 191, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-05-10", name: "Check power door lock actuators noise", category: "Electronics", categoryCode: "ELEC", subsection: "Power Windows & Locks", order: 192, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-05-11", name: "Check auto-lock function while driving (if equipped)", category: "Electronics", categoryCode: "ELEC", subsection: "Power Windows & Locks", order: 193, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
      {
        name: "Warning Lights & Sensors",
        category: "Electronics",
        items: [
          { id: "ELEC-06-01", name: "Check engine malfunction warning light status", category: "Electronics", categoryCode: "ELEC", subsection: "Warning Lights & Sensors", order: 194, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-06-02", name: "Check ABS warning light status", category: "Electronics", categoryCode: "ELEC", subsection: "Warning Lights & Sensors", order: 195, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-06-03", name: "Check airbag warning light status", category: "Electronics", categoryCode: "ELEC", subsection: "Warning Lights & Sensors", order: 196, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-06-04", name: "Check brake system warning light status", category: "Electronics", categoryCode: "ELEC", subsection: "Warning Lights & Sensors", order: 197, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-06-05", name: "Check battery charging warning light status", category: "Electronics", categoryCode: "ELEC", subsection: "Warning Lights & Sensors", order: 198, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-06-06", name: "Check engine oil pressure warning light status", category: "Electronics", categoryCode: "ELEC", subsection: "Warning Lights & Sensors", order: 199, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-06-07", name: "Check seat belt warning indicator operation", category: "Electronics", categoryCode: "ELEC", subsection: "Warning Lights & Sensors", order: 200, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-06-08", name: "Check parking sensor warning indication", category: "Electronics", categoryCode: "ELEC", subsection: "Warning Lights & Sensors", order: 201, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-06-09", name: "Check TPMS warning light status", category: "Electronics", categoryCode: "ELEC", subsection: "Warning Lights & Sensors", order: 202, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-06-10", name: "Check door open warning indicator", category: "Electronics", categoryCode: "ELEC", subsection: "Warning Lights & Sensors", order: 203, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ELEC-06-11", name: "Check all warning lights self-test during ignition", category: "Electronics", categoryCode: "ELEC", subsection: "Warning Lights & Sensors", order: 204, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
    ]
  },
  {
    code: "ENG",
    name: "Engine Bay",
    shortLabel: "ENG",
    totalItems: 42,
    subsections: [
      {
        name: "Belts, Hoses & Mounts",
        category: "Engine Bay",
        items: [
          { id: "ENG-01-01", name: "Check drive belts for cracks or fraying", category: "Engine Bay", categoryCode: "ENG", subsection: "Belts, Hoses & Mounts", order: 205, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-01-02", name: "Check belt tension and alignment", category: "Engine Bay", categoryCode: "ENG", subsection: "Belts, Hoses & Mounts", order: 206, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-01-03", name: "Check coolant hoses for cracks or swelling", category: "Engine Bay", categoryCode: "ENG", subsection: "Belts, Hoses & Mounts", order: 207, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-01-04", name: "Check hoses for leaks at joints and clamps", category: "Engine Bay", categoryCode: "ENG", subsection: "Belts, Hoses & Mounts", order: 208, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-01-05", name: "Check engine mounts for visible damage or cracks", category: "Engine Bay", categoryCode: "ENG", subsection: "Belts, Hoses & Mounts", order: 209, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-01-06", name: "Check engine mounts for excessive movement", category: "Engine Bay", categoryCode: "ENG", subsection: "Belts, Hoses & Mounts", order: 210, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
      {
        name: "Cooling System",
        category: "Engine Bay",
        items: [
          { id: "ENG-02-01", name: "Check radiator for visible damage or leaks", category: "Engine Bay", categoryCode: "ENG", subsection: "Cooling System", order: 211, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-02-02", name: "Check coolant level in radiator", category: "Engine Bay", categoryCode: "ENG", subsection: "Cooling System", order: 212, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-02-03", name: "Check coolant reservoir condition and level", category: "Engine Bay", categoryCode: "ENG", subsection: "Cooling System", order: 213, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-02-04", name: "Check radiator hoses for cracks or swelling", category: "Engine Bay", categoryCode: "ENG", subsection: "Cooling System", order: 214, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-02-05", name: "Check cooling fan operation", category: "Engine Bay", categoryCode: "ENG", subsection: "Cooling System", order: 215, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-02-06", name: "Check radiator cap condition and fitment", category: "Engine Bay", categoryCode: "ENG", subsection: "Cooling System", order: 216, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-02-07", name: "Check for coolant stains or residue in engine bay", category: "Engine Bay", categoryCode: "ENG", subsection: "Cooling System", order: 217, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
      {
        name: "Engine Bay Wiring & Components",
        category: "Engine Bay",
        items: [
          { id: "ENG-03-01", name: "Check wiring harness for cuts or exposed wires", category: "Engine Bay", categoryCode: "ENG", subsection: "Engine Bay Wiring & Components", order: 218, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-03-02", name: "Check wiring connectors for secure fitment", category: "Engine Bay", categoryCode: "ENG", subsection: "Engine Bay Wiring & Components", order: 219, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-03-03", name: "Check fuse box wiring for damage or overheating marks", category: "Engine Bay", categoryCode: "ENG", subsection: "Engine Bay Wiring & Components", order: 220, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-03-04", name: "Check battery cables for wear or cracks", category: "Engine Bay", categoryCode: "ENG", subsection: "Engine Bay Wiring & Components", order: 221, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-03-05", name: "Check grounding points for tightness and corrosion", category: "Engine Bay", categoryCode: "ENG", subsection: "Engine Bay Wiring & Components", order: 222, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-03-06", name: "Check sensor wiring for damage or loose routing", category: "Engine Bay", categoryCode: "ENG", subsection: "Engine Bay Wiring & Components", order: 223, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-03-07", name: "Check relays and connectors seating", category: "Engine Bay", categoryCode: "ENG", subsection: "Engine Bay Wiring & Components", order: 224, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-03-08", name: "Check for signs of rodent damage on wiring", category: "Engine Bay", categoryCode: "ENG", subsection: "Engine Bay Wiring & Components", order: 225, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
      {
        name: "Engine Condition (Visual)",
        category: "Engine Bay",
        items: [
          { id: "ENG-04-01", name: "Check engine bay for oil leaks", category: "Engine Bay", categoryCode: "ENG", subsection: "Engine Condition (Visual)", order: 226, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-04-02", name: "Check engine bay for coolant leaks", category: "Engine Bay", categoryCode: "ENG", subsection: "Engine Condition (Visual)", order: 227, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-04-03", name: "Check engine block and head for visible damage", category: "Engine Bay", categoryCode: "ENG", subsection: "Engine Condition (Visual)", order: 228, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-04-04", name: "Check belts for cracks or wear", category: "Engine Bay", categoryCode: "ENG", subsection: "Engine Condition (Visual)", order: 229, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-04-05", name: "Check hoses for cracks, swelling, or leaks", category: "Engine Bay", categoryCode: "ENG", subsection: "Engine Condition (Visual)", order: 230, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-04-06", name: "Check wiring harness for damage or loose connections", category: "Engine Bay", categoryCode: "ENG", subsection: "Engine Condition (Visual)", order: 231, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-04-07", name: "Check engine mounting bolts for looseness", category: "Engine Bay", categoryCode: "ENG", subsection: "Engine Condition (Visual)", order: 232, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-04-08", name: "Check fluid caps secured properly", category: "Engine Bay", categoryCode: "ENG", subsection: "Engine Condition (Visual)", order: 233, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-04-09", name: "Check engine bay cleanliness", category: "Engine Bay", categoryCode: "ENG", subsection: "Engine Condition (Visual)", order: 234, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-04-10", name: "Check for abnormal rust or corrosion in engine bay", category: "Engine Bay", categoryCode: "ENG", subsection: "Engine Condition (Visual)", order: 235, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-04-11", name: "Check for aftermarket modifications in engine bay", category: "Engine Bay", categoryCode: "ENG", subsection: "Engine Condition (Visual)", order: 236, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
      {
        name: "Fluids & Levels",
        category: "Engine Bay",
        items: [
          { id: "ENG-05-01", name: "Check engine oil level", category: "Engine Bay", categoryCode: "ENG", subsection: "Fluids & Levels", order: 237, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-05-02", name: "Check coolant level in reservoir", category: "Engine Bay", categoryCode: "ENG", subsection: "Fluids & Levels", order: 238, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-05-03", name: "Check brake fluid level", category: "Engine Bay", categoryCode: "ENG", subsection: "Fluids & Levels", order: 239, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-05-04", name: "Check windshield washer fluid level", category: "Engine Bay", categoryCode: "ENG", subsection: "Fluids & Levels", order: 240, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-05-05", name: "Check power steering fluid level (if applicable)", category: "Engine Bay", categoryCode: "ENG", subsection: "Fluids & Levels", order: 241, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
      {
        name: "Leaks & Seepage",
        category: "Engine Bay",
        items: [
          { id: "ENG-06-01", name: "Check engine oil leakage under engine", category: "Engine Bay", categoryCode: "ENG", subsection: "Leaks & Seepage", order: 242, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-06-02", name: "Check coolant leakage around hoses and radiator", category: "Engine Bay", categoryCode: "ENG", subsection: "Leaks & Seepage", order: 243, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-06-03", name: "Check brake fluid leakage near master cylinder", category: "Engine Bay", categoryCode: "ENG", subsection: "Leaks & Seepage", order: 244, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-06-04", name: "Check power steering fluid leakage (if applicable)", category: "Engine Bay", categoryCode: "ENG", subsection: "Leaks & Seepage", order: 245, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "ENG-06-05", name: "Check fuel seepage or smell in engine bay", category: "Engine Bay", categoryCode: "ENG", subsection: "Leaks & Seepage", order: 246, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
    ]
  },
  {
    code: "CHS",
    name: "Underbody & Chassis",
    shortLabel: "CHS",
    totalItems: 48,
    subsections: [
      {
        name: "Brake Lines & Components",
        category: "Underbody & Chassis",
        items: [
          { id: "CHS-01-01", name: "Check brake lines for leaks or seepage", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Brake Lines & Components", order: 247, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-01-02", name: "Check brake pipes for rust or corrosion", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Brake Lines & Components", order: 248, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-01-03", name: "Check flexible brake hoses for cracks or swelling", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Brake Lines & Components", order: 249, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-01-04", name: "Check brake hose connections and fittings", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Brake Lines & Components", order: 250, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-01-05", name: "Check brake line routing and securing clips", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Brake Lines & Components", order: 251, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-01-06", name: "Check ABS sensor wiring near brake components", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Brake Lines & Components", order: 252, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-01-07", name: "Check brake calipers for fluid leakage", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Brake Lines & Components", order: 253, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-01-08", name: "Check brake dust shields condition", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Brake Lines & Components", order: 254, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
      {
        name: "Chassis & Frame",
        category: "Underbody & Chassis",
        items: [
          { id: "CHS-02-01", name: "Check chassis frame for bends or deformation", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Chassis & Frame", order: 255, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-02-02", name: "Check chassis for rust or corrosion", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Chassis & Frame", order: 256, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-02-03", name: "Check weld points for cracks or damage", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Chassis & Frame", order: 257, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-02-04", name: "Check underbody for impact or scrape damage", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Chassis & Frame", order: 258, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-02-05", name: "Check mounting points for suspension and arms", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Chassis & Frame", order: 259, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-02-06", name: "Check cross members condition", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Chassis & Frame", order: 260, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-02-07", name: "Check protective underbody coating condition", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Chassis & Frame", order: 261, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-02-08", name: "Check signs of prior repair or welding", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Chassis & Frame", order: 262, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
      {
        name: "Exhaust System",
        category: "Underbody & Chassis",
        items: [
          { id: "CHS-03-01", name: "Check exhaust pipes for dents or damage", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Exhaust System", order: 263, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-03-02", name: "Check exhaust system for rust or corrosion", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Exhaust System", order: 264, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-03-03", name: "Check exhaust joints for leaks", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Exhaust System", order: 265, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-03-04", name: "Check muffler condition and mounting", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Exhaust System", order: 266, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-03-05", name: "Check exhaust hangers and rubber mounts", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Exhaust System", order: 267, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-03-06", name: "Check heat shields for secure fitment", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Exhaust System", order: 268, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-03-07", name: "Check catalytic converter for physical damage", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Exhaust System", order: 269, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-03-08", name: "Check exhaust noise level for abnormal sound", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Exhaust System", order: 270, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
      {
        name: "Fuel Lines & Tank Area",
        category: "Underbody & Chassis",
        items: [
          { id: "CHS-04-01", name: "Check fuel lines for leaks or seepage", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Fuel Lines & Tank Area", order: 271, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-04-02", name: "Check fuel pipes for rust or corrosion", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Fuel Lines & Tank Area", order: 272, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-04-03", name: "Check flexible fuel hoses for cracks or swelling", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Fuel Lines & Tank Area", order: 273, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-04-04", name: "Check fuel line connections and clamps", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Fuel Lines & Tank Area", order: 274, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-04-05", name: "Check fuel tank for dents or physical damage", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Fuel Lines & Tank Area", order: 275, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-04-06", name: "Check fuel tank for rust or corrosion", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Fuel Lines & Tank Area", order: 276, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-04-07", name: "Check fuel tank mounting straps and bolts", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Fuel Lines & Tank Area", order: 277, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-04-08", name: "Check fuel filler neck and hose condition", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Fuel Lines & Tank Area", order: 278, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-04-09", name: "Check fuel vapor lines for damage", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Fuel Lines & Tank Area", order: 279, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-04-10", name: "Check for fuel smell near tank area", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Fuel Lines & Tank Area", order: 280, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
      {
        name: "Suspension Components",
        category: "Underbody & Chassis",
        items: [
          { id: "CHS-05-01", name: "Check front suspension components for damage", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Suspension Components", order: 281, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-05-02", name: "Check rear suspension components for damage", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Suspension Components", order: 282, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-05-03", name: "Check shock absorbers for oil leakage", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Suspension Components", order: 283, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-05-04", name: "Check struts and mounts for cracks or wear", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Suspension Components", order: 284, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-05-05", name: "Check suspension bushes for cracks or deterioration", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Suspension Components", order: 285, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-05-06", name: "Check stabilizer bar and links condition", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Suspension Components", order: 286, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-05-07", name: "Check coil springs for damage or sagging", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Suspension Components", order: 287, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-05-08", name: "Check suspension mounting bolts tightness", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Suspension Components", order: 288, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
      {
        name: "Underbody Protection & Shields",
        category: "Underbody & Chassis",
        items: [
          { id: "CHS-06-01", name: "Check underbody shields for damage or cracks", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Underbody Protection & Shields", order: 289, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-06-02", name: "Check underbody shields for secure mounting", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Underbody Protection & Shields", order: 290, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-06-03", name: "Check splash guards for damage or missing parts", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Underbody Protection & Shields", order: 291, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-06-04", name: "Check engine undertray condition", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Underbody Protection & Shields", order: 292, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-06-05", name: "Check fasteners and clips for underbody covers", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Underbody Protection & Shields", order: 293, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "CHS-06-06", name: "Check underbody panels for signs of impact", category: "Underbody & Chassis", categoryCode: "CHS", subsection: "Underbody Protection & Shields", order: 294, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
    ]
  },
  {
    code: "ROAD",
    name: "Road Test",
    shortLabel: "ROAD",
    totalItems: 14,
    subsections: [
      {
        name: "Braking Performance",
        category: "Road Test",
        items: [
          { id: "ROAD-01-01", name: "Check brake response and stopping effectiveness", category: "Road Test", categoryCode: "ROAD", subsection: "Braking Performance", order: 295, defaultStatus: "PENDING", referenceStatus: "PENDING" },
          { id: "ROAD-01-02", name: "Check braking for vibration or judder", category: "Road Test", categoryCode: "ROAD", subsection: "Braking Performance", order: 296, defaultStatus: "PENDING", referenceStatus: "PENDING" },
        ]
      },
      {
        name: "Engine Performance",
        category: "Road Test",
        items: [
          { id: "ROAD-02-01", name: "Check engine starts promptly without hesitation", category: "Road Test", categoryCode: "ROAD", subsection: "Engine Performance", order: 297, defaultStatus: "PENDING", referenceStatus: "PENDING" },
          { id: "ROAD-02-02", name: "Check engine acceleration response", category: "Road Test", categoryCode: "ROAD", subsection: "Engine Performance", order: 298, defaultStatus: "PENDING", referenceStatus: "PENDING" },
          { id: "ROAD-02-03", name: "Check engine idling stability", category: "Road Test", categoryCode: "ROAD", subsection: "Engine Performance", order: 299, defaultStatus: "PENDING", referenceStatus: "PENDING" },
        ]
      },
      {
        name: "Noise, Vibration & Harshness (NVH)",
        category: "Road Test",
        items: [
          { id: "ROAD-03-01", name: "Check for abnormal engine noise during drive", category: "Road Test", categoryCode: "ROAD", subsection: "Noise, Vibration & Harshness (NVH)", order: 300, defaultStatus: "PENDING", referenceStatus: "PENDING" },
          { id: "ROAD-03-02", name: "Check for abnormal vibration in cabin", category: "Road Test", categoryCode: "ROAD", subsection: "Noise, Vibration & Harshness (NVH)", order: 301, defaultStatus: "PENDING", referenceStatus: "PENDING" },
          { id: "ROAD-03-03", name: "Record any abnormal noise or vibration remarks", category: "Road Test", categoryCode: "ROAD", subsection: "Noise, Vibration & Harshness (NVH)", order: 302, defaultStatus: "PENDING", referenceStatus: "PENDING" },
        ]
      },
      {
        name: "Steering & Handling",
        category: "Road Test",
        items: [
          { id: "ROAD-04-01", name: "Check steering response and straight-line stability", category: "Road Test", categoryCode: "ROAD", subsection: "Steering & Handling", order: 303, defaultStatus: "PENDING", referenceStatus: "PENDING" },
          { id: "ROAD-04-02", name: "Check steering for pulling to one side", category: "Road Test", categoryCode: "ROAD", subsection: "Steering & Handling", order: 304, defaultStatus: "PENDING", referenceStatus: "PENDING" },
          { id: "ROAD-04-03", name: "Check vehicle handling over uneven road", category: "Road Test", categoryCode: "ROAD", subsection: "Steering & Handling", order: 305, defaultStatus: "PENDING", referenceStatus: "PENDING" },
        ]
      },
      {
        name: "Transmission & Clutch",
        category: "Road Test",
        items: [
          { id: "ROAD-05-01", name: "Check smooth gear shifting during acceleration", category: "Road Test", categoryCode: "ROAD", subsection: "Transmission & Clutch", order: 306, defaultStatus: "PENDING", referenceStatus: "PENDING" },
          { id: "ROAD-05-02", name: "Check clutch engagement and release (manual)", category: "Road Test", categoryCode: "ROAD", subsection: "Transmission & Clutch", order: 307, defaultStatus: "PENDING", referenceStatus: "PENDING" },
          { id: "ROAD-05-03", name: "Check transmission for jerks or delay (automatic)", category: "Road Test", categoryCode: "ROAD", subsection: "Transmission & Clutch", order: 308, defaultStatus: "PENDING", referenceStatus: "PENDING" },
        ]
      },
    ]
  },
  {
    code: "TYRE",
    name: "Tyres & Wheels",
    shortLabel: "TYRE",
    totalItems: 15,
    subsections: [
      {
        name: "Spare Tyre & Tools",
        category: "Tyres & Wheels",
        items: [
          { id: "TYRE-01-01", name: "Check spare tyre condition", category: "Tyres & Wheels", categoryCode: "TYRE", subsection: "Spare Tyre & Tools", order: 309, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "TYRE-01-02", name: "Check jack and wheel spanner availability", category: "Tyres & Wheels", categoryCode: "TYRE", subsection: "Spare Tyre & Tools", order: 310, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
      {
        name: "Tyre Specifications",
        category: "Tyres & Wheels",
        items: [
          { id: "TYRE-02-01", name: "Check tyre size matches manufacturer specification", category: "Tyres & Wheels", categoryCode: "TYRE", subsection: "Tyre Specifications", order: 311, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "TYRE-02-02", name: "Check tyre brand and model consistency", category: "Tyres & Wheels", categoryCode: "TYRE", subsection: "Tyre Specifications", order: 312, defaultStatus: "PENDING", referenceStatus: "PASS", referenceValue: "CEAT" },
          { id: "TYRE-02-03", name: "Record tyre manufacturing week and year (DOT)", category: "Tyres & Wheels", categoryCode: "TYRE", subsection: "Tyre Specifications", order: 313, defaultStatus: "PENDING", referenceStatus: "PASS", referenceValue: "3226" },
        ]
      },
      {
        name: "Tyres Condition",
        category: "Tyres & Wheels",
        items: [
          { id: "TYRE-03-01", name: "Check front left tyre for cuts, bulges, or damage", category: "Tyres & Wheels", categoryCode: "TYRE", subsection: "Tyres Condition", order: 314, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "TYRE-03-02", name: "Check front right tyre for cuts, bulges, or damage", category: "Tyres & Wheels", categoryCode: "TYRE", subsection: "Tyres Condition", order: 315, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "TYRE-03-03", name: "Check rear left tyre for cuts, bulges, or damage", category: "Tyres & Wheels", categoryCode: "TYRE", subsection: "Tyres Condition", order: 316, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "TYRE-03-04", name: "Check rear right tyre for cuts, bulges, or damage", category: "Tyres & Wheels", categoryCode: "TYRE", subsection: "Tyres Condition", order: 317, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "TYRE-03-05", name: "Check tyres for uneven tread wear", category: "Tyres & Wheels", categoryCode: "TYRE", subsection: "Tyres Condition", order: 318, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
      {
        name: "Wheel Alignment & Balance (Visual)",
        category: "Tyres & Wheels",
        items: [
          { id: "TYRE-04-01", name: "Check steering wheel off-centre (visual)", category: "Tyres & Wheels", categoryCode: "TYRE", subsection: "Wheel Alignment & Balance (Visual)", order: 319, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "TYRE-04-02", name: "Check tyres visually for alignment-related wear", category: "Tyres & Wheels", categoryCode: "TYRE", subsection: "Wheel Alignment & Balance (Visual)", order: 320, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
      {
        name: "Wheels & Rims",
        category: "Tyres & Wheels",
        items: [
          { id: "TYRE-05-01", name: "Check alloy/steel wheels for bends or cracks", category: "Tyres & Wheels", categoryCode: "TYRE", subsection: "Wheels & Rims", order: 321, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "TYRE-05-02", name: "Check wheels for scratches or cosmetic damage", category: "Tyres & Wheels", categoryCode: "TYRE", subsection: "Wheels & Rims", order: 322, defaultStatus: "PENDING", referenceStatus: "PASS" },
          { id: "TYRE-05-03", name: "Check wheel nuts/bolts present and secured", category: "Tyres & Wheels", categoryCode: "TYRE", subsection: "Wheels & Rims", order: 323, defaultStatus: "PENDING", referenceStatus: "PASS" },
        ]
      },
    ]
  },
  {
    code: "DOC",
    name: "Documents & Compliance",
    shortLabel: "DOC",
    totalItems: 13,
    subsections: [
      {
        name: "Compliance Stickers & Labels",
        category: "Documents & Compliance",
        items: [
          { id: "DOC-01-01", name: "Check VIN sticker on body/frame", category: "Documents & Compliance", categoryCode: "DOC", subsection: "Compliance Stickers & Labels", order: 324, defaultStatus: "PENDING", referenceStatus: "PENDING" },
          { id: "DOC-01-02", name: "Check emission compliance sticker", category: "Documents & Compliance", categoryCode: "DOC", subsection: "Compliance Stickers & Labels", order: 325, defaultStatus: "PENDING", referenceStatus: "PENDING" },
          { id: "DOC-01-03", name: "Check tyre pressure and load label", category: "Documents & Compliance", categoryCode: "DOC", subsection: "Compliance Stickers & Labels", order: 326, defaultStatus: "PENDING", referenceStatus: "PENDING" },
          { id: "DOC-01-04", name: "Record remarks for document discrepancies", category: "Documents & Compliance", categoryCode: "DOC", subsection: "Compliance Stickers & Labels", order: 327, defaultStatus: "PENDING", referenceStatus: "PENDING" },
        ]
      },
      {
        name: "Insurance & Legal",
        category: "Documents & Compliance",
        items: [
          { id: "DOC-02-01", name: "Check insurance policy available", category: "Documents & Compliance", categoryCode: "DOC", subsection: "Insurance & Legal", order: 328, defaultStatus: "PENDING", referenceStatus: "PENDING" },
          { id: "DOC-02-02", name: "Verify insurance validity and vehicle details", category: "Documents & Compliance", categoryCode: "DOC", subsection: "Insurance & Legal", order: 329, defaultStatus: "PENDING", referenceStatus: "PENDING" },
        ]
      },
      {
        name: "Manufacturer Documentation",
        category: "Documents & Compliance",
        items: [
          { id: "DOC-03-01", name: "Check owner's manual availability", category: "Documents & Compliance", categoryCode: "DOC", subsection: "Manufacturer Documentation", order: 330, defaultStatus: "PENDING", referenceStatus: "PENDING" },
          { id: "DOC-03-02", name: "Check service booklet/warranty card availability", category: "Documents & Compliance", categoryCode: "DOC", subsection: "Manufacturer Documentation", order: 331, defaultStatus: "PENDING", referenceStatus: "PENDING" },
        ]
      },
      {
        name: "Registration & Ownership",
        category: "Documents & Compliance",
        items: [
          { id: "DOC-04-01", name: "Check RC copy available", category: "Documents & Compliance", categoryCode: "DOC", subsection: "Registration & Ownership", order: 332, defaultStatus: "PENDING", referenceStatus: "PENDING" },
          { id: "DOC-04-02", name: "Verify RC details match vehicle", category: "Documents & Compliance", categoryCode: "DOC", subsection: "Registration & Ownership", order: 333, defaultStatus: "PENDING", referenceStatus: "PENDING" },
        ]
      },
      {
        name: "Vehicle Identification",
        category: "Documents & Compliance",
        items: [
          { id: "DOC-05-01", name: "Verify VIN/chassis number matches vehicle embossing", category: "Documents & Compliance", categoryCode: "DOC", subsection: "Vehicle Identification", order: 334, defaultStatus: "PENDING", referenceStatus: "PENDING" },
          { id: "DOC-05-02", name: "Record VIN/chassis number", category: "Documents & Compliance", categoryCode: "DOC", subsection: "Vehicle Identification", order: 335, defaultStatus: "PENDING", referenceStatus: "PENDING" },
          { id: "DOC-05-03", name: "Record engine number", category: "Documents & Compliance", categoryCode: "DOC", subsection: "Vehicle Identification", order: 336, defaultStatus: "PENDING", referenceStatus: "PENDING" },
        ]
      },
    ]
  },
];

// Flat list of all 336 checklist items
export const ALL_CHECKLIST_ITEMS: ChecklistItemDefinition[] = CHECKLIST_CATEGORIES.flatMap(
  (cat) => cat.subsections.flatMap((sub) => sub.items)
);

export const TOTAL_CHECKLIST_ITEMS_COUNT = ALL_CHECKLIST_ITEMS.length;

// Lookup map by ID for fast lookup
export const CHECKLIST_ITEM_MAP = new Map<string, ChecklistItemDefinition>(
  ALL_CHECKLIST_ITEMS.map((item) => [item.id, item])
);
