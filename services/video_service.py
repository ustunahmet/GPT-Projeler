from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import cv2


class VideoProcessingError(Exception):
    pass


@dataclass
class ExtractionConfig:
    mode: str
    nth_frame: int | None = None
    seconds_interval: float | None = None


def _should_extract_frame(frame_index: int, timestamp_seconds: float, config: ExtractionConfig, fps: float) -> bool:
    if config.mode == "all":
        return True

    if config.mode == "nth":
        return frame_index % int(config.nth_frame or 1) == 0

    if config.mode == "seconds":
        interval = float(config.seconds_interval or 1)
        step = max(1, round(interval * fps))
        return frame_index % step == 0

    return False


def process_video(uploaded_path: Path, output_dir: Path, config: ExtractionConfig) -> tuple[dict, list[dict]]:
    capture = cv2.VideoCapture(str(uploaded_path))
    if not capture.isOpened():
        raise VideoProcessingError("Could not open uploaded video. Ensure the file is a valid video.")

    fps = float(capture.get(cv2.CAP_PROP_FPS) or 0)
    total_frames = int(capture.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    if fps <= 0:
        fps = 30.0

    duration = total_frames / fps if total_frames > 0 else 0.0
    frame_index = 0
    extracted_count = 0
    metadata: list[dict] = []

    while True:
        success, frame = capture.read()
        if not success:
            break

        timestamp = frame_index / fps
        if _should_extract_frame(frame_index, timestamp, config, fps):
            extracted_count += 1
            filename = f"frame_{extracted_count:06d}.jpg"
            frame_path = output_dir / filename

            write_success = cv2.imwrite(str(frame_path), frame)
            height, width = frame.shape[:2]

            metadata.append(
                {
                    "frame_index": frame_index,
                    "timestamp_seconds": round(timestamp, 4),
                    "filename": filename,
                    "relative_path": f"{output_dir.name}/{filename}",
                    "width": width,
                    "height": height,
                    "extraction_status": "success" if write_success else "write_failed",
                }
            )

        frame_index += 1

    capture.release()

    if not metadata:
        raise VideoProcessingError("No frames were extracted with the selected extraction settings.")

    summary = {
        "total_frames": total_frames,
        "extracted_count": len(metadata),
        "fps": round(fps, 4),
        "duration_seconds": round(duration, 2),
        "extraction_mode": config.mode,
        "nth_frame": config.nth_frame,
        "seconds_interval": config.seconds_interval,
    }
    return summary, metadata
