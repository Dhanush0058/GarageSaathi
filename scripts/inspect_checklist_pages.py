import json

with open('reference/pdf_pages.json', 'r', encoding='utf-8') as f:
    pages = json.load(f)

for page_num in [2, 3, 9, 13, 15, 18, 19, 20]:
    p = pages[page_num - 1]
    print(f'=================== PAGE {page_num} ===================')
    lines = p['text'].split('\n')
    for l in lines[:35]:
        print(repr(l))
