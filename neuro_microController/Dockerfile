FROM python:3.10-slim

WORKDIR /app

# Install network tools for Docker health checks
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# ✅ THE FIX: Explicitly install the lightweight CPU-only version of PyTorch first!
# This is ~150MB instead of ~1GB, so your internet won't drop the connection.
RUN pip install --default-timeout=1000 torch --index-url https://download.pytorch.org/whl/cpu

# Then install the rest of your packages
RUN pip install --default-timeout=1000 --no-cache-dir -r requirements.txt

COPY . .

# Default command
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]