import os
import re
from typing import Tuple


DATA_ROOT = "/data2/openreal2sim/reconstructions/data"


def ensure_status_with_yaml(metadata_path: str) -> Tuple[bool, str]:
    if not os.path.exists(metadata_path):
        return False, "metadata_missing"
    try:
        import yaml  # type: ignore
    except Exception:
        return False, "yaml_not_available"

    try:
        existing_data = {}
        with open(metadata_path, "r", encoding="utf-8") as file_obj:
            loaded = yaml.safe_load(file_obj)
            if loaded is None:
                existing_data = {}
            elif isinstance(loaded, dict):
                existing_data = loaded
            else:
                return False, "non_mapping_yaml"

        if "status" in existing_data:
            return False, "already_has_status"

        existing_data["status"] = "pending"
        with open(metadata_path, "w", encoding="utf-8") as file_obj:
            yaml.safe_dump(
                existing_data,
                file_obj,
                default_flow_style=False,
                allow_unicode=True,
                sort_keys=False,
            )
        return True, "updated_with_yaml"
    except Exception:
        return False, "yaml_update_failed"


def ensure_status_with_text(metadata_path: str) -> Tuple[bool, str]:
    status_line_regex = re.compile(r"^\s*status\s*:\s*.+$", re.MULTILINE)

    if not os.path.exists(metadata_path):
        return False, "metadata_missing"

    with open(metadata_path, "r", encoding="utf-8") as file_obj:
        content = file_obj.read()

    if status_line_regex.search(content):
        return False, "already_has_status_text"

    needs_newline = not content.endswith("\n") and len(content) > 0
    with open(metadata_path, "a", encoding="utf-8") as file_obj:
        if needs_newline:
            file_obj.write("\n")
        file_obj.write("status: pending\n")
    return True, "appended_with_text"


def process_one_video_dir(video_dir_path: str) -> Tuple[bool, str]:
    metadata_path = os.path.join(video_dir_path, "metadata.yaml")

    # First try robust YAML approach
    changed, reason = ensure_status_with_yaml(metadata_path)
    if changed:
        return True, reason

    # If YAML not available or failed due to structure, fall back to text approach
    if reason in {"yaml_not_available", "non_mapping_yaml", "yaml_update_failed"}:
        return ensure_status_with_text(metadata_path)

    return False, reason  # already_has_status


def main() -> None:
    if not os.path.isdir(DATA_ROOT):
        print(f"Data root not found: {DATA_ROOT}")
        return

    updated_count = 0
    skipped_count = 0
    examined_count = 0

    try:
        weeks = sorted(os.listdir(DATA_ROOT))
    except Exception as exc:
        print(f"Failed to list directory {DATA_ROOT}: {exc}")
        return

    for week_name in weeks:
        week_dir = os.path.join(DATA_ROOT, week_name)
        if not os.path.isdir(week_dir):
            continue
        try:
            authors = sorted(os.listdir(week_dir))
        except Exception:
            continue
        for author_name in authors:
            author_dir = os.path.join(week_dir, author_name)
            if not os.path.isdir(author_dir):
                continue
            try:
                keys = sorted(os.listdir(author_dir))
            except Exception:
                continue
            for key_name in keys:
                key_dir = os.path.join(author_dir, key_name)
                if not os.path.isdir(key_dir):
                    continue
                examined_count += 1
                changed, reason = process_one_video_dir(key_dir)
                meta_path = os.path.join(key_dir, "metadata.yaml")
                if changed:
                    updated_count += 1
                    print(f"[UPDATED] {meta_path} ({reason})")
                else:
                    skipped_count += 1
                    print(f"[SKIPPED] {meta_path} ({reason})")

    print(
        f"Done. Examined: {examined_count}, Updated: {updated_count}, Skipped: {skipped_count}"
    )


if __name__ == "__main__":
    main()

