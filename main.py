# main.py - demo script to generate a synthetic grid and draw various styles
from grid import create_dot_grid
from renderer import render_grid_with_loops, animate_kolam
import argparse

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--rows', type=int, default=5)
    parser.add_argument('--cols', type=int, default=5)
    parser.add_argument('--style', type=str, default='loop')
    parser.add_argument('--animate', action='store_true')
    args = parser.parse_args()

    grid = create_dot_grid(args.rows, args.cols, spacing=1.0)
    if args.animate:
        ani = animate_kolam(grid, style=args.style, scale=1.0)
        # to show animation inside script
        import matplotlib.pyplot as plt
        plt.show()
    else:
        render_grid_with_loops(grid, style=args.style, scale=1.0)

if __name__ == '__main__':
    main()
