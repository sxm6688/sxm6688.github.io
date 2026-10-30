from __future__ import annotations

from pathlib import Path

import qrcode
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from qrcode.constants import ERROR_CORRECT_H


ROOT = Path(__file__).resolve().parent
OUTPUT_DIR = ROOT / "assets" / "share"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

W, H = 1080, 1440
CREAM = "#f3f0e8"
INK = "#11110f"
MUTED = "#77736a"
LINE = "#d6d1c6"
CYAN = "#55e0d8"
WHITE = "#fffdf8"

FONT_CN = "C:/Windows/Fonts/msyh.ttc"
FONT_CN_BOLD = "C:/Windows/Fonts/msyhbd.ttc"
FONT_SERIF = "C:/Windows/Fonts/simsun.ttc"
FONT_MONO = "C:/Windows/Fonts/bahnschrift.ttf"
FONT_LOGO = "C:/Windows/Fonts/segoeuib.ttf"


def font(path: str, size: int, *, index: int = 0) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size=size, index=index)


sans_20 = font(FONT_CN, 20)
sans_22 = font(FONT_CN, 22)
sans_24 = font(FONT_CN, 24)
sans_26 = font(FONT_CN, 26)
sans_32 = font(FONT_CN, 32)
bold_22 = font(FONT_CN_BOLD, 22)
bold_24 = font(FONT_CN_BOLD, 24)
bold_28 = font(FONT_CN_BOLD, 28)
bold_34 = font(FONT_CN_BOLD, 34)
bold_52 = font(FONT_CN_BOLD, 52)
bold_56 = font(FONT_CN_BOLD, 56)
bold_88 = font(FONT_CN_BOLD, 88)
serif_84 = font(FONT_SERIF, 84)
serif_52 = font(FONT_SERIF, 52)
logo_64 = font(FONT_LOGO, 64)
mono_15 = font(FONT_MONO, 15)
mono_17 = font(FONT_MONO, 17)
mono_19 = font(FONT_MONO, 19)
mono_21 = font(FONT_MONO, 21)
mono_26 = font(FONT_MONO, 26)
mono_30 = font(FONT_MONO, 30)


def rounded(draw: ImageDraw.ImageDraw, box, radius, fill):
    draw.rounded_rectangle(box, radius=radius, fill=fill)


def text(
    draw: ImageDraw.ImageDraw,
    xy,
    value: str,
    *,
    fill=INK,
    fnt=sans_24,
    anchor=None,
):
    draw.text(xy, value, fill=fill, font=fnt, anchor=anchor)


def logo(draw: ImageDraw.ImageDraw, xy):
    """Match the site logo: heavy SXM glyphs with tight tracking and cyan dot."""
    x, y = xy
    tracking = -5
    for char in "SXM":
        draw.text((x, y), char, fill=INK, font=logo_64)
        x += draw.textlength(char, font=logo_64) + tracking
    draw.ellipse((x + 4, y + 6, x + 19, y + 21), fill=CYAN)
    return x + 22


def make_qr() -> Image.Image:
    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_H,
        box_size=18,
        border=4,
    )
    qr.add_data("https://sxm6688.github.io/?view=mobile")
    qr.make(fit=True)
    code = qr.make_image(fill_color=INK, back_color=WHITE).convert("RGBA")
    return code.resize((218, 218), Image.Resampling.NEAREST)


def make_background() -> Image.Image:
    image = Image.new("RGBA", (W, H), CREAM)

    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse((650, -250, 1350, 450), fill=(85, 224, 216, 27))
    glow = glow.filter(ImageFilter.GaussianBlur(150))
    image = Image.alpha_composite(image, glow)

    grain = Image.effect_noise((W, H), 12).convert("L")
    grain_rgba = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    grain_rgba.putalpha(grain.point(lambda value: int(value * 0.045)))
    return Image.alpha_composite(image, grain_rgba)


poster = make_background()
draw = ImageDraw.Draw(poster, "RGBA")

# Header. The logo keeps the same heavy weight and tight lettering as the website.
logo(draw, (72, 62))
draw.line((320, 65, 320, 125), fill=LINE, width=2)
text(draw, (344, 73), "SHAN XIAOMAN", fill=INK, fnt=mono_19)
text(draw, (344, 104), "VISUAL ARTIST", fill=MUTED, fnt=mono_15)
text(draw, (1008, 80), "PORTFOLIO / 2026", fill=MUTED, fnt=mono_17, anchor="ra")

draw.line((72, 166, 1008, 166), fill=INK, width=2)

# Main statement. Only one supporting line, with generous breathing room.
text(draw, (68, 222), "把世界，", fill=INK, fnt=bold_88)
text(draw, (68, 326), "写进", fill=INK, fnt=bold_88)
title_x = 68 + draw.textlength("写进", font=bold_88) + 8
text(draw, (title_x, 324), "作品里", fill=INK, fnt=serif_84)
period_x = title_x + draw.textlength("作品里", font=serif_84) + 3
draw.ellipse((period_x + 4, 396, period_x + 23, 415), fill=CYAN)

text(draw, (74, 466), "单小蔓 / 20岁视觉创作者", fill=INK, fnt=bold_28)
text(
    draw,
    (74, 515),
    "绘画 / 书法 / 设计 / 建模动画 / 分镜 / AI 影像",
    fill=MUTED,
    fnt=sans_24,
)

# One restrained graphic gesture: a clean cyan field and a fine orbit.
draw.line((72, 610, 1008, 610), fill=LINE, width=2)
draw.arc((378, 648, 982, 1068), start=184, end=338, fill=INK, width=3)
draw.ellipse((694, 670, 1006, 982), fill=CYAN)
draw.line((850, 780, 850, 872), fill=INK, width=3)
draw.line((804, 826, 896, 826), fill=INK, width=3)
draw.ellipse((843, 819, 857, 833), fill=INK)
draw.ellipse((447, 662, 461, 676), fill=CYAN)

text(draw, (78, 676), "IDEAS", fill=INK, fnt=mono_30)
text(draw, (78, 716), "IN MOTION", fill=MUTED, fnt=mono_30)
text(draw, (82, 793), "19 → 20", fill=INK, fnt=serif_52)
text(draw, (82, 866), "KEEP EXPLORING", fill=MUTED, fnt=mono_17)

# Quiet contact area with a single clear call to action.
rounded(draw, (72, 1102, 1008, 1368), 30, INK)
rounded(draw, (103, 1114, 345, 1356), 22, WHITE)
poster.alpha_composite(make_qr(), (115, 1126))

text(draw, (394, 1141), "SCAN TO EXPLORE", fill=CYAN, fnt=mono_17)
text(draw, (392, 1173), "扫描，进入", fill=WHITE, fnt=bold_52)
text(draw, (392, 1240), "我的作品世界", fill=WHITE, fnt=bold_52)
text(draw, (395, 1310), "sxm6688.github.io/?view=mobile", fill="#aaa69c", fnt=mono_19)

output = OUTPUT_DIR / "sxm-share-poster-mobile.png"
poster.convert("RGB").save(output, quality=96, optimize=True)
print(output)
