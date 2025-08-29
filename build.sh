#!/bin/bash
set -o errexit

echo "=== Building Habify App for Production ==="

# Build React frontend
echo "Building React frontend..."
cd interface
npm cache clean --force
npm install --legacy-peer-deps
npm run build
cd ..

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Collect static files (includes React build + images)
echo "Collecting static files..."
python manage.py collectstatic --noinput --clear

# Verify static files collected correctly
echo "Verifying static files..."
ls -la staticfiles/static/imgs/pets/ 2>/dev/null && echo "✅ Pet images collected" || echo "❌ Pet images missing"
ls -la staticfiles/static/imgs/nav/ 2>/dev/null && echo "✅ Nav images collected" || echo "❌ Nav images missing"
ls -la staticfiles/static/imgs/brand/ 2>/dev/null && echo "✅ Brand images collected" || echo "❌ Brand images missing"

# Run database migrations
echo "Running database migrations..."
python manage.py migrate

echo "=== Build Complete ==="
