# 🚀 Deploy Habify App to Render

This guide will help you deploy your full-stack Habify app (Django + React) to Render for free.

## 📋 Prerequisites

1. **GitHub Account**: Your code needs to be in a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com) (free)

## 🔧 Pre-Deployment Setup (Already Done)

✅ Created `render.yaml` configuration file  
✅ Updated Django settings for production  
✅ Created build scripts  
✅ Configured CORS and CSRF for production  
✅ Committed changes to git  

## 🚀 Deployment Steps

### Step 1: Push to GitHub

If you haven't already, push your code to GitHub:

```bash
# Add GitHub remote (replace with your GitHub username and repo name)
git remote add origin https://github.com/YOUR_USERNAME/habify-app.git

# Push to GitHub
git push -u origin master
```

### Step 2: Deploy on Render

1. **Go to [render.com](https://render.com)** and sign in
2. **Click "New +"** and select **"Blueprint"**
3. **Connect your GitHub repository**
4. **Select your repository** (habify-app)
5. **Choose the branch** (master)
6. **Click "Apply"**

Render will automatically:
- Create a PostgreSQL database
- Deploy the Django backend
- Build and deploy the React frontend
- Set up environment variables

### Step 3: Monitor Deployment

1. Watch the build logs in the Render dashboard
2. The service will:
   - Build the React frontend
   - Install Python dependencies
   - Collect static files
   - Deploy the combined application

### Step 4: Access Your App

Once deployed, you'll get **ONE URL** for everything:
- **Full App**: `https://habify-app.onrender.com`
  - React frontend at: `/` (root)
  - API endpoints at: `/api/*`
  - Django admin at: `/admin/`

## 🔧 Configuration Details

### Services Created:
- **Single Web Service**: Django serving both React frontend and API
- **Database**: PostgreSQL (free tier)

### Environment Variables (Auto-configured):
- `SECRET_KEY`: Auto-generated
- `DEBUG`: false
- `DATABASE_URL`: Auto-configured PostgreSQL
- `ALLOWED_HOSTS`: Production URL
- `REACT_APP_USE_BACKEND`: true
- `REACT_APP_API_URL`: "" (empty = same domain)

## 🔍 Troubleshooting

### Common Issues:

1. **Build Fails**: Check the build logs in Render dashboard
2. **Database Migration**: Runs automatically on first deploy
3. **Static Files**: Handled by WhiteNoise middleware
4. **CORS Errors**: Pre-configured for production URLs

### Manual Database Commands (if needed):

Access your backend service shell in Render dashboard:
```bash
python manage.py migrate
python manage.py createsuperuser
```

## 🎯 What's Included

✅ **Single-Domain Deployment**: One URL for everything  
✅ **Full-Stack Integration**: Django serving React + API  
✅ **PostgreSQL Database**: Free tier included  
✅ **Automatic HTTPS**: Render provides SSL certificates  
✅ **No CORS Issues**: Same-origin requests  
✅ **Static File Serving**: Optimized React build  
✅ **Client-Side Routing**: React Router support  
✅ **Production Ready**: Optimized configuration  

## 🔄 Updates

To deploy updates:
1. Make changes to your code
2. Commit and push to GitHub
3. Render will automatically redeploy

## 💰 Cost

- **Free Tier**: Sufficient for development and small projects
- **Auto-sleep**: Services sleep after 15 minutes of inactivity
- **Upgrade**: Available for production use with guaranteed uptime

## 📞 Support

If you encounter issues:
1. Check Render documentation
2. Review build logs in dashboard
3. Verify environment variables
4. Check service health in dashboard

Your app will be live at the provided URLs once deployment completes! 🎉
