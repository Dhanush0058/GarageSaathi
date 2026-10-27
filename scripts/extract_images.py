import fitz, os

os.makedirs('reference/extracted_images', exist_ok=True)
doc = fitz.open('reference/PDI-000028.pdf')
extracted = set()

for page_idx in range(len(doc)):
    page = doc[page_idx]
    for img_idx, img in enumerate(page.get_images()):
        xref = img[0]
        if xref in extracted:
            continue
        extracted.add(xref)
        base_img = doc.extract_image(xref)
        image_bytes = base_img['image']
        image_ext = base_img['ext']
        w = base_img['width']
        h = base_img['height']
        img_name = f'reference/extracted_images/img_xref{xref}_p{page_idx+1}.{image_ext}'
        with open(img_name, 'wb') as f:
            f.write(image_bytes)
        print(f'Extracted: {img_name} ({len(image_bytes)} bytes, dims: {w}x{h})')
