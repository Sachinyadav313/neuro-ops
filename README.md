<div align="center">
  <img src="https://capsule-render.vercel.app/render?type=soft&color=auto&height=200&section=header&text=Neuro-Ops&fontSize=70" width="100%">

  <h3>🤖 Autonomous SRE Agent for Self-Healing Distributed Systems</h3>

  <p align="center">
    <img src="https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white" />
    <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
    <img src="https://img.shields.io/badge/Apache_Kafka-231F20?style=for-the-badge&logo=apache-kafka&logoColor=white" />
    <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
    <img src="https://img.shields.io/badge/Groq_Llama3-F34F29?style=for-the-badge&logo=micro-dot-blog&logoColor=white" />
  </p>
</div>

---

## 📖 Overview
**Neuro-Ops** is a professional-grade AI agent designed to eliminate manual log analysis. By integrating **Event-Driven Architecture** with **RAG (Retrieval-Augmented Generation)**, it doesn't just alert you to errors—it understands them and fixes them.

### ✨ Key Features
- 🚀 **Real-time Ingestion**: High-throughput log processing via Apache Kafka.
- 🧠 **Intelligent Diagnosis**: Llama-3 reasoning powered by system-specific documentation in Qdrant.
- 🛠️ **Auto-Remediation**: Executes self-healing scripts via FastAPI hooks.
- 📊 **Monitoring Dashboard**: Real-time visualization of system health and agent actions.

---

## 🛠️ Tech Stack
<p align="left">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=py,fastapi,kafka,docker,mongodb,react,tailwind,githubactions" />
  </a>
</p>

---

## 🏗️ Architecture
The system follows a 4-layer intelligence pipeline:

1. **The Pulse**: Distributed services push logs to **Kafka** topics.
2. **The Brain**: The **AI Agent** consumes logs and performs a similarity search in **Qdrant** for relevant playbooks.
3. **The Strategy**: **Llama-3** generates a root-cause analysis (RCA).
4. **The Cure**: The agent triggers **FastAPI** recovery endpoints to restore service.

---

## 🚀 Getting Started

### 1. Clone & Setup
```bash
git clone [https://github.com/Sachinyadav313/neuro-ops.git](https://github.com/Sachinyadav313/neuro-ops.git)
cd neuro-ops
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
