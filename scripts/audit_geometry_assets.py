"""Read-only image audit. Pixels are inspected for QA, NEVER for game collision.

Writes a JSON report; does not crop, recolour, repack or modify any artwork.
Runtime frame contracts come from the same JS metadata used by the renderer.
"""
import hashlib
import json
import subprocess
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
specs = json.loads(subprocess.check_output([
    "node", "--input-type=module", "-e",
    "import {SPRITE_SPECS} from './src/geometry.js';console.log(JSON.stringify(SPRITE_SPECS))"
], cwd=ROOT, text=True))
paths = {
    "alexWalk": "alex-walk", "maraWalk": "mara-walk-pixel-v3",
    "castDirections": "cast-directions", "maraActionsEveryday": "mara-actions-everyday-pixel-v3",
    "maraActionsDistress": "mara-actions-distress-pixel-v3",
}
errors, frames, inventory = [], [], []
for path in sorted((ROOT / "assets").rglob("*")):
    if path.suffix.lower() not in (".png", ".webp", ".jpg"):
        continue
    with Image.open(path) as image:
        image.load()
        inventory.append({"path": path.relative_to(ROOT).as_posix(), "width": image.width,
                          "height": image.height, "bytes": path.stat().st_size,
                          "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
                          "role": "runtime" if "web" in path.parts else "source/archive"})

seen = set()
for name, spec in specs.items():
    path = ROOT / "assets/web/characters" / (paths[spec["art"]] + ".webp")
    with Image.open(path) as image:
        image = image.convert("RGBA")
        cw, ch = spec["cell"]["w"], spec["cell"]["h"]
        expected = (cw * spec["cols"], ch * spec["rows"])
        if image.size != expected:
            errors.append(f"{name}: {image.size} != contracted dimensions {expected}")
            continue
        indices = [spec["index"]] if "index" in spec else range(spec["cols"] * spec["rows"])
        for index in indices:
            key = (spec["art"], index)
            if key in seen:
                continue
            seen.add(key)
            x, y = index % spec["cols"] * cw, index // spec["cols"] * ch
            cell = image.crop((x, y, x + cw, y + ch))
            alpha = cell.getchannel("A")
            box = alpha.getbbox()
            if not box:
                errors.append(f"{name}:{index}: empty cell")
                continue
            # Any opaque boundary pixels would be clipped/crossing a frame edge.
            if box[0] == 0 or box[1] == 0 or box[2] == cw or box[3] == ch:
                errors.append(f"{name}:{index}: artwork touches a cell boundary: {box}")
            ax, ay = spec["anchor"]["x"], spec["anchor"]["y"]
            foot = alpha.crop((max(0, ax - 18), max(0, ay - 5), min(cw, ax + 19), min(ch, ay + 2)))
            if not foot.getbbox():
                errors.append(f"{name}:{index}: no sole pixels near its authored foot landmark")
            drift = abs(box[3] - ay) * spec["scale"]
            if drift > 3:
                errors.append(f"{name}:{index}: bottom/foot discrepancy {drift}px; inspect pose")
            sole = alpha.crop((0, max(0, ay-4), cw, min(ch, ay+1))).getbbox()
            lateral = abs((sole[0]+sole[2])/2-ax)*spec["scale"] if sole else 999
            if lateral > 8:
                errors.append(f"{name}:{index}: sole midpoint drifts {lateral}px from authored anchor")
            frames.append({"state": name, "index": index, "cell": [cw, ch], "inkBounds": box,
                           "authoredAnchor": [ax, ay], "footBaselineError": drift, "soleMidpointOffset": lateral})

# Portrait cells have fixed contracts too; unused old masters are inventoried, not shipped.
for path in sorted((ROOT / "assets/web/characters").glob("*-portraits-*-pixel-v3.webp")):
    with Image.open(path) as image:
        expected = (256, 384) if path.name.startswith("mara") else (384, 256)
        if image.size != expected:
            errors.append(f"{path.name}: portrait dimensions {image.size} != {expected}")
        for y in range(0, image.height, 128):
            for x in range(0, image.width, 128):
                box = image.convert("RGBA").crop((x, y, x+128, y+128)).getchannel("A").getbbox()
                if not box or box[0] == 0 or box[2] == 128:
                    errors.append(f"{path.name} ({x},{y}): empty or clipped portrait")

report = {"purpose": "Technical integrity, not a claim of manual pixel-art quality",
          "errors": errors, "checkedOverworldFrames": len(frames), "frames": frames,
          "images": inventory, "sourcePolicy": "Source/archive files are retained. Only assets/web is shipped.",
          "limitations": ["Pixel checks do not prove face consistency or artistic quality.",
                          "Old masters are inventoried, not validated as reusable sprite templates.",
                          "Furniture alignment is reviewed in rendered overlays, not inferred from alpha."]}
output = ROOT / "outputs/geometry-asset-audit.json"
output.parent.mkdir(exist_ok=True)
output.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
if not errors:
    # CI verifies these approved bytes. Rebuilding art cannot silently change a cell.
    contract = {"version": 1, "specs": specs, "files": [entry for entry in inventory if entry["role"] == "runtime"]}
    (ROOT / "assets/web/integrity.json").write_text(json.dumps(contract, indent=2) + "\n", encoding="utf-8")
print(f"Inspected {len(inventory)} images; {len(frames)} overworld frames; {len(errors)} errors.")
for error in errors:
    print(error)
raise SystemExit(1 if errors else 0)
