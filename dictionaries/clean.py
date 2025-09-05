#!/usr/bin/env python3
import json
import glob

def clean_json_file(path: str):
    with open(path, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError as e:
            print(f"❌ Failed to parse {path}: {e}")
            return

    if not isinstance(data, dict):
        print(f"⚠️ {path} does not contain a JSON object at the top level, skipping.")
        return

    # Sort alphabetically by key
    sorted_data = dict(sorted(data.items(), key=lambda x: x[0].lower()))

    with open(path, "w", encoding="utf-8") as f:
        json.dump(sorted_data, f, ensure_ascii=False, indent=2)
        f.write("\n")  # newline at end
    print(f"✅ Cleaned & sorted {path}")

def main():
    for path in glob.glob("*.json"):
        clean_json_file(path)

if __name__ == "__main__":
    main()
