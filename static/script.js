// Disease Prediction System JavaScript

let selectedSymptoms = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadSymptoms();
    setupEventListeners();
    setupFileUpload();
});

// Load symptoms from backend
async function loadSymptoms() {
    try {
        const response = await fetch('/api/symptoms');
        const data = await response.json();
        window.symptomsData = data.symptoms;
        initializeSymptoms();
    } catch (error) {
        console.error('Error loading symptoms:', error);
        // Fallback to hardcoded symptoms if API fails
        window.symptomsData = [
            'continuous_sneezing', 'chills', 'high_fever', 'fatigue', 'cough',
            'runny_nose', 'congestion', 'headache', 'body_pain', 'sore_throat'
        ];
        initializeSymptoms();
    }
}

// Initialize symptoms grid
function initializeSymptoms() {
    const symptomsGrid = document.getElementById('symptomsGrid');
    if (!symptomsGrid || !window.symptomsData) return;

    symptomsGrid.innerHTML = '';
    
    window.symptomsData.forEach(symptom => {
        const symptomItem = createSymptomItem(symptom);
        symptomsGrid.appendChild(symptomItem);
    });
}

// Create symptom item element
function createSymptomItem(symptom) {
    const div = document.createElement('div');
    div.className = 'symptom-item';
    div.innerHTML = `
        <input type="checkbox" id="symptom_${symptom}" class="symptom-checkbox">
        <label for="symptom_${symptom}" class="symptom-label">
            <i class="fas fa-plus-circle"></i>
            ${formatSymptomName(symptom)}
        </label>
    `;
    return div;
}

// Format symptom name for display
function formatSymptomName(symptom) {
    return symptom.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Setup file upload functionality
function setupFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    
    if (!fileInput || !uploadArea) return;

    // File input change handler
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop functionality
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFileSelect();
        }
    });
}

// Handle file selection
async function handleFileSelect() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/bmp', 'image/tiff', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
        showAlert('Please select a valid file type (PDF, PNG, JPG, JPEG, GIF, BMP, TIFF)', 'danger');
        return;
    }

    // Validate file size (16MB)
    if (file.size > 16 * 1024 * 1024) {
        showAlert('File size must be less than 16MB', 'danger');
        return;
    }

    // Show upload progress
    showUploadProgress();

    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok && data.success) {
            showOCRResults(data);
        } else {
            showAlert(data.error || 'Failed to process file', 'danger');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showAlert('An error occurred while processing the file', 'danger');
    } finally {
        hideUploadProgress();
    }
}

// Show upload progress
function showUploadProgress() {
    const progressDiv = document.getElementById('uploadProgress');
    const progressBar = progressDiv.querySelector('.progress-bar');
    
    progressDiv.style.display = 'block';
    
    // Animate progress bar
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 90) progress = 90;
        progressBar.style.width = progress + '%';
    }, 200);

    // Store interval for cleanup
    progressDiv.dataset.interval = interval;
}

// Hide upload progress
function hideUploadProgress() {
    const progressDiv = document.getElementById('uploadProgress');
    const progressBar = progressDiv.querySelector('.progress-bar');
    
    // Complete the progress bar
    progressBar.style.width = '100%';
    
    setTimeout(() => {
        progressDiv.style.display = 'none';
        progressBar.style.width = '0%';
        
        // Clear interval
        if (progressDiv.dataset.interval) {
            clearInterval(parseInt(progressDiv.dataset.interval));
        }
    }, 500);
}

// Show OCR results
function showOCRResults(data) {
    const resultsDiv = document.getElementById('ocrResults');
    const extractedTextDiv = document.getElementById('extractedText');
    const detectedSymptomsDiv = document.getElementById('detectedSymptoms');
    
    // Display extracted text
    extractedTextDiv.textContent = data.extracted_text;
    
    // Display detected symptoms
    detectedSymptomsDiv.innerHTML = '';
    if (data.found_symptoms && data.found_symptoms.length > 0) {
        data.found_symptoms.forEach(symptom => {
            const badge = document.createElement('span');
            badge.className = 'badge bg-success me-2 mb-2';
            badge.textContent = formatSymptomName(symptom);
            detectedSymptomsDiv.appendChild(badge);
        });
    } else {
        detectedSymptomsDiv.innerHTML = '<span class="text-muted">No symptoms detected in the document</span>';
    }
    
    // Show results
    resultsDiv.style.display = 'block';
    
    // Setup "Use These Symptoms" button
    const useButton = document.getElementById('useDetectedSymptoms');
    useButton.onclick = () => useDetectedSymptoms(data.found_symptoms || []);
    
    // Scroll to results
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

// Use detected symptoms from OCR
function useDetectedSymptoms(symptoms) {
    // Clear current selection
    clearSelection();
    
    // Select detected symptoms
    symptoms.forEach(symptom => {
        selectedSymptoms.push(symptom);
        const checkbox = document.getElementById(`symptom_${symptom}`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
    
    // Update UI
    updateSelectedSymptomsDisplay();
    updatePredictionButton();
    
    // Scroll to prediction section
    document.getElementById('prediction').scrollIntoView({ behavior: 'smooth' });
    
    // Show success message
    showAlert(`Successfully loaded ${symptoms.length} symptoms from your document!`, 'success');
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('symptomSearch');
    if (searchInput) {
        searchInput.addEventListener('input', filterSymptoms);
    }

    // Prediction button
    const predictBtn = document.getElementById('predictBtn');
    if (predictBtn) {
        predictBtn.addEventListener('click', predictDisease);
    }

    // Clear button
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearSelection);
    }

    // Symptom selection
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('symptom-checkbox')) {
            handleSymptomSelection(e.target);
        }
    });
}

// Filter symptoms based on search
function filterSymptoms() {
    const searchTerm = document.getElementById('symptomSearch').value.toLowerCase();
    const symptomItems = document.querySelectorAll('.symptom-item');
    
    symptomItems.forEach(item => {
        const label = item.querySelector('.symptom-label').textContent.toLowerCase();
        if (label.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Handle symptom selection
function handleSymptomSelection(checkbox) {
    const symptom = checkbox.id.replace('symptom_', '');
    
    if (checkbox.checked) {
        if (!selectedSymptoms.includes(symptom)) {
            selectedSymptoms.push(symptom);
        }
    } else {
        selectedSymptoms = selectedSymptoms.filter(s => s !== symptom);
    }
    
    updateSelectedSymptomsDisplay();
    updatePredictionButton();
}

// Update selected symptoms display
function updateSelectedSymptomsDisplay() {
    const container = document.getElementById('selectedSymptoms');
    if (!container) return;
    
    container.innerHTML = '';
    
    selectedSymptoms.forEach(symptom => {
        const tag = document.createElement('span');
        tag.className = 'badge bg-primary me-2 mb-2';
        tag.innerHTML = `
            ${formatSymptomName(symptom)}
            <i class="fas fa-times ms-1" onclick="removeSymptom('${symptom}')"></i>
        `;
        container.appendChild(tag);
    });
}

// Remove symptom from selection
function removeSymptom(symptom) {
    selectedSymptoms = selectedSymptoms.filter(s => s !== symptom);
    const checkbox = document.getElementById(`symptom_${symptom}`);
    if (checkbox) {
        checkbox.checked = false;
    }
    updateSelectedSymptomsDisplay();
    updatePredictionButton();
}

// Update prediction button state
function updatePredictionButton() {
    const predictBtn = document.getElementById('predictBtn');
    if (predictBtn) {
        predictBtn.disabled = selectedSymptoms.length === 0;
    }
}

// Clear all selections
function clearSelection() {
    selectedSymptoms = [];
    document.querySelectorAll('.symptom-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    updateSelectedSymptomsDisplay();
    updatePredictionButton();
    hideResults();
}

// Predict disease
async function predictDisease() {
    if (selectedSymptoms.length === 0) {
        showAlert('Please select at least one symptom.', 'warning');
        return;
    }

    const predictBtn = document.getElementById('predictBtn');
    const resultsDiv = document.getElementById('results');
    
    // Show loading state
    predictBtn.disabled = true;
    predictBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Predicting...';
    
    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                symptoms: selectedSymptoms
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            displayResults(data);
        } else {
            showAlert(data.error || 'Prediction failed.', 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('An error occurred while predicting. Please try again.', 'danger');
    } finally {
        // Reset button
        predictBtn.disabled = false;
        predictBtn.innerHTML = '<i class="fas fa-search"></i> Predict Disease';
    }
}

// Display prediction results
function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    if (!resultsDiv) return;
    
    const confidenceClass = data.confidence >= 80 ? 'success' : 
                           data.confidence >= 60 ? 'warning' : 'danger';
    
    resultsDiv.innerHTML = `
        <div class="card border-${confidenceClass}">
            <div class="card-header bg-${confidenceClass} text-white">
                <h5 class="mb-0"><i class="fas fa-stethoscope"></i> Prediction Results</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <h6 class="text-muted">Primary Prediction</h6>
                        <h4 class="text-${confidenceClass}">${data.prediction}</h4>
                        <div class="progress mb-3">
                            <div class="progress-bar bg-${confidenceClass}" 
                                 style="width: ${data.confidence}%">
                                ${data.confidence}% Confidence
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h6 class="text-muted">Other Possibilities</h6>
                        ${data.top_predictions.slice(1).map(pred => `
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span>${pred.disease}</span>
                                <span class="badge bg-secondary">${pred.confidence}%</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <hr>
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    <strong>Disclaimer:</strong> This prediction is for educational purposes only. 
                    Please consult a healthcare professional for proper diagnosis and treatment.
                </div>
            </div>
        </div>
    `;
    
    resultsDiv.style.display = 'block';
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

// Hide results
function hideResults() {
    const resultsDiv = document.getElementById('results');
    if (resultsDiv) {
        resultsDiv.style.display = 'none';
    }
}

// Show alert
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Navigation functions
function scrollToSymptoms() {
    document.getElementById('symptoms').scrollIntoView({ behavior: 'smooth' });
}

function scrollToAbout() {
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
}

// Search functionality for symptoms
function searchSymptoms(query) {
    const symptomItems = document.querySelectorAll('.symptom-item');
    const searchTerm = query.toLowerCase();
    
    symptomItems.forEach(item => {
        const label = item.querySelector('label').textContent.toLowerCase();
        if (label.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Add search input to symptoms section
function addSearchInput() {
    const symptomsSection = document.getElementById('symptoms');
    const searchDiv = document.createElement('div');
    searchDiv.className = 'mb-3';
    searchDiv.innerHTML = `
        <div class="input-group">
            <span class="input-group-text">
                <i class="fas fa-search"></i>
            </span>
            <input type="text" class="form-control" id="symptomSearch" 
                   placeholder="Search symptoms..." onkeyup="searchSymptoms(this.value)">
        </div>
    `;
    
    const symptomsGrid = document.getElementById('symptomsGrid');
    symptomsGrid.parentNode.insertBefore(searchDiv, symptomsGrid);
}

// Initialize search when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addSearchInput, 100);
}); 