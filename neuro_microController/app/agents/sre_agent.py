import json
import time
import os
from kafka import KafkaConsumer, KafkaProducer
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient

# ---------------------------------------------------------
# 1. CONFIGURATION (Docker-Aware)
# ---------------------------------------------------------
# ✅ These now automatically use the Docker container names!
KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:29092")
QDRANT_URL = os.getenv("QDRANT_URL", "http://qdrant:6333")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "") 

INPUT_TOPIC = "neuro_ops_logs"
OUTPUT_TOPIC = "neuro_ops_alerts"
COLLECTION_NAME = "sre_knowledge_base"

print(f"🚀 Starting SRE Agent... Connecting to Kafka at: {KAFKA_BOOTSTRAP_SERVERS}")

# ---------------------------------------------------------
# 2. SETUP INFRASTRUCTURE
# ---------------------------------------------------------
consumer = KafkaConsumer(
    INPUT_TOPIC,
    bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
    auto_offset_reset='latest',
    value_deserializer=lambda x: json.loads(x.decode('utf-8'))
)

producer = KafkaProducer(
    bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
    value_serializer=lambda x: json.dumps(x).encode('utf-8')
)

# ---------------------------------------------------------
# 3. SETUP MEMORY
# ---------------------------------------------------------
print("🧠 Connecting to Memory...")
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
client = QdrantClient(url=QDRANT_URL)
vector_store = QdrantVectorStore(client=client, collection_name=COLLECTION_NAME, embedding=embeddings)

# ---------------------------------------------------------
# 4. SETUP BRAIN
# ---------------------------------------------------------
print("⚡ Connecting to Groq Inference Engine...")
llm = ChatGroq(
    temperature=0,
    model_name="llama-3.3-70b-versatile",
    groq_api_key=GROQ_API_KEY
)

print("👀 Listening for errors & Publishing fixes...")

# ---------------------------------------------------------
# 5. THE LOOP
# ---------------------------------------------------------
for message in consumer:
    log = message.value
    
    if log.get("level") in ["ERROR", "CRITICAL"]:
        print(f"\n🔥 ALERT: {log['service']} - {log['message']}")
        
        try:
            docs = vector_store.similarity_search(log['message'], k=1)
            context = docs[0].page_content if docs else "No specific runbook found."
        except Exception as e:
            context = "Memory unavailable."

        prompt = (
            f"You are a Senior SRE. A system error occurred.\n"
            f"Error Log: {log['message']}\n"
            f"Runbook Context: {context}\n"
            f"Task: Provide a concise, actionable 1-sentence fix command or solution."
        )
        
        try:
            response = llm.invoke(prompt)
            solution_text = response.content
            
            alert_payload = {
                "timestamp": time.strftime("%H:%M:%S"),
                "service": log['service'],
                "level": log['level'],
                "error": log['message'],
                "solution": solution_text,
                "confidence": "High"
            }
            
            producer.send(OUTPUT_TOPIC, value=alert_payload)
            producer.flush() 
            print(f"   ✅ Solution sent: {solution_text[:50]}...")
            
        except Exception as e:
            print(f"❌ API Error: {e}")