import openai
from huggingface_hub import InferenceClient
from app.config import config
openai.api_key = config.OPENAI_API_KEY
hf_client = InferenceClient(api_key=config.HF_API_KEY)

# Local E5 model setup
import torch
from transformers import AutoTokenizer, AutoModel

_e5_tokenizer = None
_e5_model = None
def get_e5_model():
    global _e5_tokenizer, _e5_model
    if _e5_tokenizer is None or _e5_model is None:
        _e5_tokenizer = AutoTokenizer.from_pretrained("intfloat/e5-base")
        _e5_model = AutoModel.from_pretrained("intfloat/e5-base")
    return _e5_tokenizer, _e5_model


def embed(texts, model="openai"):
    if isinstance(texts, str):
        texts = [texts]

    if model == "openai":
        resp = openai.Embedding.create(
            model="text-embedding-3-small",
            input=texts
        )
        return [d["embedding"] for d in resp["data"]]

    elif model == "e5":
        # Use local E5 model for embedding extraction
        tokenizer, model_e5 = get_e5_model()
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        model_e5 = model_e5.to(device)
        # E5 expects "query: " prefix for queries
        sentences = ["query: " + t for t in texts]
        batch = tokenizer(sentences, padding=True, truncation=True, return_tensors="pt").to(device)
        with torch.no_grad():
            embeddings = model_e5(**batch).last_hidden_state[:, 0]
        return embeddings.cpu().numpy().tolist()

    elif model == "bge":
        return [hf_client.feature_extraction(t, model="BAAI/bge-small-en") for t in texts]

    else:
        raise ValueError(
            f"Unknown embedding model: {model}. "
            f"Valid options are: ['openai', 'e5', 'bge']"
        )
