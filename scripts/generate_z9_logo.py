from PIL import Image, ImageDraw, ImageFont
import os

font_bold_large = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 72)
font_bold_mid = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 44)
font_sub = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 20)
font_tag = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 14)

# -------------------------------------------------------------------------
# 1. HORIZONTAL LOGO: assets/images/logo.png (600 x 160)
# -------------------------------------------------------------------------
img_logo = Image.new('RGBA', (620, 160), (255, 255, 255, 0))
draw = ImageDraw.Draw(img_logo)

# Shield Emblem (x=20, y=20, w=120, h=120)
badge_points = [
    (30, 25),
    (110, 25),
    (130, 60),
    (110, 125),
    (70, 142),
    (30, 125),
    (10, 60)
]

# Badge background
draw.polygon(badge_points, fill=(15, 23, 42, 255))
# Badge border
draw.line(badge_points + [badge_points[0]], fill=(255, 100, 60, 255), width=4)

# Speed lines inside badge
draw.line([(25, 45), (60, 45)], fill=(255, 100, 60, 200), width=3)
draw.line([(20, 55), (55, 55)], fill=(255, 100, 60, 160), width=3)

# 'Z9' inside badge
draw.text((36, 42), 'Z', font=font_bold_mid, fill=(255, 255, 255, 255))
draw.text((68, 42), '9', font=font_bold_mid, fill=(255, 100, 60, 255))

# Text on the right:
# 'Z9'
draw.text((155, 22), 'Z', font=font_bold_large, fill=(15, 23, 42, 255))
draw.text((215, 22), '9', font=font_bold_large, fill=(255, 100, 60, 255))

# 'AUTOMOTIVE'
# Letter-spaced text
auto_text = 'A U T O M O T I V E'
draw.text((158, 98), auto_text, font=font_sub, fill=(15, 23, 42, 255))

# Bottom orange speed accent bar
draw.rounded_rectangle([(158, 128), (430, 134)], radius=3, fill=(255, 100, 60, 255))

# Tagline
draw.text((445, 122), 'INSPECTION & WORKSHOP', font=font_tag, fill=(100, 116, 139, 255))

os.makedirs('assets/images', exist_ok=True)
img_logo.save('assets/images/logo.png', 'PNG')
print('Saved assets/images/logo.png')

# -------------------------------------------------------------------------
# 2. SQUARE APP ICON: assets/icon.png (1024 x 1024)
# -------------------------------------------------------------------------
img_icon = Image.new('RGBA', (1024, 1024), (15, 23, 42, 255))
draw_icon = ImageDraw.Draw(img_icon)

# Big shield in center
scale = 6.0
cx = 512
cy = 460

badge_big = [
    (cx - int(50 * scale), cy - int(55 * scale)),
    (cx + int(50 * scale), cy - int(55 * scale)),
    (cx + int(70 * scale), cy - int(10 * scale)),
    (cx + int(50 * scale), cy + int(60 * scale)),
    (cx, cy + int(80 * scale)),
    (cx - int(50 * scale), cy + int(60 * scale)),
    (cx - int(70 * scale), cy - int(10 * scale)),
]

draw_icon.polygon(badge_big, fill=(30, 41, 59, 255))
draw_icon.line(badge_big + [badge_big[0]], fill=(255, 100, 60, 255), width=24)

# Z9 in icon
font_icon_z = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 320)
font_icon_sub = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 72)

draw_icon.text((cx - 240, cy - 200), 'Z', font=font_icon_z, fill=(255, 255, 255, 255))
draw_icon.text((cx + 10, cy - 200), '9', font=font_icon_z, fill=(255, 100, 60, 255))

# Automotive text below badge
auto_big = 'A U T O M O T I V E'
bbox = draw_icon.textbbox((0, 0), auto_big, font=font_icon_sub)
tw = bbox[2] - bbox[0]
draw_icon.text((cx - tw // 2, 880), auto_big, font=font_icon_sub, fill=(255, 255, 255, 255))

# Top orange accent line
draw_icon.rectangle([(cx - 150, 970), (cx + 150, 982)], fill=(255, 100, 60, 255))

img_icon.save('assets/icon.png', 'PNG')
img_icon.save('assets/adaptive-icon.png', 'PNG')
print('Saved assets/icon.png & assets/adaptive-icon.png')
