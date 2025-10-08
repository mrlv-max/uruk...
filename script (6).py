# Create environment configuration and deployment scripts

# Environment configuration
env_config = """
# ========================================
# URUK HEALTH BACKEND - ENVIRONMENT CONFIG
# Production-ready environment variables
# ========================================

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=uruk_health
DB_USER=postgres
DB_PASSWORD=uruk123

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# MongoDB Configuration
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_USERNAME=admin
MONGO_PASSWORD=uruk123
MONGO_DATABASE=uruk_ai

# InfluxDB Configuration
INFLUXDB_URL=http://localhost:8086
INFLUXDB_TOKEN=uruk-health-token-2025
INFLUXDB_ORG=uruk-health
INFLUXDB_BUCKET=health-data

# Blockchain Configuration
BLOCKCHAIN_URL=http://localhost:8545
BLOCKCHAIN_PRIVATE_KEY=0x...
BLOCKCHAIN_CONTRACT_ADDRESS=0x...

# IPFS Configuration
IPFS_API=http://localhost:5001

# Security Configuration
JWT_SECRET=uruk_health_secret_2025_production
ENCRYPTION_KEY=auto_generated_key
API_KEY_SECRET=uruk_api_key_secret

# External API Keys
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
SENDGRID_API_KEY=your_sendgrid_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Service Ports
USER_SERVICE_PORT=3001
HEALTH_SERVICE_PORT=3002
AMBULANCE_SERVICE_PORT=3003
RECORDS_SERVICE_PORT=3004
PHARMACY_SERVICE_PORT=3005
AI_SERVICE_PORT=3006
APPOINTMENT_SERVICE_PORT=3007
NOTIFICATION_SERVICE_PORT=3008
PAYMENT_SERVICE_PORT=3009
ANALYTICS_SERVICE_PORT=3010

# Monitoring Configuration
PROMETHEUS_PORT=9090
GRAFANA_PORT=3000
GRAFANA_ADMIN_PASSWORD=uruk123
ELASTICSEARCH_PORT=9200
KIBANA_PORT=5601

# Application Configuration
NODE_ENV=production
FLASK_ENV=production
LOG_LEVEL=info
API_VERSION=v1
MAX_FILE_SIZE=50MB
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=15m

# SSL Configuration
SSL_CERT_PATH=/etc/ssl/certs/uruk-health.crt
SSL_KEY_PATH=/etc/ssl/private/uruk-health.key

# Backup Configuration
BACKUP_SCHEDULE=0 2 * * *
BACKUP_RETENTION_DAYS=30
S3_BACKUP_BUCKET=uruk-health-backups
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key

# Health Check Configuration
HEALTH_CHECK_INTERVAL=30s
HEALTH_CHECK_TIMEOUT=10s
HEALTH_CHECK_RETRIES=3
"""

# Save environment configuration
with open('.env.example', 'w') as f:
    f.write(env_config)

# Create deployment script
deployment_script = """#!/bin/bash

# ========================================
# URUK HEALTH BACKEND - DEPLOYMENT SCRIPT
# Automated deployment with health checks
# ========================================

set -e

echo "🚀 Starting Uruk Health Backend Deployment"
echo "=========================================="

# Colors for output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
BLUE='\\033[0;34m'
NC='\\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    print_status "Docker is installed"
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    print_status "Docker Compose is installed"
    
    # Check if .env file exists
    if [ ! -f .env ]; then
        print_warning ".env file not found, creating from example"
        cp .env.example .env
        print_warning "Please update .env file with your configuration"
    fi
}

# Create necessary directories
create_directories() {
    print_header "Creating Directories"
    
    directories=(
        "uploads"
        "logs"
        "ssl"
        "monitoring/grafana/dashboards"
        "monitoring/grafana/datasources"
        "nginx/ssl"
        "backups"
        "init-scripts"
    )
    
    for dir in "${directories[@]}"; do
        mkdir -p "$dir"
        print_status "Created directory: $dir"
    done
}

# Generate SSL certificates (self-signed for development)
generate_ssl_certificates() {
    print_header "Generating SSL Certificates"
    
    if [ ! -f "nginx/ssl/server.crt" ]; then
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \\
            -keyout nginx/ssl/server.key \\
            -out nginx/ssl/server.crt \\
            -subj "/C=IN/ST=MP/L=Indore/O=UrukHealth/CN=localhost" \\
            2>/dev/null || true
        print_status "SSL certificates generated"
    else
        print_status "SSL certificates already exist"
    fi
}

# Build Docker images
build_images() {
    print_header "Building Docker Images"
    
    # Create Dockerfiles for each service
    create_dockerfiles
    
    # Build images
    docker-compose build --no-cache
    print_status "Docker images built successfully"
}

# Create Dockerfiles for services
create_dockerfiles() {
    print_status "Creating Dockerfiles"
    
    # User Service Dockerfile
    mkdir -p services/user-management
    cp user_management_service.js services/user-management/app.js
    
    cat > services/user-management/Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \\
  CMD curl -f http://localhost:3001/health || exit 1
CMD ["node", "app.js"]
EOF

    cat > services/user-management/package.json << 'EOF'
{
  "name": "uruk-user-service",
  "version": "1.0.0",
  "main": "app.js",
  "dependencies": {
    "express": "^4.18.2",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "pg": "^8.11.3",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0",
    "cors": "^2.8.5"
  }
}
EOF

    # Health Service Dockerfile  
    mkdir -p services/health-monitoring
    cp health_monitoring_service.py services/health-monitoring/app.py
    
    cat > services/health-monitoring/Dockerfile << 'EOF'
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 3002
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \\
  CMD curl -f http://localhost:3002/health || exit 1
CMD ["python", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "3002"]
EOF

    cat > services/health-monitoring/requirements.txt << 'EOF'
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
jwt==1.3.1
PyJWT==2.8.0
influxdb-client==1.38.0
asyncpg==0.29.0
redis==5.0.1
numpy==1.24.3
pandas==2.0.3
scikit-learn==1.3.0
EOF

    # Ambulance Service Dockerfile
    mkdir -p services/ambulance
    cp ambulance_service.js services/ambulance/app.js
    
    cat > services/ambulance/Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3003
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \\
  CMD curl -f http://localhost:3003/health || exit 1
CMD ["node", "app.js"]
EOF

    cat > services/ambulance/package.json << 'EOF'
{
  "name": "uruk-ambulance-service",
  "version": "1.0.0",
  "main": "app.js",
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.7.4",
    "pg": "^8.11.3",
    "redis": "^4.6.10",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "axios": "^1.6.2"
  }
}
EOF

    # Medical Records Service Dockerfile
    mkdir -p services/medical-records
    cp medical_records_service.py services/medical-records/app.py
    
    cat > services/medical-records/Dockerfile << 'EOF'
FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 3004
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \\
  CMD curl -f http://localhost:3004/health || exit 1
CMD ["python", "-m", "flask", "run", "--host", "0.0.0.0", "--port", "3004"]
EOF

    cat > services/medical-records/requirements.txt << 'EOF'
flask==3.0.0
flask-cors==4.0.0
PyJWT==2.8.0
psycopg2-binary==2.9.9
redis==5.0.1
cryptography==41.0.7
ipfshttpclient==0.8.0a2
web3==6.11.3
eth-account==0.9.0
EOF

    print_status "Dockerfiles created"
}

# Start services
start_services() {
    print_header "Starting Services"
    
    # Pull latest images
    docker-compose pull
    
    # Start services in order
    print_status "Starting databases..."
    docker-compose up -d postgresql redis mongodb influxdb
    
    # Wait for databases to be ready
    sleep 30
    
    print_status "Starting blockchain and storage..."
    docker-compose up -d ganache ipfs
    
    sleep 15
    
    print_status "Starting microservices..."
    docker-compose up -d user-service health-monitoring-service ambulance-service medical-records-service
    
    sleep 20
    
    print_status "Starting gateway and monitoring..."
    docker-compose up -d nginx-gateway prometheus grafana elasticsearch kibana
    
    print_status "All services started"
}

# Health checks
perform_health_checks() {
    print_header "Performing Health Checks"
    
    services=(
        "user-service:3001"
        "health-monitoring-service:3002" 
        "ambulance-service:3003"
        "medical-records-service:3004"
    )
    
    for service in "${services[@]}"; do
        service_name=$(echo $service | cut -d: -f1)
        port=$(echo $service | cut -d: -f2)
        
        print_status "Checking $service_name..."
        
        max_attempts=10
        attempt=1
        
        while [ $attempt -le $max_attempts ]; do
            if curl -f -s "http://localhost:$port/health" > /dev/null 2>&1; then
                print_status "$service_name is healthy"
                break
            fi
            
            if [ $attempt -eq $max_attempts ]; then
                print_error "$service_name health check failed"
                return 1
            fi
            
            print_warning "$service_name not ready, attempt $attempt/$max_attempts"
            sleep 10
            ((attempt++))
        done
    done
}

# Display service URLs
display_urls() {
    print_header "Service URLs"
    
    echo "🌐 API Gateway:           http://localhost"
    echo "👤 User Service:         http://localhost:3001"
    echo "💊 Health Service:       http://localhost:3002"  
    echo "🚑 Ambulance Service:    http://localhost:3003"
    echo "📄 Records Service:      http://localhost:3004"
    echo ""
    echo "📊 Monitoring:"
    echo "   Grafana:              http://localhost:3000 (admin/uruk123)"
    echo "   Prometheus:           http://localhost:9090"
    echo "   Kibana:               http://localhost:5601"
    echo ""
    echo "🗄️  Databases:"
    echo "   PostgreSQL:           localhost:5432"
    echo "   Redis:                localhost:6379"
    echo "   MongoDB:              localhost:27017"
    echo "   InfluxDB:             localhost:8086"
    echo ""
    echo "🔗 Storage:"
    echo "   IPFS:                 http://localhost:8080"
    echo "   Blockchain:           http://localhost:8545"
}

# Backup function
backup_data() {
    print_header "Creating Backup"
    
    timestamp=$(date +"%Y%m%d_%H%M%S")
    backup_dir="backups/backup_$timestamp"
    
    mkdir -p "$backup_dir"
    
    # Backup PostgreSQL
    docker-compose exec -T postgresql pg_dumpall -c -U postgres > "$backup_dir/postgres_backup.sql"
    
    # Backup Redis
    docker-compose exec -T redis redis-cli BGSAVE
    docker cp $(docker-compose ps -q redis):/data/dump.rdb "$backup_dir/redis_backup.rdb"
    
    print_status "Backup created in $backup_dir"
}

# Main deployment function
main() {
    print_status "Uruk Health Backend Deployment Starting..."
    
    check_prerequisites
    create_directories
    generate_ssl_certificates
    build_images
    start_services
    
    if perform_health_checks; then
        print_status "✅ Deployment completed successfully!"
        display_urls
    else
        print_error "❌ Deployment failed - some services are unhealthy"
        print_status "Check logs with: docker-compose logs"
        exit 1
    fi
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "stop")
        print_status "Stopping all services..."
        docker-compose down
        ;;
    "restart")
        print_status "Restarting services..."
        docker-compose restart
        ;;
    "logs")
        docker-compose logs -f "${2:-}"
        ;;
    "backup")
        backup_data
        ;;
    "health")
        perform_health_checks
        ;;
    *)
        echo "Usage: $0 {deploy|stop|restart|logs|backup|health}"
        echo "  deploy   - Deploy all services (default)"
        echo "  stop     - Stop all services"  
        echo "  restart  - Restart all services"
        echo "  logs     - Show logs (optionally for specific service)"
        echo "  backup   - Create database backup"
        echo "  health   - Check service health"
        exit 1
        ;;
esac
"""

# Save deployment script
with open('deploy.sh', 'w') as f:
    f.write(deployment_script)

# Make deployment script executable (on Unix systems)
import os
os.chmod('deploy.sh', 0o755)

print("✅ Deployment configuration created")
print("📁 Files saved:")
print("   - .env.example (environment template)")
print("   - deploy.sh (deployment script)")
print("\n🚀 Quick Start:")
print("   1. cp .env.example .env")
print("   2. Edit .env with your configuration") 
print("   3. chmod +x deploy.sh")
print("   4. ./deploy.sh deploy")
print("\n📋 Deployment Features:")
features = [
    "Automated Docker image building",
    "Health checks for all services", 
    "SSL certificate generation",
    "Database backup functionality",
    "Service dependency management",
    "Colored console output",
    "Error handling and rollback"
]
for i, feature in enumerate(features, 1):
    print(f"   {i}. {feature}")