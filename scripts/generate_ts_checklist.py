import json, os

with open('reference/checklist_extracted.json', 'r', encoding='utf-8') as f:
    categories = json.load(f)

os.makedirs('src/data', exist_ok=True)

CAT_CODES = {
    'Exterior': 'EXT',
    'Interior': 'INT',
    'Electronics': 'ELEC',
    'Engine Bay': 'ENG',
    'Underbody & Chassis': 'CHS',
    'Road Test': 'ROAD',
    'Tyres & Wheels': 'TYRE',
    'Documents & Compliance': 'DOC'
}

ts_lines = [
    '// GarageSaarthi Vehicle Inspection Checklist Definition',
    '// Generated directly from reference PDI-000028 (1).pdf',
    '// 8 Categories, 46 Subsections, 336 Total Inspection Items',
    '',
    'export type InspectionStatus = \"PASS\" | \"FAIL\" | \"PENDING\";',
    '',
    'export interface ChecklistItemDefinition {',
    '  id: string;',
    '  name: string;',
    '  category: string;',
    '  categoryCode: string;',
    '  subsection: string;',
    '  order: number;',
    '  defaultStatus: InspectionStatus;',
    '  referenceStatus?: InspectionStatus;',
    '  referenceValue?: string;',
    '}',
    '',
    'export interface ChecklistSubsectionDefinition {',
    '  name: string;',
    '  category: string;',
    '  items: ChecklistItemDefinition[];',
    '}',
    '',
    'export interface ChecklistCategoryDefinition {',
    '  code: string;',
    '  name: string;',
    '  shortLabel: string;',
    '  subsections: ChecklistSubsectionDefinition[];',
    '  totalItems: number;',
    '}',
    '',
    'export const CHECKLIST_CATEGORIES: ChecklistCategoryDefinition[] = ['
]

global_item_idx = 1
all_items = []

for cat in categories:
    cat_name = cat['name']
    cat_code = CAT_CODES.get(cat_name, 'GEN')
    subsections_ts = []
    cat_item_count = sum(len(sub['items']) for sub in cat['subsections'])
    
    ts_lines.append('  {')
    ts_lines.append(f'    code: \"{cat_code}\",')
    ts_lines.append(f'    name: \"{cat_name}\",')
    ts_lines.append(f'    shortLabel: \"{cat_code}\",')
    ts_lines.append(f'    totalItems: {cat_item_count},')
    ts_lines.append('    subsections: [')
    
    for sub_idx, sub in enumerate(cat['subsections'], 1):
        sub_name = sub['name'].replace('\"', '\\\"')
        ts_lines.append('      {')
        ts_lines.append(f'        name: \"{sub_name}\",')
        ts_lines.append(f'        category: \"{cat_name}\",')
        ts_lines.append('        items: [')
        
        for item_idx, itm in enumerate(sub['items'], 1):
            item_id = f'{cat_code}-{sub_idx:02d}-{item_idx:02d}'
            clean_name = itm['name'].replace('\"', '\\\"')
            ref_status = itm.get('reference_status', 'PENDING')
            ref_val = itm.get('reference_value')
            val_str = f', referenceValue: \"{ref_val}\"' if ref_val else ''
            
            ts_lines.append(f'          {{ id: \"{item_id}\", name: \"{clean_name}\", category: \"{cat_name}\", categoryCode: \"{cat_code}\", subsection: \"{sub_name}\", order: {global_item_idx}, defaultStatus: \"PENDING\", referenceStatus: \"{ref_status}\"{val_str} }},')
            all_items.append(item_id)
            global_item_idx += 1
            
        ts_lines.append('        ]')
        ts_lines.append('      },')
        
    ts_lines.append('    ]')
    ts_lines.append('  },')

ts_lines.append('];')
ts_lines.append('')
ts_lines.append('// Flat list of all 336 checklist items')
ts_lines.append('export const ALL_CHECKLIST_ITEMS: ChecklistItemDefinition[] = CHECKLIST_CATEGORIES.flatMap(')
ts_lines.append('  (cat) => cat.subsections.flatMap((sub) => sub.items)')
ts_lines.append(');')
ts_lines.append('')
ts_lines.append('export const TOTAL_CHECKLIST_ITEMS_COUNT = ALL_CHECKLIST_ITEMS.length;')
ts_lines.append('')
ts_lines.append('// Lookup map by ID for fast lookup')
ts_lines.append('export const CHECKLIST_ITEM_MAP = new Map<string, ChecklistItemDefinition>(')
ts_lines.append('  ALL_CHECKLIST_ITEMS.map((item) => [item.id, item])')
ts_lines.append(');')

with open('src/data/checklistDefinition.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(ts_lines) + '\n')

print(f'Successfully generated src/data/checklistDefinition.ts with {len(all_items)} items!')
