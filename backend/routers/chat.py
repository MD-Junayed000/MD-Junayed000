from fastapi import APIRouter

from models.schemas import ChatRequest, ChatResponse
from services.chatbot import generate_response

router = APIRouter(prefix="/api", tags=["chat"])

# TODO: Add rate limiting to the chat endpoint to prevent abuse.
# The /api/chat endpoint is public and calls an external paid API (HuggingFace).
# Without rate limiting, an attacker could exhaust the HF API quota.
# Recommended: Use SlowAPI (https://github.com/laurentS/slowapi) with IP-based limits.
# Example: @limiter.limit("10/minute") per IP address.


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    result = await generate_response(request.message)
    return ChatResponse(
        response=result["response"],
        sources=result.get("sources", []),
    )
