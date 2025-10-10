#!/bin/bash
# Consultation Booking System - Quick Setup Script

set -e

echo "🚀 Setting up Consultation Booking System..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Error: Must run from project root directory${NC}"
    exit 1
fi

echo "📋 Step 1: Checking Backend Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}⚠️  Virtual environment not found. Creating...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Check if stripe is installed
if ! python -c "import stripe" 2>/dev/null; then
    echo -e "${YELLOW}📦 Installing Stripe package...${NC}"
    pip install stripe
fi

# Check if migrations are up to date
echo "🔄 Running database migrations..."
python manage.py migrate --no-input

# Check if consultation slots exist
SLOT_COUNT=$(python manage.py shell -c "from apps.consultations.models import ConsultationSlot; print(ConsultationSlot.objects.count())" 2>/dev/null || echo "0")

if [ "$SLOT_COUNT" -eq "0" ]; then
    echo -e "${YELLOW}📅 No consultation slots found. Creating sample slots...${NC}"
    python manage.py create_consultation_slots --days=30
else
    echo -e "${GREEN}✅ Found $SLOT_COUNT existing consultation slots${NC}"
fi

echo ""
echo "📋 Step 2: Checking Frontend Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd ../frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    npm install --legacy-peer-deps
fi

# Check if react-calendar is installed
if ! npm list react-calendar 2>/dev/null | grep -q react-calendar; then
    echo -e "${YELLOW}📦 Installing react-calendar...${NC}"
    npm install react-calendar --legacy-peer-deps
fi

# Check if Stripe packages are installed
if ! npm list @stripe/stripe-js 2>/dev/null | grep -q "@stripe/stripe-js"; then
    echo -e "${YELLOW}📦 Installing Stripe packages...${NC}"
    npm install @stripe/stripe-js @stripe/react-stripe-js --legacy-peer-deps
fi

cd ..

echo ""
echo "📋 Step 3: Environment Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check backend .env
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  Backend .env not found. Creating template...${NC}"
    cat > backend/.env << 'EOF'
# Django Settings
SECRET_KEY=django-insecure-change-this-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (using default SQLite)
DATABASE_URL=sqlite:///db.sqlite3

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLIC_KEY=pk_test_your_public_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Email Configuration (Console for development)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
DEFAULT_FROM_EMAIL=noreply@resnovate.ai

# Business Contact
BUSINESS_PHONE=+1 (555) 123-4567

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000
EOF
    echo -e "${RED}⚠️  Please update backend/.env with your Stripe keys!${NC}"
else
    echo -e "${GREEN}✅ Backend .env found${NC}"
fi

# Check frontend .env.local
if [ ! -f "frontend/.env.local" ]; then
    echo -e "${YELLOW}⚠️  Frontend .env.local not found. Creating template...${NC}"
    cat > frontend/.env.local << 'EOF'
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8001/api

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_public_key_here
EOF
    echo -e "${RED}⚠️  Please update frontend/.env.local with your Stripe public key!${NC}"
else
    echo -e "${GREEN}✅ Frontend .env.local found${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Configure Stripe API keys:"
echo "   - Get keys from: https://dashboard.stripe.com/test/apikeys"
echo "   - Update: backend/.env (STRIPE_SECRET_KEY, STRIPE_PUBLIC_KEY)"
echo "   - Update: frontend/.env.local (NEXT_PUBLIC_STRIPE_PUBLIC_KEY)"
echo ""
echo "2. Start the backend server:"
echo "   cd backend && source venv/bin/activate && python manage.py runserver 0.0.0.0:8001"
echo ""
echo "3. Start the frontend server (in new terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "4. Start Stripe webhook listener (in new terminal, optional for testing):"
echo "   stripe listen --forward-to localhost:8001/api/webhooks/stripe/"
echo ""
echo "5. Access the application:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend Admin: http://localhost:8001/admin"
echo "   - Contact Page: http://localhost:3000/contact"
echo ""
echo "6. Test a booking with Stripe test card:"
echo "   - Card: 4242 4242 4242 4242"
echo "   - Exp: Any future date"
echo "   - CVC: Any 3 digits"
echo ""
echo "📖 Full documentation: CONSULTATION_BOOKING_SETUP.md"
echo ""
