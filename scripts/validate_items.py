import json

with open('reference/checklist_extracted.json', 'r', encoding='utf-8') as f:
    cats = json.load(f)

for cat in cats:
    print('Category:', cat['name'])
    for sub in cat['subsections']:
        sname = sub['name']
        cnt = len(sub['items'])
        sample = sub['items'][0]['name'] if cnt > 0 else 'EMPTY'
        print('  -', sname, '(', cnt, 'items): sample:', sample)
