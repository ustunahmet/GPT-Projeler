from __future__ import annotations

import json
import shutil
import uuid
from pathlib import Path

from fastapi import FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from services.export_service import ExportBundle, create_export_bundle, write_summary
from services.video_service import ExtractionConfig, VideoProcessingError, process_video

BASE_DIR = Path(__file__).resolve().parent
UPLOADS_DIR = BASE_DIR / "uploads"
OUTPUTS_DIR = BASE_DIR / "outputs"
ALLOWED_VIDEO_EXTENSIONS = {".mp4", ".mov", ".avi", ".mkv", ".webm", ".m4v"}

for directory in [UPLOADS_DIR, OUTPUTS_DIR]:
    directory.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Video Frame Extraction Web Tool")
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")
app.mount("/outputs", StaticFiles(directory=OUTPUTS_DIR), name="outputs")
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))


@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "error": None})


def _safe_extension(filename: str | None) -> str:
    suffix = Path(filename or "").suffix.lower()
    if suffix not in ALLOWED_VIDEO_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported file type. Please upload a valid video file.")
    return suffix


def _validate_extraction(mode: str, nth_frame: int | None, seconds_interval: float | None) -> ExtractionConfig:
    if mode not in {"all", "nth", "seconds"}:
        raise HTTPException(status_code=400, detail="Invalid extraction mode.")
    if mode == "nth" and (nth_frame is None or nth_frame < 1):
        raise HTTPException(status_code=400, detail="Nth frame interval must be an integer greater than 0.")
    if mode == "seconds" and (seconds_interval is None or seconds_interval <= 0):
        raise HTTPException(status_code=400, detail="Seconds interval must be a number greater than 0.")
    return ExtractionConfig(mode=mode, nth_frame=nth_frame, seconds_interval=seconds_interval)


@app.post("/process")
async def process_upload(
    request: Request,
    video: UploadFile = File(...),
    extraction_mode: str = Form(...),
    nth_frame: int | None = Form(default=None),
    seconds_interval: float | None = Form(default=None),
):
    suffix = _safe_extension(video.filename)
    config = _validate_extraction(extraction_mode, nth_frame, seconds_interval)

    job_id = uuid.uuid4().hex
    upload_dir = UPLOADS_DIR / job_id
    output_dir = OUTPUTS_DIR / job_id
    upload_dir.mkdir(parents=True, exist_ok=True)
    output_dir.mkdir(parents=True, exist_ok=True)

    uploaded_path = upload_dir / f"uploaded{suffix}"
    with uploaded_path.open("wb") as buffer:
        shutil.copyfileobj(video.file, buffer)

    try:
        summary, metadata = process_video(uploaded_path=uploaded_path, output_dir=output_dir, config=config)
        exports: ExportBundle = create_export_bundle(output_dir=output_dir, metadata=metadata)
    except VideoProcessingError as exc:
        return templates.TemplateResponse("index.html", {"request": request, "error": str(exc)}, status_code=400)
    finally:
        video.file.close()

    summary.update(
        {
            "job_id": job_id,
            "source_filename": video.filename,
            "json_file": exports.json_path.name,
            "csv_file": exports.csv_path.name,
            "zip_file": exports.zip_path.name,
        }
    )
    write_summary(output_dir=output_dir, summary=summary)

    return templates.TemplateResponse("result.html", {"request": request, "summary": summary, "frames": metadata})


@app.get("/result/{job_id}")
async def result_page(request: Request, job_id: str):
    output_dir = OUTPUTS_DIR / job_id
    frames_path = output_dir / "frames.json"
    summary_path = output_dir / "summary.json"
    if not frames_path.exists() or not summary_path.exists():
        raise HTTPException(status_code=404, detail="Result not found.")

    frames = json.loads(frames_path.read_text(encoding="utf-8"))
    summary = json.loads(summary_path.read_text(encoding="utf-8"))
    return templates.TemplateResponse("result.html", {"request": request, "summary": summary, "frames": frames})


@app.get("/api/result/{job_id}")
async def result_json(job_id: str):
    target = OUTPUTS_DIR / job_id / "frames.json"
    if not target.exists():
        return JSONResponse(status_code=404, content={"error": "Result not found."})
    return FileResponse(path=target, media_type="application/json", filename="frames.json")


@app.get("/download/{job_id}/{file_type}")
async def download_file(job_id: str, file_type: str):
    file_map = {"json": "frames.json", "csv": "frames.csv", "zip": "frames.zip"}
    if file_type not in file_map:
        raise HTTPException(status_code=404, detail="Invalid file type.")

    target = OUTPUTS_DIR / job_id / file_map[file_type]
    if not target.exists():
        raise HTTPException(status_code=404, detail="File not found.")

    media_types = {"json": "application/json", "csv": "text/csv", "zip": "application/zip"}
    return FileResponse(path=target, media_type=media_types[file_type], filename=file_map[file_type])


@app.get("/health")
async def health():
    return JSONResponse({"status": "ok"})
