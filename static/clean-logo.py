"""
Clean SVG logo generator from PNG source.
Reads vcp-logo.png, quantizes colors, traces regions with simplified contours,
outputs a clean SVG with fewer paths.
"""

from collections import Counter

import numpy as np
from PIL import Image


def rgb_to_hex(r, g, b):
    return f"#{r:02x}{g:02x}{b:02x}"


def simplify_contour(contour, tolerance=2.0):
    """Douglas-Peucker line simplification."""
    if len(contour) <= 2:
        return contour

    # Find point furthest from line between first and last
    start, end = np.array(contour[0]), np.array(contour[-1])
    line_vec = end - start
    line_len = np.linalg.norm(line_vec)

    if line_len == 0:
        return [contour[0]]

    line_unit = line_vec / line_len

    max_dist = 0
    max_idx = 0
    for i in range(1, len(contour) - 1):
        pt = np.array(contour[i])
        vec = pt - start
        proj = np.dot(vec, line_unit)
        proj = max(0, min(line_len, proj))
        closest = start + proj * line_unit
        dist = np.linalg.norm(pt - closest)
        if dist > max_dist:
            max_dist = dist
            max_idx = i

    if max_dist > tolerance:
        left = simplify_contour(contour[: max_idx + 1], tolerance)
        right = simplify_contour(contour[max_idx:], tolerance)
        return left[:-1] + right
    else:
        return [contour[0], contour[-1]]


def trace_color_region(mask, simplification=2.0):
    """Simple contour tracing for a binary mask."""
    h, w = mask.shape

    # Find contour using marching squares-like approach
    # Scan for boundary pixels
    boundary = np.zeros_like(mask, dtype=bool)
    for y in range(h):
        for x in range(w):
            if mask[y, x]:
                # Check if any neighbor is not in mask
                is_boundary = False
                for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                    ny, nx = y + dy, x + dx
                    if ny < 0 or ny >= h or nx < 0 or nx >= w or not mask[ny, nx]:
                        is_boundary = True
                        break
                if is_boundary:
                    boundary[y, x] = True

    # Convert boundary to path points - just collect them in scan order
    # For SVG, we'll create a filled region from the mask directly
    # Use runs-based approach for cleaner output
    paths = []
    for y in range(h):
        x = 0
        while x < w:
            if mask[y, x]:
                start_x = x
                while x < w and mask[y, x]:
                    x += 1
                paths.append((start_x, y, x - start_x))
            else:
                x += 1

    return paths


def mask_to_svg_path(mask, simplification=1.5):
    """Convert binary mask to SVG path using horizontal spans, then merge."""
    h, w = mask.shape

    # Collect horizontal runs per row
    rows = {}
    for y in range(h):
        runs = []
        x = 0
        while x < w:
            if mask[y, x]:
                start_x = x
                while x < w and mask[y, x]:
                    x += 1
                runs.append((start_x, x))
            else:
                x += 1
        if runs:
            rows[y] = runs

    if not rows:
        return ""

    # Build SVG path from runs (rect-based for cleanliness)
    parts = []
    for y in sorted(rows.keys()):
        for x1, x2 in rows[y]:
            parts.append(f"M{x1} {y}h{x2 - x1}v1h{x1 - x2}z")

    return " ".join(parts)


def main():
    img = Image.open("/Users/nellwatson/Documents/GitHub/Rewind/vcp-demo/static/vcp-logo.png")
    img = img.convert("RGBA")

    # Resize to reduce complexity while keeping detail
    target_size = 128
    img = img.resize((target_size, target_size), Image.LANCZOS)

    pixels = np.array(img)
    h, w = pixels.shape[:2]

    # Quantize colors - reduce to key palette
    # Flatten and find dominant colors
    flat = pixels.reshape(-1, 4)
    # Filter out nearly-transparent pixels
    opaque = flat[flat[:, 3] > 128]

    # Quantize to fewer colors using simple binning
    quantized = (opaque[:, :3] // 32) * 32 + 16
    color_counts = Counter(map(tuple, quantized))

    # Get top colors (skip background)
    bg_color = (31, 34, 42)  # #1f222a from the SVG
    top_colors = []
    for color, count in color_counts.most_common(30):
        if count < 20:
            continue
        # Skip if too close to background
        diff = sum(abs(a - b) for a, b in zip(color, bg_color))
        if diff < 60:
            continue
        top_colors.append((color, count))

    print(f"Found {len(top_colors)} significant colors")
    for c, n in top_colors[:15]:
        print(f"  {rgb_to_hex(*c)}: {n} pixels")

    # Build SVG with cleaner approach - use the quantized image directly
    # Re-quantize the full image
    q_pixels = pixels.copy()
    q_pixels[:, :, :3] = (q_pixels[:, :, :3] // 24) * 24 + 12

    # Build color layers
    svg_parts = []
    svg_parts.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="224" height="224">')

    # Background
    svg_parts.append(f'<rect width="{w}" height="{h}" fill="#1f222a"/>')

    # For each unique color, create a single path
    unique_colors = {}
    for y in range(h):
        for x in range(w):
            r, g, b, a = q_pixels[y, x]
            if a < 128:
                continue
            color = (int(r), int(g), int(b))
            diff = sum(abs(a - b) for a, b in zip(color, bg_color))
            if diff < 40:
                continue
            key = rgb_to_hex(*color)
            if key not in unique_colors:
                unique_colors[key] = np.zeros((h, w), dtype=bool)
            unique_colors[key][y, x] = True

    print(f"Building {len(unique_colors)} color layers...")

    # Sort by luminance (darker first, lighter on top)
    sorted_colors = sorted(unique_colors.items(), key=lambda x: sum(int(x[0][i : i + 2], 16) for i in (1, 3, 5)))

    for hex_color, mask in sorted_colors:
        pixel_count = mask.sum()
        if pixel_count < 10:
            continue
        path_d = mask_to_svg_path(mask)
        if path_d:
            svg_parts.append(f'<path fill="{hex_color}" d="{path_d}"/>')

    svg_parts.append("</svg>")

    svg_content = "\n".join(svg_parts)

    outpath = "/Users/nellwatson/Documents/GitHub/Rewind/vcp-demo/static/vcp-logo-clean.svg"
    with open(outpath, "w") as f:
        f.write(svg_content)

    print(f"Written to {outpath}")
    print(f"File size: {len(svg_content)} bytes")


if __name__ == "__main__":
    main()
