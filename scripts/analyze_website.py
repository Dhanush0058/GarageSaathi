import re

with open('reference/website.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find colors
hex_colors = set(re.findall(r'#(?:[0-9a-fA-F]{3,4}){1,2}\b', html))
print('Unique hex colors found:', len(hex_colors))
print('Sample colors:', sorted(list(hex_colors))[:25])

# Find image sources / logos
img_srcs = set(re.findall(r'<img[^>]+src=[\"\']([^\"\']+)[\"\']', html))
print('\nImage sources:')
for src in sorted(img_srcs):
    if any(k in src.lower() for k in ['logo', 'brand', 'icon', 'hero']):
        print(' -', src)

# Find CSS links or style tags
css_links = re.findall(r'<link[^>]+rel=[\"\']stylesheet[\"\'][^>]+href=[\"\']([^\"\']+)[\"\']', html)
print('\nCSS links:', css_links)

# Find title and meta description
title = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE)
print('\nTitle:', title.group(1) if title else 'None')
meta_desc = re.search(r'<meta[^>]+name=[\"\']description[\"\'][^>]+content=[\"\']([^\"\']+)[\"\']', html, re.IGNORECASE)
print('Description:', meta_desc.group(1) if meta_desc else 'None')
