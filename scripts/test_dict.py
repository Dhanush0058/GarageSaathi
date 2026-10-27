import fitz

doc = fitz.open('reference/PDI-000028.pdf')
page = doc[1] # Page 2
d = page.get_text('dict')

for b in d['blocks']:
    if 'lines' in b:
        for l in b['lines']:
            for s in l['spans']:
                text = s['text'].strip()
                if text:
                    font = s['font']
                    sz = s['size']
                    col = s['color']
                    print(f'font={font}, size={sz:.1f}, color={col} -> {repr(text)[:60]}')
