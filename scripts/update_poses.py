#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to create per-video directories under backend/poses and symlink all
.mp4 files from videos/<video>/reconstruction/objects/ into each matching
backend/poses/<video>/ directory.

This mirrors the behavior of update_frames.py and update_scenes.py, but for
pose (.mp4) assets stored under each video's reconstruction objects folder.
 
Updated: The data directory is now organized as data/<week>/<author>/<video>,
so this script traverses week and author subdirectories to find video folders.
"""

import sys
from pathlib import Path


def get_script_root():
    """Get the root directory of this script (scene_visualizer)."""
    script_dir = Path(__file__).parent
    return script_dir.parent


def main():
    """Main function to populate backend/poses with symlinks to pose videos."""
    script_root = get_script_root()
    videos_dir = script_root.parent / "data"
    poses_root_dir = script_root / "backend" / "poses"

    poses_root_dir.mkdir(parents=True, exist_ok=True)

    if not videos_dir.exists():
        sys.exit(1)

    videos_processed = 0
    created_count = 0
    skipped_videos = 0  # videos with no objects mp4s
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

                videos_processed += 1
                video_name = video_folder.name
                objects_dir = video_folder / "reconstruction" / "objects"
                target_dir = poses_root_dir / video_name

                target_dir.mkdir(parents=True, exist_ok=True)

                if not objects_dir.exists():
                    skipped_videos += 1
                    continue

                mp4_files = sorted(objects_dir.glob("*.mp4"))
                if len(mp4_files) == 0:
                    skipped_videos += 1
                    continue

                for src_file in mp4_files:
                    try:
                        dst_path = target_dir / src_file.name
                        if dst_path.exists() or dst_path.is_symlink():
                            dst_path.unlink()
                        
                        dst_path.symlink_to(src_file.resolve())
                        created_count += 1
                    except Exception:
                        error_count += 1

    # Print summary
    print(f"\n{'='*50}")
    print(f"  Videos processed: {videos_processed}")
    print(f"  Symlinks created: {created_count}")
    print(f"  Videos skipped (no mp4s): {skipped_videos}")
    print(f"  Errors:           {error_count}")
    print(f"{'='*50}")

    if error_count > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()



