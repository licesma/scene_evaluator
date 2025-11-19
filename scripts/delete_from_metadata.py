#!/usr/bin/env python3
"""
Script to delete videos whose metadata status is set to 'delete'.

This script iterates through all video folders in outputs/videos and checks their
metadata.yaml files. If the status value is 'delete', the entire video folder
is removed from the filesystem.
"""

import os
import sys
import shutil
import yaml
from pathlib import Path


def get_script_root():
    """Get the root directory of this script (glb_visualizer)."""
    script_dir = Path(__file__).parent
    return script_dir.parent


def load_metadata(metadata_file):
    """Load and parse a metadata.yaml file.

    Args:
        metadata_file: Path to the metadata.yaml file

    Returns:
        Dictionary with metadata contents, or None if file doesn't exist or can't be parsed
    """
    if not metadata_file.exists():
        return None

    try:
        with open(metadata_file, 'r') as f:
            return yaml.safe_load(f)
    except Exception as e:
        print("Warning: Could not parse {}: {}".format(metadata_file, e))
        return None


def main():
    """Main function to delete videos marked for deletion."""
    script_root = get_script_root()
    videos_dir = script_root.parent / "videos"

    if not videos_dir.exists():
        print("Error: Videos directory not found at {}".format(videos_dir))
        sys.exit(1)

    deleted_count = 0
    skipped_count = 0
    error_count = 0

    print("\n" + "="*60)
    print("Scanning for videos to delete...")
    print("="*60 + "\n")

    # Iterate through each folder in the videos directory
    for video_folder in sorted(videos_dir.iterdir()):
        if not video_folder.is_dir():
            continue

        video_name = video_folder.name
        metadata_file = video_folder / "metadata.yaml"

        # Load metadata
        metadata = load_metadata(metadata_file)

        if metadata is None:
            print("[SKIP] {:<50} (No metadata)".format(video_name))
            skipped_count += 1
            continue

        # Check if status is 'delete'
        status = metadata.get('status', '').lower()

        if status != 'delete':
            skipped_count += 1
            continue

        # Delete the video folder
        try:
            print("[DEL]  {:<50}".format(video_name))
            shutil.rmtree(video_folder)
            deleted_count += 1
        except Exception as e:
            print("[ERR]  {:<50} {}".format(video_name, str(e)))
            error_count += 1

    # Print summary
    print("\n" + "="*60)
    print("  Deleted: {}".format(deleted_count))
    print("  Skipped: {}".format(skipped_count))
    print("  Errors:  {}".format(error_count))
    print("="*60 + "\n")

    if error_count > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
