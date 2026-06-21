from pydantic import BaseModel, Field
from typing import Optional, List


# Auth schemas
class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# About schemas
class AboutContentBase(BaseModel):
    bio: str
    title: str
    photo_url: Optional[str] = None


class AboutContentResponse(AboutContentBase):
    id: int

    class Config:
        from_attributes = True


# Project schemas
class ProjectBase(BaseModel):
    name: str
    description: str
    tech_stack: str
    repo_url: Optional[str] = None
    demo_url: Optional[str] = None
    image_url: Optional[str] = None
    order: int = 0


class ProjectResponse(ProjectBase):
    id: int

    class Config:
        from_attributes = True


# Skill schemas
class SkillBase(BaseModel):
    category: str
    name: str
    proficiency: float = 0.0


class SkillResponse(SkillBase):
    id: int

    class Config:
        from_attributes = True


# Research schemas
class ResearchBase(BaseModel):
    title: str
    venue: Optional[str] = None
    year: Optional[int] = None
    status: Optional[str] = None
    link: Optional[str] = None


class ResearchResponse(ResearchBase):
    id: int

    class Config:
        from_attributes = True


# Experience schemas
class ExperienceBase(BaseModel):
    title: str
    organization: str
    period: str
    description: Optional[str] = None


class ExperienceResponse(ExperienceBase):
    id: int

    class Config:
        from_attributes = True


# Certificate schemas
class CertificateBase(BaseModel):
    name: str
    issuer: Optional[str] = None
    date: Optional[str] = None
    file_path: Optional[str] = None


class CertificateResponse(CertificateBase):
    id: int

    class Config:
        from_attributes = True


# Chat schemas
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)


class ChatResponse(BaseModel):
    response: str
    sources: List[str] = []


# Admin Settings schemas
class AdminSettings(BaseModel):
    hf_model_id: Optional[str] = None
    hf_api_token: Optional[str] = None
