# 🎯 Habify - Gamified Habit Tracking App

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

> Transform your daily habits into an engaging, reward-based adventure with virtual pet companions and a rupee economy system.

## 🌟 Overview

**Habify** is a modern, gamified habit tracking web application that makes building consistent routines fun and rewarding. Earn rupees (₹) for maintaining good habits, collect unique digital pets, and watch your streaks grow in a beautifully designed, responsive interface.

### ✨ Key Features

- 🔐 **Complete Authentication System** - Django-powered login, signup, and session management
- 💰 **Rupee Economy** - Earn ₹ currency for consistent habit maintenance with backend persistence
- 🛍️ **Pet Marketplace** - 10 unique collectible creatures across diverse categories
- 📅 **Activity Calendar** - Visual tracking with streak system and progress indicators
- 🎒 **Inventory Management** - Collect and activate up to 3 pets simultaneously
- 🎨 **Modern UI/UX** - Glass-morphism design with smooth animations
- 📱 **Fully Responsive** - Optimized for all devices and screen sizes
- 🔗 **Full-Stack Architecture** - Django REST API backend with React frontend
- 🗄️ **Dual Storage Options** - Django backend with PostgreSQL or localStorage fallback
- 🛡️ **Security Features** - CSRF protection, secure authentication, and CORS configuration

## 🎮 How It Works

1. **Track Daily Habits** - Simple check-in system for your routines
2. **Earn Rupees** - Get ₹10+ per successful day (with streak multipliers)
3. **Shop for Pets** - Spend earned rupees on unique creatures (₹100-450)
4. **Build Collections** - Activate your favorite pets and build your inventory
5. **Maintain Streaks** - Consistency rewards with increasing multipliers

## 🛍️ Pet Categories

| Category | Pet Examples | Price Range |
|----------|-------------|-------------|
| 🌊 **Water** | Aquilance | ₹150 |
| 🔥 **Fire** | Pyrogriff | ₹300 |
| ⚡ **Electric** | Starshock | ₹450 |
| 🦇 **Shadow** | Draven | ₹250 |
| 🌸 **Nature** | Petally | ₹180 |
| 😊 **Friendly** | Freddie | ₹200 |
| ❄️ **Ice** | Blanco | ₹275 |
| 🐛 **Bug** | Verminator | ₹350 |
| 🐕 **Meme** | Doge | ₹100 |
| 🦌 **Adventure** | Skiddo | ₹320 |

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Development Setup

#### 1. Clone and Setup Backend
```bash
# Clone the repository
git clone <your-repo-url>
cd habify-app-main

# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Start Django backend server
python manage.py runserver
# Backend will run on http://localhost:8000
```

#### 2. Setup Frontend
```bash
# Open new terminal, navigate to frontend
cd interface

# Create environment file
cp environment.example .env

# Edit .env file:
# REACT_APP_USE_BACKEND=true
# REACT_APP_API_URL=http://localhost:8000

# Install dependencies
npm install

# Start React development server
npm start
# Frontend will run on http://localhost:3000
```

#### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Django Admin**: http://localhost:8000/admin
- **API Docs**: http://localhost:8000/api/

### Production Deployment

#### Full-Stack Deployment (Heroku)
```bash
# Deploy both frontend and backend
git push heroku main

# Run migrations on production
heroku run python manage.py migrate
```

#### Frontend-Only Deployment (Netlify/Vercel)
```bash
# Set environment variable for localStorage mode
echo "REACT_APP_USE_BACKEND=false" > interface/.env

# Build and deploy
cd interface
npm run build
# Deploy build/ folder to Netlify or connect to Vercel
```

## 🏗️ Project Structure

```
habify-app-main/
├── interface/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Accounts/     # Authentication forms
│   │   │   ├── Dashboard/    # Main app interface
│   │   │   ├── Shop/         # Pet marketplace
│   │   │   └── Inventory/    # Pet collection
│   │   ├── context/          # React Context (AuthContext)
│   │   ├── config/           # API configuration
│   │   └── utils/            # Helper functions
│   ├── public/
│   │   └── static/imgs/      # Pet images and assets
│   ├── .env                  # Environment variables
│   └── build/                # Production build
├── config/                   # Django project configuration
│   ├── settings.py          # Django settings with CORS/CSRF config
│   ├── urls.py              # Main URL configuration
│   └── wsgi.py              # WSGI application
├── user_app/                # Django user management app
│   ├── models.py            # User profile and day log models
│   ├── views.py             # API endpoints for auth and data
│   ├── serializers.py       # DRF serializers
│   └── urls.py              # User app URL patterns
├── rewards_app/             # Django rewards system app
│   ├── models.py            # Pet and reward models
│   ├── views.py             # Reward API endpoints
│   └── urls.py              # Rewards URL patterns
├── venv/                    # Python virtual environment
├── requirements.txt         # Python dependencies
├── manage.py               # Django management script
├── Procfile                # Heroku deployment config
├── netlify.toml            # Netlify deployment config
└── README.md
```

## 💻 Tech Stack

### Frontend
- **React 18** - Modern functional components with hooks
- **Context API** - Global state management for authentication and app state
- **CSS3** - Modern styling with gradients, animations, and glass-morphism
- **Responsive Design** - Mobile-first approach with cross-device compatibility

### Backend
- **Django 4.2** - Python web framework with REST API capabilities
- **Django REST Framework** - API development and serialization
- **SQLite** - Development database (auto-created)
- **PostgreSQL** - Production database (via dj-database-url)
- **Django CORS Headers** - Cross-origin resource sharing configuration

### Security & Authentication
- **Django Authentication** - Built-in user management and sessions
- **CSRF Protection** - Cross-site request forgery protection
- **CORS Configuration** - Secure cross-origin API access
- **Session Management** - Secure user session handling

### Development Tools
- **Create React App** - React development environment
- **Django Management Commands** - Database migrations and server management
- **ESLint** - Code linting and formatting
- **Virtual Environments** - Python dependency isolation

### Deployment & Infrastructure
- **Heroku** - Full-stack cloud deployment platform
- **Netlify** - Frontend-only deployment option
- **WhiteNoise** - Static file serving for Django
- **Gunicorn** - Python WSGI HTTP server for production

## 🔧 Configuration

### Frontend Environment Variables
Create `interface/.env` file:
```bash
# Backend Configuration
REACT_APP_USE_BACKEND=true              # Use Django backend (false for localStorage only)
REACT_APP_API_URL=http://localhost:8000 # Django backend URL

# Development Settings
DISABLE_ESLINT_PLUGIN=true
GENERATE_SOURCEMAP=false
FAST_REFRESH=true
```

### Backend Environment Variables (Production)
```bash
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-domain.com,localhost

# Database (Heroku sets DATABASE_URL automatically)
DATABASE_URL=postgres://user:pass@host:port/dbname

# Static Files (for deployment)
STATIC_URL=/static/
```

### Configuration Modes

#### Development Mode
- Django backend on `localhost:8000`
- React frontend on `localhost:3000` 
- SQLite database (auto-created)
- CORS enabled for cross-origin requests

#### Production Mode
- Django serves both API and static files
- PostgreSQL database via DATABASE_URL
- WhiteNoise serves React build files
- CSRF and CORS configured for production domain

#### Frontend-Only Mode
- Set `REACT_APP_USE_BACKEND=false`
- All data stored in browser localStorage
- No backend dependencies required

## 🌐 Deployment Options

### Full-Stack Deployment (Heroku) - Recommended
```bash
# 1. Create Heroku app
heroku create your-app-name

# 2. Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# 3. Set environment variables
heroku config:set SECRET_KEY=your-secret-key
heroku config:set DEBUG=False
heroku config:set REACT_APP_USE_BACKEND=true

# 4. Deploy
git push heroku main

# 5. Run migrations
heroku run python manage.py migrate

# 6. Create superuser (optional)
heroku run python manage.py createsuperuser
```

### Frontend-Only Deployment

#### Netlify
```bash
# 1. Set localStorage mode
echo "REACT_APP_USE_BACKEND=false" > interface/.env

# 2. Build React app
cd interface && npm run build

# 3. Deploy build/ folder to Netlify
# Drag & drop or connect GitHub repository
```

#### Vercel
```bash
# 1. Set environment variables in Vercel dashboard:
#    REACT_APP_USE_BACKEND=false

# 2. Connect GitHub repository
# 3. Set root directory to `interface`
# 4. Framework preset: React
```

### Development Deployment (Local Network)
```bash
# 1. Start Django backend
python manage.py runserver 0.0.0.0:8000

# 2. Update React .env
echo "REACT_APP_API_URL=http://YOUR_LOCAL_IP:8000" > interface/.env

# 3. Start React frontend
cd interface && npm start

# Access from other devices on your network
```

## 📱 Features Showcase

### Authentication System
- Secure login/signup with validation
- Forgot password with email reset simulation
- Session management with auto-expiration
- Demo accounts available for testing

### Gamification Elements
- Daily rupee earning system
- Streak multipliers for consistency
- Pet collection and activation
- Visual progress tracking
- Achievement-based rewards

### User Experience
- Intuitive navigation and modern design
- Responsive layout for all devices
- Smooth animations and hover effects
- Accessibility-focused interface
- Fast loading with optimized assets

## 🎯 Roadmap

### ✅ Completed Features
- [x] Complete authentication system
- [x] Rupee-based economy
- [x] Pet marketplace with 10 creatures
- [x] Activity calendar with streaks
- [x] Inventory management system
- [x] Responsive design and animations
- [x] ESLint error resolution
- [x] Production deployment configuration

### 🚧 Future Enhancements
- [ ] Pet animations and interactions
- [ ] Achievement badges system
- [ ] Social features and leaderboards
- [ ] Custom habit categories
- [ ] Data export functionality
- [ ] PWA capabilities
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔧 Troubleshooting

### Common Issues

#### "Failed to fetch" or Login 403 Errors
```bash
# Ensure Django backend is running
python manage.py runserver

# Check React .env file has correct settings
cat interface/.env
# Should contain: REACT_APP_USE_BACKEND=true

# Restart React with environment variables
cd interface && npm start
```

#### CORS/CSRF Issues
```bash
# Verify Django settings include CORS configuration
# Check config/settings.py for CORS_ALLOWED_ORIGINS

# Ensure both servers are running on correct ports
# Django: http://localhost:8000
# React: http://localhost:3000
```

#### Database Issues
```bash
# Reset database (development only)
rm db.sqlite3
python manage.py migrate

# Create new superuser
python manage.py createsuperuser
```

#### Static Files Not Loading (Production)
```bash
# Build React frontend first
cd interface && npm run build

# Collect static files
python manage.py collectstatic --noinput

# Check STATICFILES_DIRS in Django settings
```

### Development Workflow

#### Starting Development
```bash
# Terminal 1: Start Django backend
source venv/bin/activate
python manage.py runserver

# Terminal 2: Start React frontend  
cd interface
npm start

# Both servers will auto-reload on file changes
```

#### Making Changes
1. **Backend changes**: Edit Python files in `user_app/`, `rewards_app/`, or `config/`
2. **Frontend changes**: Edit React files in `interface/src/`
3. **Database changes**: Create migrations with `python manage.py makemigrations`
4. **New dependencies**: Update `requirements.txt` or `package.json`

#### Testing
```bash
# Test Django backend
python manage.py test

# Test React frontend
cd interface && npm test

# Manual testing: Use both http://localhost:3000 and Django admin
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/csrf/` | GET | Get CSRF token |
| `/api/new/` | POST | Create new user |
| `/api/login/` | POST | User login |
| `/api/logout/` | POST | User logout |
| `/api/profile/` | GET | Get user profile |
| `/api/daylog/` | GET | Get day logs |
| `/api/daylog/` | POST | Create day log |
| `/api/rewards/` | GET | Get rewards |

## 🙏 Acknowledgments

- React community for excellent documentation
- Django community for robust web framework
- Modern CSS design inspiration from various UI/UX resources
- Gamification principles from habit formation research

## 📞 Support

For support, questions, or feature requests:
- Open an issue on GitHub
- Contact the development team
- Check troubleshooting section above

---

**Made with ❤️ for building better habits through gamification**

🎮 **Start your habit journey today!** → [Live Demo](your-deployed-url-here)