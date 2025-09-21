from sentence_transformers import SentenceTransformer
import openai
from app.config import config

# Set OpenAI API key from .env
openai.api_key = config.OPENAI_API_KEY

# Load local models once at import time (avoids reloading for every request)
e5_model = SentenceTransformer("intfloat/e5-base")
bge_model = SentenceTransformer("BAAI/bge-small-en")


def embed(texts, model="openai"):
    """
    Embed a list of texts into vector embeddings using the chosen model.

    Args:
        texts (List[str]): List of strings to embed.
        model (str): Which embedding model to use. 
                     Options: "openai", "e5", "bge"

    Returns:
        List[List[float]]: List of embeddings (one per input text).
    """
    if isinstance(texts, str):
        texts = [texts]  # Ensure it's always a list

    if model == "openai":
        # OpenAI embedding call
        resp = openai.Embedding.create(
            model="text-embedding-3-small",  # Use the smallest cost-effective model
            input=texts
        )
        return [d["embedding"] for d in resp["data"]]

    elif model in ("e5", "sentence-transformers"):
        # Normalize to make embeddings comparable
        return e5_model.encode(texts, normalize_embeddings=True).tolist()

    elif model == "bge":
        return bge_model.encode(texts, normalize_embeddings=True).tolist()

    else:
        raise ValueError(
            f"Unknown embedding model: {model}. "
            f"Valid options are: ['openai', 'e5', 'bge']"
        )
