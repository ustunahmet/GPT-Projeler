from __future__ import annotations

import csv
import json
import zipfile
from dataclasses import dataclass
from pathlib import Path


@dataclass
class ExportBundle:
    json_path: Path
    csv_path: Path
    zip_path: Path


def create_export_bundle(output_dir: Path, metadata: list[dict]) -> ExportBundle:
    json_path = output_dir / "frames.json"
    csv_path = output_dir / "frames.csv"
    zip_path = output_dir / "frames.zip"

    json_path.write_text(json.dumps(metadata, indent=2), encoding="utf-8")

    with csv_path.open("w", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(
            csvfile,
            fieldnames=[
                "frame_index",
                "timestamp_seconds",
                "filename",
                "relative_path",
                "width",
                "height",
                "extraction_status",
            ],
        )
        writer.writeheader()
        writer.writerows(metadata)

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        for image_file in sorted(output_dir.glob("frame_*.jpg")):
            zipf.write(image_file, arcname=image_file.name)
        zipf.write(json_path, arcname=json_path.name)
        zipf.write(csv_path, arcname=csv_path.name)

    return ExportBundle(json_path=json_path, csv_path=csv_path, zip_path=zip_path)


def write_summary(output_dir: Path, summary: dict) -> Path:
    summary_path = output_dir / "summary.json"
    summary_path.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    return summary_path
