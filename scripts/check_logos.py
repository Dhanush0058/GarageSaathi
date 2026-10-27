with open('reference/website.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
logos = re.findall(r'<img[^>]+alt=[\"\']([^\"\']*)[\"\'][^>]*>', html)
print('Image alts:', logos[:10])

# Check logo mentions
for m in re.finditer(r'<img[^>]*src=[\"\']([^\"\']+)[\"\'][^>]*>', html):
    tag = m.group(0)
    if 'logo' in tag.lower():
        print('Logo img tag:', tag)
