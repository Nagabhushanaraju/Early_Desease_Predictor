from flask import Flask, render_template, request, jsonify #app's server
import pandas as pd #data analysis
import numpy as np #data analysis
import pickle # saving the models
import os #operating system-> saving/ rewriting the files/ deleting
import re #regex template
from werkzeug.utils import secure_filename 
from PIL import Image
import cv2
import easyocr 
import pytesseract
from pdf2image import convert_from_path
import tempfile
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'pdf'}

# Create uploads directory if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Global variables for model and encoder
model = None #trained random forest model
encoder = None #label encoder for disease
symptoms = None #list of sympotoms

# Initialize EasyOCR reader
reader = None

def load_model():
    """Load the trained model from pickle files"""
    global model, encoder, symptoms, reader
    
    try:
        # Try to load the saved model
        with open('disease_model.pkl', 'rb') as f:
            model = pickle.load(f)
        
        # Load the label encoder
        with open('label_encoder.pkl', 'rb') as f:
            encoder = pickle.load(f)
        
        # Load the symptom names
        with open('symptom_names.pkl', 'rb') as f:
            symptoms = pickle.load(f)
        
        print(f"Model loaded successfully!")
        print(f"Number of symptoms: {len(symptoms)}")
        print(f"Number of diseases: {len(encoder.classes_)}")
    
        
    except Exception as e:
        print(f"Error loading saved model: {e}")
        print("Retraining model from scratch...")
        
        # Retrain the model
        if retrain_model():
            print("Model retrained successfully!")
        else:
            print("Failed to retrain model.")
            return False
    
    # Initialize EasyOCR reader
    try:
        reader = easyocr.Reader(['en'])
    except Exception as e:
        print(f"Warning: EasyOCR initialization failed: {e}")
        reader = None
    
    return True


#Load pre-trained model components from pickle files
#handle the cases where model files are missing by retraining
#initialize ocr reader with error handling


def retrain_model():
    """Retrain the model from the training data"""
    global model, encoder, symptoms
    
    try:
        # Load training data
        df = pd.read_csv("Training.csv")
        
        # Remove the unnamed column if it exists
        if "Unnamed: 133" in df.columns:
            df = df.drop("Unnamed: 133", axis=1)
        
        # Prepare data
        encoder = LabelEncoder()
        df["prognosis"] = encoder.fit_transform(df["prognosis"])
        
        X = df.drop("prognosis", axis=1).values
        y = df["prognosis"].values
        
        # Train the model (same parameters as in notebook)
        model = RandomForestClassifier(
            n_estimators=100,
            min_samples_split=2,
            random_state=67
        )
        model.fit(X, y)
        
        # Get symptom names
        symptoms = df.drop("prognosis", axis=1).columns.tolist()
        
        # Save the new model
        with open('disease_model.pkl', 'wb') as f:
            pickle.dump(model, f)
        
        with open('label_encoder.pkl', 'wb') as f:
            pickle.dump(encoder, f)
        
        with open('symptom_names.pkl', 'wb') as f:
            pickle.dump(symptoms, f)
        
        print(f"Model retrained and saved successfully!")
        print(f"Number of symptoms: {len(symptoms)}")
        print(f"Number of diseases: {len(encoder.classes_)}")
        
        return True
        
    except Exception as e:
        print(f"Error retraining model: {e}")
        return False

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_image(image_path):
    """Extract text from image using multiple OCR methods"""
    try:
        extracted_text = ""
        
        # Method 1: EasyOCR (if available)
        if reader:
            try:
                results = reader.readtext(image_path)
                # RESULTS->  TEXT
                easyocr_text = ' '.join([text[1] for text in results])
                extracted_text += easyocr_text + "\n"
            except Exception as e:
                print(f"EasyOCR failed: {e}")
        
        # Method 2: Tesseract OCR
        try:
            image = Image.open(image_path)
            tesseract_text = pytesseract.image_to_string(image)
            extracted_text += tesseract_text + "\n"
        except Exception as e:
            print(f"Tesseract failed: {e}")
        
        # Method 3: OpenCV preprocessing + Tesseract
        try:
            img = cv2.imread(image_path)
            if img is not None:
                gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
                
                # Save preprocessed image temporarily
                temp_path = os.path.join(app.config['UPLOAD_FOLDER'], 'temp_preprocessed.png')
                cv2.imwrite(temp_path, thresh)
                
                preprocessed_text = pytesseract.image_to_string(Image.open(temp_path))
                extracted_text += preprocessed_text + "\n"
                
                # Clean up
                if os.path.exists(temp_path):
                    os.remove(temp_path)
        except Exception as e:
            print(f"OpenCV preprocessing failed: {e}")
        
        return extracted_text.strip()
        
    except Exception as e:
        print(f"Error extracting text from image: {e}")
        return ""

def extract_text_from_pdf(pdf_path):
    """Extract text from PDF file"""
    try:
        # Convert PDF to images
        images = convert_from_path(pdf_path)
        text_content = []
        
        for i, image in enumerate(images):
            # Save image temporarily
            temp_path = os.path.join(app.config['UPLOAD_FOLDER'], f'temp_pdf_page_{i}.png')
            image.save(temp_path, 'PNG')
            
            # Extract text from image
            page_text = extract_text_from_image(temp_path)
            text_content.append(page_text)
            
            # Clean up
            if os.path.exists(temp_path):
                os.remove(temp_path)
        
        return '\n'.join(text_content)
        
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

def extract_symptoms_from_text(text):
    """Extract symptoms from extracted text"""
    if not text or not symptoms:
        return []
    
    # Convert text to lowercase for matching
    text_lower = text.lower()
    
    # Find matching symptoms
    found_symptoms = []
    for symptom in symptoms:
        # Convert symptom name to readable format
        symptom_readable = symptom.replace('_', ' ').lower()
        
        # Check for exact matches and variations
        if symptom_readable in text_lower:
            found_symptoms.append(symptom)
        elif symptom in text_lower:
            found_symptoms.append(symptom)
        else:
            # Check for partial matches
            words = symptom_readable.split()
            if any(word in text_lower for word in words if len(word) > 3):
                found_symptoms.append(symptom)
    
    # Remove duplicates and return
    return list(set(found_symptoms))

# Load model on startup
if not load_model():
    print("Failed to load model. Please ensure all pickle files are present.")

# Disease descriptions
disease_info = {
    'Fungal infection': 'A fungal infection is a skin disease caused by a fungus. Common symptoms include itching, skin rash, and skin eruptions.',
    'Allergy': 'An allergy is an immune system response to a foreign substance. Symptoms include sneezing, shivering, and chills.',
    'GERD': 'Gastroesophageal reflux disease (GERD) occurs when stomach acid frequently flows back into the esophagus. Symptoms include stomach pain, acidity, and vomiting.',
    'Chronic cholestasis': 'A condition where bile flow from the liver is blocked. Symptoms include vomiting, yellowish skin, and dark urine.',
    'Drug Reaction': 'An adverse reaction to medication. Symptoms include skin rash, stomach pain, and burning urination.',
    'Peptic ulcer diseae': 'Sores that develop on the lining of the stomach or small intestine. Symptoms include vomiting, headache, and back pain.',
    'AIDS': 'Acquired immunodeficiency syndrome affects the immune system. Symptoms include muscle wasting, sunken eyes, and malaise.',
    'Diabetes': 'A metabolic disease that causes high blood sugar. Symptoms include fatigue, weight loss, and increased appetite.',
    'Gastroenteritis': 'Inflammation of the stomach and intestines. Symptoms include vomiting, dehydration, and indigestion.',
    'Bronchial Asthma': 'A condition that affects the airways in the lungs. Symptoms include fatigue, high fever, and breathlessness.',
    'Hypertension': 'High blood pressure. Symptoms include headache, dizziness, and chest pain.',
    'Migraine': 'A type of headache that can cause severe throbbing pain. Symptoms include acidity, headache, and visual disturbances.',
    'Cervical spondylosis': 'A general term for age-related wear and tear affecting the spinal disks in the neck. Symptoms include back pain, neck pain, and dizziness.',
    'Paralysis (brain hemorrhage)': 'Loss of muscle function due to brain hemorrhage. Symptoms include vomiting, headache, and weakness.',
    'Jaundice': 'Yellowing of the skin and eyes due to high bilirubin levels. Symptoms include vomiting, fatigue, and yellowish skin.',
    'Malaria': 'A mosquito-borne infectious disease. Symptoms include chills, vomiting, and high fever.',
    'Chicken pox': 'A highly contagious viral infection. Symptoms include skin rash, fatigue, and high fever.',
    'Dengue': 'A mosquito-borne viral infection. Symptoms include chills, vomiting, and high fever.',
    'Typhoid': 'A bacterial infection spread through contaminated food and water. Symptoms include chills, vomiting, and high fever.',
    'hepatitis A': 'A highly contagious liver infection. Symptoms include joint pain, vomiting, and yellowish skin.',
    'Hepatitis B': 'A serious liver infection caused by the hepatitis B virus. Symptoms include fatigue, vomiting, and yellowish skin.',
    'Hepatitis C': 'A viral infection that causes liver inflammation. Symptoms include fatigue, vomiting, and yellowish skin.',
    'Hepatitis D': 'A serious liver disease caused by the hepatitis D virus. Symptoms include joint pain, vomiting, and yellowish skin.',
    'Hepatitis E': 'A liver disease caused by the hepatitis E virus. Symptoms include joint pain, vomiting, and yellowish skin.',
    'Alcoholic hepatitis': 'Liver inflammation caused by drinking alcohol. Symptoms include vomiting, headache, and yellowish skin.',
    'Tuberculosis': 'A serious infectious disease that mainly affects the lungs. Symptoms include chills, vomiting, and high fever.',
    'Common Cold': 'A viral infectious disease of the upper respiratory tract. Symptoms include chills, fatigue, and high fever.',
    'Pneumonia': 'Infection that inflames the air sacs in one or both lungs. Symptoms include chills, fatigue, and high fever.',
    'Dimorphic hemmorhoids(piles)': 'Swollen veins in the rectum and anus. Symptoms include fatigue, sweating, and dehydration.',
    'Heart attack': 'A medical emergency that occurs when blood flow to the heart is blocked. Symptoms include vomiting, sweating, and chest pain.',
    'Varicose veins': 'Enlarged, twisted veins that commonly occur in the legs. Symptoms include fatigue, swelling, and pain.',
    'Hypothyroidism': 'A condition where the thyroid gland doesn\'t produce enough thyroid hormone. Symptoms include fatigue, weight gain, and cold hands.',
    'Hyperthyroidism': 'A condition where the thyroid gland produces too much thyroid hormone. Symptoms include fatigue, weight loss, and anxiety.',
    'Hypoglycemia': 'A condition where blood sugar levels are lower than normal. Symptoms include vomiting, headache, and dizziness.',
    'Osteoarthristis': 'A degenerative joint disease that affects cartilage. Symptoms include joint pain, muscle weakness, and stiffness.',
    'Arthritis': 'Inflammation of one or more joints. Symptoms include fatigue, joint pain, and swelling.',
    '(vertigo) Paroymsal  Positional Vertigo': 'A condition that causes brief episodes of mild to intense dizziness. Symptoms include vomiting, headache, and dizziness.',
    'Acne': 'A skin condition that occurs when hair follicles become plugged with oil and dead skin cells. Symptoms include skin rash and pimples.',
    'Urinary tract infection': 'An infection in any part of the urinary system. Symptoms include burning urination and frequent urination.',
    'Psoriasis': 'A skin disorder that causes skin cells to multiply up to 10 times faster than normal. Symptoms include skin rash and itching.',
    'Impetigo': 'A highly contagious skin infection that mainly affects infants and children. Symptoms include skin rash and high fever.'
}

@app.route('/')
def index():
    """Homepage"""
    return render_template('index.html', symptoms=symptoms)

@app.route('/upload', methods=['POST'])
def upload_file():
    """Handle file upload for OCR processing"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400
        
        # Save uploaded file
        print(app.config['UPLOAD_FOLDER'])
        filename = secure_filename(file.filename)
        
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        file.save(filepath)
        
        
        
        # Extract text based on file type
        if filename.lower().endswith('.pdf'):
            extracted_text = extract_text_from_pdf(filepath)
        else:
            extracted_text = extract_text_from_image(filepath)
        
        # Clean up uploaded file
        if os.path.exists(filepath):
            os.remove(filepath)
        
        if not extracted_text:
            return jsonify({'error': 'Could not extract text from file'}), 400
        
        # Extract symptoms from text
        found_symptoms = extract_symptoms_from_text(extracted_text)
        
        return jsonify({
            'success': True,
            'extracted_text': extracted_text[:500] + '...' if len(extracted_text) > 500 else extracted_text,
            'found_symptoms': found_symptoms,
            'symptom_count': len(found_symptoms)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict', methods=['POST'])
def predict():
    """Predict disease based on symptoms"""
    try:
        data = request.get_json()
        selected_symptoms = data.get('symptoms', [])
        
        if not selected_symptoms:
            return jsonify({'error': 'No symptoms selected'}), 400
        
        # Create feature vector
        features = np.zeros(len(symptoms))
        for symptom in selected_symptoms:
            if symptom in symptoms:
                idx = symptoms.index(symptom)
                features[idx] = 1
        
        # Make prediction
        prediction = model.predict([features])[0]
        disease = encoder.inverse_transform([prediction])[0]
        
        # Get prediction probabilities
        probabilities = model.predict_proba([features])[0]
        
        # Get top 3 predictions with their probabilities
        top_indices = np.argsort(probabilities)[::-1][:3]
        top_predictions = []
        
        for idx in top_indices:
            disease_name = encoder.inverse_transform([idx])[0]
            confidence = probabilities[idx] * 100
            top_predictions.append({
                'disease': disease_name,
                'confidence': round(confidence, 2)
            })
        
        return jsonify({
            'prediction': disease,
            'confidence': round(probabilities[prediction] * 100, 2),
            'top_predictions': top_predictions,
            'selected_symptoms': selected_symptoms
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/about')
def about():
    """About page"""
    return render_template('about.html')

@app.route('/api/symptoms')
def get_symptoms():
    """API endpoint to get all symptoms"""
    return jsonify({'symptoms': symptoms})

if __name__ == '__main__':
    # Use port 5001 to avoid conflicts with AirPlay Receiver
    app.run(debug=True, host='0.0.0.0', port=5001) 