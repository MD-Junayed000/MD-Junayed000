import chromadb
from chromadb.config import Settings as ChromaSettings
from PyPDF2 import PdfReader
from typing import List, Dict, Optional
import os
import uuid

from config import settings


_client: Optional[chromadb.ClientAPI] = None
_collection = None


def get_chroma_client():
    global _client
    if _client is None:
        os.makedirs(settings.CHROMA_PERSIST_DIR, exist_ok=True)
        _client = chromadb.Client(ChromaSettings(
            chroma_db_impl="duckdb+parquet",
            persist_directory=settings.CHROMA_PERSIST_DIR,
            anonymized_telemetry=False,
        ))
    return _client


def initialize_collection():
    global _collection
    try:
        client = get_chroma_client()
        _collection = client.get_or_create_collection(
            name="portfolio_knowledge",
            metadata={"hnsw:space": "cosine"},
        )
    except Exception:
        # Fallback: use simple in-memory client if persistent fails
        global _client
        _client = chromadb.Client()
        _collection = _client.get_or_create_collection(
            name="portfolio_knowledge",
            metadata={"hnsw:space": "cosine"},
        )
    return _collection


def get_collection():
    global _collection
    if _collection is None:
        initialize_collection()
    return _collection


def add_document(text: str, metadata: Dict = None, doc_id: str = None) -> str:
    collection = get_collection()
    if doc_id is None:
        doc_id = str(uuid.uuid4())
    if metadata is None:
        metadata = {}
    collection.add(
        documents=[text],
        metadatas=[metadata],
        ids=[doc_id],
    )
    return doc_id


def query(question: str, n_results: int = 3) -> List[Dict]:
    collection = get_collection()
    if collection.count() == 0:
        return []
    results = collection.query(
        query_texts=[question],
        n_results=min(n_results, collection.count()),
    )
    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    return [
        {"text": doc, "metadata": meta}
        for doc, meta in zip(documents, metadatas)
    ]


def delete_document(doc_id: str):
    collection = get_collection()
    collection.delete(ids=[doc_id])


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    """Split text into overlapping chunks."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        if chunk.strip():
            chunks.append(chunk.strip())
        start = end - overlap
    return chunks


def process_pdf(file_path: str) -> List[str]:
    """Extract text from PDF and add chunks to vector store."""
    reader = PdfReader(file_path)
    full_text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            full_text += page_text + "\n"

    if not full_text.strip():
        return []

    chunks = chunk_text(full_text)
    doc_ids = []
    filename = os.path.basename(file_path)
    for i, chunk in enumerate(chunks):
        doc_id = add_document(
            text=chunk,
            metadata={"source": filename, "chunk_index": i},
            doc_id=f"{filename}_{i}",
        )
        doc_ids.append(doc_id)

    return doc_ids
