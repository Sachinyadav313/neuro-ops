import time
import json
import random
import logging
from kafka import KafkaProducer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

producer = KafkaProducer(
    bootstrap_servers=['localhost:9092'],
    value_serializer=lambda x: json.dumps(x).encode('utf-8')
)

TOPIC_NAME = "neuro_ops_logs"
ERROR_TEMPLATES = [
    {"service": "payment-api", "level": "ERROR", "message": "Connection refused to DB:5432. Timeout 3000ms."},
    {"service": "auth-service", "level": "CRITICAL", "message": "Redis OOM command not allowed when used memory > 'maxmemory'."},
    {"service": "frontend", "level": "WARN", "message": "API response time > 500ms for /login endpoint."},
]

def generate_chaos():
    logger.info(f"🔥 Starting Chaos Generator on topic: {TOPIC_NAME}")
    try:
        while True:
            log_entry = random.choice(ERROR_TEMPLATES)
            log_entry["timestamp"] = time.time()
            producer.send(TOPIC_NAME, value=log_entry)
            logger.info(f"Sent: {log_entry['level']} - {log_entry['message']}")
            
            # ✅ WAIT 15 SECONDS to avoid Groq Rate Limits
            time.sleep(15)
    except KeyboardInterrupt:
        producer.close()

if __name__ == "__main__":
    generate_chaos()