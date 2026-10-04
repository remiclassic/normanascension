# Prepares the site's images from the unretouched in-engine captures.
#   python tools/build-assets.py
# Sources live in the (private) engine repo's marketing folder; outputs go to assets/img.
import os
from PIL import Image, ImageDraw, ImageFilter

SRC = "C:/Users/Remi Couture/Documents/NormanEngine/marketing/steam/"
SHOTS = SRC + "screenshots-2026-10-03/4k/"
OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "img")
TEMP = os.environ.get("TEMP", ".")
os.makedirs(OUT, exist_ok=True)


def save(im, name, w, q=84):
    h = round(im.height * w / im.width)
    im.resize((w, h), Image.LANCZOS).save(os.path.join(OUT, name), quality=q, method=6)


gallery = [
    ("23-walking-to-the-mont", "mont-traveller"),
    ("03-wheat-field-sunset", "wheat-sunset"),
    ("22-torchlight-in-the-forest", "torchlight-forest"),
    ("02-etretat-cliffs-sunset", "etretat-sunset"),
    ("24-traveller-forest-ride", "forest-ride"),
    ("28-traveller-in-snow", "winter-lane"),
    ("08-forest-hills-dawn-mist", "forest-mist"),
    ("21-torchlight-under-the-stars", "torchlight-stars"),
    ("11-etretat-coast-from-air", "etretat-air"),
    ("13-storm-on-the-lane", "storm-lane"),
    ("26-traveller-wheat-sunset", "wheat-traveller"),
    ("01-mont-saint-michel-dawn", "mont-dawn"),
    ("09-winter-meadow-frost", "winter-frost"),
    ("06-lane-hazy-morning", "lane-haze"),
    ("27-traveller-autumn-forest", "autumn-forest"),
    ("25-traveller-on-the-lane", "lane-traveller"),
]
for a, b in gallery:
    im = Image.open(SHOTS + a + ".png").convert("RGB")
    save(im, b + ".webp", 1920)
    save(im, b + "-800.webp", 800, 80)

for t, name in [("8.5", "battle-archers"), ("26.5", "battle-shield-wall"), ("36.2", "battle-helmets"), ("33", "battle-poster")]:
    im = Image.open(os.path.join(TEMP, f"nb-{t}.png")).convert("RGB")
    save(im, name + ".webp", 1920)
    save(im, name + "-800.webp", 800, 80)

# logo, hero poster, favicon
logo = Image.open(SRC + "library-logo.png").convert("RGBA")
logo.save(os.path.join(OUT, "logo.png"), optimize=True)
logo.resize((640, round(logo.height * 640 / logo.width)), Image.LANCZOS).save(os.path.join(OUT, "logo-640.png"), optimize=True)
hero = Image.open(SHOTS + "23-walking-to-the-mont.png").convert("RGB")
hero.resize((1920, 1080), Image.LANCZOS).save(os.path.join(OUT, "hero-poster.jpg"), quality=82, optimize=True, progressive=True)
icon = Image.open(SRC + "app-icon.png").convert("RGB")
icon.resize((180, 180), Image.LANCZOS).save(os.path.join(OUT, "apple-touch-icon.png"))
icon.resize((48, 48), Image.LANCZOS).save(os.path.join(OUT, "favicon.png"))

# social card: wheat sunset, darkened, with the logo
og = Image.open(SHOTS + "03-wheat-field-sunset.png").convert("RGB").resize((1200, 675), Image.LANCZOS).crop((0, 22, 1200, 652))
shade = Image.new("L", og.size, 0)
d = ImageDraw.Draw(shade)
d.rectangle([0, 0, 1200, 630], fill=120)
og = Image.composite(Image.new("RGB", og.size, (10, 12, 10)), og, shade.filter(ImageFilter.GaussianBlur(1)))
lw = 820
l2 = logo.resize((lw, round(logo.height * lw / logo.width)), Image.LANCZOS)
og.paste(l2, ((1200 - lw) // 2, (630 - l2.height) // 2 - 20), l2)
og.save(os.path.join(OUT, "social-card.jpg"), quality=86, optimize=True)
print("ok", len(os.listdir(OUT)), "files")
