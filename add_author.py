#!/usr/bin/env python3
"""
Script to add or modify author information in metadata.yaml files.
Allows choosing an author and updates all metadata.yaml files in the author's outputs directory.
"""

import os
import sys
from pathlib import Path
import yaml


def get_author_choice():
    """Prompt user to choose an author from available directories."""
    base_path = Path("/data2/openreal2sim")

    # Get all directories (potential authors) in the base path
    author_dirs = [
        d.name for d in base_path.iterdir()
        if d.is_dir() and d.name not in ["outputs", "node_modules"]
    ]

    if not author_dirs:
        print("Error: No author directories found in /data2/openreal2sim/")
        sys.exit(1)

    author_dirs.sort()
    print("\nAvailable authors:")
    for i, author in enumerate(author_dirs, 1):
        print(f"  {i}. {author}")

    while True:
        try:
            choice = input("\nSelect an author (enter number or name): ").strip()

            # Check if choice is a number
            if choice.isdigit():
                idx = int(choice) - 1
                if 0 <= idx < len(author_dirs):
                    return author_dirs[idx]
                else:
                    print("Invalid selection. Please try again.")
            # Check if choice is a name
            elif choice in author_dirs:
                return choice
            else:
                print("Author not found. Please try again.")
        except KeyboardInterrupt:
            print("\n\nAborted by user.")
            sys.exit(0)


def process_metadata_file(file_path, author):
    """
    Add or modify the author key in a metadata.yaml file.
    Creates the file if it doesn't exist.
    """
    try:
        # Load existing content if file exists
        if file_path.exists():
            with open(file_path, 'r') as f:
                data = yaml.safe_load(f) or {}
        else:
            data = {}

        # Update the author field
        data['author'] = author

        # Write back to file
        with open(file_path, 'w') as f:
            yaml.dump(data, f, default_flow_style=False, allow_unicode=True)

        return True
    except Exception as e:
        print(f"  Error processing {file_path}: {e}")
        return False


def process_author_outputs(author):
    """Process all directories in the author's outputs folder."""
    author_outputs_path = Path(f"/data2/openreal2sim/{author}/outputs")

    if not author_outputs_path.exists():
        print(f"\nError: {author_outputs_path} does not exist.")
        sys.exit(1)

    # Get all subdirectories in the outputs folder
    subdirs = [d for d in author_outputs_path.iterdir() if d.is_dir()]

    if not subdirs:
        print(f"\nNo subdirectories found in {author_outputs_path}")
        return

    print(f"\nProcessing {len(subdirs)} director{'y' if len(subdirs) == 1 else 'ies'} for author: {author}")
    print(f"Path: {author_outputs_path}\n")

    successful = 0
    failed = 0

    for subdir in sorted(subdirs):
        metadata_path = subdir / "metadata.yaml"
        print(f"Processing: {subdir.name}... ", end="", flush=True)

        if process_metadata_file(metadata_path, author):
            print("")
            successful += 1
        else:
            print("")
            failed += 1

    print(f"\n{'='*50}")
    print(f"Summary:")
    print(f"  Successfully processed: {successful}")
    if failed > 0:
        print(f"  Failed: {failed}")
    print(f"{'='*50}")


if __name__ == "__main__":
    try:
        # Check if PyYAML is installed
        import yaml
    except ImportError:
        print("Error: PyYAML is not installed.")
        print("Please install it using: pip install pyyaml")
        sys.exit(1)

    # Get author choice from user
    author = get_author_choice()

    # Process all metadata files for the chosen author
    process_author_outputs(author)

    print("\nDone!")
