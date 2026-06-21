import httpx
from typing import Optional

from config import settings
from services.vector_store import query as vector_query


SYSTEM_PROMPT = """You are an AI assistant for Muhammad Junayed's portfolio website. 
Muhammad Junayed is an AI Engineering Enthusiast specializing in Computer Vision and Cloud-Native ML Systems. 
He is a final-year ETE student at CUET.

Answer questions about Muhammad Junayed based on the provided context. 
Be helpful, concise, and professional. If you don't have enough information to answer a question, 
say so politely and suggest what the visitor might want to know about Muhammad Junayed.

Context from knowledge base:
{context}
"""


async def generate_response(user_message: str) -> dict:
    """Generate a response using RAG: query vector store for context, then call HuggingFace."""
    # Retrieve relevant context from vector store
    results = vector_query(user_message, n_results=3)
    context_texts = [r["text"] for r in results]
    context = "\n\n".join(context_texts) if context_texts else "No specific context available."

    sources = [r["metadata"].get("source", "profile") for r in results if r.get("metadata")]

    # If no HF API token, return a fallback response
    if not settings.HF_API_TOKEN:
        return {
            "response": _generate_fallback_response(user_message, context),
            "sources": list(set(sources)),
        }

    # Call HuggingFace Inference API
    prompt = _build_prompt(user_message, context)
    try:
        response_text = await _call_hf_api(prompt)
    except Exception:
        response_text = _generate_fallback_response(user_message, context)

    return {
        "response": response_text,
        "sources": list(set(sources)),
    }


def _build_prompt(user_message: str, context: str) -> str:
    system = SYSTEM_PROMPT.format(context=context)
    return f"<s>[INST] {system}\n\nUser question: {user_message} [/INST]"


async def _call_hf_api(prompt: str) -> str:
    url = f"https://api-inference.huggingface.co/models/{settings.HF_MODEL_ID}"
    headers = {"Authorization": f"Bearer {settings.HF_API_TOKEN}"}
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 500,
            "temperature": 0.7,
            "return_full_text": False,
        },
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(url, json=payload, headers=headers)
        response.raise_for_status()
        result = response.json()

    if isinstance(result, list) and len(result) > 0:
        return result[0].get("generated_text", "").strip()
    return "I apologize, but I could not generate a response at this time."


def _generate_fallback_response(user_message: str, context: str) -> str:
    """Generate a simple response when HF API is not available."""
    message_lower = user_message.lower()

    if any(word in message_lower for word in ["hello", "hi", "hey"]):
        return ("Hello! I'm Muhammad Junayed's AI assistant. "
                "I can tell you about his projects, skills, research, and experience. "
                "What would you like to know?")

    if any(word in message_lower for word in ["project", "work", "portfolio"]):
        return ("Muhammad Junayed has worked on several exciting projects including "
                "AroBot (an Agentic RAG Multi-Modal Chatbot for healthcare), "
                "Uber Fare Prediction with MLOps pipeline, "
                "and Tabular-QA for question answering over structured datasets. "
                "Would you like to know more about any specific project?")

    if any(word in message_lower for word in ["skill", "technology", "tech"]):
        return ("Muhammad Junayed's key skills include AI/ML (PyTorch, TensorFlow, Computer Vision), "
                "LLM Systems (RAG pipelines, Agent orchestration), "
                "MLOps (Airflow, ZenML, MLflow), "
                "and Backend Development (FastAPI, Flask, Node.js). "
                "What area interests you?")

    if any(word in message_lower for word in ["research", "paper", "publication"]):
        return ("Muhammad Junayed's research includes his B.Sc. thesis on hallucination detection "
                "in LLMs, CNN-based defect recognition published at ICAEEE 2024 (IEEE), "
                "and Vision Transformer work for breast ultrasound classification. "
                "Would you like more details?")

    if context and context != "No specific context available.":
        return f"Based on what I know about Muhammad Junayed: {context[:500]}"

    return ("I'm Muhammad Junayed's AI portfolio assistant. "
            "I can help you learn about his projects, skills, research, and background. "
            "Please ask me something specific!")
