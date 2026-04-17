import os
import shutil
import librosa
import numpy as np
from dotenv import load_dotenv
import datetime
from google import genai
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from fpdf import FPDF

# --- SYSTEM CONFIG ---
ffmpeg_path = r'D:\ffmpeg-2026-04-16-git-5abc240a27-full_build\bin' 
os.environ["PATH"] += os.pathsep + ffmpeg_path

# Replace with your key from https://aistudio.google.com/
load_dotenv() # Loads the .env file
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

app = Flask(__name__)
# Explicit CORS setup for file uploads
CORS(app, resources={r"/*": {"origins": "*"}})

UPLOAD_FOLDER = 'uploads'
REPORT_FOLDER = 'reports'
for f in [UPLOAD_FOLDER, REPORT_FOLDER]:
    if not os.path.exists(f): os.makedirs(f)

def get_ai_insight(results):
    prompt = f"""
    Act as a Voice Pathologist. Analyze these metrics:
    Jitter: {results['jitter']}, Shimmer: {results['shimmer']}, Status: {results['status']}.
    Explain what these numbers mean regarding vocal fold vibration and suggest next steps in 3 sentences.
    """
    try:
        response = client.models.generate_content(model="gemini-1.5-flash", contents=prompt)
        return response.text
    except Exception as e:
        print(f"AI Error: {e}")
        return "Analysis indicates acoustic irregularities. Clinical follow-up with an ENT is recommended."

def analyze_audio(path):
    try:
        y, sr = librosa.load(path, sr=None)
        f0, _, _ = librosa.pyin(y, fmin=75, fmax=600)
        f0_clean = f0[~np.isnan(f0)]
        if len(f0_clean) == 0: return {"error": "Audio quality too low."}
        
        jitter = np.std(f0_clean) / np.mean(f0_clean)
        shimmer = np.std(y) / np.mean(np.abs(y))
        status = "Pathology Detected" if (jitter > 0.018 or shimmer > 0.04) else "Healthy"
        
        return {"jitter": round(float(jitter), 5), "shimmer": round(float(shimmer), 5), "status": status}
    except Exception as e:
        return {"error": str(e)}

def generate_pdf(results, ai_text):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", 'B', 20)
    pdf.set_text_color(34, 211, 238)
    pdf.cell(200, 20, "VoiceWell Clinical Analysis", ln=True, align='C')
    pdf.set_font("Arial", size=10)
    pdf.set_text_color(100)
    pdf.cell(200, 10, f"Date: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}", ln=True, align='C')
    pdf.ln(10)
    pdf.set_text_color(0)
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(0, 10, " 1. Acoustic Data", ln=True, fill=True)
    pdf.set_font("Arial", size=11)
    pdf.cell(95, 12, f" Jitter: {results['jitter']}", border=1)
    pdf.cell(95, 12, f" Shimmer: {results['shimmer']}", border=1, ln=True)
    pdf.ln(5)
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(0, 10, " 2. AI Interpretation", ln=True)
    pdf.set_font("Arial", size=10)
    pdf.multi_cell(0, 7, ai_text)
    pdf.ln(10)
    pdf.set_font("Arial", 'B', 14)
    pdf.cell(190, 15, f" RESULT: {results['status']}", border=2, ln=True, align='C')
    
    report_name = f"Report_{datetime.datetime.now().strftime('%M%S')}.pdf"
    pdf.output(os.path.join(REPORT_FOLDER, report_name))
    return report_name

@app.route('/analyze', methods=['POST', 'OPTIONS'])
def handle_upload():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
    if 'file' not in request.files:
        return jsonify({"error": "No file"}), 400
    
    file = request.files['file']
    save_path = os.path.join(UPLOAD_FOLDER, "input.wav")
    file.save(save_path)
    
    analysis = analyze_audio(save_path)
    if "error" in analysis: return jsonify(analysis), 500
    
    ai_text = get_ai_insight(analysis)
    report_file = generate_pdf(analysis, ai_text)
    
    return jsonify({
        **analysis, 
        "ai_insight": ai_text,
        "report_url": f"http://localhost:5000/download/{report_file}"
    })

@app.route('/download/<filename>')
def download(filename):
    return send_file(os.path.join(REPORT_FOLDER, filename), as_attachment=True)

if __name__ == '__main__':
    # use_reloader=False stops the threading.py loop error
    app.run(port=5000, debug=True, use_reloader=False)