"""Genera l'icona dell'app (Base Pizza) e aggiorna tutti i file che la usano.

Uso:  python3 scripts/build-icons.py            # rigenera con i parametri qui sotto
      (cambia KW per forma e proporzioni, INK/CREAM per i colori)

Dopo ogni rigenerazione cambia V (il contrassegno nei nomi file): i telefoni
memorizzano le icone per indirizzo per sempre, quindi un file nuovo con lo stesso
nome verrebbe letto nella vecchia versione.
"""
import base64
import json
import math
import os
import sys
import urllib.request

from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "public")
FONT = os.path.join(HERE, "Manrope-800.ttf")
V = "v6"          # contrassegno: cambialo a ogni nuova grafica
COLS = 64         # palette: tiene i bordi morbidi, file ~4 volte più piccolo

# Il marchio è Manrope (già caricato dal sito). Se il file non c'è, lo scarica.
FONT_URL = "https://fonts.gstatic.com/s/manrope/v20/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk59E-_F.ttf"

# --- colori: scuro su crema (oklch convertito a mano, come nel tema del sito) ---
def oklch(L, C, H):
    h = math.radians(H)
    a = C * math.cos(h)
    b = C * math.sin(h)
    l_ = L + 0.3963377774 * a + 0.2158037573 * b
    m_ = L - 0.1055613458 * a - 0.0638541728 * b
    s_ = L - 0.0894841775 * a - 1.2914855480 * b
    l, m, s = l_ ** 3, m_ ** 3, s_ ** 3
    r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
    g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
    bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s

    def gam(c):
        c = 0.0 if c < 0 else (1.0 if c > 1 else c)
        return 12.92 * c if c <= 0.0031308 else 1.055 * (c ** (1 / 2.4)) - 0.055

    return tuple(round(gam(x) * 255) for x in (r, g, bl))


INK = oklch(0.20, 0.012, 145)
CREAM = oklch(0.945, 0.035, 85)

# --- forma del disco: smerlatura da crostata, testo grande su due righe ---
KW = dict(bumps=20, lobe=1.28, crust=0.068, inner_line=0.0, target=0.575,
          gap_ratio=0.28, R=0.455)

S = 2048


def draw_icon(bumps, lobe, crust, inner_line, target, gap_ratio, R,
              inner_gap=0.055, word1="BASE", word2="PIZZA"):
    img = Image.new("RGB", (S, S), CREAM)
    d = ImageDraw.Draw(img)
    cx = cy = S / 2

    # bordo a crostata: una corona di lobi
    R = R * S
    r_b = R * math.sin(math.pi / bumps) * lobe
    for i in range(bumps):
        a = 2 * math.pi * i / bumps - math.pi / 2
        bx = cx + (R - r_b) * math.cos(a)
        by = cy + (R - r_b) * math.sin(a)
        d.ellipse([bx - r_b, by - r_b, bx + r_b, by + r_b], fill=INK)

    # campo interno: lascia solo l'anello del cornicione
    R_in = R - crust * S
    d.ellipse([cx - R_in, cy - R_in, cx + R_in, cy + R_in], fill=CREAM)

    # sottile bordo interno (di default spento: a 60px impasta)
    if inner_line:
        t = inner_line * S
        r2 = R_in - inner_gap * S
        d.ellipse([cx - r2 - t, cy - r2 - t, cx + r2 + t, cy + r2 + t],
                  outline=INK, width=int(t))

    # scritte: entrambe giustificate alla stessa larghezza
    if not os.path.exists(FONT):
        urllib.request.urlretrieve(FONT_URL, FONT)
    tw = target * S
    size = 180
    while True:
        f = ImageFont.truetype(FONT, size)
        if sum(d.textlength(c, font=f) for c in word2) >= tw * 0.94:
            break
        size += 4
    font = ImageFont.truetype(FONT, size)

    def line(text, y_center):
        widths = [d.textlength(c, font=font) for c in text]
        extra = (tw - sum(widths)) / (len(text) - 1)
        x = cx - tw / 2
        for c, w in zip(text, widths):
            bb = font.getbbox(c)
            d.text((x, y_center - (bb[1] + bb[3]) / 2), c, font=font, fill=INK)
            x += w + extra

    cap = font.getbbox("X")
    lead = (cap[3] - cap[1]) * (1 + gap_ratio)
    line(word1, cy - lead / 2)
    line(word2, cy + lead / 2)
    return img


def main():
    master = draw_icon(**KW).resize((1024, 1024), Image.LANCZOS)

    def sq(size):
        return master.resize((size, size), Image.LANCZOS)

    def save(im, path):
        im.quantize(colors=COLS, method=Image.MEDIANCUT).save(path, optimize=True)

    for name, size in [("apple-touch-icon", 180), ("apple-touch-icon-precomposed", 180),
                       ("apple-touch-icon-120x120", 120), ("apple-touch-icon-152x152", 152),
                       ("apple-touch-icon-167x167", 167)]:
        save(sq(size), f"{OUT}/{name}-{V}.png")

    save(sq(192), f"{OUT}/icon-192-{V}.png")
    save(sq(512), f"{OUT}/icon-512-{V}.png")

    # maskable: il segno sta nell'area di sicurezza all'80%
    m512 = Image.new("RGB", (512, 512), CREAM)
    mark = sq(410)
    m512.paste(mark, ((512 - 410) // 2, (512 - 410) // 2))
    save(m512, f"{OUT}/icon-maskable-512-{V}.png")

    save(sq(64), f"{OUT}/favicon-{V}.png")
    sq(64).save(f"{OUT}/favicon-{V}.ico", format="ICO",
                sizes=[(16, 16), (32, 32), (48, 48)])

    manifest = {
        "name": "Basex Pizza — Strano Ma Vero!",
        "short_name": "Basex Pizza",
        "description": "Base pizza cotta al 90% nel forno a legna e condimenti preconfezionati da finire a casa.",
        "start_url": "/",
        "scope": "/",
        "display": "standalone",
        "background_color": f"#{CREAM[0]:02x}{CREAM[1]:02x}{CREAM[2]:02x}",
        "theme_color": "#c45c26",
        "icons": [
            {"src": f"/icon-192-{V}.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
            {"src": f"/icon-512-{V}.png", "sizes": "512x512", "type": "image/png", "purpose": "any"},
            {"src": f"/icon-maskable-512-{V}.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
        ],
    }
    for f in (f"manifest-{V}.json", "manifest.json"):
        with open(f"{OUT}/{f}", "w") as fh:
            json.dump(manifest, fh, indent=2, ensure_ascii=False)
            fh.write("\n")

    # icona incorporata nella pagina: il telefono non deve scaricarla a parte
    with open(f"{OUT}/apple-touch-icon-{V}.png", "rb") as fh:
        data = base64.b64encode(fh.read()).decode()
    with open(os.path.join(ROOT, "src", "lib", "touch-icon.ts"), "w") as fh:
        fh.write("// Icona per la schermata Home: incorporata nella pagina, così il telefono\n")
        fh.write("// non deve scaricarla a parte (era quel download a fallire, mostrando una lettera).\n")
        fh.write(f"// Rigenerato da public/apple-touch-icon-{V}.png con scripts/build-icons.py.\n")
        fh.write("export const touchIconDataUri =\n")
        fh.write('  "data:image/png;base64,' + data + '";\n')

    print(f"icona {V} generata: {len(data)} caratteri incorporati, {len(os.listdir(OUT))} file in public/")


if __name__ == "__main__":
    from PIL import ImageDraw, ImageFont  # noqa: F401  (servono a draw_icon)
    main()
