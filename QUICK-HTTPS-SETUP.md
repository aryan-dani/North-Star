# Quick HTTPS Deployment Guide for north-star.ramkansal.com

## Prerequisites Checklist
- [ ] Ubuntu/Debian server with public IP
- [ ] DNS A record: `north-star.ramkansal.com` → Your server's public IP
- [ ] Ports 80, 443, and 22 open in firewall
- [ ] Domain propagated (check with `nslookup north-star.ramkansal.com`)

## Quick Setup Commands

### 1. Update DNS
Ensure your domain points to the server:
```bash
# Check DNS propagation
nslookup north-star.ramkansal.com
# Should return your server's public IP
```

### 2. Install Required Software
```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx python3-pip nodejs npm
```

### 3. Deploy Application Files
```bash
# Upload your North-Star directory to the server
# Recommended location: /var/www/north-star

# Or clone from git
cd /var/www
sudo git clone <your-repo> north-star
cd north-star
```

### 4. Set Up Python Backend
```bash
cd /var/www/north-star/backend

# Create virtual environment
python3 -m venv ../.venv
source ../.venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 5. Build Frontend
```bash
cd /var/www/north-star/frontend

# Install dependencies
npm install

# Build for production
npm run build
# This creates the 'dist' folder
```

### 6. Configure Nginx
```bash
# Copy the nginx configuration
sudo cp /var/www/north-star/nginx-config.conf /etc/nginx/sites-available/north-star

# IMPORTANT: Edit the config to set correct paths
sudo nano /etc/nginx/sites-available/north-star
# Update line: root /var/www/north-star/frontend/dist;

# Enable the site
sudo ln -s /etc/nginx/sites-available/north-star /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 7. Get SSL Certificate
```bash
# This will automatically configure HTTPS
sudo certbot --nginx -d north-star.ramkansal.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose to redirect HTTP to HTTPS: Yes (recommended)
```

### 8. Set Up Backend Service
```bash
# Copy service file
sudo cp /var/www/north-star/backend-service.conf /etc/systemd/system/north-star-backend.service

# Edit to update paths
sudo nano /etc/systemd/system/north-star-backend.service
# Update WorkingDirectory and Environment paths

# Start the service
sudo systemctl daemon-reload
sudo systemctl enable north-star-backend
sudo systemctl start north-star-backend

# Check status
sudo systemctl status north-star-backend
```

### 9. Verify Everything Works
```bash
# Test backend directly
curl http://127.0.0.1:8000/health

# Test through Nginx (HTTPS)
curl https://north-star.ramkansal.com/api/health

# Check logs
sudo journalctl -u north-star-backend -f
sudo tail -f /var/log/nginx/north-star-error.log
```

## One-Line Quick Start (Automated)
```bash
# On your server, run:
cd /var/www/north-star
chmod +x deploy-https.sh
./deploy-https.sh
```

## Important File Paths to Update

### In nginx-config.conf:
- Line ~51: `root /var/www/north-star/frontend/dist;`

### In backend-service.conf:
- Line ~13: `WorkingDirectory=/var/www/north-star/backend`
- Line ~14: `Environment="PATH=/var/www/north-star/.venv/bin"`
- Line ~17: `ExecStart=/var/www/north-star/.venv/bin/uvicorn ...`

## Testing Checklist

- [ ] DNS resolves correctly
- [ ] Nginx is running: `sudo systemctl status nginx`
- [ ] Backend is running: `sudo systemctl status north-star-backend`
- [ ] SSL certificate is valid: `sudo certbot certificates`
- [ ] HTTP redirects to HTTPS: `curl -I http://north-star.ramkansal.com`
- [ ] HTTPS works: `curl -I https://north-star.ramkansal.com`
- [ ] API endpoint works: `curl https://north-star.ramkansal.com/api/health`
- [ ] Frontend loads in browser: `https://north-star.ramkansal.com`

## Common Issues & Fixes

### Issue: 502 Bad Gateway
```bash
# Check if backend is running
sudo systemctl status north-star-backend
curl http://127.0.0.1:8000/health

# Check logs
sudo journalctl -u north-star-backend -n 50
```

### Issue: SSL Certificate Not Working
```bash
# Check certificate
sudo certbot certificates

# Try obtaining again
sudo certbot --nginx -d north-star.ramkansal.com --force-renewal
```

### Issue: Frontend Not Loading
```bash
# Check if dist folder exists
ls -la /var/www/north-star/frontend/dist/

# Rebuild frontend
cd /var/www/north-star/frontend
npm run build

# Check permissions
sudo chown -R www-data:www-data /var/www/north-star/frontend/dist
```

### Issue: API Calls Failing
```bash
# Check Nginx proxy configuration
sudo nginx -t

# Test backend directly
curl http://127.0.0.1:8000/models/available

# Check browser console for CORS errors
# Check nginx error log
sudo tail -f /var/log/nginx/north-star-error.log
```

## Maintenance Commands

```bash
# Restart everything
sudo systemctl restart north-star-backend
sudo systemctl restart nginx

# View logs
sudo journalctl -u north-star-backend -f  # Backend logs
sudo tail -f /var/log/nginx/north-star-access.log  # Nginx access
sudo tail -f /var/log/nginx/north-star-error.log   # Nginx errors

# Renew SSL (auto-renews, but manual command)
sudo certbot renew
sudo systemctl reload nginx

# Update backend code
cd /var/www/north-star/backend
git pull
sudo systemctl restart north-star-backend

# Update frontend
cd /var/www/north-star/frontend
git pull
npm install
npm run build
sudo systemctl reload nginx
```

## Security Hardening (Optional but Recommended)

```bash
# Enable automatic security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# Set up fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban

# Configure SSH to use key-only authentication
# Edit /etc/ssh/sshd_config:
# PasswordAuthentication no
```

## Performance Optimization

```bash
# Add to nginx config for better caching
# Already included in nginx-config.conf

# Monitor resources
htop
df -h
free -h

# Check what's using ports
sudo netstat -tlnp
```

## Support

If you encounter issues:
1. Check the logs (see commands above)
2. Verify all paths in config files are correct
3. Ensure DNS is properly configured
4. Check firewall rules
5. Test backend independently from Nginx

For more details, see: DEPLOYMENT-HTTPS.md
