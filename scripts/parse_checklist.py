import json, re

with open('reference/pdf_pages.json', 'r', encoding='utf-8') as f:
    pages = json.load(f)

# Inspect all lines from page 2 to 20
all_lines = []
for p in pages[1:20]: # pages 2 to 20
    text = p['text']
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    all_lines.append((p['page'], lines))

print(f'Total checklist pages: {len(all_lines)}')
