import fitz

doc = fitz.open('reference/PDI-000028.pdf')
page = doc[17] # Page 18
d = page.get_text('dict')

for b in d['blocks']:
    if 'lines' in b:
        for l in b['lines']:
            for s in l['spans']:
                text = s['text'].strip()
                if text and text not in ['DETAILR', '18']:
                    f = s['font']
                    sz = s['size']
                    c = s['color']
                    print(f'font={f}, sz={sz:.1f}, col={c} -> {repr(text)}')
