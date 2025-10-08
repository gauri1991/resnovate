#!/bin/bash

echo "🚀 Starting Railway deployment setup..."

# Make sure we're in the right directory
cd /app

# Run production setup
echo "🔧 Running production setup..."
python setup_production.py

# Check if setup was successful
if [ $? -eq 0 ]; then
    echo "✅ Setup completed successfully"
else
    echo "❌ Setup failed"
    exit 1
fi

# Start the Django application
echo "🌐 Starting Django server..."
exec python manage.py runserver 0.0.0.0:$PORT