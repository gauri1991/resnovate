# Environment Variables Reference

## 🚀 Railway Backend Environment Variables

**Set these in Railway Dashboard → Project → Backend Service → Variables:**

### 🔒 **SECURE PRODUCTION CONFIGURATION** (Recommended)

```bash
# Security & Debug
DEBUG=False
SECRET_KEY=GENERATE-NEW-STRONG-SECRET-KEY-HERE

# Database
DATABASE_URL=postgresql://postgres:gEHpajppUavtHgmetriWAjHMnhhDULoj@postgres.railway.internal:5432/railway

# Host Configuration
ALLOWED_HOSTS=resnovate.in,www.resnovate.in,resnovate-production.up.railway.app

# CORS Configuration
CORS_ALLOWED_ORIGINS=https://resnovate.in,https://www.resnovate.in

# HTTPS Security
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True

# Admin Configuration
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@resnovate.in  
ADMIN_PASSWORD=admin123
```

### ⚠️ **CURRENT WORKING CONFIGURATION** (Less Secure)

```bash
# Currently working but less secure
DEBUG=True
SECRET_KEY=django-production-key-2024-resnovate-secure-random-string-change-this-in-real-production
DATABASE_URL=postgresql://postgres:gEHpajppUavtHgmetriWAjHMnhhDULoj@postgres.railway.internal:5432/railway
ALLOWED_HOSTS=*.railway.app,*.up.railway.app,resnovate.in,www.resnovate.in,resnovate-production.up.railway.app
CORS_ALLOWED_ORIGINS=https://resnovate.in,https://www.resnovate.in
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@resnovate.in
ADMIN_PASSWORD=ResnovateAdmin2024!
```

## 🌐 Vercel Frontend Environment Variables

**Set these in Vercel Dashboard → Project → Settings → Environment Variables:**

```bash
NEXT_PUBLIC_API_URL=https://resnovate-production.up.railway.app/api
NEXT_PUBLIC_SITE_URL=https://resnovate.in
NEXT_PUBLIC_DOMAIN=resnovate.in
```

## 📋 Variable Descriptions

### Backend Variables

| Variable | Purpose | Current Value | Secure Value |
|----------|---------|---------------|--------------|
| `DEBUG` | Django debug mode | `True` | `False` |
| `SECRET_KEY` | Django cryptographic key | Temporary key | Generate new |
| `DATABASE_URL` | PostgreSQL connection | ✅ Correct | ✅ Correct |
| `ALLOWED_HOSTS` | Valid request hosts | Wildcards | Specific domains |
| `CORS_ALLOWED_ORIGINS` | Frontend domains | ✅ Correct | ✅ Correct |
| `ADMIN_USERNAME` | Admin login | `admin` | `admin` |
| `ADMIN_PASSWORD` | Admin password | `admin123` | Change recommended |

### Frontend Variables

| Variable | Purpose | Value |
|----------|---------|-------|
| `NEXT_PUBLIC_API_URL` | Backend API endpoint | `https://resnovate-production.up.railway.app/api` |
| `NEXT_PUBLIC_SITE_URL` | Frontend URL | `https://resnovate.in` |
| `NEXT_PUBLIC_DOMAIN` | Domain name | `resnovate.in` |

## 🔄 Migration Steps

### 1. **Current → Secure (Recommended)**

**Step 1:** Test with DEBUG=False
```bash
DEBUG=False
```

**Step 2:** Add security headers
```bash
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

**Step 3:** Restrict hosts
```bash
ALLOWED_HOSTS=resnovate.in,www.resnovate.in,resnovate-production.up.railway.app
```

**Step 4:** Generate new secret key
```bash
SECRET_KEY=your-new-32-character-secret-key-here
```

### 2. **Testing Commands**

Test after each change:
```bash
# Test admin login
curl -X POST https://resnovate-production.up.railway.app/api/token/ \
  -H "Content-Type: application/json" \
  -H "Origin: https://resnovate.in" \
  -d '{"username":"admin","password":"admin123"}'

# Should return 200 with access/refresh tokens
```

## 🛠️ Development vs Production

### Development (.env.local)
```bash
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOW_ALL_ORIGINS=True
```

### Production (Railway)
```bash
DEBUG=False
DATABASE_URL=postgresql://...
ALLOWED_HOSTS=specific-domains-only
CORS_ALLOWED_ORIGINS=specific-origins-only
```

## 🔧 Troubleshooting

### Common Issues & Solutions

**1. Login fails after changing DEBUG=False**
- ✅ Verified: JWT works with DEBUG=False
- Check ALLOWED_HOSTS includes your domain

**2. CORS errors**
- Ensure CORS_ALLOWED_ORIGINS includes frontend domain
- Check Origin header in browser

**3. Database connection fails**
- Verify DATABASE_URL is correctly set
- Check PostgreSQL service is running

**4. 500 Internal Server Error**
- Check Railway logs for specific errors
- Verify all required environment variables are set

## 📝 Notes

- **✅ JWT authentication works** with DEBUG=False
- **✅ PostgreSQL migration** completed successfully  
- **✅ Admin login functional** with current config
- **⚠️ Security improvements** recommended but not required
- **🔄 Environment variables** should be set in Railway dashboard, not in code

## 🚨 Security Priority

**HIGH PRIORITY:** Set DEBUG=False for production security  
**MEDIUM PRIORITY:** Add HTTPS security headers  
**LOW PRIORITY:** Generate new SECRET_KEY and change admin password

---

**Last Updated:** October 2025  
**Status:** Working configuration documented ✅