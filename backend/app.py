import os
import numpy as np
import librosa
import pickle
import subprocess
import uuid
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from fpdf import FPDF

# =========================
# 🔥 SYSTEM CONFIG
# =========================
FFMPEG_PATH = r'D:\ffmpeg-2026-04-16-git-5abc240a27-full_build\bin'
os.environ["PATH"] += os.pathsep + FFMPEG_PATH

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

UPLOAD_FOLDER = "uploads"
REPORT_FOLDER = "reports"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(REPORT_FOLDER, exist_ok=True)

# =========================
# 🤖 PNN MODEL LOADING
# =========================
model, mean, std = None, None, None

def load_pnn():
    global model, mean, std
    try:
        model_path = os.path.join("models", "pnn.pkl")
        with open(model_path, "rb") as f:
            data = pickle.load(f)
            model = data["model"]
            mean = data["mean"]
            std = data["std"]
        print("✅ PNN Architecture: Pattern & Summation Layers Ready")
    except Exception as e:
        print(f"❌ PNN Initialization Failed: {e}")

load_pnn()

# =========================
# 🎧 AUDIO ENGINE
# =========================
def convert_to_wav(input_p, output_p):
    subprocess.run([
        "ffmpeg", "-y", "-i", input_p, 
        "-ac", "1", "-ar", "22050", output_p
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)

def extract_features(path):
    y, sr = librosa.load(path, sr=22050)
    pitches, _ = librosa.piptrack(y=y, sr=sr)
    p = pitches[pitches > 0]
    jitter = (np.std(p) / np.mean(p)) * 100 if len(p) > 0 else 0
    rms = librosa.feature.rms(y=y)[0]
    shimmer = (np.std(rms) / np.mean(rms)) * 100 if np.mean(rms) > 0 else 0
    return {"jitter": float(round(jitter, 4)), "shimmer": float(round(shimmer, 4))}

# =========================
# 📊 API & PDF ENGINE
# =========================
@app.route("/analyze", methods=["POST", "OPTIONS"])
def analyze():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    try:
        if "audio" not in request.files:
            return jsonify({"error": "No audio"}), 400

        uid = str(uuid.uuid4())[:8]
        webm_path = os.path.join(UPLOAD_FOLDER, f"in_{uid}.webm")
        wav_path = os.path.join(UPLOAD_FOLDER, f"out_{uid}.wav")
        request.files["audio"].save(webm_path)
        
        convert_to_wav(webm_path, wav_path)
        metrics = extract_features(wav_path)

        # 🤖 PNN PREDICTION
        x = np.array([[metrics["jitter"], metrics["shimmer"]]])
        x_scaled = (x - mean) / std
        pred_idx = model.predict(x_scaled)[0]
        prediction = "HEALTHY" if pred_idx == 0 else "PARKINSON'S RISK DETECTED"
        
        # 📄 STRUCTURED PDF REPORT
        report_name = f"VoiceWell_Report_{uid}.pdf"
        report_path = os.path.join(REPORT_FOLDER, report_name)
        
        pdf = FPDF()
        pdf.add_page()
        
        # Header Styling
        pdf.set_fill_color(13, 17, 23) # Dark Blue/Black
        pdf.rect(0, 0, 210, 50, 'F')
        pdf.set_text_color(0, 200, 160) # VoiceWell Teal
        pdf.set_font("Arial", "B", 26)
        pdf.cell(0, 30, "VOICEWELL DIAGNOSTICS", ln=True, align="C")
        
        pdf.set_text_color(0, 0, 0)
        pdf.ln(30)
        
        # Summary Section
        pdf.set_font("Arial", "B", 14)
        pdf.cell(0, 10, "1. PATIENT ANALYSIS SUMMARY", ln=True)
        pdf.set_font("Arial", "", 11)
        pdf.cell(100, 8, f"Assessment Result: {prediction}", ln=True)
        pdf.cell(100, 8, f"System ID: VW-ML-{uid.upper()}", ln=True)
        pdf.ln(10)

        # Metrics Table
        pdf.set_fill_color(240, 240, 240)
        pdf.set_font("Arial", "B", 10)
        pdf.cell(60, 10, "ACOUSTIC PARAMETER", 1, 0, 'C', True)
        pdf.cell(60, 10, "MEASURED VALUE", 1, 0, 'C', True)
        pdf.cell(70, 10, "CLINICAL THRESHOLD", 1, 1, 'C', True)
        
        pdf.set_font("Arial", "", 10)
        pdf.cell(60, 10, "Local Jitter (%)", 1)
        pdf.cell(60, 10, f"{metrics['jitter']}%", 1, 0, 'C')
        pdf.cell(70, 10, "< 1.04% (Normal)", 1, 1, 'C')
        
        pdf.cell(60, 10, "Local Shimmer (%)", 1)
        pdf.cell(60, 10, f"{metrics['shimmer']}%", 1, 0, 'C')
        pdf.cell(70, 10, "< 3.81% (Normal)", 1, 1, 'C')

        # Model Insight
        pdf.ln(15)
        pdf.set_font("Arial", "B", 12)
        pdf.cell(0, 10, "2. PROBABILISTIC NEURAL NETWORK (PNN) INSIGHT", ln=True)
        pdf.set_font("Arial", "", 10)
        insight = (
            "The PNN model utilizes a Radial Basis Function to compare your vocal micro-fluctuations "
            "against known clinical patterns. Jitter measures frequency instability, while Shimmer "
            "measures amplitude variance. High values indicate potential laryngeal control issues."
        )
        pdf.multi_cell(0, 7, insight)
        
        pdf.output(report_path)

        return jsonify({
            "metrics": metrics,
            "prediction": prediction,
            "report_url": f"/download/{report_name}"
        })

    except Exception as e:
        print(f"❌ Server Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/download/<filename>")
def download(filename):
    return send_from_directory(REPORT_FOLDER, filename, as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=5000)