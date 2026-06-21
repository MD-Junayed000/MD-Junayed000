import pytest
from httpx import AsyncClient, ASGITransport
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set test environment variables BEFORE importing the app
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///./test_portfolio.db"
os.environ["TESTING"] = "true"
os.environ["SECRET_KEY"] = "test-secret-key-for-testing-only"

from main import app
from database import init_db, engine
from services.vector_store import initialize_collection
from services.seed_data import seed_database, seed_vector_store


@pytest.fixture(autouse=True)
async def setup_db():
    """Initialize database and vector store before tests."""
    await init_db()
    initialize_collection()
    await seed_database()
    seed_vector_store()
    yield
    # Cleanup test database
    if os.path.exists("./test_portfolio.db"):
        await engine.dispose()


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.mark.anyio
async def test_health_check():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


@pytest.mark.anyio
async def test_login_success():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Use default credentials
        response = await client.post(
            "/api/auth/login",
            json={"username": "admin", "password": "admin123"},
        )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.anyio
async def test_login_failure():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/auth/login",
            json={"username": "admin", "password": "wrongpassword"},
        )
    assert response.status_code == 401


@pytest.mark.anyio
async def test_admin_route_requires_auth():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.put(
            "/api/admin/about",
            json={"bio": "test", "title": "test"},
        )
    assert response.status_code == 403


@pytest.mark.anyio
async def test_get_about():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/about")
    assert response.status_code == 200
    data = response.json()
    assert "bio" in data
    assert "title" in data


@pytest.mark.anyio
async def test_get_projects():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/projects")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.anyio
async def test_get_skills():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/skills")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.anyio
async def test_get_research():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/research")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.anyio
async def test_chat_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/chat",
            json={"message": "Tell me about Muhammad Junayed"},
        )
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert isinstance(data["response"], str)
    assert len(data["response"]) > 0


@pytest.mark.anyio
async def test_verify_token_invalid():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get(
            "/api/auth/verify",
            headers={"Authorization": "Bearer invalid-token"},
        )
    assert response.status_code == 401


@pytest.mark.anyio
async def test_verify_token_valid():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Login first
        login_response = await client.post(
            "/api/auth/login",
            json={"username": "admin", "password": "admin123"},
        )
        token = login_response.json()["access_token"]

        # Verify token
        response = await client.get(
            "/api/auth/verify",
            headers={"Authorization": f"Bearer {token}"},
        )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "valid"
