# Deployment Guide

Complete guide for deploying the North Star Exoplanet Classification System.

## 📋 Table of Contents

- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Environment Variables](#environment-variables)
- [Monitoring & Maintenance](#monitoring--maintenance)

---

## 🔧 Local Development

### Backend Setup

1. **Install Python dependencies:**

```powershell
pip install -r requirements.txt
```

2. **Start the backend server:**

```powershell
cd backend
python main.py
```

Backend will be available at: **http://localhost:8000**

### Frontend Setup

1. **Install Node.js dependencies:**

```powershell
cd frontend
npm install
```

2. **Start the development server:**

```powershell
npm run dev
```

Frontend will be available at: **http://localhost:5174**

### Verify Setup

1. Backend health check: http://localhost:8000/health
2. Backend API docs: http://localhost:8000/docs
3. Frontend app: http://localhost:5174

---

## 🚀 Production Deployment

### Backend Production Build

#### Using Gunicorn (Recommended)

1. **Install Gunicorn:**

```bash
pip install gunicorn
```

2. **Run with multiple workers:**

```bash
cd backend
gunicorn app.main:app \
  -w 4 \
  -k uvicorn.workers.UvicornWorker \
  -b 0.0.0.0:8000 \
  --access-logfile - \
  --error-logfile - \
  --log-level info
```

#### Configuration Options:

- `-w 4`: 4 worker processes (adjust based on CPU cores: 2-4 × num_cores)
- `-k uvicorn.workers.UvicornWorker`: Use Uvicorn worker class
- `-b 0.0.0.0:8000`: Bind to all interfaces on port 8000
- `--timeout 120`: Request timeout in seconds

### Frontend Production Build

1. **Build the frontend:**

```powershell
cd frontend
npm run build
```

This creates optimized files in `frontend/dist/`

2. **Preview the production build:**

```powershell
npm run preview
```

3. **Serve with a static file server:**

```bash
# Using Python
cd dist
python -m http.server 5173

# Using Node.js serve
npx serve -s dist -l 5173

# Using Nginx (see Nginx config below)
```

---

## 🐳 Docker Deployment

### Backend Dockerfile

Create `Dockerfile` in the project root:

```dockerfile
# Backend Dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY backend/ ./backend/
COPY models/ ./models/

# Expose port
EXPOSE 8000

# Run with Gunicorn
CMD ["gunicorn", "backend.app.main:app", \
     "-w", "4", \
     "-k", "uvicorn.workers.UvicornWorker", \
     "-b", "0.0.0.0:8000"]
```

### Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

Create `docker-compose.yml` in project root:

```yaml
version: "3.8"

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - ./models:/app/models:ro
    environment:
      - PYTHONUNBUFFERED=1
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://backend:8000
    restart: unless-stopped
```

### Deploy with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

---

## ☁️ Cloud Deployment

### Heroku Deployment

#### Backend (Heroku)

1. **Create `Procfile` in project root:**

```
web: gunicorn backend.app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:$PORT
```

2. **Create `runtime.txt`:**

```
python-3.10.12
```

3. **Deploy:**

```bash
# Login to Heroku
heroku login

# Create app
heroku create north-star-api

# Push code
git push heroku main

# Scale dynos
heroku ps:scale web=1

# View logs
heroku logs --tail
```

#### Frontend (Netlify)

1. **Create `netlify.toml` in frontend directory:**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  VITE_API_URL = "https://your-backend-url.herokuapp.com"
```

2. **Deploy:**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd frontend
netlify deploy --prod
```

### AWS Deployment

#### Backend (AWS Elastic Beanstalk)

1. **Install EB CLI:**

```bash
pip install awsebcli
```

2. **Initialize EB:**

```bash
eb init -p python-3.10 north-star-api
```

3. **Create environment:**

```bash
eb create north-star-production
```

4. **Deploy:**

```bash
eb deploy
```

#### Frontend (AWS S3 + CloudFront)

1. **Build frontend:**

```bash
cd frontend
npm run build
```

2. **Upload to S3:**

```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

3. **Configure CloudFront** for CDN distribution

### Google Cloud Platform

#### Backend (Cloud Run)

1. **Create `Dockerfile` (see Docker section above)**

2. **Build and deploy:**

```bash
# Build container
gcloud builds submit --tag gcr.io/PROJECT_ID/north-star-api

# Deploy to Cloud Run
gcloud run deploy north-star-api \
  --image gcr.io/PROJECT_ID/north-star-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Frontend (Firebase Hosting)

1. **Install Firebase CLI:**

```bash
npm install -g firebase-tools
```

2. **Initialize Firebase:**

```bash
cd frontend
firebase init hosting
```

3. **Deploy:**

```bash
npm run build
firebase deploy --only hosting
```

---

## 🔐 Environment Variables

### Backend Environment Variables

Create `.env` file in backend directory:

```bash
# Application
ENVIRONMENT=production
DEBUG=False
LOG_LEVEL=info

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
WORKERS=4

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Model Configuration
MODEL_PATH=../models/RandomForest_classification_20251005_162644.joblib
MODEL_TYPE=classification

# Rate Limiting
RATE_LIMIT_PER_MINUTE=100

# Security
SECRET_KEY=your-secret-key-here
```

### Frontend Environment Variables

Create `.env.production` in frontend directory:

```bash
# API Configuration
VITE_API_URL=https://api.yourdomain.com
VITE_API_TIMEOUT=30000

# Application
VITE_APP_NAME=North Star
VITE_APP_VERSION=1.0.0
```

---

## 🔧 Nginx Configuration

Create `nginx.conf` for frontend:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (if backend on same server)
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

For HTTPS, use Let's Encrypt:

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (already configured by certbot)
sudo certbot renew --dry-run
```

---

## 🔒 Security Checklist

### Backend Security

- [ ] Set `DEBUG=False` in production
- [ ] Configure specific CORS origins (not `*`)
- [ ] Use HTTPS for all communications
- [ ] Implement rate limiting
- [ ] Add authentication if needed (API keys, OAuth)
- [ ] Sanitize file uploads
- [ ] Set appropriate timeouts
- [ ] Use environment variables for secrets
- [ ] Enable logging and monitoring
- [ ] Keep dependencies updated

### Frontend Security

- [ ] Build with production mode (`npm run build`)
- [ ] Use HTTPS
- [ ] Set Content Security Policy headers
- [ ] Sanitize user inputs
- [ ] Implement CSRF protection if needed
- [ ] Keep dependencies updated
- [ ] Minify and obfuscate code

---

## 📊 Monitoring & Maintenance

### Backend Monitoring

1. **Health checks:**

```bash
curl https://api.yourdomain.com/health
```

2. **Logging:**

```python
# Add to backend/app/main.py
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
```

3. **Monitoring services:**
   - Sentry for error tracking
   - Datadog for metrics
   - New Relic for APM

### Frontend Monitoring

1. **Analytics:**

```typescript
// Add Google Analytics or similar
```

2. **Error tracking:**

```typescript
// Add Sentry or similar error boundary
```

### Maintenance Tasks

1. **Regular updates:**

```bash
# Backend
pip list --outdated
pip install -U package-name

# Frontend
npm outdated
npm update
```

2. **Database backups** (if applicable)

3. **Model retraining** schedule

4. **Log rotation**

5. **Security patches**

---

## 🆘 Troubleshooting

### Common Issues

1. **Port already in use:**

```bash
# Find process
netstat -ano | findstr :8000
# Kill process
taskkill /PID <PID> /F
```

2. **CORS errors:**

   - Check `allow_origins` in backend CORS middleware
   - Ensure frontend URL is whitelisted

3. **Module not found:**

```bash
pip install -r requirements.txt
npm install
```

4. **Model file not found:**

   - Verify model path in backend
   - Train model if missing: `python src/training_v3.py`

5. **Build failures:**

```bash
# Clear caches
rm -rf node_modules package-lock.json
npm install

rm -rf __pycache__ *.pyc
```

---

## 📞 Support

For deployment issues:

1. Check application logs
2. Verify environment variables
3. Test health endpoints
4. Review CORS configuration
5. Check firewall rules

---

**Last Updated**: October 5, 2025  
**Version**: 1.0.0
