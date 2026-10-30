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
PAPER = "#fbf9f3"
SOFT = "#e9e5db"
INK = "#11110f"
MUTED = "#706c63"
CYAN = "#55e0d8"
CORAL = "#ef6a3a"
WHITE = "#fffdf8"

FONT_CN = "C:/Windows/Fonts/msyh.ttc"
FONT_CN_BOLD = "C:/Windows/Fonts/msyhbd.ttc"
FONT_SERIF = "C:/Windows/Fonts/simsun.ttc"
FONT_MONO = "C:/Windows/Fonts/bahnschrift.ttf"


def font(path: str, size: int, *, index: int = 0) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size=size, index=index)


sans_18 = font(FONT_CN, 18)
sans_20 = font(FONT_CN, 20)
sans_22 = font(FONT_CN, 22)
sans_24 = font(FONT_CN, 24)
sans_28 = font(FONT_CN, 28)
sans_34 = font(FONT_CN, 34)
sans_42 = font(FONT_CN, 42)
bold_20 = font(FONT_CN_BOLD, 20)
bold_22 = font(FONT_CN_BOLD, 22)
bold_24 = font(FONT_CN_BOLD, 24)
bold_26 = font(FONT_CN_BOLD, 26)
bold_34 = font(FONT_CN_BOLD, 34)
bold_52 = font(FONT_CN_BOLD, 52)
bold_58 = font(FONT_CN_BOLD, 58)
bold_72 = font(FONT_CN_BOLD, 72)
bold_88 = font(FONT_CN_BOLD, 88)
serif_84 = font(FONT_SERIF, 84)
serif_320 = font(FONT_SERIF, 320)
brand_68 = font(FONT_MONO, 68)
mono_16 = font(FONT_MONO, 16)
mono_18 = font(FONT_MONO, 18)
mono_20 = font(FONT_MONO, 20)
mono_22 = font(FONT_MONO, 22)
mono_30 = font(FONT_MONO, 30)
mono_44 = font(FONT_MONO, 44)
mono_54 = font(FONT_MONO, 54)


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
    stroke_width=0,
    stroke_fill=None,
):
    draw.text(
        xy,
        value,
        fill=fill,
        font=fnt,
        anchor=anchor,
        stroke_width=stroke_width,
        stroke_fill=stroke_fill,
    )


def tracked_text(
    draw: ImageDraw.ImageDraw,
    xy,
    value: str,
    *,
    fill=INK,
    fnt=sans_20,
    tracking: int = 5,
):
    x, y = xy
    for char in value:
        draw.text((x, y), char, fill=fill, font=fnt)
        x += draw.textlength(char, font=fnt) + tracking
    return x


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
    return code.resize((244, 244), Image.Resampling.NEAREST)


def make_background() -> Image.Image:
    image = Image.new("RGB", (W, H), CREAM)

    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse((680, -260, 1380, 440), fill=(85, 224, 216, 46))
    glow = glow.filter(ImageFilter.GaussianBlur(120))
    image = Image.alpha_composite(image.convert("RGBA"), glow)

    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    rounded(shadow_draw, (64, 530, 1016, 934), 42, (17, 17, 15, 50))
    shadow = shadow.filter(ImageFilter.GaussianBlur(30))
    image = Image.alpha_composite(image, shadow)

    grain = Image.effect_noise((W, H), 16).convert("L")
    grain_rgba = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    grain_rgba.putalpha(grain.point(lambda value: int(value * 0.10)))
    image = Image.alpha_composite(image, grain_rgba)
    return image


poster = make_background()
draw = ImageDraw.Draw(poster, "RGBA")

# Header / logo
text(draw, (72, 58), "SXM", fill=INK, fnt=brand_68)
draw.ellipse((255, 112, 272, 129), fill=CYAN)
text(draw, (306, 72), "SHAN XIAOMAN", fill=INK, fnt=mono_20)
text(draw, (306, 106), "VISUAL ARTIST", fill=MUTED, fnt=mono_16)
text(draw, (1008, 76), "PORTFOLIO / 2026", fill=MUTED, fnt=mono_18, anchor="ra")

draw.line((72, 178, 1008, 178), fill=(17, 17, 15, 50), width=2)
text(draw, (72, 192), "20 / EARTH ONLINE", fill=MUTED, fnt=mono_18)
text(draw, (1008, 192), "MOBILE SHARE EDITION", fill=MUTED, fnt=mono_18, anchor="ra")

# Main editorial headline
text(draw, (68, 218), "把世界，", fill=INK, fnt=bold_88)

headline_y = 320
text(draw, (68, headline_y), "写进", fill=INK, fnt=bold_88)
accent_x = 68 + draw.textlength("写进", font=bold_88) + 8
text(draw, (accent_x, headline_y - 2), "作品里", fill=INK, fnt=serif_84)
period_x = accent_x + draw.textlength("作品里", font=serif_84) + 2
draw.ellipse((period_x + 4, headline_y + 70, period_x + 23, headline_y + 89), fill=CYAN)

text(draw, (74, 448), "单小蔓 · 20岁视觉创作者", fill=INK, fnt=bold_34)
text(
    draw,
    (74, 496),
    "作品、旅程，以及正在继续生长的生活。",
    fill=MUTED,
    fnt=sans_24,
)

# Main visual panel
rounded(draw, (72, 542, 1008, 934), 38, INK)

# Fine grid and axes
for x in (152, 232, 312, 392, 472, 552, 632, 712, 792, 872, 952):
    draw.line((x, 542, x, 934), fill=(243, 240, 232, 14), width=1)
for y in (622, 702, 782, 862):
    draw.line((72, y, 1008, y), fill=(243, 240, 232, 14), width=1)

# Cyan orbital form, intentionally crisp instead of muddy.
draw.ellipse((706, 606, 1002, 902), fill=CYAN)
draw.arc((650, 654, 980, 893), start=167, end=278, fill=(243, 240, 232, 125), width=3)
draw.arc((678, 622, 998, 841), start=350, end=466, fill=(17, 17, 15, 120), width=3)
draw.line((854, 754, 934, 754), fill=INK, width=4)
draw.line((894, 714, 894, 794), fill=INK, width=4)
draw.ellipse((886, 746, 902, 762), fill=INK)
draw.ellipse((679, 577, 697, 595), fill=CORAL)

# Typographic 20 and copy
text(draw, (86, 574), "SXM / VISUAL PRACTICE", fill=CYAN, fnt=mono_18)
text(draw, (94, 604), "20", fill=(243, 240, 232, 235), fnt=serif_320)
text(draw, (96, 838), "KEEP EXPLORING", fill=WHITE, fnt=mono_30)
draw.line((96, 887, 638, 887), fill=(243, 240, 232, 55), width=2)

categories = [
    ("01", "绘画"),
    ("02", "书法"),
    ("03", "设计"),
    ("04", "建模动画"),
    ("05", "分镜制作"),
    ("06", "AI 影像"),
]
category_x = [96, 255, 403, 545, 743, 926]
for (number, label), x in zip(categories, category_x):
    text(draw, (x, 901), number, fill=CYAN, fnt=mono_16, anchor="ma")
    if label == "建模动画":
        text(draw, (x, 874), label, fill=WHITE, fnt=sans_18, anchor="ma")
    elif label == "分镜制作":
        text(draw, (x, 874), label, fill=WHITE, fnt=sans_18, anchor="ma")
    elif label == "AI 影像":
        text(draw, (x, 874), label, fill=WHITE, fnt=sans_18, anchor="ma")
    else:
        text(draw, (x, 874), label, fill=WHITE, fnt=sans_20, anchor="ma")

# QR call-to-action panel
rounded(draw, (72, 1000, 1008, 1368), 34, SOFT)
rounded(draw, (96, 1024, 384, 1312), 24, WHITE)

qr = make_qr()
poster.alpha_composite(qr, (118, 1046))
text(draw, (251, 1322), "SCAN ME", fill=MUTED, fnt=mono_18, anchor="ma")

text(draw, (430, 1043), "PERSONAL WEBSITE / MOBILE", fill=MUTED, fnt=mono_18)
text(draw, (430, 1080), "扫码打开", fill=INK, fnt=bold_58)
text(draw, (430, 1152), "我的作品世界", fill=INK, fnt=bold_52)
text(draw, (432, 1224), "绘画 · 书法 · 旅行 · 建模 · 设计", fill=MUTED, fnt=sans_24)
draw.ellipse((434, 1282, 451, 1299), fill=CYAN)
text(
    draw,
    (466, 1279),
    "sxm6688.github.io/?view=mobile",
    fill=INK,
    fnt=mono_22,
)

# Footer details
text(draw, (72, 1394), "SHAN XIAOMAN  /  KEEP GROWING", fill=MUTED, fnt=mono_16)
text(draw, (1008, 1394), "2026", fill=MUTED, fnt=mono_16, anchor="ra")

output = OUTPUT_DIR / "sxm-share-poster-mobile.png"
poster.convert("RGB").save(output, quality=96, optimize=True)
print(output)
