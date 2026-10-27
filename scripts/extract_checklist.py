import fitz, json

doc = fitz.open('reference/PDI-000028.pdf')

categories = []
current_category = None
current_subsection = None

for page_idx in range(1, 20): # Pages 2 to 20
    page = doc[page_idx]
    d = page.get_text('dict')
    
    # Collect all text spans in page order
    spans = []
    for b in d['blocks']:
        if 'lines' in b:
            for l in b['lines']:
                for s in l['spans']:
                    text = s['text'].strip()
                    if text:
                        spans.append({
                            'text': text,
                            'font': s['font'],
                            'size': round(s['size'], 1),
                            'color': s['color'],
                            'bbox': s['bbox']
                        })
                        
    # Filter out page numbers and watermark
    spans = [s for s in spans if s['text'] not in ['DETAILR', str(page_idx + 1)]]
    
    i = 0
    while i < len(spans):
        s = spans[i]
        txt = s['text']
        sz = s['size']
        font = s['font']
        
        # Category header
        if sz == 16.0 and 'SemiBold' in font:
            cat_name = txt
            current_category = {
                'name': cat_name,
                'subsections': []
            }
            categories.append(current_category)
            current_subsection = None
            i += 1
            continue
            
        # Subsection header
        if sz == 10.5 and 'SemiBold' in font:
            sub_name = txt
            current_subsection = {
                'name': sub_name,
                'items': []
            }
            if current_category is None:
                print('Warning: subsection without category on page', page_idx+1, sub_name)
            else:
                current_category['subsections'].append(current_subsection)
            i += 1
            continue
            
        # Skip top banner tag like 'D E T A I L R  E X T'
        if 'D E T A I L R' in txt and sz < 10.0:
            i += 1
            continue
            
        # Check item
        if sz == 9.0 and 'Regular' in font:
            item_name = txt
            i += 1
            # Check next spans for remark/value and result
            remark = None
            status = 'PENDING'
            
            while i < len(spans):
                nxt = spans[i]
                if nxt['size'] == 8.0:
                    remark = nxt['text']
                    i += 1
                elif nxt['size'] == 7.0 and nxt['text'] in ['PASS', 'FAIL', 'PENDING']:
                    status = nxt['text']
                    i += 1
                    break
                else:
                    break
                    
            if current_subsection is None:
                print('Warning: item without subsection on page', page_idx+1, item_name)
            else:
                current_subsection['items'].append({
                    'name': item_name,
                    'reference_status': status,
                    'reference_value': remark,
                    'page': page_idx + 1
                })
            continue
            
        i += 1

print('Total categories extracted:', len(categories))
total_items = 0
for cat in categories:
    cat_items = sum(len(sub['items']) for sub in cat['subsections'])
    total_items += cat_items
    cname = cat['name']
    subcount = len(cat['subsections'])
    print(cname, ':', subcount, 'subsections,', cat_items, 'items')

print('TOTAL CHECKLIST ITEMS:', total_items)

with open('reference/checklist_extracted.json', 'w', encoding='utf-8') as f:
    json.dump(categories, f, indent=2, ensure_ascii=False)
print('Saved reference/checklist_extracted.json')
