"""Build compact browser-ready art while preserving the full source library.

The committed PNG files are the editable masters. This script creates smaller
WebP runtime copies and repacks generated Mara portrait grids into true square
cells so the dialogue renderer never distorts her face.
"""

from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
WEB = ASSETS / "web"


def reduce_palette(image: Image.Image, colors: int) -> Image.Image:
    alpha = image.getchannel("A")
    rgb = image.convert("RGB").quantize(colors=colors, dither=Image.Dither.NONE).convert("RGBA")
    rgb.putalpha(alpha)
    return rgb


def save_webp(
    source: Path,
    destination: Path,
    size: tuple[int, int] | None = None,
    quality: int = 88,
    colors: int | None = None,
) -> None:
    image = Image.open(source).convert("RGBA")
    if size:
        image = ImageOps.fit(image, size, method=Image.Resampling.LANCZOS)
    if colors:
        image = reduce_palette(image, colors)
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination, "WEBP", quality=quality, method=6, exact=True)


def clear_connected_checkerboard(image: Image.Image) -> Image.Image:
    """Remove only neutral light pixels connected to the edge of one portrait cell."""
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size
    seen: set[tuple[int, int]] = set()
    queue: deque[tuple[int, int]] = deque()

    def background(x: int, y: int) -> bool:
        r, g, b, a = pixels[x, y]
        return a == 0 or (min(r, g, b) > 207 and max(r, g, b) - min(r, g, b) < 18)

    def add(x: int, y: int) -> None:
        point = (x, y)
        if point not in seen and background(x, y):
            seen.add(point)
            queue.append(point)

    for x in range(width):
        add(x, 0)
        add(x, height - 1)
    for y in range(height):
        add(0, y)
        add(width - 1, y)

    while queue:
        x, y = queue.popleft()
        r, g, b, _ = pixels[x, y]
        pixels[x, y] = (r, g, b, 0)
        if x:
            add(x - 1, y)
        if x + 1 < width:
            add(x + 1, y)
        if y:
            add(x, y - 1)
        if y + 1 < height:
            add(x, y + 1)

    # Generators sometimes draw checker cells as isolated islands separated by
    # one-pixel grid lines. Remove those neutral islands too. Warm skin, cream
    # clothing and hair highlights have enough chroma to survive this pass.
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a and min(r, g, b) > 174 and max(r, g, b) - min(r, g, b) < 30:
                pixels[x, y] = (r, g, b, 0)
    return rgba


def repack_mara_sheet(source: Path, destination: Path) -> None:
    source_image = Image.open(source).convert("RGBA")
    source_width, source_height = source_image.size
    cell_size = 128
    output = Image.new("RGBA", (cell_size * 2, cell_size * 3), (0, 0, 0, 0))
    for row in range(3):
        for column in range(2):
            left = round(column * source_width / 2)
            right = round((column + 1) * source_width / 2)
            top = round(row * source_height / 3)
            bottom = round((row + 1) * source_height / 3)
            cell = clear_connected_checkerboard(source_image.crop((left, top, right, bottom)))
            bounds = cell.getbbox()
            if not bounds:
                continue
            figure = cell.crop(bounds)
            figure.thumbnail((122, 125), Image.Resampling.LANCZOS)
            figure = reduce_palette(figure, 64)
            x = column * cell_size + (cell_size - figure.width) // 2
            y = row * cell_size + 127 - figure.height
            output.alpha_composite(figure, (x, y))
    destination.parent.mkdir(parents=True, exist_ok=True)
    output.save(destination, "WEBP", lossless=True, method=6, exact=True)


def repack_directional_sheet(source: Path, destination: Path, rows: int) -> None:
    source_image = Image.open(source).convert("RGBA")
    source_width, source_height = source_image.size
    cell_width, cell_height = 64, 80
    output = Image.new("RGBA", (cell_width * 4, cell_height * rows), (0, 0, 0, 0))
    for row in range(rows):
        for column in range(4):
            left = round(column * source_width / 4)
            right = round((column + 1) * source_width / 4)
            top = round(row * source_height / rows)
            bottom = round((row + 1) * source_height / rows)
            cell = clear_connected_checkerboard(source_image.crop((left, top, right, bottom)))
            bounds = cell.getbbox()
            if not bounds:
                continue
            figure = cell.crop(bounds)
            figure.thumbnail((58, 75), Image.Resampling.LANCZOS)
            figure = reduce_palette(figure, 48)
            x = column * cell_width + (cell_width - figure.width) // 2
            y = row * cell_height + 78 - figure.height
            output.alpha_composite(figure, (x, y))
    destination.parent.mkdir(parents=True, exist_ok=True)
    output.save(destination, "WEBP", lossless=True, method=6, exact=True)


def repack_action_sheet(source: Path, destination: Path) -> None:
    """Repack a 2x3 generated full-body pose board into six clean pixel cells."""
    source_image = Image.open(source).convert("RGBA")
    source_width, source_height = source_image.size
    cell_width, cell_height = 112, 160
    output = Image.new("RGBA", (cell_width * 2, cell_height * 3), (0, 0, 0, 0))
    for row in range(3):
        for column in range(2):
            left = round(column * source_width / 2)
            right = round((column + 1) * source_width / 2)
            top = round(row * source_height / 3)
            bottom = round((row + 1) * source_height / 3)
            cell = clear_connected_checkerboard(source_image.crop((left, top, right, bottom)))
            bounds = cell.getbbox()
            if not bounds:
                continue
            figure = cell.crop(bounds)
            figure.thumbnail((106, 154), Image.Resampling.LANCZOS)
            figure = reduce_palette(figure, 48)
            x = column * cell_width + (cell_width - figure.width) // 2
            y = row * cell_height + 157 - figure.height
            output.alpha_composite(figure, (x, y))
    destination.parent.mkdir(parents=True, exist_ok=True)
    output.save(destination, "WEBP", lossless=True, method=6, exact=True)


def main() -> None:
    scene_names = [
        "bedroom-v2",
        "bedroom-shifted-v2",
        "college-hall-v2",
        "college-hall-shifted-v2",
        "cafe-v2",
        "park-rain-v2",
        "library-v2",
        "arcade-v2",
        "station-rain-v2",
        "high-street-rain-v2",
    ]
    for name in scene_names:
        # 480x270 is intentionally the native art resolution. The 960x540
        # canvas doubles it with nearest-neighbour scaling for visible pixels.
        save_webp(ASSETS / "scenes" / f"{name}.png", WEB / "scenes" / f"{name}.webp", (480, 270), 91, 160)

    save_webp(ASSETS / "title" / "mara-bedroom-v2.png", WEB / "title" / "mara-bedroom-v2.webp", (320, 180), 92, 128)

    mara_sheets = ["warm", "vulnerable", "jealous", "intense", "romance", "anomalies"]
    for name in mara_sheets:
        repack_mara_sheet(
            ASSETS / "characters" / f"mara-portraits-{name}-v2.png",
            WEB / "characters" / f"mara-portraits-{name}-v2.webp",
        )

    for name in ["everyday", "distress"]:
        repack_action_sheet(
            ASSETS / "characters" / f"mara-actions-{name}-v2.png",
            WEB / "characters" / f"mara-actions-{name}-v2.webp",
        )

    for name in ["cast-portraits", "cast-portraits-happy-v2", "cast-portraits-concerned-v2"]:
        save_webp(ASSETS / "characters" / f"{name}.png", WEB / "characters" / f"{name}.webp", (384, 256), 91, 72)

    repack_directional_sheet(ASSETS / "characters" / "alex-walk.png", WEB / "characters" / "alex-walk.webp", 4)
    repack_directional_sheet(ASSETS / "characters" / "mara-walk.png", WEB / "characters" / "mara-walk.webp", 4)
    repack_directional_sheet(ASSETS / "characters" / "cast-directions.png", WEB / "characters" / "cast-directions.webp", 6)

    atlas_specs = {
        "furniture-atlas": (800, 640),
        "material-atlas": (512, 512),
        "outdoor-atlas": (800, 640),
    }
    for name, size in atlas_specs.items():
        save_webp(ASSETS / "environment" / f"{name}.png", WEB / "environment" / f"{name}.webp", size, 91, 128)

    count = len(list(WEB.rglob("*.webp")))
    total_mb = sum(path.stat().st_size for path in WEB.rglob("*.webp")) / 1024 / 1024
    print(f"Built {count} runtime images ({total_mb:.2f} MB) in {WEB}")


if __name__ == "__main__":
    main()
