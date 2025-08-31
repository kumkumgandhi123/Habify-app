# 🧪 Complete Website Testing Guide

## 🚀 Your app is running at: **http://localhost:3000**

---

## 📋 PHASE 1: Fresh Start Testing

### Step 1: Clear All Data (Start Fresh)
1. **Open Browser Developer Tools** (F12 or Cmd+Option+I)
2. **Go to Application/Storage tab**
3. **Clear all localStorage data:**
   - Look for `habify_user` and `habify_users` 
   - Delete them if they exist
4. **Refresh the page** (Cmd+R or F5)

### Step 2: Initial Page Load
✅ **What you should see:**
- Beautiful gradient background (sky blue to darker blue)
- Animated floating dots
- White card with "Welcome Back" title
- Login form with username and password fields
- Blue "Fill Demo User" button
- "Sign In" button
- Toggle button at bottom saying "Sign Up"

---

## 📋 PHASE 2: Authentication Testing

### Test A: Demo User Login
1. **Click "Fill Demo User (demo/demo123)" button**
   - Should auto-fill: username=`demo`, password=`demo123`
2. **Click "Sign In" button**
   - Should see "Login successful! Welcome back!" message
   - Should automatically transition to dashboard (no page reload)

### Test B: Manual Login
1. **Refresh page** → should go back to login
2. **Manually enter:**
   - Username: `admin`
   - Password: `admin123`
3. **Click "Sign In"**
   - Should login successfully

### Test C: Create New Account
1. **Refresh page** → back to login
2. **Click "Sign Up" toggle button**
   - Form should change to signup with 4 fields
3. **Fill out signup form:**
   - First Name: `Test`
   - Last Name: `User`
   - Username: `testuser` (min 3 chars)
   - Password: `testpass123` (min 6 chars)
4. **Click "Create Account"**
   - Should see success message and login automatically

### Test D: Error Handling
1. **Try invalid login:**
   - Username: `wrong`
   - Password: `wrong`
   - Should show error message
2. **Try signup with existing username:**
   - Use `demo` as username
   - Should show "Username already exists" error

---

## 📋 PHASE 3: Dashboard Pages Testing

### Navigation Bar Testing
✅ **What you should see in top navigation:**
- **Left:** Habify logo (should be visible)
- **Right:** 4 buttons with icons:
  - 📅 Calendar icon
  - 🛒 Shop icon  
  - 👤 Profile icon
  - **D** Profile circle (your initial)

### Page 1: Calendar (Default Page)
1. **Should load automatically after login**
2. **Check for:**
   - Calendar interface
   - User stats displayed (coins: 100, streak: 5)
   - Daily activity form
   - All images loading properly

### Page 2: Shop
1. **Click the shop icon (🛒)**
2. **Check for:**
   - Pet/reward cards displayed
   - Pet images loading (0.png through 9.png)
   - Names: Aquilance, Pyrogriff, Draven, Doge, etc.
   - Buy buttons on each card
   - Proper grid layout

### Page 3: Profile/Inventory
1. **Click the profile icon (👤)**
2. **Check for:**
   - Profile information
   - User stats
   - Inventory items
   - Profile interface

---

## 📋 PHASE 4: Authentication Persistence Testing

### Test A: Browser Refresh
1. **While logged in, refresh the page (Cmd+R/F5)**
2. **Should remain logged in** (no return to login page)
3. **Dashboard should load immediately**

### Test B: Session Duration
1. **Login and stay logged in**
2. **Navigate between pages multiple times**
3. **Should not randomly logout**

### Test C: Logout Functionality
1. **Click the profile circle (D) in top-right**
2. **Should see confirmation dialog**
3. **Click "OK" to logout**
4. **Should return to login page**
5. **Should clear all session data**

---

## 📋 PHASE 5: Responsive Design Testing

### Desktop Testing (Current)
1. **Resize browser window**
2. **Check all elements scale properly**
3. **Verify navigation works at different sizes**

### Mobile Simulation
1. **Open Developer Tools (F12)**
2. **Click device toggle (mobile icon)**
3. **Select iPhone or Android device**
4. **Test all pages in mobile view:**
   - Login form should stack properly
   - Navigation should be touch-friendly
   - All images should load
   - Text should be readable

---

## 📋 PHASE 6: Image Loading Verification

### Check All Images Load:
1. **Navigation icons:**
   - ✅ Logo in top-left
   - ✅ Calendar icon
   - ✅ Shop icon  
   - ✅ Profile icon

2. **Shop page images:**
   - ✅ All 10 pet images (0.png - 9.png)
   - ✅ No broken image icons

3. **Debug image issues:**
   - Open Developer Tools → Network tab
   - Refresh page
   - Look for any red/failed requests
   - All images should return 200 status

---

## 📋 PHASE 7: Debug Monitor Testing

### Authentication Debug Panel
1. **Look for small debug panel (top-right corner)**
2. **Should show:**
   - `Authenticated: Yes/No`
   - `User: [username]`
   - `LocalStorage: Present/None`
3. **Monitor during login/logout to verify state changes**

---

## 🎯 Expected Results Summary

### ✅ **Working Features:**
- Beautiful, modern login/signup interface
- Stable authentication (no random logouts)
- All images loading properly
- Smooth page transitions
- Responsive design
- Persistent login sessions
- Three main pages: Calendar, Shop, Profile
- Working logout functionality

### 🚨 **Report Any Issues:**
- Broken images (missing icons)
- Authentication problems
- Page navigation issues
- Responsive design problems
- Unexpected logouts

---

## 🎮 Start Testing Now!

**Go to: http://localhost:3000**

Follow each phase step by step and let me know if you encounter any issues! The website should work perfectly through all these tests.
