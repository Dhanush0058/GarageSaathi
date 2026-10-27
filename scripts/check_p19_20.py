import json
with open('reference/pdf_pages.json', 'r', encoding='utf-8') as f:
    pages = json.load(f)
print('--- End of Page 19 ---')
print(pages[18]['text'].split('\n')[-10:])
print('--- Page 20 ---')
print(pages[19]['text'].split('\n'))
