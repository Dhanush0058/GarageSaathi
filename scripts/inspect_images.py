import fitz

doc = fitz.open('reference/PDI-000028.pdf')
for i, page in enumerate(doc):
    images = page.get_images()
    if images:
        print(f'Page {i+1} has {len(images)} images: {images}')
