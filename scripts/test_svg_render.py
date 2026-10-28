import fitz

svg_data = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 200" width="600" height="200">
<rect width="100%" height="100%" fill="#0F172A"/>
<circle cx="100" cy="100" r="40" fill="#F59E0B"/>
<text x="180" y="115" fill="#FFFFFF" font-family="Arial" font-size="48" font-weight="bold">Z9 AUTOMOTIVE</text>
</svg>'''

with open('test_svg.svg', 'w', encoding='utf-8') as f:
    f.write(svg_data)

doc = fitz.open('test_svg.svg')
page = doc[0]
pix = page.get_pixmap(dpi=150)
pix.save('test_svg.png')
print('Success! PyMuPDF rendered SVG to PNG, size:', pix.width, pix.height)
