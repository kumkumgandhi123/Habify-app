#!/bin/bash
set -o errexit

echo "=== Building Habify App for Production ==="

# Build React frontend
echo "Building React frontend..."
cd interface
npm cache clean --force
npm ci --legacy-peer-deps
npm run build
cd ..

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Collect static files (includes React build)
echo "Collecting static files..."
python manage.py collectstatic --noinput --clear

# Run database migrations
echo "Running database migrations..."
python manage.py migrate

echo "=== Build Complete ==="
