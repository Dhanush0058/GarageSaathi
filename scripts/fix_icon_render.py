import fitz

doc = fitz.open('assets/icon.svg')
page = doc[0]
pix = page.get_pixmap(dpi=72)
pix.save('assets/icon.png')
pix.save('assets/adaptive-icon.png')
print(f'Rendered assets/icon.png & assets/adaptive-icon.png ({pix.width}x{pix.height})')
