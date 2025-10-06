# Resnovate.ai Platform

A comprehensive AI consulting platform combining a Django REST API backend with a Next.js frontend. This platform helps businesses transform through AI-driven strategies, machine learning implementation, process automation, and data analytics solutions.

## 🏗️ Architecture Overview

```
resnovate-platform/
├── backend/          # Django REST API
├── frontend/         # Next.js React Application
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for caching)
- Docker & Docker Compose (optional)

### Option 1: Docker Compose (Recommended)

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd resnovate-platform
   cp .env.example .env
   ```

2. **Configure Environment**
   Edit `.env` file with your settings:
   ```bash
   # Database
   POSTGRES_DB=resnovate
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_password
   
   # Django
   SECRET_KEY=your_secret_key
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   
   # Next.js
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

3. **Start the Platform**
   ```bash
   docker-compose up --build
   ```

4. **Access the Applications**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Admin Panel: http://localhost:8000/admin

### Option 2: Manual Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure database**
   ```bash
   # Create PostgreSQL database
   createdb resnovate
   
   # Run migrations
   python manage.py migrate
   
   # Create superuser
   python manage.py createsuperuser
   
   # Load sample data (optional)
   python manage.py loaddata fixtures/sample_data.json
   ```

5. **Start Django server**
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your API URL
   ```

4. **Start Next.js development server**
   ```bash
   npm run dev
   ```

## 🎯 Features

### Backend (Django REST API)
- **Content Management**: Blog posts, case studies, services
- **Lead Management**: Lead capture, newsletter subscriptions
- **Consultation Booking**: Time slot management, booking system
- **User Authentication**: JWT-based authentication
- **Admin Interface**: Django admin for content management
- **API Documentation**: Auto-generated OpenAPI/Swagger docs

### Frontend (Next.js React)
- **Modern UI/UX**: Tailwind CSS with custom design system
- **Responsive Design**: Mobile-first approach
- **Interactive Components**: Forms, calendars, animations
- **SEO Optimized**: Meta tags, structured data
- **Performance**: Image optimization, code splitting
- **TypeScript**: Full type safety

## 📱 Pages & Features

### Public Pages
- **Homepage**: Hero section, features, testimonials, CTA
- **About**: Company story, team, values, achievements
- **Services**: Service offerings, pricing, process overview
- **Research Insights**: Blog posts with filtering and search
- **Case Studies**: Client success stories with metrics
- **Resources**: Downloads, tools, calculators
- **Contact**: Contact forms, booking calendar, office locations

### Key Components
- **Navigation**: Responsive navigation with mobile menu
- **Footer**: Links, newsletter signup, social media
- **Lead Capture Form**: Multi-step form with validation
- **Newsletter Form**: Email subscription with API integration
- **Booking Calendar**: Consultation scheduling system

## 🛠️ Development

### Backend Development

```bash
# Install development dependencies
pip install -r requirements-dev.txt

# Run tests
python manage.py test

# Create new migration
python manage.py makemigrations

# Format code
black .
isort .

# Lint code
flake8

# Type checking
mypy .
```

### Frontend Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run type checking
npm run type-check
```

### API Documentation

Visit http://localhost:8000/api/docs/ for interactive API documentation.

### Key API Endpoints

```
# Content
GET  /api/blog-posts/
GET  /api/blog-posts/{slug}/
GET  /api/case-studies/
GET  /api/case-studies/{slug}/
GET  /api/services/

# Leads
POST /api/leads/
POST /api/leads/quick_contact/
POST /api/newsletter/subscribe/

# Consultations  
GET  /api/consultation-slots/available/
POST /api/bookings/

# Authentication
POST /api/token/
POST /api/token/refresh/
```

## 🎨 Design System

### Color Palette
- **Deep Blue**: #1e3a8a (Primary brand color)
- **Innovation Orange**: #f59e0b (Accent color)
- **Clean Gray**: #64748b (Text and UI elements)

### Typography
- **Primary Font**: Geist Sans
- **Monospace Font**: Geist Mono

### Components
- Custom Tailwind CSS configuration
- Framer Motion animations
- Heroicons for icons
- Responsive breakpoints

## 🚀 Deployment

### Production Environment Variables

```bash
# Django Production Settings
DEBUG=False
SECRET_KEY=your_production_secret_key
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://user:password@host:port/dbname

# Next.js Production Settings
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Deployment Options

1. **Docker**: Use docker-compose for containerized deployment
2. **Cloud Platforms**: Deploy to AWS, Google Cloud, or Azure
3. **PaaS**: Use platforms like Heroku, Railway, or DigitalOcean App Platform
4. **Static Hosting**: Frontend can be deployed to Vercel, Netlify

### Database Migration in Production

```bash
python manage.py migrate --no-input
python manage.py collectstatic --no-input
```

## 📊 Monitoring & Analytics

### Backend Monitoring
- Django logging configuration
- Database query optimization
- API endpoint performance tracking

### Frontend Analytics
- Next.js analytics integration
- User behavior tracking
- Performance monitoring

## 🧪 Testing

### Backend Testing
```bash
# Run all tests
python manage.py test

# Run specific test
python manage.py test apps.content.tests.test_models

# Test coverage
coverage run manage.py test
coverage report
coverage html
```

### Frontend Testing
```bash
# Run Jest tests (if configured)
npm test

# E2E testing with Cypress (if configured)
npm run e2e
```

## 🔒 Security

### Backend Security
- CSRF protection
- CORS configuration
- SQL injection prevention
- Input validation and sanitization
- Rate limiting
- Authentication and authorization

### Frontend Security  
- XSS prevention
- Input sanitization
- Secure API communication
- Environment variable protection

## 📝 Content Management

### Adding Content via Admin
1. Access Django admin: http://localhost:8000/admin
2. Navigate to desired content type
3. Create/edit content with rich text editor
4. Set publication status and metadata

### Content Types
- **Blog Posts**: Research insights and articles
- **Case Studies**: Client success stories
- **Services**: Service offerings and descriptions
- **Consultation Slots**: Available booking times

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Workflow
1. Follow existing code style and conventions
2. Add tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PR

## 📞 Support

For support and questions:
- **Email**: hello@resnovate.ai  
- **Phone**: +1 (555) 123-4567
- **Documentation**: Check API docs at `/api/docs/`
- **Issues**: Create GitHub issues for bugs/features

## 📄 License

This project is proprietary software. All rights reserved.

---

**Built with ❤️ by the Resnovate.ai team**

*Transforming businesses through AI innovation*# resnovate
