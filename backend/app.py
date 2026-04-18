import os
import numpy as np
import librosa
import pickle
import subprocess
import uuid
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from fpdf import FPDF

# ================= CONFIG =================
FFMPEG_PATH = r'D:\ffmpeg-2026-04-16-git-5abc240a27-full_build\bin'
os.environ["PATH"] += os.pathsep + FFMPEG_PATH

UPLOAD_FOLDER = "uploads"
REPORT_FOLDER = "reports"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(REPORT_FOLDER, exist_ok=True)

app = Flask(__name__)
CORS(app)

# ================= LOAD MODEL =================
model, mean, std = None, None, None

try:
    with open("models/pnn.pkl", "rb") as f:
        data = pickle.load(f)
        model = data["model"]
        mean = data["mean"]
        std = data["std"]
except Exception as e:
    print(f"❌ Model Load Error: {e}")


# ================= FEATURE EXTRACTION =================
def extract_features(path):
    y, sr = librosa.load(path, sr=22050)

    pitches, _ = librosa.piptrack(y=y, sr=sr)
    p = pitches[pitches > 0]

    jitter = (np.std(p) / np.mean(p)) * 10 if len(p) > 0 else 0

    rms = librosa.feature.rms(y=y)[0]
    shimmer = (np.std(rms) / np.mean(rms)) * 10 if np.mean(rms) > 0 else 0

    return {
        "jitter": round(float(jitter), 3),
        "shimmer": round(float(shimmer), 3)
    }


# ================= PDF GENERATION =================
def generate_pdf(uid, metrics, prediction):
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    # Title
    pdf.set_font("Arial", "B", 20)
    pdf.cell(0, 12, "Voice Health Report", ln=True, align="C")

    pdf.ln(5)

    # Divider
    pdf.set_draw_color(200, 200, 200)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())

    pdf.ln(10)

    # Summary
    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, "Summary", ln=True)

    pdf.set_font("Arial", "", 12)
    pdf.multi_cell(0, 8, f"Prediction: {prediction}")

    pdf.ln(5)

    # Metrics Section
    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, "Acoustic Metrics", ln=True)

    pdf.set_font("Arial", "", 12)

    pdf.set_fill_color(240, 240, 240)

    pdf.cell(90, 10, "Metric", border=1, fill=True)
    pdf.cell(90, 10, "Value", border=1, ln=True, fill=True)

    pdf.cell(90, 10, "Jitter", border=1)
    pdf.cell(90, 10, str(metrics["jitter"]), border=1, ln=True)

    pdf.cell(90, 10, "Shimmer", border=1)
    pdf.cell(90, 10, str(metrics["shimmer"]), border=1, ln=True)

    pdf.ln(10)

    # Footer
    pdf.set_font("Arial", "I", 10)
    pdf.set_text_color(120, 120, 120)
    pdf.multi_cell(0, 6, "Note: This is an AI-generated analysis and not a medical diagnosis.")

    path = os.path.join(REPORT_FOLDER, f"Report_{uid}.pdf")
    pdf.output(path)

    return path


# ================= API =================
@app.route("/analyze", methods=["POST", "OPTIONS"])
def analyze():

    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    try:
        if "audio" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["audio"]
        uid = str(uuid.uuid4())[:8]

        webm_path = os.path.join(UPLOAD_FOLDER, f"in_{uid}.webm")
        wav_path = os.path.join(UPLOAD_FOLDER, f"out_{uid}.wav")

        file.save(webm_path)

        # Convert audio
        subprocess.run(
            ["ffmpeg", "-y", "-i", webm_path, "-ac", "1", "-ar", "22050", wav_path],
            check=True
        )

        # Extract features
        metrics = extract_features(wav_path)

        # Prediction
        x = (np.array([[metrics["jitter"], metrics["shimmer"]]]) - mean) / (std + 1e-8)
        pred = "HEALTHY" if model.predict(x)[0] == 0 else "PARKINSON'S RISK DETECTED"

        # Generate PDF
        generate_pdf(uid, metrics, pred)

        return jsonify({
            "metrics": metrics,
            "prediction": pred,
            "report_url": f"/download/Report_{uid}.pdf"
        })

    except Exception as e:
        print(f"❌ Server Error: {e}")
        return jsonify({"error": str(e)}), 500


# ================= DOWNLOAD =================
@app.route("/download/<filename>")
def download(filename):
    return send_from_directory(REPORT_FOLDER, filename, as_attachment=True)


# ================= RUN =================
if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=5000)