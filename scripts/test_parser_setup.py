import fitz, json

doc = fitz.open('reference/PDI-000028.pdf')

CATEGORIES = [
    ('Exterior', 'EXT'),
    ('Interior', 'INT'),
    ('Electronics', 'ELEC'),
    ('Engine Bay', 'ENG'),
    ('Underbody & Chassis', 'CHS'),
    ('Road Test', 'ROAD'),
    ('Tyres & Wheels', 'TYRE'),
    ('Documents & Compliance', 'DOC')
]

CAT_NAMES = [c[0] for c in CATEGORIES]

# Let's inspect all blocks on pages 2 to 20
checklist = []
current_cat = None
current_sub = None

for page_idx in range(1, 20):
    page = doc[page_idx]
    blocks = page.get_text('blocks')
    
    # Sort blocks by vertical position y0
    sorted_blocks = sorted(blocks, key=lambda b: (round(b[1] / 10) * 10, b[0]))
    
    i = 0
    while i < len(sorted_blocks):
        b = sorted_blocks[i]
        text = b[4].strip()
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        i += 1
        
        if not lines:
            continue
            
        # Check page number or footer
        if lines == ['DETAILR'] or (len(lines) == 1 and lines[0] == str(page_idx + 1)):
            continue
            
        # Check Category header
        cat_match = None
        for cat, code in CATEGORIES:
            if cat in text and 'D E T A I L R' in text:
                cat_match = (cat, code)
                break
        if cat_match:
            current_cat = cat_match[0]
            current_sub = None
            continue
            
        # Check if subsection
        # A subsection is typically a single line, bold or colored header, not ending in PASS/FAIL/PENDING
        # Let's check block font/size or known characteristics
        # In this PDF, subsections are known headers. Let's inspect font info using get_text('dict')
        pass

print('Ready to test block dict extraction')
