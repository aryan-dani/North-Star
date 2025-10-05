#!/bin/bash

# North Star Deployment Script
# Run this script on your Ubuntu/Debian server to set up HTTPS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="north-star.ramkansal.com"
APP_DIR="/var/www/north-star"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  North Star HTTPS Deployment Script${NC}"
echo -e "${BLUE}======================================${NC}\n"

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}This script should not be run as root${NC}"
   echo -e "Run it with sudo privileges instead"
   exit 1
fi

# Function to print step
print_step() {
    echo -e "\n${GREEN}[STEP]${NC} $1\n"
}

# Function to print info
print_info() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

# Function to print success
print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Function to print error
print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Install dependencies
print_step "Installing Nginx and Certbot"
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

print_success "Nginx and Certbot installed"

# Step 2: Configure firewall
print_step "Configuring firewall"
if command -v ufw &> /dev/null; then
    sudo ufw allow 'Nginx Full'
    sudo ufw allow 'OpenSSH'
    print_success "Firewall configured"
else
    print_info "UFW not found, skipping firewall configuration"
fi

# Step 3: Copy Nginx configuration
print_step "Setting up Nginx configuration"
sudo cp nginx-config.conf /etc/nginx/sites-available/north-star

# Update paths in nginx config
print_info "Update the paths in /etc/nginx/sites-available/north-star to match your setup"
print_info "Frontend root should be: $FRONTEND_DIR/dist"
read -p "Press enter to edit the config file..." dummy
sudo nano /etc/nginx/sites-available/north-star

# Enable site
sudo ln -sf /etc/nginx/sites-available/north-star /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test configuration
print_info "Testing Nginx configuration..."
if sudo nginx -t; then
    print_success "Nginx configuration is valid"
    sudo systemctl reload nginx
else
    print_error "Nginx configuration has errors. Please fix them."
    exit 1
fi

# Step 4: Obtain SSL certificate
print_step "Obtaining SSL certificate with Certbot"
echo -e "${YELLOW}You will be prompted to enter your email and agree to terms${NC}"
sudo certbot --nginx -d $DOMAIN

print_success "SSL certificate obtained"

# Step 5: Set up backend service
print_step "Setting up backend systemd service"
print_info "Update paths in backend-service.conf before continuing"
read -p "Press enter to edit the service file..." dummy
nano backend-service.conf

sudo cp backend-service.conf /etc/systemd/system/north-star-backend.service
sudo systemctl daemon-reload
sudo systemctl enable north-star-backend
sudo systemctl start north-star-backend

print_info "Checking backend service status..."
sudo systemctl status north-star-backend --no-pager

# Step 6: Build frontend
print_step "Building frontend"
if [ -d "$FRONTEND_DIR" ]; then
    cd $FRONTEND_DIR
    print_info "Installing frontend dependencies..."
    npm install
    print_info "Building frontend..."
    npm run build
    print_success "Frontend built successfully"
else
    print_error "Frontend directory not found at $FRONTEND_DIR"
    print_info "Please build the frontend manually"
fi

# Step 7: Set permissions
print_step "Setting permissions"
if [ -d "$APP_DIR" ]; then
    sudo chown -R www-data:www-data $APP_DIR
    sudo chmod -R 755 $APP_DIR
    print_success "Permissions set"
fi

# Step 8: Final checks
print_step "Running final checks"

echo -e "\n${BLUE}Checking services:${NC}"
echo -e "Nginx: $(systemctl is-active nginx)"
echo -e "Backend: $(systemctl is-active north-star-backend)"

echo -e "\n${BLUE}Testing endpoints:${NC}"
curl -I https://$DOMAIN 2>/dev/null | head -n 1

print_success "Deployment complete!"

echo -e "\n${GREEN}======================================${NC}"
echo -e "${GREEN}  Deployment Summary${NC}"
echo -e "${GREEN}======================================${NC}"
echo -e "Domain: https://$DOMAIN"
echo -e "Frontend: $FRONTEND_DIR/dist"
echo -e "Backend: http://127.0.0.1:8000"
echo -e "\nUseful commands:"
echo -e "  View backend logs: ${YELLOW}sudo journalctl -u north-star-backend -f${NC}"
echo -e "  View Nginx logs: ${YELLOW}sudo tail -f /var/log/nginx/north-star-error.log${NC}"
echo -e "  Restart backend: ${YELLOW}sudo systemctl restart north-star-backend${NC}"
echo -e "  Restart Nginx: ${YELLOW}sudo systemctl restart nginx${NC}"
echo -e "  Renew SSL: ${YELLOW}sudo certbot renew${NC}"
echo -e "${GREEN}======================================${NC}\n"
