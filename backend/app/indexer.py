import faiss
import numpy as np
import os, json

class FaissIndex:
    def __init__(self, dim, index_path):
        self.index_path = index_path
        self.index = faiss.IndexFlatL2(dim)
        self.metadata = []

    def add(self, embeddings, metadata):
        vectors = np.array(embeddings).astype("float32")
        self.index.add(vectors)
        self.metadata.extend(metadata)

    def search(self, query_vector, k=5):
        D, I = self.index.search(np.array([query_vector]).astype("float32"), k)
        return [(self.metadata[i], float(D[0][idx])) for idx, i in enumerate(I[0])]

    def save(self):
        os.makedirs(os.path.dirname(self.index_path), exist_ok=True)  # Ensure directory exists
        faiss.write_index(self.index, self.index_path)
        with open(self.index_path + ".meta.json", "w") as f:
            json.dump(self.metadata, f)

    def load(self):
        self.index = faiss.read_index(self.index_path)
        with open(self.index_path + ".meta.json") as f:
            self.metadata = json.load(f)
