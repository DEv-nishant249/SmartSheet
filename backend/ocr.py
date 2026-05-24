import easyocr
import gc

reader = None


def get_reader():
    global reader

    if reader is None:
        print("Initializing EasyOCR...")

        reader = easyocr.Reader(
            ['en'],
            gpu=False,
            verbose=False
        )

        print("EasyOCR Ready")

    return reader


def extract_text_from_image(image_path):
    try:
        ocr_reader = get_reader()

        results = ocr_reader.readtext(
            image_path,
            detail=0,
            paragraph=True
        )

        text = "\n".join(results)

        gc.collect()

        return text

    except Exception as e:
        gc.collect()
        raise RuntimeError(str(e))