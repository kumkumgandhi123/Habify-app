#!/bin/bash
set -o errexit

echo "=== Building Habify App for Production ==="

# Check if React build already exists
if [ -d "interface/build" ]; then
    echo "✅ Using existing React build (pre-built locally)"
else
    echo "❌ No React build found - attempting to build..."
    # Build React frontend with specific ajv fix
    echo "Building React frontend..."
    cd interface
    
    # Aggressive cleanup
    echo "Cleaning npm cache and dependencies..."
    npm cache clean --force
    rm -rf node_modules
    rm -f package-lock.json
    
    # Install with specific ajv version fix
    echo "Installing dependencies with ajv compatibility fix..."
    npm install --legacy-peer-deps --force --no-audit
    
    # Manually install compatible ajv version
    echo "Installing compatible ajv version..."
    npm install ajv@8.12.0 --legacy-peer-deps --save-dev
    
    # Build React app
    echo "Building React application..."
    npm run build
    
    cd ..
fi

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
