import easyocr

reader = None

def get_reader():
    global reader
    if reader is None:
        reader = easyocr.Reader(['en'])
    return reader

def extract_text_from_image(image_path):
    results = reader.readtext(image_path)

    extracted = []

    for result in results:
        extracted.append(result[1])

    return "\n".join(extracted)
