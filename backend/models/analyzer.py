import librosa
import numpy as np

def analyze_voice(file_path):
    # Load audio file
    y, sr = librosa.load(file_path)
    
    # Extract fundamental frequency (F0)
    f0, voiced_flag, voiced_probs = librosa.pyin(y, fmin=75, fmax=600)
    
    # Calculate basic Jitter (variation in pitch)
    f0_clean = f0[~np.isnan(f0)]
    jitter = np.std(f0_clean) / np.mean(f0_clean) if len(f0_clean) > 0 else 0
    
    # Calculate basic Shimmer (variation in amplitude)
    shimmer = np.std(y) / np.mean(np.abs(y)) if len(y) > 0 else 0
    
    return {
        "jitter": round(float(jitter), 4),
        "shimmer": round(float(shimmer), 4),
        "status": "Healthy" if jitter < 0.01 else "Consult Specialist"
    }