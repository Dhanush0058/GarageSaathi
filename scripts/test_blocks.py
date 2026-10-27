import fitz

doc = fitz.open('reference/PDI-000028.pdf')
for pno in [2, 6, 9, 13, 15, 17, 18, 19]:
    page = doc[pno - 1]
    blocks = page.get_text('blocks')
    print(f'Page {pno} has {len(blocks)} blocks:')
    for b in blocks[:8]:
        # b is (x0, y0, x1, y1, text, block_no, block_type)
        print(f'  ({b[0]:.1f}, {b[1]:.1f}) -> {repr(b[4].strip())[:80]}')
