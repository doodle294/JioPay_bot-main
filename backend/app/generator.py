import openai
from app.config import config

openai.api_key = config.OPENAI_API_KEY

def generate_answer(query, retrieved_chunks):
    context_blocks = []
    for idx, (chunk, score) in enumerate(retrieved_chunks):
        context_blocks.append(f"[{idx+1}] URL: {chunk['url']}\nCHUNK: {chunk['text']}")
    context = "\n---\n".join(context_blocks)

    prompt = f"""
You are a helpful support bot for JioPay. Use ONLY the context below to answer.
If context doesn't answer, say "I couldn't find this in JioPay's docs."

<CONTEXT>
{context}
</CONTEXT>

Question: {query}
Answer with citations like [1], [2].
"""
    resp = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[{"role": "system", "content": prompt}],
        temperature=0
    )
    return resp.choices[0].message["content"]
