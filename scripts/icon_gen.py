import os
from PIL import Image, ImageDraw, ImageFont

size = (1024, 1024)
icon = Image.new("RGBA", size, (255, 255, 255, 0))
draw = ImageDraw.Draw(icon)

bg_color = (26, 37, 54, 255)
mask = Image.new("L", size, 0)
mask_draw = ImageDraw.Draw(mask)
mask_draw.rounded_rectangle([(0, 0), (1024, 1024)], radius=220, fill=255)

bg = Image.new("RGBA", size, bg_color)
glow = Image.new("RGBA", size, (0, 0, 0, 0))
glow_draw = ImageDraw.Draw(glow)
glow_draw.ellipse([212, 100, 812, 700], fill=(42, 63, 94, 255))
bg = Image.alpha_composite(bg, glow)

draw_bg = ImageDraw.Draw(bg)
draw_bg.ellipse([280, 220, 420, 360], fill=(18, 18, 18, 255))
draw_bg.ellipse([604, 220, 744, 360], fill=(18, 18, 18, 255))
draw_bg.ellipse([312, 260, 712, 600], fill=(245, 245, 245, 255))

left_patch = Image.new("RGBA", size, (0, 0, 0, 0))
lp_draw = ImageDraw.Draw(left_patch)
lp_draw.ellipse([370, 360, 480, 480], fill=(30, 30, 30, 255))
right_patch = Image.new("RGBA", size, (0, 0, 0, 0))
rp_draw = ImageDraw.Draw(right_patch)
rp_draw.ellipse([544, 360, 654, 480], fill=(30, 30, 30, 255))

bg = Image.alpha_composite(bg, left_patch)
bg = Image.alpha_composite(bg, right_patch)
draw_bg = ImageDraw.Draw(bg)

draw_bg.ellipse([410, 395, 450, 435], fill=(255, 255, 255, 255))
draw_bg.ellipse([422, 407, 442, 427], fill=(10, 10, 10, 255))
draw_bg.ellipse([430, 411, 438, 419], fill=(255, 255, 255, 255))
draw_bg.ellipse([574, 395, 614, 435], fill=(255, 255, 255, 255))
draw_bg.ellipse([582, 407, 602, 427], fill=(10, 10, 10, 255))
draw_bg.ellipse([586, 411, 594, 419], fill=(255, 255, 255, 255))

draw_bg.ellipse([462, 450, 562, 530], fill=(235, 235, 235, 255))
draw_bg.polygon([(487, 465), (537, 465), (512, 490)], fill=(20, 20, 20, 255))
draw_bg.arc([482, 485, 512, 510], start=0, end=180, fill=(20, 20, 20, 255), width=5)
draw_bg.arc([512, 485, 542, 510], start=0, end=180, fill=(20, 20, 20, 255), width=5)
draw_bg.ellipse([340, 450, 390, 490], fill=(240, 170, 175, 120))
draw_bg.ellipse([634, 450, 684, 490], fill=(240, 170, 175, 120))

draw_bg.polygon([(340, 570), (684, 570), (740, 760), (284, 760)], fill=(45, 52, 64, 255))
draw_bg.polygon([(472, 570), (552, 570), (512, 670)], fill=(255, 255, 255, 255))
draw_bg.polygon([(502, 610), (522, 610), (532, 730), (512, 750), (492, 730)], fill=(21, 101, 192, 255))
draw_bg.polygon([(340, 570), (460, 570), (410, 690), (310, 650)], fill=(34, 40, 49, 255))
draw_bg.polygon([(684, 570), (564, 570), (614, 690), (714, 650)], fill=(34, 40, 49, 255))

try:
    font_title = ImageFont.truetype("Arial.ttf", 76)
    font_sub = ImageFont.truetype("Arial.ttf", 38)
except Exception:
    font_title = ImageFont.load_default()
    font_sub = ImageFont.load_default()

draw_bg.text((512, 820), "Pandinyo", fill=(255, 255, 255, 255), font=font_title, anchor="mm")
draw_bg.text((512, 900), "Business English", fill=(170, 190, 210, 255), font=font_sub, anchor="mm")

final_icon = Image.new("RGBA", size)
final_icon.paste(bg, (0, 0), mask=mask)

out = os.path.join(os.path.dirname(__file__), "pandinyo_app_icon.png")
final_icon.save(out, "PNG")
print("Başarılı! '%s' kaydedildi." % out)
