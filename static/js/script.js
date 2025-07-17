// Disease Prediction System JavaScript

class DiseasePredictor {
    constructor() {
        this.selectedSymptoms = new Set();
        this.init();
    }

    init() {
        this.createSymptomGrid();
        this.setupEventListeners();
    }

    createSymptomGrid() {
        const symptomGrid = document.getElementById('symptomGrid');
        if (!symptomGrid) return;

        const symptoms = [
            'itching', 'skin_rash', 'nodal_skin_eruptions', 'continuous_sneezing',
            'shivering', 'chills', 'joint_pain', 'stomach_pain', 'acidity',
            'ulcers_on_tongue', 'muscle_wasting', 'vomiting', 'burning_micturition',
            'fatigue', 'weight_gain', 'anxiety', 'cold_hands_and_feets',
            'mood_swings', 'weight_loss', 'restlessness', 'lethargy',
            'patches_in_throat', 'irregular_sugar_level', 'cough', 'high_fever',
            'sunken_eyes', 'breathlessness', 'sweating', 'dehydration',
            'indigestion', 'headache', 'yellowish_skin', 'dark_urine',
            'nausea', 'loss_of_appetite', 'pain_behind_the_eyes', 'back_pain',
            'constipation', 'abdominal_pain', 'diarrhoea', 'mild_fever',
            'yellow_urine', 'yellowing_of_eyes', 'acute_liver_failure',
            'fluid_overload', 'swelling_of_stomach', 'swelled_lymph_nodes',
            'malaise', 'blurred_and_distorted_vision', 'phlegm',
            'throat_irritation', 'redness_of_eyes', 'sinus_pressure',
            'runny_nose', 'congestion', 'chest_pain', 'weakness_in_limbs',
            'fast_heart_rate', 'pain_during_bowel_movements', 'pain_in_anal_region',
            'bloody_stool', 'irritation_in_anus', 'neck_pain', 'dizziness',
            'cramps', 'bruising', 'obesity', 'swollen_legs', 'swollen_blood_vessels',
            'puffy_face_and_eyes', 'enlarged_thyroid', 'brittle_nails',
            'swollen_extremeties', 'excessive_hunger', 'extra_marital_contacts',
            'drying_and_tingling_lips', 'slurred_speech', 'knee_pain',
            'hip_joint_pain', 'muscle_weakness', 'stiff_neck', 'swelling_joints',
            'movement_stiffness', 'spinning_movements', 'loss_of_balance',
            'unsteadiness', 'weakness_of_one_body_side', 'loss_of_smell',
            'bladder_discomfort', 'foul_smell_of urine', 'continuous_feel_of_urine',
            'passage_of_gases', 'internal_itching', 'toxic_look_(typhos)',
            'depression', 'irritability', 'muscle_pain', 'altered_sensorium',
            'red_spots_over_body', 'belly_pain', 'abnormal_menstruation',
            'dischromic _patches', 'watering_from_eyes', 'increased_appetite',
            'polyuria', 'family_history', 'mucoid_sputum', 'rusty_sputum',
            'lack_of_concentration', 'visual_disturbances', 'receiving_blood_transfusion',
            'receiving_unsterile_injections', 'coma', 'stomach_bleeding',
            'distention_of_abdomen', 'history_of_alcohol_consumption',
            'blood_in_sputum', 'prominent_veins_on_calf', 'palpitations',
            'painful_walking', 'pus_filled_pimples', 'blackheads', 'scurring',
            'skin_peeling', 'silver_like_dusting', 'small_dents_in_nails',
            'inflammatory_nails', 'blister', 'red_sore_around_nose',
            'yellow_crust_ooze'
        ];

        symptomGrid.innerHTML = '';
        symptoms.forEach(symptom => {
            const symptomItem = this.createSymptomItem(symptom);
            symptomGrid.appendChild(symptomItem);
        });
    }

    createSymptomItem(symptom) {
        const div = document.createElement('div');
        div.className = 'symptom-item';
        div.setAttribute('data-symptom', symptom);
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `symptom-${symptom.replace(/\s+/g, '-')}`;
        
        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = this.formatSymptomName(symptom);
        
        div.appendChild(checkbox);
        div.appendChild(label);
        
        div.addEventListener('click', (e) => {
            if (e.target.type !== 'checkbox') {
                checkbox.checked = !checkbox.checked;
            }
            this.toggleSymptom(symptom, checkbox.checked);
        });
        
        return div;
    }

    formatSymptomName(symptom) {
        return symptom
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase())
            .replace(/\s+/g, ' ')
            .trim();
    }

    setupEventListeners() {
        const predictBtn = document.getElementById('predictBtn');
        if (predictBtn) {
            predictBtn.addEventListener('click', () => this.predictDisease());
        }

        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearAll());
        }
    }

    toggleSymptom(symptom, isSelected) {
        if (isSelected) {
            this.selectedSymptoms.add(symptom);
        } else {
            this.selectedSymptoms.delete(symptom);
        }
        
        this.updateSelectedSymptomsDisplay();
        this.updatePredictButton();
        this.updateSymptomItemStyle(symptom, isSelected);
    }

    updateSymptomItemStyle(symptom, isSelected) {
        const symptomItem = document.querySelector(`[data-symptom="${symptom}"]`);
        if (symptomItem) {
            if (isSelected) {
                symptomItem.classList.add('selected');
            } else {
                symptomItem.classList.remove('selected');
            }
        }
    }

    updateSelectedSymptomsDisplay() {
        const container = document.getElementById('selectedSymptomsContainer');
        const display = document.getElementById('selectedSymptoms');
        
        if (!container || !display) return;

        if (this.selectedSymptoms.size > 0) {
            container.style.display = 'block';
            display.innerHTML = '';
            
            this.selectedSymptoms.forEach(symptom => {
                const tag = this.createSymptomTag(symptom);
                display.appendChild(tag);
            });
        } else {
            container.style.display = 'none';
        }
    }

    createSymptomTag(symptom) {
        const tag = document.createElement('span');
        tag.className = 'selected-symptom-tag';
        tag.innerHTML = `
            ${this.formatSymptomName(symptom)}
            <span class="remove-btn" onclick="predictor.removeSymptom('${symptom}')">
                <i class="fas fa-times"></i>
            </span>
        `;
        return tag;
    }

    removeSymptom(symptom) {
        this.selectedSymptoms.delete(symptom);
        this.updateSelectedSymptomsDisplay();
        this.updatePredictButton();
        this.updateSymptomItemStyle(symptom, false);
        
        const checkbox = document.getElementById(`symptom-${symptom.replace(/\s+/g, '-')}`);
        if (checkbox) {
            checkbox.checked = false;
        }
    }

    updatePredictButton() {
        const predictBtn = document.getElementById('predictBtn');
        if (predictBtn) {
            predictBtn.disabled = this.selectedSymptoms.size === 0;
        }
    }

    async predictDisease() {
        if (this.selectedSymptoms.size === 0) {
            this.showAlert('Please select at least one symptom.', 'warning');
            return;
        }

        this.showLoading(true);
        
        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    symptoms: Array.from(this.selectedSymptoms)
                })
            });

            const data = await response.json();
            
            if (data.success) {
                this.displayResults(data);
            } else {
                this.showAlert('Error: ' + data.error, 'danger');
            }
        } catch (error) {
            this.showAlert('Network error. Please try again.', 'danger');
            console.error('Prediction error:', error);
        } finally {
            this.showLoading(false);
        }
    }

    displayResults(data) {
        const resultsSection = document.getElementById('resultsSection');
        const resultsContent = document.getElementById('resultsContent');
        
        if (!resultsSection || !resultsContent) return;

        const html = `
            <div class="fade-in">
                <div class="prediction-card slide-up">
                    <div class="row align-items-center">
                        <div class="col-md-8">
                            <h2 class="mb-3">
                                <i class="fas fa-diagnoses me-2"></i>
                                Predicted Disease: ${data.prediction}
                            </h2>
                            <p class="mb-3">${data.description}</p>
                            <div class="d-flex align-items-center mb-3">
                                <span class="me-3">Confidence:</span>
                                <div class="confidence-bar flex-grow-1 me-3">
                                    <div class="confidence-fill" style="width: ${data.confidence}%"></div>
                                </div>
                                <span class="fw-bold">${data.confidence}%</span>
                            </div>
                        </div>
                        <div class="col-md-4 text-center">
                            <div class="display-4 fw-bold">${data.confidence}%</div>
                            <small class="text-white-50">Confidence Level</small>
                        </div>
                    </div>
                </div>

                <div class="top-predictions slide-up">
                    <h4 class="mb-3">
                        <i class="fas fa-list-ol text-primary me-2"></i>
                        Top Predictions
                    </h4>
                    ${data.top_predictions.map((pred, index) => `
                        <div class="prediction-item">
                            <div class="d-flex align-items-center">
                                <span class="badge bg-primary me-3">${index + 1}</span>
                                <div>
                                    <div class="prediction-name">${pred.disease}</div>
                                    <small class="text-muted">${pred.description}</small>
                                </div>
                            </div>
                            <div class="prediction-probability">${pred.probability}%</div>
                        </div>
                    `).join('')}
                </div>

                <div class="alert alert-info mt-4">
                    <i class="fas fa-info-circle me-2"></i>
                    <strong>Important:</strong> This prediction is for educational purposes only. 
                    Always consult with a healthcare professional for proper diagnosis and treatment.
                </div>
            </div>
        `;

        resultsContent.innerHTML = html;
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    showLoading(show) {
        const loadingSpinner = document.getElementById('loadingSpinner');
        const resultsContent = document.getElementById('resultsContent');
        
        if (loadingSpinner) {
            loadingSpinner.style.display = show ? 'block' : 'none';
        }
        
        if (resultsContent) {
            resultsContent.style.display = show ? 'none' : 'block';
        }
    }

    showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(alertDiv, container.firstChild);
            
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.remove();
                }
            }, 5000);
        }
    }

    clearAll() {
        this.selectedSymptoms.clear();
        this.updateSelectedSymptomsDisplay();
        this.updatePredictButton();
        
        document.querySelectorAll('.symptom-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
            const symptomItem = checkbox.closest('.symptom-item');
            if (symptomItem) {
                symptomItem.classList.remove('selected');
            }
        });
        
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection) {
            resultsSection.style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.predictor = new DiseasePredictor();
}); 