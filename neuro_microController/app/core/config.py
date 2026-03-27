import os

class Settings:
    # Kafka Configs
    KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
    KAFKA_TOPIC_LOGS = "neuro_ops_logs"
    
    # Qdrant Configs (Memory)
    QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")
    QDRANT_COLLECTION = "sre_knowledge_base"

    # AI Configs (DeepSeek)
    OLLAMA_BASE_URL = "http://localhost:11434"
    MODEL_NAME = "deepseek-r1:8b"

settings = Settings()