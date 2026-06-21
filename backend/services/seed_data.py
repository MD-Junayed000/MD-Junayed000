from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database import AboutContent, Project, Skill, Research, async_session
from services.vector_store import add_document, get_collection


async def seed_database():
    """Seed the database with Muhammad Junayed's profile data."""
    async with async_session() as session:
        # Check if already seeded
        result = await session.execute(select(AboutContent))
        if result.scalar_one_or_none() is not None:
            return

        # Seed About content
        about = AboutContent(
            bio=(
                "I am Muhammad Junayed, an AI Engineering Enthusiast specializing in "
                "Computer Vision and Cloud-Native ML Systems. Currently a final-year "
                "ETE student at CUET, I am passionate about building intelligent systems "
                "that solve real-world problems. My work spans from RAG pipelines and "
                "LLM applications to industrial computer vision and MLOps."
            ),
            title="AI Engineering Enthusiast | Computer Vision | Cloud-Native ML Systems",
            photo_url=None,
        )
        session.add(about)

        # Seed Projects
        projects_data = [
            {
                "name": "AroBot",
                "description": "Agentic RAG Multi-Modal Chatbot for healthcare",
                "tech_stack": "FastAPI, OCR, LangSmith, Pinecone, Ollama",
                "repo_url": "https://github.com/MD-Junayed000/AroBot",
                "order": 1,
            },
            {
                "name": "Uber Fare Prediction",
                "description": "MLOps pipeline with Airflow + ZenML",
                "tech_stack": "Airflow, ZenML, MLflow, Flask, PostgreSQL",
                "order": 2,
            },
            {
                "name": "Tabular-QA",
                "description": "QA over structured datasets (SemEval DataBench)",
                "tech_stack": "Semantic matching, Transformers",
                "repo_url": "https://github.com/MD-Junayed000/Tabular-QA",
                "order": 3,
            },
            {
                "name": "WM811k Wafer Defect Recognition",
                "description": "Industrial vision with CNN + Grad-CAM",
                "tech_stack": "CNN, Grad-CAM, Computer Vision",
                "order": 4,
            },
            {
                "name": "Wavelet EEG + Vision Transformer",
                "description": "EEG classification for alcoholic vs control",
                "tech_stack": "ViT, Signal Processing",
                "order": 5,
            },
            {
                "name": "Bistro-92",
                "description": "Go microservices + React restaurant management",
                "tech_stack": "Go, React, RabbitMQ, Temporal",
                "repo_url": "https://github.com/MD-Junayed000/Bistro-92",
                "order": 6,
            },
            {
                "name": "Graph Algorithm Visualizer",
                "description": "Interactive graph visualization with ML prediction",
                "tech_stack": "React, Flask, TensorFlow",
                "order": 7,
            },
            {
                "name": "Smart Attendance System",
                "description": "Face Recognition + RFID attendance",
                "tech_stack": "Flask, Face Recognition, RFID",
                "order": 8,
            },
            {
                "name": "Aroma Pharmacy",
                "description": "PHP e-commerce platform",
                "tech_stack": "PHP, MySQL",
                "repo_url": "https://github.com/MD-Junayed000/Aroma-Pharmacy",
                "order": 9,
            },
            {
                "name": "Bangladesh Medicine Scraper",
                "description": "Web scraper for medicine data",
                "tech_stack": "Scrapy, Playwright, PostgreSQL, Django/DRF",
                "repo_url": "https://github.com/MD-Junayed000/Bangladesh_Medicine_Scraper",
                "order": 10,
            },
            {
                "name": "NLP from Scratch",
                "description": "NLP learning lab",
                "tech_stack": "Python, LSTM, BERT",
                "repo_url": "https://github.com/MD-Junayed000/NLP_from_Scratch",
                "order": 11,
            },
            {
                "name": "Credit Card Fraud Detection",
                "description": "ML fraud detection app",
                "tech_stack": "SMOTE, Random Forest, XGBoost",
                "repo_url": "https://github.com/MD-Junayed000/Credit-Card-Fraud-Detection-App",
                "order": 12,
            },
            {
                "name": "Async Tasks",
                "description": "Production-ready async task processing",
                "tech_stack": "Flask, Celery, RabbitMQ, Redis, Docker, AWS EC2, Pulumi",
                "repo_url": "https://github.com/MD-Junayed000/Async-tasks-main",
                "order": 13,
            },
        ]
        for p in projects_data:
            session.add(Project(**p))

        # Seed Skills
        skills_data = [
            # AI/ML
            {"category": "AI/ML", "name": "PyTorch", "proficiency": 0.9},
            {"category": "AI/ML", "name": "TensorFlow", "proficiency": 0.85},
            {"category": "AI/ML", "name": "scikit-learn", "proficiency": 0.85},
            {"category": "AI/ML", "name": "Transformers", "proficiency": 0.85},
            {"category": "AI/ML", "name": "GANs", "proficiency": 0.75},
            {"category": "AI/ML", "name": "NLP", "proficiency": 0.85},
            {"category": "AI/ML", "name": "Computer Vision", "proficiency": 0.9},
            # LLM Systems
            {"category": "LLM Systems", "name": "RAG pipelines", "proficiency": 0.9},
            {"category": "LLM Systems", "name": "OCR + retrieval", "proficiency": 0.8},
            {"category": "LLM Systems", "name": "Prompt workflows", "proficiency": 0.85},
            {"category": "LLM Systems", "name": "Agent orchestration", "proficiency": 0.8},
            # MLOps
            {"category": "MLOps", "name": "Airflow", "proficiency": 0.8},
            {"category": "MLOps", "name": "ZenML", "proficiency": 0.8},
            {"category": "MLOps", "name": "MLflow", "proficiency": 0.85},
            {"category": "MLOps", "name": "Reproducible training", "proficiency": 0.8},
            # Backend
            {"category": "Backend", "name": "FastAPI", "proficiency": 0.9},
            {"category": "Backend", "name": "Flask", "proficiency": 0.85},
            {"category": "Backend", "name": "Node.js", "proficiency": 0.75},
            {"category": "Backend", "name": "REST APIs", "proficiency": 0.9},
            {"category": "Backend", "name": "PostgreSQL", "proficiency": 0.8},
            # Frontend
            {"category": "Frontend", "name": "React", "proficiency": 0.8},
            {"category": "Frontend", "name": "JavaScript", "proficiency": 0.85},
            {"category": "Frontend", "name": "HTML5", "proficiency": 0.85},
            {"category": "Frontend", "name": "CSS3", "proficiency": 0.8},
            # Deployment
            {"category": "Deployment", "name": "Docker", "proficiency": 0.85},
            {"category": "Deployment", "name": "AWS", "proficiency": 0.75},
            {"category": "Deployment", "name": "CI workflows", "proficiency": 0.8},
            # Languages
            {"category": "Languages", "name": "Python", "proficiency": 0.95},
            {"category": "Languages", "name": "JavaScript", "proficiency": 0.85},
            {"category": "Languages", "name": "C++", "proficiency": 0.7},
            {"category": "Languages", "name": "PHP", "proficiency": 0.65},
            {"category": "Languages", "name": "MATLAB", "proficiency": 0.6},
        ]
        for s in skills_data:
            session.add(Skill(**s))

        # Seed Research
        research_data = [
            {
                "title": "B.Sc. thesis: Hallucination detection/mitigation in LLMs",
                "status": "Ongoing",
                "year": 2024,
            },
            {
                "title": "CNN-based defect recognition for silicon wafer maps",
                "venue": "ICAEEE 2024, IEEE",
                "year": 2024,
            },
            {
                "title": "Vision Transformer for breast ultrasound classification",
                "venue": "SPICSCON 2025",
                "year": 2025,
            },
            {
                "title": "Prompt-engineering with AI tutors",
                "venue": "BEA 2025 / ACL workshop",
                "year": 2025,
            },
        ]
        for r in research_data:
            session.add(Research(**r))

        await session.commit()


def seed_vector_store():
    """Seed the vector store with Muhammad Junayed's profile information."""
    collection = get_collection()
    if collection.count() > 0:
        return

    # Profile summary
    profile_texts = [
        (
            "Muhammad Junayed is an AI Engineering Enthusiast specializing in Computer Vision "
            "and Cloud-Native ML Systems. He is a final-year ETE (Electronics and Telecommunication "
            "Engineering) student at CUET (Chittagong University of Engineering and Technology)."
        ),
        (
            "Contact: Email - mdjunayed573@gmail.com, "
            "LinkedIn - https://www.linkedin.com/in/muhammad-junayed-ete20/, "
            "GitHub - https://github.com/MD-Junayed000, "
            "Kaggle - https://www.kaggle.com/muhammedjunayed"
        ),
        (
            "Muhammad Junayed's AI/ML skills include PyTorch, TensorFlow, scikit-learn, "
            "Transformers, GANs, NLP, and Computer Vision. He specializes in building "
            "LLM Systems including RAG pipelines, OCR + retrieval, Prompt workflows, "
            "and Agent orchestration."
        ),
        (
            "Muhammad Junayed's MLOps expertise includes Airflow, ZenML, MLflow, and "
            "Reproducible training. For backend development he uses FastAPI, Flask, "
            "Node.js, REST APIs, and PostgreSQL."
        ),
        (
            "Muhammad Junayed's projects include AroBot (Agentic RAG Multi-Modal Chatbot "
            "for healthcare using FastAPI, OCR, LangSmith, Pinecone, Ollama), "
            "Uber Fare Prediction (MLOps pipeline with Airflow + ZenML), "
            "and Tabular-QA (QA over structured datasets for SemEval DataBench)."
        ),
        (
            "More projects by Muhammad Junayed: WM811k Wafer Defect Recognition "
            "(Industrial vision with CNN + Grad-CAM), Wavelet EEG + Vision Transformer "
            "(EEG classification), Bistro-92 (Go microservices + React restaurant management), "
            "and Graph Algorithm Visualizer."
        ),
        (
            "Muhammad Junayed's research work includes his B.Sc. thesis on Hallucination "
            "detection and mitigation in LLMs (ongoing), CNN-based defect recognition for "
            "silicon wafer maps (ICAEEE 2024, IEEE), Vision Transformer for breast ultrasound "
            "classification (SPICSCON 2025), and Prompt-engineering with AI tutors "
            "(BEA 2025 / ACL workshop)."
        ),
        (
            "Muhammad Junayed is proficient in Python, JavaScript, C++, PHP, and MATLAB. "
            "For deployment, he uses Docker, AWS, and CI workflows. His frontend skills "
            "include React, JavaScript, HTML5, and CSS3."
        ),
    ]

    for i, text in enumerate(profile_texts):
        add_document(
            text=text,
            metadata={"source": "profile", "chunk_index": i},
            doc_id=f"profile_{i}",
        )
