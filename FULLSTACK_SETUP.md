# 🚀 Full-Stack Habify Setup Guide

Your Habify app now supports **both Django backend and localStorage** authentication!

## 🎯 Quick Start Options

### Option 1: Frontend Only (Current Setup)
```bash
cd interface
npm start
# Runs at http://localhost:3000
# Uses localStorage for data
```

### Option 2: Full-Stack Django + React
```bash
# Terminal 1: Start Django Backend
source venv/bin/activate
python manage.py runserver
# Runs at http://localhost:8000

# Terminal 2: Start React Frontend  
cd interface
npm start
# Runs at http://localhost:3000
```

## ⚙️ Configuration

### Environment Variables
Create `interface/.env` file:
```env
# Use Django backend (true) or localStorage (false)
REACT_APP_USE_BACKEND=true

# Django API URL
REACT_APP_API_URL=http://localhost:8000
```

### Django Admin Access
- **URL**: http://localhost:8000/admin/
- **Username**: admin
- **Password**: admin123

## 🔌 API Endpoints (Django)

### Authentication
- `POST /api/new/` - Create user
- `POST /api/login/` - User login  
- `POST /api/logout/` - User logout
- `GET /api/csrf/` - Get CSRF token

### User Data
- `GET/POST /api/profile/` - User profile & coins
- `GET/POST /api/daylog/` - Daily activity logging
- `GET/POST /api/log/` - Activity history

### Shop & Rewards
- `GET /api/rewards/` - User's purchased items
- `POST /buyreward/` - Purchase new item

## 🗄️ Database Models

### User Profile
```python
class Profile(models.Model):
    user = models.OneToOneField(User)
    streak = models.IntegerField(default=0)
    coins = models.IntegerField(default=0)
    pfp = models.CharField(max_length=100)
    last_updated = models.DateField()
```

### Daily Activity
```python
class Day(models.Model):
    user = models.ForeignKey(User)
    day = models.DateField()
    activity = models.IntegerField()
    notes = models.CharField(max_length=250)
```

### Purchased Rewards
```python
class Rewards(models.Model):
    user = models.ForeignKey(User)
    price = models.IntegerField()
    img = models.CharField(max_length=999)
    title = models.CharField(max_length=50)
```

## 🔧 Development Commands

### Django Backend
```bash
# Activate virtual environment
source venv/bin/activate

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
```

### React Frontend
```bash
cd interface

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 🚀 Deployment Options

### Frontend Only (Netlify/Vercel)
```bash
cd interface
npm run build
# Deploy build/ folder
```

### Full-Stack (Heroku)
```bash
# Uses existing Procfile and app.json
git push heroku main
```

## 🎯 Next Steps

1. **Choose your setup**: Frontend-only or Full-Stack
2. **Configure environment**: Set REACT_APP_USE_BACKEND
3. **Test both modes**: localStorage vs Django API
4. **Deploy**: Choose platform based on your needs

Your Habify app is now a complete full-stack application! 🎉
