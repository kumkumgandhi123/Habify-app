#!/bin/bash
set -o errexit

echo "=== Building Habify App for Production ==="

# Ensure npm uses the official registry (fixes ENOTFOUND nexus3.mmt.com issue)
npm config set registry https://registry.npmjs.org/

# Build React frontend
echo "Building React frontend..."
cd interface
npm cache clean --force
npm ci --legacy-peer-deps
npm run build
cd ..

# Install Python dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Collect static files (includes React build)
echo "Collecting static files..."
python manage.py collectstatic --noinput --clear

# Run database migrations
echo "Running database migrations..."
python manage.py migrate

echo "=== Build Complete ==="

