import fitz

doc = fitz.open('reference/PDI-000028.pdf')

for page_idx in range(1, 20):
    page = doc[page_idx]
    blocks = page.get_text('blocks')
    for b in blocks:
        text = b[4].strip()
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        if not lines:
            continue
        # Check if Category header
        if 'D E T A I L R' in text and any(cat in text for cat in ['Exterior', 'Interior', 'Electronics', 'Engine Bay', 'Underbody & Chassis', 'Road Test', 'Tyres & Wheels', 'Documents & Compliance']):
            print(f'P{page_idx+1} [CAT]:', repr(lines))
        elif len(lines) == 1 and lines[0] not in ['DETAILR', str(page_idx+1)]:
            # Potential subsection
            print(f'P{page_idx+1} [SUB?]:', repr(lines[0]))
