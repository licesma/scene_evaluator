#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to create symlinks for frame_00000.jpg files from reconstruction folders
to the backend/frames directory.

This script goes through each folder under outputs/videos and checks if it has a
file at reconstruction/scenario/frame_00000.jpg. If it does, it creates a
symlink to that file in backend/frames with the same name as the video folder.
 
Updated: The data directory is now organized as data/<week>/<author>/<video>,
so this script traverses week and author subdirectories to find video folders.
"""

import os
import sys
from pathlib import Path


def get_script_root():
    """Get the root directory of this script (glb_visualizer)."""
    script_dir = Path(__file__).parent
    return script_dir.parent


def main():
    """Main function to create symlinks for frame files."""
    script_root = get_script_root()
    videos_dir = script_root.parent / "data"
    frames_dir = script_root / "backend" / "frames"

    # Ensure the frames directory exists
    frames_dir.mkdir(parents=True, exist_ok=True)

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
                frame_file = video_folder / "images" / "frame_00000.jpg"
                symlink_path = frames_dir / f"{video_name}.jpg"

                if not frame_file.exists():
                    skipped_count += 1
                    continue

                try:
                    # Remove existing symlink if it exists
                    if symlink_path.exists() or symlink_path.is_symlink():
                        symlink_path.unlink()

                    # Create the symlink
                    symlink_path.symlink_to(frame_file.resolve())
                    created_count += 1
                except Exception as e:
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
