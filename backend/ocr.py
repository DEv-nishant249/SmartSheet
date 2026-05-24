import easyocr

reader = easyocr.Reader(['en'], gpu=False)

def extract_text_from_image(image_path: str):
    results = reader.readtext(image_path)

    if not results:
        return ""

    return "\n".join([r[1] for r in results])