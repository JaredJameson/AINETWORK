# VPS Setup (Hostinger)

## Prerequisites
- Ubuntu 22.04+ VPS
- Minimum 2GB RAM, 20GB disk

## 1. Install Docker
```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
```

## 2. Clone repo
```bash
git clone https://github.com/YOUR_ORG/ainetwork-web.git
cd ainetwork-web
```

## 3. Configure environment
```bash
cp .env.example .env
nano .env
```

Fill in these values:
- `DB_PASSWORD` — strong random password for PostgreSQL
- `ADMIN_EMAIL` — your admin login email
- `ADMIN_PASSWORD_HASH` — bcrypt hash of your password (see below)
- `JWT_SECRET` — minimum 32 random characters
- `ANTHROPIC_API_KEY` — from console.anthropic.com
- `GEMINI_API_KEY` — from aistudio.google.com
- `DATABASE_URL` — leave as: `postgresql://ainetwork:${DB_PASSWORD}@db:5432/ainetwork`

## 4. Generate password hash
```bash
node -e "const b=require('bcryptjs');b.hash('YOUR_ACTUAL_PASSWORD',10).then(h=>console.log(h))"
```
Paste the output as `ADMIN_PASSWORD_HASH` in `.env`.

## 5. First deploy
```bash
# Start database first
docker compose up -d db
sleep 10

# Run migrations and seed
docker compose run --rm app npx prisma migrate deploy
docker compose run --rm app node prisma/seed.js

# Start app
docker compose up -d app
```

## 6. Subsequent deploys
```bash
./scripts/deploy.sh
```

## 7. Nginx reverse proxy (optional)
```nginx
server {
    server_name ainetwork.pl www.ainetwork.pl;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 8. SSL with Certbot
```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d ainetwork.pl -d www.ainetwork.pl
```

## Monitoring
```bash
# View logs
docker compose logs -f app

# Check status
docker compose ps

# Restart app
docker compose restart app
```
