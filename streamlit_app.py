# streamlit_app.py - simple Streamlit interface to upload an image and render recreated kolam
import streamlit as st
from image_processor import preprocess_image, adaptive_dot_detection, draw_detected_dots
from grid import create_grid_from_detected_dots
from renderer import render_grid_with_loops, animate_kolam
import cv2
import numpy as np
from PIL import Image

st.title('Kolam Analyzer & Generator')
uploaded = st.file_uploader('Upload a Kolam image (jpg/png)', type=['jpg','jpeg','png'])
style = st.selectbox('Choose motif style', ['loop','spiral','cross','diagonal','tiling','arc'])
animate = st.checkbox('Animate drawing')

if uploaded is not None:
    file_bytes = np.asarray(bytearray(uploaded.read()), dtype=np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
    st.image(cv2.cvtColor(img, cv2.COLOR_BGR2RGB), caption='Uploaded image', use_column_width=True)
    if st.button('Analyze & Recreate'):
        original, gray, blur = preprocess_image(img)
        dot_grid, clean_img = adaptive_dot_detection(blur)
        total_dots = sum(len(row) for row in dot_grid)
        st.write(f'Detected {total_dots} dots')
        out = draw_detected_dots(original, dot_grid)
        st.image(cv2.cvtColor(out, cv2.COLOR_BGR2RGB), caption='Detected dots')
        if not dot_grid:
            st.error('Could not form a dot grid from the detected dots')
        else:
            st.success(f'Formed grid with {len(dot_grid)} rows')
            if animate:
                st.info('Animation will open in a separate window (matplotlib).')
                ani = animate_kolam(dot_grid, style=style)
                import matplotlib.pyplot as plt
                plt.show()
            else:
                fig, ax = render_grid_with_loops(dot_grid, style=style, show=False)
                st.pyplot(fig)
