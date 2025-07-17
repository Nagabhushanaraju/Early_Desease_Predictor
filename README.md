
# Disease Prediction System

An AI-powered web application for early disease detection using patient symptoms.  
Built with **Python**, **Flask**, and **scikit-learn**, this system leverages machine learning models to predict potential diseases based on user-input symptoms.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the application:
```bash
python app.py
```

3. Open
   ```bash
   http://localhost:5000 #in your browser

## Features

- Random Forest classifier with 97.6% accuracy
- Interactive symptom selection
- Real-time predictions with confidence scores
- Responsive design
- Search functionality

## Important

⚠️ **Educational purposes only** - Not a substitute for professional medical advice.

## Files

| File/Folder                | Description                          |
| -------------------------- | ------------------------------------ |
| `app.py`                   | Main Flask application               |
| `diagnose_issue.py`        | Helper script for diagnosis logic    |
| `disease_model.pkl`        | Trained ML model                     |
| `disease-prediction.ipynb` | Notebook for prediction workflow     |
| `label_encoder.pkl`        | Encoded labels for symptoms/diseases |
| `model.ipynb`              | Model training notebook              |
| `symptom_names.pkl`        | Pickle of symptom names              |
| `Training.csv`             | Dataset for model training           |
| `Testing.csv`              | Dataset for testing                  |
| `submission.csv`           | (Optional) Output file               |
| `requirements.txt`         | Project dependencies                 |
| `LICENSE`                  | License file                         |
| `README.md`                | Project documentation (this file)    |
| `.gitignore`               | Git ignored files list               |
| `.DS_Store`                | macOS system file (can be deleted)   |
| `templates/index.html`     | Frontend HTML template               |
| `static/style.css`         | CSS styling                          |
| `static/script.js`         | JavaScript functionality             |
| `uploads/`                 | Folder for user uploads              |
| `learnings/`               | Optional experiments/notes           |
| `diseaseenv/`              | Virtual environment (ignored in Git) |


## Technology Stack

- **Backend**: Flask (Python)
- **Machine Learning**: scikit-learn (Random Forest)
- **Frontend**: HTML5, CSS3, JavaScript
- **UI Framework**: Bootstrap 5
- **Icons**: Font Awesome
- **Data Processing**: pandas, numpy

##  Installation

- **Set up a virtual environment using Conda (recommended):**

  ```bash
  conda create -n diseaseenv python=3.11
  conda activate diseaseenv
- **Install Git (if not already installed):**

- Download Git
  ```bash
  https://git-scm.com/downloads #visit this page & install according to ur OS

- Clone the repository:
    ```bash
    git clone https://github.com/Nagabhushanaraju/Early_Desease_Predictor.git
    
    cd Early_Desease_Predictor

-Install required dependencies inside the virtual environment:

```bash
pip install -r requirements.txt

   ```



## How It Works

1. **Data Loading**: The application loads the training dataset and trains a Random Forest classifier
2. **Symptom Selection**: Users select their symptoms from a comprehensive list
3. **Feature Vector**: Selected symptoms are converted to a binary feature vector
4. **Prediction**: The trained model predicts the most likely disease
5. **Results**: Displays the prediction with confidence score and alternative conditions

## Model Performance

- **Accuracy**: 97.6% on test data
- **Algorithm**: Random Forest Classifier
- **Features**: 132 binary symptom features
- **Diseases**: Multiple disease categories

## Important Disclaimer

⚠️ **This tool is for educational purposes only.**

- The predictions are based on machine learning algorithms and should not replace professional medical advice
- Always consult with qualified healthcare professionals for proper diagnosis and treatment
- The system is designed as a learning tool and demonstration of AI capabilities

## File Structure

```
D:\Nagabhushana_MIT_Proj\DISEASE PREDICTION\DISEASE PREDICTION (backup) 

DISEASE PREDICTION/
├── app.py                     # Main Flask application
├── diagnose_issue.py          # Script for issue diagnosis
├── disease_model.pkl          # Trained ML model (Pickle file)
├── disease-prediction.ipynb   # Jupyter notebook for prediction logic
├── label_encoder.pkl          # Encoder for symptoms/diseases
├── model.ipynb                # Model training & analysis notebook
├── symptom_names.pkl          # Symptom names pickle file
├── Training.csv               # Training dataset
├── Testing.csv                # Testing dataset
├── submission.csv             # Optional submission/testing file
├── tempCodeRunnerFile.py      # Temporary VS Code runner file
├── requirements.txt           # Project dependencies
├── LICENSE                    # Project license info
├── README.md                  # Project documentation (this file)
├── .gitignore                 # Git ignore rules
├── .DS_Store                  # macOS system file (can be ignored/deleted)
├── static/                    # Folder for static assets
│   ├── style.css              # Custom CSS styles
│   └── script.js              # JavaScript functions
├── templates/
│   └── index.html             # HTML frontend template
├── uploads/                   # Folder to store uploaded files
├── learnings/                 # (Optional) Folder for experiments/notes
└── diseaseenv/                # Local virtual environment (should be ignored in Git)

```

## Customization

### Adding New Symptoms
1. Update the `Training.csv` and `Testing.csv` files
2. Retrain the model by running the application

### Modifying the UI
1. Edit `templates/index.html` for layout changes
2. Modify `static/style.css` for styling
3. Update `static/script.js` for functionality

### Model Parameters
Adjust the Random Forest parameters in `app.py`:
```python
model = RandomForestClassifier(
    n_estimators=100,      # Number of trees
    min_samples_split=2,   # Minimum samples to split
    random_state=67        # For reproducibility
)
```

## Troubleshooting

### Common Issues

1. **Port already in use**:
   - Change the port in `app.py`: `app.run(debug=True, port=5001)`

2. **Missing dependencies**:
   - Run: `pip install -r requirements.txt`

3. **Data files not found**:
   - Ensure `Training.csv` and `Testing.csv` are in the project directory

4. **Model training errors**:
   - Check that the CSV files have the correct format
   - Verify all required columns are present

## Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Improving the UI/UX
- Enhancing the machine learning model

## License

This project is licensed under the MIT License.
See the LICENSE file for complete details.

⚠️ Disclaimer: This project is intended for educational and research purposes only. It must not be used for real-world medical diagnosis or treatment without proper certification and regulatory approval. Please ensure compliance with local laws and medical data regulations when using or modifying this software.


## Contact

For questions or support, please refer to the project documentation or create an issue in the repository. 

# Early_Desease_Predictor
A machine learning-based system for early detection of diseases using patient symptoms. Built with Python, Flask, and scikit-learn.

