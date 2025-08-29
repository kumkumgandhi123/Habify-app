#!/bin/bash
set -o errexit

echo "=== Building Habify App for Production ==="

# Build React frontend
echo "Building React frontend..."
cd interface

# Aggressive cleanup to resolve dependency conflicts
echo "Cleaning npm cache and dependencies..."
npm cache clean --force
rm -rf node_modules
rm -f package-lock.json

# Install with aggressive dependency resolution
echo "Installing dependencies with conflict resolution..."
npm install --legacy-peer-deps --force --no-audit

# Rebuild native dependencies for current Node version
echo "Rebuilding dependencies..."
npm rebuild

# Build React app
echo "Building React application..."
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
