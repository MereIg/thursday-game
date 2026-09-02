"""Build scene exports and publish fixed-canvas character masters.

NO alpha bounding-box cropping, silhouette fitting, automatic centering or
per-pose resizing. Read ASSET_SPEC.md before importing art. Original generated
illustrations remain archived under assets/characters. Inspected lossless
fixed-grid sheets under assets/production/characters are the pixel-editable
production sources for the active character library.
"""
from pathlib import Path
from shutil import copyfile
import json
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
WEB = ASSETS / "web"


def save_webp(source, destination, size=None, quality=88, colors=None):
    """Scene export only. Never pass a character sheet here."""
    image = Image.open(source).convert("RGBA")
    if size:
        image = ImageOps.fit(image, size, method=Image.Resampling.LANCZOS)
    if colors:
        alpha = image.getchannel("A")
        image = image.convert("RGB").quantize(colors=colors, dither=Image.Dither.NONE).convert("RGBA")
        image.putalpha(alpha)
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination, "WEBP", quality=quality, method=6, exact=True)


def main():
    scenes = ["bedroom-v2", "bedroom-shifted-v2", "college-hall-v2", "college-hall-shifted-v2",
              "cafe-v2", "park-rain-v2", "library-v2", "arcade-v2", "station-rain-v2",
              "high-street-rain-v2", "mallow-street-geometry-v4", "rowan-house-v3", "east-hall-v3",
              "seminar-room-v3", "cafeteria-v3", "music-room-v3", "archive-corridor-v3",
              "archive-annex-v3", "cafe-shifted-v3", "library-shifted-v3", "station-shifted-v3"]
    for name in scenes:
        save_webp(ASSETS / "scenes" / f"{name}.png", WEB / "scenes" / f"{name}.webp", (480, 270), 91, 160)
    save_webp(ASSETS / "title/mara-bedroom-v2.png", WEB / "title/mara-bedroom-v2.webp", (320, 180), 92, 128)

    contract = json.loads((WEB / "integrity.json").read_text(encoding="utf-8"))
    published = 0
    for entry in contract["files"]:
        master = ASSETS / "production/characters" / Path(entry["path"]).name
        if not master.exists():
            continue  # Retained legacy exports are versioned; do not re-normalize them.
        with Image.open(master) as image:
            if image.size != (entry["width"], entry["height"]):
                raise ValueError(f"{master.name}: fixed-canvas contract violated; do not auto-fit.")
        copyfile(master, ROOT / entry["path"])
        published += 1
    if published != 14:
        raise ValueError(f"Expected 14 approved character sheets; found {published}. Review the manifest.")
    count = len(list(WEB.rglob("*.webp")))
    size = sum(p.stat().st_size for p in WEB.rglob("*.webp")) / 1024 / 1024
    print(f"Published {published} fixed-grid masters unchanged; {count} runtime images ({size:.2f} MiB).")


if __name__ == "__main__":
    main()
