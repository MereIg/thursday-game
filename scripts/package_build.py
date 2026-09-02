"""Create the small downloadable review build; original PNG assets stay in Git."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "outputs" / "MARA-playable-opening.zip"
files = [ROOT / name for name in (
    "index.html", "styles.css", "README.md", "GAME_DESIGN.md",
    "DEVELOPMENT_STATUS.md", "ORIGINAL_VISION.md", "QA_REPORT.md", "ART_PROMPTS.md",
    "REFERENCE_NOTES.md", "package.json", "assets/README.md", "scripts/test_game.mjs",
)]
files += sorted((ROOT / "src").rglob("*.js"))
files += sorted((ROOT / "src").rglob("*.mjs"))
files += sorted((ROOT / "assets" / "web").rglob("*.webp"))
with ZipFile(OUTPUT, "w", ZIP_DEFLATED) as archive:
    for path in files:
        archive.write(path, path.relative_to(ROOT).as_posix())
print(f"Packaged {len(files)} files: {OUTPUT.stat().st_size / 1024 / 1024:.2f} MiB")
