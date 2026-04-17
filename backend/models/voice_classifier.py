import numpy as np

class VoiceDiagnosticModel:
    def __init__(self):
        # Thresholds calibrated from your clinical datasets:
        # voice001 (Hyperkinetic Dysphonia) vs voice002 (Healthy Control)
        self.jitter_threshold = 1.04   # Baseline from voice001.hea
        self.shimmer_threshold = 3.81  # Baseline for amplitude stability

    def predict(self, jitter, shimmer):
        if jitter > self.jitter_threshold:
            return "Pathological Pattern Detected"
        elif jitter > 0.8:
            return "Moderate Risk: Elevated Instability"
        else:
            return "Healthy"