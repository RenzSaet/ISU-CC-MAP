import json
from pathlib import Path

current_dir = Path(__file__).parent

files = [
    "./",
    "./index.html",
    "./map_admins.json",
    "./map_rooms.json",
    "./map.geojson",
    "./map.svg"
]

folders = [path for path in current_dir.iterdir() if not path.is_file()]

for folder in folders:
    for path in (current_dir / folder).rglob("*"):
        if path.is_file():
            relative_path = path.relative_to(current_dir)

            files.append("./" + relative_path._str.replace("\\", '/'))

with open(current_dir / "precache-manifest.json", "w", encoding="utf-8") as f:
    json.dump(files, f, indent=4, ensure_ascii=False)
    print("File saved.")