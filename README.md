    # Kolam Generator & Analyzer (Python)

This repository contains a working Kolam (muggu/rangoli) analyzer and generator with OpenCV integration and a Streamlit app for interactive use.

## Features
    - Dot detection from images using OpenCV
    - Grid formation and symmetry analysis (reflections + rotations)
    - Multiple motif styles (loop, arc, cross, diagonal cross, spiral, tiling)
    - Animated drawing via matplotlib.animation
    - Simple CNN placeholder for later training/integration
    - Streamlit app for upload + motif selection + animated rendering

## Requirements
    Recommended creating a virtualenv.

```bash
    pip install -r requirements.txt
    ```

Optional for interactive canvas (install separately):
    - streamlit-drawable-canvas (pip install streamlit-drawable-canvas)

    ## Run locally
    - Run CLI image pipeline:
      ```bash
      python main_cv.py --image kolam_sample.jpg --style loop --animate True
      ```
    - Run Streamlit app:
      ```bash
      streamlit run streamlit_app.py
      ```

Files of interest:
- main.py (demo grid generation)
- main_cv.py (image -> detect -> recreate)
- streamlit_app.py (web UI)
- motifs.py (motif functions)
- renderer.py (rendering & animation)
- image_processor.py (OpenCV dot detection)
