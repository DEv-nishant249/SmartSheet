import os
import uuid

from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

from parser import parse_text
from excel_generator import create_excel
from ocr import extract_text_from_image

app = FastAPI()

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","https://developernishantsmartsheet.netlify.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- Folders ----------------
os.makedirs("uploads", exist_ok=True)
os.makedirs("generated", exist_ok=True)


# ---------------- Request Model ----------------
class TextInput(BaseModel):
    text: str


# ---------------- Home ----------------
@app.get("/")
def home():
    return {"message": "SmartSheet Lite Backend Running"}


# ---------------- TEXT TO EXCEL ----------------
@app.post("/text-to-excel")
def text_to_excel(data: TextInput):
    parsed = parse_text(data.text)

    filename = f"{uuid.uuid4()}.xlsx"
    filepath = f"generated/{filename}"

    create_excel(parsed, filepath)

    return {
        "filename": filename
    }


# ---------------- IMAGE TO EXCEL (OCR) ----------------
@app.post("/image-to-excel")
async def image_to_excel(file: UploadFile = File(...)):
    try:
        image_path = f"uploads/{file.filename}"

        with open(image_path, "wb") as buffer:
            buffer.write(await file.read())

        # OCR step
        extracted_text = extract_text_from_image(image_path)

        if not extracted_text:
            return {"error": "No text extracted"}

        parsed = parse_text(extracted_text)

        filename = f"{uuid.uuid4()}.xlsx"
        filepath = f"generated/{filename}"

        create_excel(parsed, filepath)

        return {
            "filename": filename,
            "ocr_text": extracted_text
        }

    except Exception as e:
        return {
            "error": str(e)
        }
# ---------------- DOWNLOAD + AUTO DELETE ----------------
@app.get("/download/{filename}")
def download_file(filename: str, background_tasks: BackgroundTasks):
    path = f"generated/{filename}"

    def delete_file():
        if os.path.exists(path):
            os.remove(path)

    background_tasks.add_task(delete_file)

    return FileResponse(
        path,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=filename,
    )