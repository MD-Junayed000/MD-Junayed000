import os
import warnings

from pydantic_settings import BaseSettings
from typing import List, Optional


# Default password hash for "admin123" - used ONLY for local development/testing.
# MUST be overridden in production via ADMIN_PASSWORD_HASH environment variable.
_DEFAULT_ADMIN_HASH = "$2b$12$ZpiQhHMCPNdwFB8KOE.Qw.uLkicju6xp4YTY72DabZd932E74MTaW"


class Settings(BaseSettings):
    # In production, SECRET_KEY MUST be set via environment variable.
    # In testing (TESTING=true), a default is used for convenience.
    SECRET_KEY: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    ADMIN_USERNAME: str = "admin"
    # WARNING: The default hash corresponds to "admin123". Override in production!
    ADMIN_PASSWORD_HASH: str = _DEFAULT_ADMIN_HASH

    HF_API_TOKEN: str = ""
    HF_MODEL_ID: str = "mistralai/Mistral-7B-Instruct-v0.3"

    CHROMA_PERSIST_DIR: str = "./chroma_data"

    # CORS: Set CORS_ORIGINS to your specific production frontend URL(s).
    # CORS_ORIGIN_REGEX can be used for Vercel preview deployments.
    # Example: r"https://portfolio-junayed(-[a-z0-9]+)?\.vercel\.app"
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
    ]
    CORS_ORIGIN_REGEX: Optional[str] = None

    DATABASE_URL: str = "sqlite+aiosqlite:///./portfolio.db"

    # Set TESTING=true in test environment to allow default SECRET_KEY
    TESTING: bool = False

    # Maximum upload sizes in bytes
    MAX_PHOTO_SIZE: int = 10 * 1024 * 1024  # 10 MB
    MAX_PDF_SIZE: int = 50 * 1024 * 1024    # 50 MB

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()


def validate_settings_at_startup() -> None:
    """Validate critical settings at application startup.

    Raises RuntimeError if SECRET_KEY is not configured in non-test environments.
    Emits warnings if default admin credentials are still in use.
    """
    # SECRET_KEY validation: fail hard if not set (unless in test mode)
    if not settings.SECRET_KEY:
        if settings.TESTING:
            # Allow a default for testing only
            settings.SECRET_KEY = "test-secret-key-not-for-production"
        else:
            raise RuntimeError(
                "FATAL: SECRET_KEY environment variable is not set. "
                "Generate one with: python -c \"import secrets; print(secrets.token_urlsafe(32))\" "
                "and set it in your .env file or environment variables."
            )

    # Warn if default admin credentials are in use
    if settings.ADMIN_PASSWORD_HASH == _DEFAULT_ADMIN_HASH:
        warnings.warn(
            "WARNING: Default admin credentials are in use (password: admin123). "
            "This is only acceptable for local development. "
            "For production, generate a new hash with: "
            'python -c "from passlib.context import CryptContext; '
            "print(CryptContext(schemes=['bcrypt']).hash('your-secure-password'))\" "
            "and set ADMIN_PASSWORD_HASH in your environment.",
            stacklevel=2,
        )
