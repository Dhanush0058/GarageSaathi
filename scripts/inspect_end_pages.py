import json
with open('reference/pdf_pages.json', 'r', encoding='utf-8') as f:
    pages = json.load(f)
for p in [19, 20, 21]:
    idx = pages[p]['page']
    print(f'=== PAGE {idx} ===')
    print(pages[p]['text'])
