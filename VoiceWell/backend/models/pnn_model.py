import numpy as np

class PNN:
    def __init__(self, sigma=0.1):
        self.sigma = sigma
        self.X = None
        self.y = None

    def fit(self, X, y):
        self.X = np.array(X, dtype=np.float32)
        self.y = np.array(y)

    def _kernel(self, x, xi):
        return np.exp(-np.sum((x - xi) ** 2) / (2 * self.sigma ** 2))

    def predict(self, x):
        x = np.array(x, dtype=np.float32)
        classes = np.unique(self.y)

        scores = {}
        for c in classes:
            Xc = self.X[self.y == c]
            scores[c] = np.sum([self._kernel(x, xi) for xi in Xc])

        return int(max(scores, key=scores.get))