import uuid
import os

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

from parser import parse_text
from excel_generator import create_excel
from ocr import extract_text_from_image

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


os.makedirs("uploads", exist_ok=True)
os.makedirs("generated", exist_ok=True)


class TextInput(BaseModel):
    text: str


@app.get("/")
def home():
    return {"message": "SmartSheet Lite Backend Running"}


@app.post("/text-to-excel")
def text_to_excel(data: TextInput):
    parsed = parse_text(data.text)

    filename = f"{uuid.uuid4()}.xlsx"

    create_excel(parsed, filename)

    return {
        "filename": filename
    }


@app.post("/image-to-excel")
async def image_to_excel(file: UploadFile = File(...)):
    image_path = f"uploads/{file.filename}"

    with open(image_path, "wb") as buffer:
        buffer.write(await file.read())

    extracted_text = extract_text_from_image(image_path)

    parsed = parse_text(extracted_text)

    filename = f"{uuid.uuid4()}.xlsx"

    create_excel(parsed, filename)

    return {
        "filename": filename,
        "ocr_text": extracted_text
    }


@app.get("/download/{filename}")
def download_file(filename: str):
    path = f"generated/{filename}"

    return FileResponse(
        path,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=filename,
    )