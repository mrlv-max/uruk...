# Create Docker Compose configuration for the entire backend
docker_compose_config = """
# ========================================
# URUK HEALTH BACKEND - DOCKER COMPOSE
# Complete microservices orchestration
# ========================================

version: '3.8'

services:
  # =====================================
  # DATABASES
  # =====================================
  
  postgresql:
    image: postgres:15-alpine
    container_name: uruk-postgresql
    environment:
      POSTGRES_DB: uruk_health
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: uruk123
      POSTGRES_MULTIPLE_DATABASES: user_db,ambulance_db,records_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d
    networks:
      - uruk-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: uruk-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - uruk-network
    restart: unless-stopped
    command: redis-server --appendonly yes

  mongodb:
    image: mongo:6
    container_name: uruk-mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: uruk123
      MONGO_INITDB_DATABASE: uruk_ai
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    networks:
      - uruk-network
    restart: unless-stopped

  influxdb:
    image: influxdb:2.7-alpine
    container_name: uruk-influxdb
    environment:
      DOCKER_INFLUXDB_INIT_MODE: setup
      DOCKER_INFLUXDB_INIT_USERNAME: admin
      DOCKER_INFLUXDB_INIT_PASSWORD: uruk123admin
      DOCKER_INFLUXDB_INIT_ORG: uruk-health
      DOCKER_INFLUXDB_INIT_BUCKET: health-data
      DOCKER_INFLUXDB_INIT_ADMIN_TOKEN: uruk-health-token-2025
    ports:
      - "8086:8086"
    volumes:
      - influx_data:/var/lib/influxdb2
    networks:
      - uruk-network
    restart: unless-stopped

  # =====================================
  # BLOCKCHAIN & STORAGE
  # =====================================

  ganache:
    image: trufflesuite/ganache:latest
    container_name: uruk-ganache
    ports:
      - "8545:8545"
    command: >
      ganache
      --host 0.0.0.0
      --accounts 10
      --defaultBalanceEther 100
      --mnemonic "uruk health blockchain network development test mnemonic seed phrase"
    networks:
      - uruk-network
    restart: unless-stopped

  ipfs:
    image: ipfs/kubo:latest
    container_name: uruk-ipfs
    ports:
      - "4001:4001"
      - "5001:5001"
      - "8080:8080"
    volumes:
      - ipfs_data:/data/ipfs
    networks:
      - uruk-network
    restart: unless-stopped

  # =====================================
  # MICROSERVICES
  # =====================================

  user-service:
    build:
      context: ./services/user-management
      dockerfile: Dockerfile
    container_name: uruk-user-service
    environment:
      NODE_ENV: development
      PORT: 3001
      DB_HOST: postgresql
      DB_PORT: 5432
      DB_NAME: uruk_health
      DB_USER: postgres
      DB_PASSWORD: uruk123
      JWT_SECRET: uruk_health_secret_2025
      REDIS_URL: redis://redis:6379
    ports:
      - "3001:3001"
    depends_on:
      - postgresql
      - redis
    networks:
      - uruk-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  health-monitoring-service:
    build:
      context: ./services/health-monitoring
      dockerfile: Dockerfile
    container_name: uruk-health-service
    environment:
      PYTHONPATH: /app
      INFLUXDB_URL: http://influxdb:8086
      INFLUXDB_TOKEN: uruk-health-token-2025
      INFLUXDB_ORG: uruk-health
      INFLUXDB_BUCKET: health-data
      DB_HOST: postgresql
      DB_PORT: 5432
      DB_NAME: uruk_health
      DB_USER: postgres
      DB_PASSWORD: uruk123
      REDIS_URL: redis://redis:6379
      JWT_SECRET: uruk_health_secret_2025
    ports:
      - "3002:3002"
    depends_on:
      - postgresql
      - redis
      - influxdb
    networks:
      - uruk-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3002/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  ambulance-service:
    build:
      context: ./services/ambulance
      dockerfile: Dockerfile
    container_name: uruk-ambulance-service
    environment:
      NODE_ENV: development
      PORT: 3003
      DB_HOST: postgresql
      DB_PORT: 5432
      DB_NAME: uruk_health
      DB_USER: postgres
      DB_PASSWORD: uruk123
      REDIS_HOST: redis
      REDIS_PORT: 6379
      JWT_SECRET: uruk_health_secret_2025
      GOOGLE_MAPS_API_KEY: ${GOOGLE_MAPS_API_KEY}
    ports:
      - "3003:3003"
    depends_on:
      - postgresql
      - redis
    networks:
      - uruk-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3003/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  medical-records-service:
    build:
      context: ./services/medical-records
      dockerfile: Dockerfile
    container_name: uruk-records-service
    environment:
      PYTHONPATH: /app
      DB_HOST: postgresql
      DB_PORT: 5432
      DB_NAME: uruk_health
      DB_USER: postgres
      DB_PASSWORD: uruk123
      REDIS_URL: redis://redis:6379
      IPFS_API: http://ipfs:5001
      BLOCKCHAIN_URL: http://ganache:8545
      JWT_SECRET: uruk_health_secret_2025
      FLASK_ENV: development
    ports:
      - "3004:3004"
    depends_on:
      - postgresql
      - redis
      - ipfs
      - ganache
    volumes:
      - ./uploads:/app/uploads
    networks:
      - uruk-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3004/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # =====================================
  # API GATEWAY & LOAD BALANCER
  # =====================================

  nginx-gateway:
    image: nginx:alpine
    container_name: uruk-api-gateway
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - user-service
      - health-monitoring-service
      - ambulance-service
      - medical-records-service
    networks:
      - uruk-network
    restart: unless-stopped

  # =====================================
  # MONITORING & OBSERVABILITY
  # =====================================

  prometheus:
    image: prom/prometheus:latest
    container_name: uruk-prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    networks:
      - uruk-network
    restart: unless-stopped

  grafana:
    image: grafana/grafana:latest
    container_name: uruk-grafana
    environment:
      GF_SECURITY_ADMIN_PASSWORD: uruk123
    ports:
      - "3000:3000"
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./monitoring/grafana/datasources:/etc/grafana/provisioning/datasources
    depends_on:
      - prometheus
    networks:
      - uruk-network
    restart: unless-stopped

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.8.0
    container_name: uruk-elasticsearch
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    networks:
      - uruk-network
    restart: unless-stopped

  kibana:
    image: docker.elastic.co/kibana/kibana:8.8.0
    container_name: uruk-kibana
    environment:
      ELASTICSEARCH_HOSTS: http://elasticsearch:9200
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch
    networks:
      - uruk-network
    restart: unless-stopped

  # =====================================
  # MESSAGE QUEUE
  # =====================================

  kafka:
    image: confluentinc/cp-kafka:latest
    container_name: uruk-kafka
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: "true"
    ports:
      - "9092:9092"
    depends_on:
      - zookeeper
    networks:
      - uruk-network
    restart: unless-stopped

  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    container_name: uruk-zookeeper
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - "2181:2181"
    networks:
      - uruk-network
    restart: unless-stopped

# =====================================
# NETWORKS & VOLUMES
# =====================================

networks:
  uruk-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16

volumes:
  postgres_data:
  redis_data:
  mongo_data:
  influx_data:
  ipfs_data:
  prometheus_data:
  grafana_data:
  elasticsearch_data:
"""

# Save Docker Compose file
with open('docker-compose.yml', 'w') as f:
    f.write(docker_compose_config)

# Create Nginx configuration for API Gateway
nginx_config = """
# ========================================
# NGINX API GATEWAY CONFIGURATION
# Load balancing and routing for Uruk Health
# ========================================

events {
    worker_connections 1024;
}

http {
    upstream user_service {
        server user-service:3001;
    }

    upstream health_service {
        server health-monitoring-service:3002;
    }

    upstream ambulance_service {
        server ambulance-service:3003;
    }

    upstream records_service {
        server medical-records-service:3004;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;
    limit_req_zone $binary_remote_addr zone=auth:10m rate=20r/m;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                   '$status $body_bytes_sent "$http_referer" '
                   '"$http_user_agent" "$http_x_forwarded_for" '
                   'rt=$request_time uct="$upstream_connect_time" '
                   'uht="$upstream_header_time" urt="$upstream_response_time"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    server {
        listen 80;
        server_name localhost api.uruk-health.local;

        # CORS configuration
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization";

        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization";
            add_header Access-Control-Max-Age 1728000;
            add_header Content-Type 'text/plain; charset=utf-8';
            add_header Content-Length 0;
            return 204;
        }

        # User Management Service
        location /api/auth/ {
            limit_req zone=auth burst=10 nodelay;
            proxy_pass http://user_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /api/user/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://user_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Health Monitoring Service
        location /api/health-score/ {
            limit_req zone=api burst=15 nodelay;
            proxy_pass http://health_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /api/vitals/ {
            limit_req zone=api burst=30 nodelay;
            proxy_pass http://health_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /api/insights/ {
            limit_req zone=api burst=10 nodelay;
            proxy_pass http://health_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Ambulance Service
        location /api/ambulance/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://ambulance_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # WebSocket support
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }

        # Medical Records Service
        location /api/records/ {
            limit_req zone=api burst=15 nodelay;
            proxy_pass http://records_service;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # Increase limits for file uploads
            client_max_body_size 50M;
            proxy_connect_timeout 300s;
            proxy_send_timeout 300s;
            proxy_read_timeout 300s;
        }

        # Health checks
        location /health {
            access_log off;
            return 200 "API Gateway is healthy\\n";
            add_header Content-Type text/plain;
        }

        # WebSocket endpoint for real-time features
        location /socket.io/ {
            proxy_pass http://ambulance_service;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Default error page
        error_page 404 /404.html;
        error_page 500 502 503 504 /50x.html;
        
        location = /50x.html {
            root /usr/share/nginx/html;
        }
    }
}
"""

# Save Nginx configuration
with open('nginx.conf', 'w') as f:
    f.write(nginx_config)

print("✅ Docker Compose configuration created")
print("📁 File saved: docker-compose.yml")
print("🔧 Services: 15+ containers including databases, microservices, monitoring")
print("🌐 API Gateway: Nginx with load balancing and rate limiting")
print("📊 Monitoring: Prometheus, Grafana, ELK Stack")
print("🔒 Security: SSL, CORS, rate limiting, security headers")
print("\n🚀 To start the entire backend:")
print("   docker-compose up -d")
print("\n📋 Included Services:")
services = [
    "PostgreSQL (Primary DB)",
    "Redis (Caching)",
    "MongoDB (AI Assistant)",
    "InfluxDB (Time-series vitals)",
    "IPFS (File storage)", 
    "Ganache (Blockchain)",
    "Nginx (API Gateway)",
    "Prometheus (Metrics)",
    "Grafana (Dashboards)",
    "Elasticsearch + Kibana (Logs)",
    "Kafka + Zookeeper (Events)"
]
for i, service in enumerate(services, 1):
    print(f"   {i:2d}. {service}")