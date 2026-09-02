# Mallow Street — geometry-first replacement

Built-in image generation, one project-bound environment. The collision template
is `src/geometry-world.js` → `ROOMS.street`; never derive collision from this image.

Use case: stylized-concept. Asset type: production 2D RPG environment background.
Generate a 16:9 original pixel-art residential street in a cozy English college town.
Use deliberate, simple pixel clusters, a limited warm brick/moss/cream palette,
crisp outlines and readable paving. No people, text, UI, particles or baked rain.
Flat elevated RPG camera, looking north; horizontal street, no vanishing point.
Reference image is palette/material mood only, NOT the layout.

Strict spatial template below uses a 480×270 logical art grid. Scale proportionally
if output is larger. Fit scenery to this template; leave all other ground open.

- Left brick row house: x28–158, base y113, roof/top y5. Front door centered x92, threshold y113.
- Low central garden wall x190–300, top y32, base y91; garden gate centered x242. Path from gate to y121.
- Right brick row house: x335–450, base y109, roof/top y5.
- Pavement along houses at y113–130. Open quiet street, slate paving/asphalt, y130–230. Soft grassy curb y230–263.
- Small noticeboard x155–176, top y115, ground base y164.
- Bench x147–195, top y166, ground base y196. Do not join it to the noticeboard.
- Bus shelter x348–439, roof y111, ground footprint y156–180. All poles inside this footprint.
- Slender bus-stop post x323–333, top y108, ground base y191.
- Right route remains clear around x451,y216. House approach x92,y119, park approach x242,y121,
  bus approach x391,y191, noticeboard approach x166,y179 must be empty walkable ground.

No extra planters, obstacles, cars, fences across the road, trees in the walking
area or decorative objects that would require new collision. Warm daylight.
Pixel art first, not an oil painting or blurred illustration. No characters.
