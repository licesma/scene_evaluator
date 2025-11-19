from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import os
from pathlib import Path
import yaml
from typing import Dict, Any

class VideoMetadataUpdate(BaseModel):
    video: str
    metadata: Dict[str, Any]

app = FastAPI()
app.mount("/scenes", StaticFiles(directory="scenes", follow_symlink=True), name="scenes")
app.mount("/frames", StaticFiles(directory="frames", follow_symlink=True), name="frames")
app.mount("/poses", StaticFiles(directory="poses", follow_symlink=True), name="poses")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

VIDEOS_PATH = Path(__file__).parent.parent.parent / "videos" 
DATA_PATH = Path(__file__).parent.parent.parent / "data"
POSES_PATH = Path(__file__).parent / "poses"

@app.get("/api/hello")
def hello():
    return {"message": "Hello from FastAPI2!"}

@app.get("/api/scenes/data")
def get_reconstruction_keys():
    """
    Get all available scene keys.
    Scans the scenes directory and returns all scene names (without .glb extension).
    """
    scenes_path = Path(__file__).parent / "scenes"

    if not scenes_path.exists():
        return {"keys": []}

    available_keys = []
    try:
        for item in scenes_path.iterdir():
            if item.is_file() and item.suffix == ".glb":
                available_keys.append(item.stem)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error scanning scenes directory: {str(e)}")

    return {"keys": sorted(available_keys)}

@app.get("/api/reconstruction/scenario")
def get_reconstruction_scenario(key: str):
    """
    Get the scenario reconstruction GLB file for a given key.
    Returns the file from scenes/<key>.glb
    """
    scenes_path = Path(__file__).parent / "scenes"
    file_path = scenes_path / f"{key}.glb"

    if not file_path.exists():
        raise HTTPException(status_code=404, detail=f"Scene not found for key: {key}")

    return FileResponse(
        path=file_path,
        media_type="model/gltf-binary",
        filename=f"{key}.glb"
    )

@app.post("/api/video/metadata")
def update_video_metadata(request: VideoMetadataUpdate):
    """
    Update metadata for a given video.
    Expects:
    - video: leaf video folder name (e.g., "img_0003")
    - metadata: a dict that MUST include "week" and "author"
    Locates metadata file at data/<week>/<author>/<video>/metadata.yaml and merges incoming metadata.
    """
    video = request.video
    incoming_metadata = request.metadata or {}

    week = incoming_metadata.get("week")
    author = incoming_metadata.get("author")
    if not week or not author:
        raise HTTPException(status_code=400, detail="metadata.week and metadata.author are required")

    video_path = DATA_PATH / week / author / video
    metadata_file = video_path / "metadata.yaml"

    if not video_path.exists():
        raise HTTPException(status_code=404, detail=f"Video not found at {video_path}")

    try:
        if metadata_file.exists():
            with open(metadata_file, 'r') as f:
                existing = yaml.safe_load(f) or {}
        else:
            existing = {}

        # Shallow merge: incoming keys override existing
        existing.update(incoming_metadata)

        with open(metadata_file, 'w') as f:
            yaml.dump(existing, f, default_flow_style=False)

        return {"message": f"Metadata updated for video '{video}'", "path": str(metadata_file)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating metadata: {str(e)}")

@app.get("/api/videos/metadata")
def get_all_videos_metadata():
    """
    Get metadata for all videos.
    Returns a dictionary mapping video names to their metadata from
    data/<week>/<author>/<video>/metadata.yaml
    """
    videos_path = DATA_PATH

    if not videos_path.exists():
        return {}

    all_metadata = {}
    try:
        # Traverse data/<week>/<author>/<video>
        for week_dir in sorted(videos_path.iterdir()):
            if not week_dir.is_dir():
                continue
            for author_dir in sorted(week_dir.iterdir()):
                if not author_dir.is_dir():
                    continue
                for video_dir in sorted(author_dir.iterdir()):
                    if not video_dir.is_dir():
                        continue
                    metadata_file = video_dir / "metadata.yaml"
                    video_name = video_dir.name

                    if metadata_file.exists():
                        try:
                            with open(metadata_file, 'r') as f:
                                metadata = yaml.safe_load(f) or {}
                                all_metadata[video_name] = metadata
                        except Exception as e:
                            print(f"Error reading metadata for {video_name}: {str(e)}")
                            all_metadata[video_name] = {}
                    else:
                        all_metadata[video_name] = {}

        return all_metadata

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading metadata: {str(e)}")

@app.get("/api/poses/list")
def list_pose_mp4s(video: str):
    """
    List all mp4 filenames for a given video folder under POSES_PATH.
    Served statically at /poses/<video>/<file>.mp4
    """
    pose_dir = POSES_PATH / video
    if not pose_dir.exists() or not pose_dir.is_dir():
        return {"mp4s": []}

    try:
        mp4s = [
            f.name
            for f in sorted(pose_dir.iterdir())
            if f.is_file() and f.suffix.lower() == ".mp4"
        ]
        return {"mp4s": mp4s}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing pose mp4s: {str(e)}")