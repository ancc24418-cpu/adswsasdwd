# Kolam Generator & Analyzer (Web)

This is a web-based Kolam (muggu/rangoli) analyzer and generator that runs entirely in the browser using HTML5 Canvas and JavaScript.

## Features
- Interactive web interface for kolam generation
- Image upload and basic dot detection
- Grid formation and symmetry analysis (reflections + rotations)
- Multiple motif styles (loop, arc, cross, diagonal cross, spiral, tiling)
- Animated drawing using HTML5 Canvas
- Responsive design that works on desktop and mobile
- Download generated kolam as PNG image

## Usage
Simply open `index.html` in a web browser or deploy to any static hosting service like Netlify, Vercel, or GitHub Pages.

### Local Development
1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. Start creating kolam patterns!

### Deployment
This is a static web application that can be deployed to:
- Netlify (drag and drop the folder)
- Vercel
- GitHub Pages
- Any static hosting service

## How to Use
1. **Generate Pattern**: Use the sliders to set grid dimensions, choose a motif style, and click "Generate Kolam"
2. **Upload Image**: Upload an image with dot patterns for analysis and recreation
3. **Customize**: Select different motif styles and enable animation
4. **Download**: Save your created kolam as a PNG image

## Files Structure
- `index.html` - Main application interface
- `styles.css` - Styling and responsive design
- `app.js` - Main application logic
- `motifs.js` - Kolam motif drawing functions
- `renderer.js` - Canvas rendering and animation
- `gridUtils.js` - Grid creation and manipulation
- `imageProcessor.js` - Basic image processing for dot detection
- `analyzer.js` - Symmetry analysis functions
- `netlify.toml` - Netlify deployment configuration

## Browser Compatibility
This application works in all modern browsers that support HTML5 Canvas and ES6 JavaScript features.