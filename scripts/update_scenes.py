#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to create symlinks for scene_optimized.glb files from reconstruction folders
to the backend/scenes directory.

This script goes through each folder under data/<week>/<author>/<video> and checks if it has a
file at reconstruction/scenario/scene_optimized.glb. If it does, it creates a
symlink to that file in backend/scenes with the same name as the video folder.

Updated: The data directory is now organized as data/<week>/<author>/<video>,
so this script traverses week and author subdirectories to find video folders.
"""

import sys
from pathlib import Path


def get_script_root():
    """Get the root directory of this script (glb_visualizer)."""
    script_dir = Path(__file__).parent
    return script_dir.parent


def main():
    """Main function to create symlinks for scene files."""
    script_root = get_script_root()
    videos_dir = script_root.parent / "data"
    scenes_dir = script_root / "backend" / "scenes"

    scenes_dir.mkdir(parents=True, exist_ok=True)

    if not videos_dir.exists():
        sys.exit(1)

    created_count = 0
    skipped_count = 0
    error_count = 0

    # Traverse data/<week>/<author>/<video>
    for week_dir in sorted(videos_dir.iterdir()):
        if not week_dir.is_dir():
            continue
        for author_dir in sorted(week_dir.iterdir()):
            if not author_dir.is_dir():
                continue
            for video_folder in sorted(author_dir.iterdir()):
                if not video_folder.is_dir():
                    continue

                video_name = video_folder.name
                scene_file = video_folder / "reconstruction" / "scenario" / "scene_optimized.glb"
                symlink_path = scenes_dir / f"{video_name}.glb"

                if not scene_file.exists():
                    print(video_name)
                    skipped_count += 1
                    continue

                try:
                    if symlink_path.exists() or symlink_path.is_symlink():
                        symlink_path.unlink()
                    symlink_path.symlink_to(scene_file.resolve())
                    created_count += 1
                except Exception:
                    error_count += 1

    # Print summary
    print(f"\n{'='*50}")
    print(f"  Created: {created_count}")
    print(f"  Skipped: {skipped_count}")
    print(f"  Errors:  {error_count}")
    print(f"{'='*50}")

    if error_count > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()