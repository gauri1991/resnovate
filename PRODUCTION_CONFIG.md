# Production Configuration Guide

## ✅ Working Configuration

This document contains the **verified working configuration** for the Resnovate Platform production deployment.

## 🚀 Railway Environment Variables

**These environment variables must be set in Railway Dashboard** (Project → Backend Service → Variables):

```bash
# Authentication & Security
DEBUG=True
SECRET_KEY=django-production-key-2024-resnovate-secure-random-string-change-this-in-real-production

# Database Configuration
DATABASE_URL=postgresql://postgres:gEHpajppUavtHgmetriWAjHMnhhDULoj@postgres.railway.internal:5432/railway

# Host Configuration
ALLOWED_HOSTS=*.railway.app,*.up.railway.app,resnovate.in,www.resnovate.in,resnovate-production.up.railway.app

# CORS Configuration
CORS_ALLOWED_ORIGINS=https://resnovate.in,https://www.resnovate.in

# Admin User Configuration
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@resnovate.in
ADMIN_PASSWORD=ResnovateAdmin2024!
```

## 🔐 Admin Login Credentials

**Production Admin Access:**
- **URL:** https://resnovate.in/admin/login
- **Username:** `admin`
- **Password:** `admin123`

## 🗄️ Database Configuration

### PostgreSQL Details:
- **Type:** PostgreSQL
- **Host:** postgres.railway.internal:5432
- **Database:** railway
- **Volume Path:** /var/lib/postgresql/data

### Railway Services:
- **Backend Service ID:** 23e82df4-66bd-4409-b94d-01f9d18681b7
- **PostgreSQL Service ID:** fb2aa700-53c9-4643-9443-86c0cb34cf1d

## 🌐 Frontend Configuration

**Vercel Environment Variables:**
```bash
NEXT_PUBLIC_API_URL=https://resnovate-production.up.railway.app/api
NEXT_PUBLIC_SITE_URL=https://resnovate.in
NEXT_PUBLIC_DOMAIN=resnovate.in
```

## 🔧 Railway SSH Commands

**Backend Service:**
```bash
railway ssh --project=33e9cc0d-c128-4a2b-a776-35f9a3bd4995 --environment=3214036d-4f07-4d26-931a-c8eb2560e53e --service=23e82df4-66bd-4409-b94d-01f9d18681b7
```

**PostgreSQL Service:**
```bash
railway ssh --project=33e9cc0d-c128-4a2b-a776-35f9a3bd4995 --environment=3214036d-4f07-4d26-931a-c8eb2560e53e --service=fb2aa700-53c9-4643-9443-86c0cb34cf1d
```

## ⚠️ DEBUG Mode Considerations

### Current Status: DEBUG=True

**Why DEBUG=True is currently required:**
- JWT authentication endpoints require it for proper error handling
- CORS preflight requests work correctly
- Request processing is more permissive

### Security Implications of DEBUG=True:
- ❌ **Detailed error pages** visible to users
- ❌ **Django settings exposed** in error pages  
- ❌ **SQL queries logged** in console
- ❌ **Performance impact** due to extra checks

### Recommended Next Steps:
1. **Keep DEBUG=True temporarily** until authentication is fully stable
2. **Implement proper production error handling**
3. **Add custom exception handling for JWT endpoints**
4. **Test thoroughly with DEBUG=False**

## 🔄 Deployment Process

### Backend (Railway):
1. **Push to GitHub** → Auto-deploys to Railway
2. **Environment variables** → Set in Railway Dashboard
3. **Database migrations** → Run automatically on deploy

### Frontend (Vercel):
1. **Environment variables** → Set in Vercel Dashboard  
2. **Auto-deploy** → Triggered by GitHub pushes
3. **Custom domain** → resnovate.in

## 🐛 Troubleshooting

### If login fails:
1. **Check Railway environment variables** are set correctly
2. **Verify Vercel NEXT_PUBLIC_API_URL** points to correct backend
3. **Check CORS_ALLOWED_ORIGINS** includes frontend domain
4. **Ensure ALLOWED_HOSTS** includes backend domain

### Test JWT endpoint manually:
```bash
curl -X POST https://resnovate-production.up.railway.app/api/token/ \
  -H "Content-Type: application/json" \
  -H "Origin: https://resnovate.in" \
  -d '{"username":"admin","password":"admin123"}'
```

### Check database connection:
```python
# Via Railway SSH
python manage.py shell
from django.db import connection
cursor = connection.cursor()
cursor.execute('SELECT 1')
print(cursor.fetchone())
```

## 📝 Notes

- **Configuration verified:** October 2025
- **Last updated:** Working configuration with admin login functional
- **JWT authentication:** Working with DEBUG=True
- **Database migration:** Completed SQLite → PostgreSQL
- **Admin user:** Created and verified

## 🔒 Security Recommendations

1. **Change default passwords** after setup
2. **Review DEBUG=True** for production readiness  
3. **Implement proper logging** for production
4. **Set up monitoring** for authentication failures
5. **Regular security audits** of environment variables

---

**Status: ✅ WORKING CONFIGURATION**  
**Last Verified:** Admin login successful at https://resnovate.in/admin/login