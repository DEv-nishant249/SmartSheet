import os
import uuid

from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import FileResponse

from parser import parse_text
from excel_generator import create_excel
from ocr import extract_text_from_image

app = FastAPI()

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://developernishantsmartsheet.netlify.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- FOLDERS ----------------
os.makedirs("uploads", exist_ok=True)
os.makedirs("generated", exist_ok=True)


# ---------------- REQUEST MODEL ----------------
class TextInput(BaseModel):
    text: str


# ---------------- CLEAN VOICE / OCR NOISE ----------------
def clean_voice_stream(text: str):
    words = text.split()

    cleaned = []
    for i, w in enumerate(words):
        # remove repeated words like "in in name name"
        if i == 0 or w.lower() != words[i - 1].lower():
            cleaned.append(w)

    return " ".join(cleaned)


# ---------------- HOME ----------------
@app.get("/")
def home():
    return {"message": "SmartSheet Lite Backend Running"}


# ---------------- TEXT TO EXCEL ----------------
@app.post("/text-to-excel")
def text_to_excel(data: TextInput):
    try:
        text = clean_voice_stream(data.text.strip())

        if not text:
            return {"error": "Empty input"}

        parsed = parse_text(text)

        if not parsed:
            parsed = [["text"], [text]]

        filename = f"{uuid.uuid4()}.xlsx"
        create_excel(parsed, filename)

        return {
            "filename": filename,
            "cleaned_text": text
        }

    except Exception as e:
        return {"error": str(e)}


# ---------------- IMAGE TO EXCEL (OCR) ----------------
@app.post("/image-to-excel")
async def image_to_excel(file: UploadFile = File(...)):
    image_path = None

    try:
        image_path = f"uploads/{uuid.uuid4()}_{file.filename}"

        with open(image_path, "wb") as f:
            f.write(await file.read())

        extracted_text = extract_text_from_image(image_path)

        if not extracted_text:
            return {"error": "No text extracted"}

        cleaned_text = clean_voice_stream(extracted_text)

        parsed = parse_text(cleaned_text)

        if not parsed:
            parsed = [["ocr_text"], [cleaned_text]]

        filename = f"{uuid.uuid4()}.xlsx"
        create_excel(parsed, filename)

        

        return {
            "filename": filename,
            "ocr_text": cleaned_text
        }

    except Exception as e:
        return {"error": f"OCR failed: {str(e)}"}

    finally:
        if image_path and os.path.exists(image_path):
            os.remove(image_path)


# ---------------- DOWNLOAD + AUTO DELETE ----------------
@app.get("/download/{filename}")
def download_file(filename: str, background_tasks: BackgroundTasks):
    path = os.path.join("generated", filename)

    def delete_file():
        if os.path.exists(path):
            os.remove(path)

    background_tasks.add_task(delete_file)

    return FileResponse(
        path,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=filename,
    )