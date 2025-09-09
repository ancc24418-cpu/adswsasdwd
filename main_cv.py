# main_cv.py - pipeline: image -> detect dots -> form grid -> analyze -> render
import argparse
import cv2
from image_processor import preprocess_image, adaptive_dot_detection, draw_detected_dots
from grid import create_grid_from_detected_dots
from renderer import render_grid_with_loops, animate_kolam
from analyzer import analyze_symmetries
import matplotlib.pyplot as plt

def run_pipeline(image_path, style='loop', animate=False, show_detected=True):
    img = cv2.imread(image_path)
    original, gray, blur = preprocess_image(img)
    dot_grid, clean_img = adaptive_dot_detection(blur)
    total_dots = sum(len(row) for row in dot_grid)
    print(f'Detected {total_dots} dots')
    if show_detected:
        out = draw_detected_dots(original, dot_grid)
        out_rgb = cv2.cvtColor(out, cv2.COLOR_BGR2RGB)
        plt.figure(figsize=(6,6))
        plt.imshow(out_rgb)
        plt.axis('off')
        plt.title('Detected dots')
        plt.show()
    if not dot_grid:
        print('Could not form a grid from dots')
        return
    print(f'Formed dot grid with {len(dot_grid)} rows')
    sym = analyze_symmetries(dot_grid)
    print('Symmetry analysis:')
    for k,v in sym.items():
        print(f' - {k}: {v}')
    if animate:
        ani = animate_kolam(dot_grid, style=style, scale=1.0)
        plt.show()
    else:
        render_grid_with_loops(dot_grid, style=style, scale=1.0)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--image', required=True)
    parser.add_argument('--style', default='loop')
    parser.add_argument('--animate', action='store_true')
    args = parser.parse_args()
    run_pipeline(args.image, style=args.style, animate=args.animate)
