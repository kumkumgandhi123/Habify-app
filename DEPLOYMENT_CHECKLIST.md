# 🚀 Render Deployment Checklist

## Before Deploying:

### ✅ Code & Configuration
- [ ] All changes committed to Git
- [ ] Python version matches between `render.yaml` and `runtime.txt`
- [ ] Node.js version compatible in `render.yaml` and `package.json`
- [ ] Build script (`build.sh`) is executable

### ✅ Environment Variables (Auto-configured by render.yaml)
- [ ] `SECRET_KEY` - Auto-generated ✅
- [ ] `DEBUG` - Set to false ✅
- [ ] `DATABASE_URL` - Auto-configured PostgreSQL ✅
- [ ] `ALLOWED_HOSTS` - Includes your Render domain ✅
- [ ] `REACT_APP_USE_BACKEND` - Set to true ✅
- [ ] `REACT_APP_API_URL` - Empty (same domain) ✅

## Deployment Process:

1. **Push to GitHub**: Ensure all changes are pushed
2. **Deploy on Render**: 
   - Go to [render.com](https://render.com)
   - Create new Blueprint
   - Connect your GitHub repo
   - Choose master/main branch
   - Click "Apply"

## If Build Still Fails:

### Check Build Logs:
1. Go to Render dashboard
2. Click on your service
3. Check "Events" tab for detailed error messages

### Common Issues:
- **Node/npm errors**: Check Node.js version compatibility
- **Python dependency errors**: Check requirements.txt
- **Build script permission**: Ensure build.sh is executable
- **Static files**: Verify React build creates `interface/build/` directory

### Manual Debug Commands:
```bash
# Test React build locally
cd interface
npm install
npm run build
ls -la build/  # Should show built files

# Test Django setup
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py check --deploy
```

## Success Indicators:
- ✅ Build completes without errors
- ✅ Service shows "Live" status
- ✅ Can access app at your Render URL
- ✅ React frontend loads correctly
- ✅ API endpoints respond (test /admin/)

## After Successful Deployment:
1. Create Django superuser: Access shell in Render dashboard
   ```bash
   python manage.py createsuperuser
   ```
2. Test login functionality
3. Verify all features work as expected

## Support:
- Check [Render documentation](https://render.com/docs)
- Review service logs in Render dashboard
- Test locally with same Node/Python versions
