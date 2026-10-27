import json

with open('reference/pdf_pages.json', 'r', encoding='utf-8') as f:
    pages = json.load(f)

for p in pages:
    lines = [line.strip() for line in p['text'].split('\n') if line.strip()]
    first_few = ' | '.join(lines[:6])
    print(f"Page {p['page']}: ({len(lines)} lines) -> {first_few[:140]}")
