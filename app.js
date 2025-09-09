// app.js - Main application logic

class KolamApp {
    constructor() {
        this.canvas = document.getElementById('kolamCanvas');
        this.renderer = new Renderer(this.canvas);
        this.currentGrid = null;
        this.uploadedImage = null;
        
        this.initializeElements();
        this.bindEvents();
        this.updateSliderValues();
    }

    initializeElements() {
        this.elements = {
            imageInput: document.getElementById('imageInput'),
            rowsSlider: document.getElementById('rowsSlider'),
            colsSlider: document.getElementById('colsSlider'),
            rowsValue: document.getElementById('rowsValue'),
            colsValue: document.getElementById('colsValue'),
            styleSelect: document.getElementById('styleSelect'),
            animateCheck: document.getElementById('animateCheck'),
            generateBtn: document.getElementById('generateBtn'),
            analyzeBtn: document.getElementById('analyzeBtn'),
            downloadBtn: document.getElementById('downloadBtn'),
            uploadedImage: document.getElementById('uploadedImage'),
            loadingSpinner: document.getElementById('loadingSpinner'),
            symmetryInfo: document.getElementById('symmetryInfo'),
            symmetryResults: document.getElementById('symmetryResults'),
            detectionInfo: document.getElementById('detectionInfo'),
            detectionResults: document.getElementById('detectionResults')
        };
    }

    bindEvents() {
        // File upload
        this.elements.imageInput.addEventListener('change', (e) => {
            this.handleImageUpload(e);
        });

        // Slider updates
        this.elements.rowsSlider.addEventListener('input', () => {
            this.updateSliderValues();
        });

        this.elements.colsSlider.addEventListener('input', () => {
            this.updateSliderValues();
        });

        // Button clicks
        this.elements.generateBtn.addEventListener('click', () => {
            this.generateKolam();
        });

        this.elements.analyzeBtn.addEventListener('click', () => {
            this.analyzeImage();
        });

        this.elements.downloadBtn.addEventListener('click', () => {
            this.downloadKolam();
        });

        // Style change
        this.elements.styleSelect.addEventListener('change', () => {
            if (this.currentGrid) {
                this.renderCurrentGrid();
            }
        });

        // Animation toggle
        this.elements.animateCheck.addEventListener('change', () => {
            if (this.currentGrid) {
                this.renderCurrentGrid();
            }
        });
    }

    updateSliderValues() {
        this.elements.rowsValue.textContent = this.elements.rowsSlider.value;
        this.elements.colsValue.textContent = this.elements.colsSlider.value;
    }

    async handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        this.showLoading(true);
        
        try {
            // Display uploaded image
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.style.maxWidth = '100%';
            img.style.maxHeight = '200px';
            img.style.borderRadius = '8px';
            
            this.elements.uploadedImage.innerHTML = '';
            this.elements.uploadedImage.appendChild(img);
            
            // Store the uploaded image
            this.uploadedImage = file;
            this.elements.analyzeBtn.disabled = false;
            
        } catch (error) {
            console.error('Error uploading image:', error);
            this.showError('Error processing uploaded image');
        } finally {
            this.showLoading(false);
        }
    }

    generateKolam() {
        this.showLoading(true);
        
        try {
            const rows = parseInt(this.elements.rowsSlider.value);
            const cols = parseInt(this.elements.colsSlider.value);
            
            // Create a synthetic grid
            this.currentGrid = GridUtils.createDotGrid(rows, cols, 60);
            
            // Analyze symmetries
            const symmetries = Analyzer.analyzeSymmetries(this.currentGrid);
            this.displaySymmetryResults(symmetries);
            
            // Show detection info
            this.displayDetectionResults({
                totalDots: rows * cols,
                gridRows: rows,
                gridCols: cols,
                source: 'generated'
            });
            
            // Render the kolam
            this.renderCurrentGrid();
            this.elements.downloadBtn.disabled = false;
            
        } catch (error) {
            console.error('Error generating kolam:', error);
            this.showError('Error generating kolam');
        } finally {
            this.showLoading(false);
        }
    }

    async analyzeImage() {
        if (!this.uploadedImage) return;
        
        this.showLoading(true);
        
        try {
            // Process the uploaded image
            const result = await ImageProcessor.processImage(this.uploadedImage);
            const { dots, canvas } = result;
            
            if (dots.length === 0) {
                this.showError('No dots detected in the image. Try an image with clearer dot patterns.');
                return;
            }
            
            // Create grid from detected dots
            this.currentGrid = GridUtils.createGridFromDetectedDots(dots);
            
            if (this.currentGrid.length === 0) {
                this.showError('Could not form a grid from detected dots.');
                return;
            }
            
            // Analyze symmetries
            const symmetries = Analyzer.analyzeSymmetries(this.currentGrid);
            this.displaySymmetryResults(symmetries);
            
            // Show detection results
            this.displayDetectionResults({
                totalDots: dots.length,
                gridRows: this.currentGrid.length,
                detectedDots: dots.length,
                source: 'image'
            });
            
            // Render the kolam
            this.renderCurrentGrid();
            this.elements.downloadBtn.disabled = false;
            
        } catch (error) {
            console.error('Error analyzing image:', error);
            this.showError('Error analyzing image');
        } finally {
            this.showLoading(false);
        }
    }

    renderCurrentGrid() {
        if (!this.currentGrid) return;
        
        const style = this.elements.styleSelect.value;
        const animate = this.elements.animateCheck.checked;
        
        this.renderer.renderGrid(this.currentGrid, style, animate);
    }

    displaySymmetryResults(symmetries) {
        const results = this.elements.symmetryResults;
        results.innerHTML = '';
        
        const symmetryLabels = {
            horizontal_reflection: 'Horizontal Reflection',
            vertical_reflection: 'Vertical Reflection',
            rotation_90: '90° Rotation',
            rotation_180: '180° Rotation'
        };
        
        Object.entries(symmetries).forEach(([key, value]) => {
            const div = document.createElement('div');
            div.className = 'symmetry-result';
            
            const label = document.createElement('span');
            label.textContent = symmetryLabels[key] || key;
            
            const status = document.createElement('span');
            status.className = `symmetry-status ${value}`;
            status.textContent = value ? '✓' : '✗';
            
            div.appendChild(label);
            div.appendChild(status);
            results.appendChild(div);
        });
        
        this.elements.symmetryInfo.classList.remove('hidden');
    }

    displayDetectionResults(info) {
        const results = this.elements.detectionResults;
        results.innerHTML = '';
        
        const items = [
            { label: 'Total Dots', value: info.totalDots },
            { label: 'Grid Rows', value: info.gridRows },
            { label: 'Source', value: info.source }
        ];
        
        if (info.gridCols) {
            items.splice(2, 0, { label: 'Grid Columns', value: info.gridCols });
        }
        
        items.forEach(item => {
            const p = document.createElement('p');
            p.innerHTML = `<strong>${item.label}:</strong> ${item.value}`;
            results.appendChild(p);
        });
        
        this.elements.detectionInfo.classList.remove('hidden');
    }

    downloadKolam() {
        if (!this.currentGrid) return;
        
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const style = this.elements.styleSelect.value;
        const filename = `kolam-${style}-${timestamp}.png`;
        
        this.renderer.downloadCanvas(filename);
    }

    showLoading(show) {
        if (show) {
            this.elements.loadingSpinner.classList.remove('hidden');
        } else {
            this.elements.loadingSpinner.classList.add('hidden');
        }
    }

    showError(message) {
        // Simple error display - you could enhance this with a proper modal
        alert(message);
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new KolamApp();
});