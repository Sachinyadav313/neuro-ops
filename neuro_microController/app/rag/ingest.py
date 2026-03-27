import os
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.http import models

# 1. Setup
QDRANT_URL = "http://localhost:6333"
COLLECTION_NAME = "sre_knowledge_base"
# Pointing to where your file actually is
DATA_PATH = "data/docs/runbook.txt"

print(f"🚀 Starting Ingestion for {DATA_PATH}...")

# 2. Check if file exists
if not os.path.exists(DATA_PATH):
    print(f"❌ CRITICAL ERROR: File not found at {os.path.abspath(DATA_PATH)}")
    print("Please make sure you created the runbook.txt file inside data/docs/")
    exit(1)

# 3. Initialize Qdrant Client
try:
    client = QdrantClient(url=QDRANT_URL)
    # Reset Collection
    if client.collection_exists(COLLECTION_NAME):
        client.delete_collection(COLLECTION_NAME)
    
    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=models.VectorParams(size=384, distance=models.Distance.COSINE),
    )
    print(f"✅ Collection '{COLLECTION_NAME}' created/reset.")
except Exception as e:
    print(f"❌ Error connecting to Qdrant: {e}")
    print("Is your Docker container running? Try 'sudo docker ps'")
    exit(1)

# 4. Load & Split Data
loader = TextLoader(DATA_PATH)
documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=0)
docs = text_splitter.split_documents(documents)
print(f"📄 Loaded {len(docs)} chunks from runbook.")

# 5. Embed & Store
print("🧠 Generating Embeddings (this might take a moment)...")
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

QdrantVectorStore.from_documents(
    docs,
    embeddings,
    url=QDRANT_URL,
    collection_name=COLLECTION_NAME,
    force_recreate=True 
)

print("🎉 Success! Knowledge Base is ready.")
