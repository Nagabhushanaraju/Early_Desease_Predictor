#!/usr/bin/env python3
"""
Diagnostic script to understand why the model is predicting tuberculosis for uploaded diseases.


import pandas as pd
import numpy as np
import pickle
import random
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

def analyze_training_data():
alyze the training data to understand the models behavior    print(=== TRAINING DATA ANALYSIS ===)   # Load training data
    df = pd.read_csv("Training.csv")
    
    # Remove unnamed column if it exists
    ifUnnamed: 133f.columns:
        df = df.drop("Unnamed: 133, axis=1)
    
    print(f"Total samples: {len(df)}")
    print(fTotal symptoms: [object Object]len(df.columns) - 1}")  # -1 for prognosis column
    
    # Analyze disease distribution
    disease_counts = df[prognosis].value_counts()
    print(f"\nDisease distribution:")
    print(disease_counts)
    
    # Check for tuberculosis specifically
    ifTuberculosis' in disease_counts.index:
        tb_samples = df[dfprognosis'] == 'Tuberculosis]
        print(f"\nTuberculosis samples: {len(tb_samples)}")
        
        # Get symptoms for tuberculosis
        tb_symptoms = tb_samples.drop(prognosis,axis=1)
        tb_symptom_counts = tb_symptoms.sum().sort_values(ascending=False)
        print(f"\nMost common symptoms in tuberculosis samples:)
        print(tb_symptom_counts.head(10))
    
    # Check for common symptoms across all diseases
    symptom_counts = df.drop(prognosis', axis=1).sum().sort_values(ascending=False)
    print(f"\nMost common symptoms across all diseases:)
    print(symptom_counts.head(10))
    
    return df

def test_symptom_extraction():
    "symptom extraction function""   print("\n=== SYMPTOM EXTRACTION TEST ===)   # Load symptoms
    try:
        with open(symptom_names.pkl', 'rb') as f:
            symptoms = pickle.load(f)
        print(f"Loaded {len(symptoms)} symptoms")
    except:
        print("Could not load symptoms from pickle file")
        return
    
    # Test with sample text
    test_texts =       Patient has fever, cough, and chest pain",
       Symptoms include headache, fatigue, and nausea",
     The patient is experiencing joint pain and muscle weakness, Common symptoms: itching, skin rash, and burning sensation"
    ]
    
    for i, text in enumerate(test_texts):
        print(f"\nTest {i+1}: {text})    found_symptoms = extract_symptoms_from_text(text, symptoms)
        print(fFound symptoms: {found_symptoms}")

def extract_symptoms_from_text(text, symptoms):
    "ract symptoms from text (copied from app.py)"    if not text or not symptoms:
        return []
    
    # Convert text to lowercase for matching
    text_lower = text.lower()
    
    # Find matching symptoms
    found_symptoms =     for symptom in symptoms:
        # Convert symptom name to readable format
        symptom_readable = symptom.replace(_.lower()
        
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

def test_model_prediction(): model predictions with different symptom combinations""print("\n=== MODEL PREDICTION TEST ===")
    
    try:
        # Load model components
        with open(disease_model.pkl', 'rb') as f:
            model = pickle.load(f)
        
        with open(label_encoder.pkl', 'rb') as f:
            encoder = pickle.load(f)
        
        with open(symptom_names.pkl', 'rb') as f:
            symptoms = pickle.load(f)
        
        print(f"Model loaded successfully)
        print(f"Number of symptoms: {len(symptoms)})
        print(f"Number of diseases: {len(encoder.classes_)}")
        
        # Test different symptom combinations
        test_cases = [
            ['high_fever,cough, ain],            ['headache', fatigue', 'nausea],         joint_pain', 'muscle_weakness],        itching', skin_rash, urning_micturition']
        ]
        
        for i, symptom_list in enumerate(test_cases):
            print(f"\nTest case {i+1}: {symptom_list}")
            
            # Create feature vector
            features = np.zeros(len(symptoms))
            found_symptoms = []
            
            for symptom in symptom_list:
                if symptom in symptoms:
                    idx = symptoms.index(symptom)
                    features[idx] = 1
                    found_symptoms.append(symptom)
            
            print(fFound symptoms in model: {found_symptoms}")
            
            # Make prediction
            prediction = model.predict([features])[0]
            disease = encoder.inverse_transform([prediction])[0]
            
            # Get probabilities
            probabilities = model.predict_proba([features])[0           top_indices = np.argsort(probabilities)[::-1][:3]
            
            print(f"Prediction: {disease}")
            print(fTop3ons:)           for idx in top_indices:
                disease_name = encoder.inverse_transform([idx])[0        confidence = probabilities[idx] * 10             print(f - {disease_name}: {confidence:.2f}%")
        
    except Exception as e:
        print(f"Error testing model: {e}")

def analyze_model_bias():
   alyze if the model has a bias towards certain diseases""print("\n=== MODEL BIAS ANALYSIS ===")
    
    try:
        # Load model
        with open(disease_model.pkl', 'rb') as f:
            model = pickle.load(f)
        
        with open(label_encoder.pkl', 'rb') as f:
            encoder = pickle.load(f)
        
        # Test with random symptom combinations
        for i in range(5):
            # Generate random symptoms
            num_symptoms = random.randint(1, 5)
            random_symptoms = random.sample(range(len(model.feature_importances_)), num_symptoms)
            
            # Create feature vector
            features = np.zeros(len(model.feature_importances_))
            for idx in random_symptoms:
                features[idx] = 1
            
            # Make prediction
            prediction = model.predict([features])[0]
            disease = encoder.inverse_transform([prediction])[0]
            
            probabilities = model.predict_proba([features])[0]
            confidence = probabilitiesprediction] * 100
            print(f"Random test {i+1}: {disease} (confidence: {confidence:.2f}%)")
            
            # Check if tuberculosis is frequently predicted
            tb_idx = None
            for idx, disease_name in enumerate(encoder.classes_):
                if disease_name == 'Tuberculosis':
                    tb_idx = idx
                    break
            
            if tb_idx is not None:
                tb_confidence = probabilities[tb_idx] * 10             print(f"  Tuberculosis confidence: [object Object]tb_confidence:.2f}%")
        
    except Exception as e:
        print(f"Error analyzing model bias: {e})if __name__ ==__main__":
    # Run all diagnostics
    df = analyze_training_data()
    test_symptom_extraction()
    test_model_prediction()
    analyze_model_bias()
    
    print("\n=== DIAGNOSTIC COMPLETE ===") 