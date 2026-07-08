import os, random

random.seed(42)

categories = {
    "roads": {"colors": ["#4a5568","#718096","#2d3748"], "label": "Road Damage", "icon": "road"},
    "potholes": {"colors": ["#c53030","#e53e3e","#742a2a"], "label": "Pothole Hazard", "icon": "hole"},
    "water": {"colors": ["#2b6cb0","#3182ce","#1a365d"], "label": "Water Crisis", "icon": "drop"},
    "drainage": {"colors": ["#2d3748","#4a5568","#1a202c"], "label": "Drainage Issue", "icon": "drain"},
    "garbage": {"colors": ["#553c9a","#6b46c1","#322659"], "label": "Garbage Dump", "icon": "trash"},
    "electricity": {"colors": ["#1a202c","#2d3748","#000000"], "label": "Power Outage", "icon": "bolt"},
    "streetlights": {"colors": ["#c05621","#dd6b20","#7b341e"], "label": "Street Light Out", "icon": "light"},
    "healthcare": {"colors": ["#276749","#38a169","#1a4731"], "label": "Health Center", "icon": "med"},
    "schools": {"colors": ["#2c5282","#3182ce","#1a365d"], "label": "School Issue", "icon": "school"},
    "traffic": {"colors": ["#744210","#975a16","#422006"], "label": "Traffic Problem", "icon": "sign"},
    "construction": {"colors": ["#6b4226","#8b5e3c","#3e2716"], "label": "Construction", "icon": "build"},
    "parks": {"colors": ["#276749","#48bb78","#14532d"], "label": "Park Issue", "icon": "tree"},
    "flooding": {"colors": ["#2b6cb0","#4299e1","#1a365d"], "label": "Flooding", "icon": "wave"},
    "pollution": {"colors": ["#742a2a","#9b2c2c","#3b1111"], "label": "Pollution", "icon": "factory"},
}

base_dir = os.path.join("backend", "media", "demo")
w, h = 800, 600

for cat, info in categories.items():
    cat_dir = os.path.join(base_dir, cat)
    os.makedirs(cat_dir, exist_ok=True)
    colors = info["colors"]
    label = info["label"]

    for i in range(4):
        seed_val = hash(f"{cat}-{i}") % 10000
        rng = random.Random(seed_val)

        bg = colors[i % len(colors)]
        accent = colors[(i + 1) % len(colors)]

        shapes = []
        for _ in range(rng.randint(5, 10)):
            shape = rng.choice(["circle", "rect"])
            opacity = round(rng.uniform(0.05, 0.15), 2)
            if shape == "circle":
                cx = rng.randint(0, w)
                cy = rng.randint(0, h)
                r = rng.randint(40, 180)
                shapes.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{accent}" opacity="{opacity}"/>')
            else:
                x = rng.randint(0, w - 50)
                y = rng.randint(0, h - 50)
                rw = rng.randint(60, 250)
                rh = rng.randint(60, 250)
                shapes.append(f'<rect x="{x}" y="{y}" width="{rw}" height="{rh}" rx="8" fill="{accent}" opacity="{opacity}"/>')

        pattern_circles = []
        for _ in range(rng.randint(3, 6)):
            cx = rng.randint(50, w - 50)
            cy = rng.randint(50, h - 50)
            r = rng.randint(20, 80)
            pattern_circles.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{accent}" stroke-width="2" opacity="0.12"/>')

        accent_bar = f'<rect x="0" y="0" width="{w}" height="8" fill="{accent}" opacity="0.7"/>'

        cx_icon, cy_icon = w // 2, h // 2 - 40
        icon_outer = f'<circle cx="{cx_icon}" cy="{cy_icon}" r="60" fill="{accent}" opacity="0.12"/>'
        icon_inner = f'<circle cx="{cx_icon}" cy="{cy_icon}" r="35" fill="{accent}" opacity="0.25"/>'

        font_size = rng.randint(22, 28)
        text_main = f'<text x="50%" y="{h//2 + 35}" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="{font_size}" font-weight="700" fill="white" opacity="0.9">{label}</text>'
        text_sub = f'<text x="50%" y="{h//2 + 60}" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="13" fill="white" opacity="0.5">Constituency #{i+1} · Demo Image</text>'

        bottom_bar = f'<rect x="0" y="{h - 40}" width="{w}" height="40" fill="black" opacity="0.25"/>'
        bottom_text = f'<text x="50%" y="{h - 14}" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="11" fill="white" opacity="0.5">Category: {cat.title()} · MP Portal Demo</text>'

        badge = f'<rect x="{w - 140}" y="16" width="124" height="28" rx="14" fill="{accent}" opacity="0.2"/>'
        badge_text = f'<text x="{w - 78}" y="34" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="11" fill="{accent}" opacity="0.8">{cat.title()}</text>'

        shapes_str = "\n  ".join(shapes)
        pattern_str = "\n  ".join(pattern_circles)

        grid = f'<pattern id="grid{i}" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="0.5" opacity="0.03"/></pattern>'
        grid_rect = f'<rect width="100%" height="100%" fill="url(#grid{i})"/>'

        svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">
  <defs>
    <linearGradient id="bg{i}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{bg}"/>
      <stop offset="50%" stop-color="{accent}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="{bg}"/>
    </linearGradient>
    {grid}
  </defs>
  <rect width="100%" height="100%" fill="url(#bg{i})"/>
  {grid_rect}
  {shapes_str}
  {pattern_str}
  {accent_bar}
  {icon_outer}
  {icon_inner}
  {text_main}
  {text_sub}
  {bottom_bar}
  {bottom_text}
  {badge}
  {badge_text}
</svg>'''

        filename = f"{cat}-{i+1}.svg"
        filepath = os.path.join(cat_dir, filename)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(svg)
        print(f"Created: {filepath}")

    # Also create a .jpg copy for backward compatibility
    # (the backend serves .jpg demos, but we'll keep SVGs as primary)

print("Done! All images generated.")
