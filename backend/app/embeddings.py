import openai
from huggingface_hub import InferenceClient
from app.config import config

# API keys
openai.api_key = config.OPENAI_API_KEY
hf_client = InferenceClient(api_key=config.HF_API_KEY)


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
        return hf_client.feature_extraction(texts, model="intfloat/e5-base")

    elif model == "bge":
        return hf_client.feature_extraction(texts, model="BAAI/bge-small-en")

    else:
        raise ValueError(
            f"Unknown embedding model: {model}. "
            f"Valid options are: ['openai', 'e5', 'bge']"
        )
