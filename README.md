# Disease Prediction System

AI-powered web application for disease prediction using machine learning.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the application:
```bash
python app.py
```

3. Open http://localhost:5000 in your browser

## Features

- Random Forest classifier with 97.6% accuracy
- Interactive symptom selection
- Real-time predictions with confidence scores
- Responsive design
- Search functionality

## Important

⚠️ **Educational purposes only** - Not a substitute for professional medical advice.

## Files

- `app.py` - Flask application
- `templates/index.html` - Main template
- `static/style.css` - Styling
- `static/script.js` - Functionality
- `Training.csv` - Training data
- `Testing.csv` - Test data

## Technology Stack

- **Backend**: Flask (Python)
- **Machine Learning**: scikit-learn (Random Forest)
- **Frontend**: HTML5, CSS3, JavaScript
- **UI Framework**: Bootstrap 5
- **Icons**: Font Awesome
- **Data Processing**: pandas, numpy

## Installation

1. **Clone or download the project files**

2. **Ensure you have the required data files**:
   - `Training.csv` - Training dataset with symptoms and diseases
   - `Testing.csv` - Testing dataset

## Usage

1. **Start the application**:
   ```bash
   python app.py
   ```

2. **Open your web browser** and navigate to:
   ```
   http://localhost:5000
   ```

3. **Select symptoms** from the interactive grid

4. **Click "Predict Disease"** to get instant results

5. **View predictions** with confidence scores and alternative conditions

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
DISEASE PREDICTION/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── Training.csv          # Training dataset
├── Testing.csv           # Testing dataset
├── templates/
│   └── index.html        # Main HTML template
└── static/
    ├── style.css         # Custom CSS styles
    └── script.js         # JavaScript functionality
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

This project is for educational purposes. Please ensure compliance with local regulations regarding medical software.

## Contact

For questions or support, please refer to the project documentation or create an issue in the repository. 