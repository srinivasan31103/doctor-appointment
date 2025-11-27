# 🚀 START HERE - HealthCare+ Quick Setup

## ⚠️ IMPORTANT: Path Issue Detected!

Your project is in a path with spaces: `Smart Health & Doctor Appointment System`

This causes issues with npm scripts. **Here are your options:**

---

## ✅ Option 1: Use the Fixed Batch Files (EASIEST)

I've created special batch files that work around the path issue.

### Just Double-Click These Files:

1. **start-both.bat** - Starts both frontend and backend (RECOMMENDED)
2. **start-backend.bat** - Starts only backend
3. **start-frontend.bat** - Starts only frontend

**That's it!** The application will start automatically.

---

## ✅ Option 2: Move Project (RECOMMENDED for long-term)

1. **Cut** the `healthcare-plus` folder
2. **Paste** it to: `E:\Sri\`
3. **New path:** `E:\Sri\healthcare-plus` (no spaces!)
4. Then run: `INSTALL.bat` and `START.bat`

---

## 📋 Before Starting

### 1. Install MongoDB
- **Download:** https://www.mongodb.com/try/download/community
- **Install** and start MongoDB
- Or use MongoDB Atlas (cloud) - free tier available

### 2. Get Claude API Key (Optional but Recommended)
- Go to: https://console.anthropic.com/
- Sign up (free $5 credits)
- Create API key
- Update in: `backend\.env` file

### 3. Configure Backend
Open `backend\.env` and update:

```env
# Required
MONGODB_URI=mongodb://localhost:27017/healthcare-plus
# Or for Atlas: mongodb+srv://username:password@cluster.mongodb.net/healthcare-plus

# Optional but recommended for AI health advice
CLAUDE_API_KEY=your_claude_api_key_here

# Auto-generated (don't change)
JWT_SECRET=healthcare_plus_super_secret_jwt_key_change_this_in_production_123456789
PORT=5000
NODE_ENV=development
```

---

## 🎯 Starting the Application

### Method 1: Double-Click (Easiest)
1. Double-click `start-both.bat`
2. Wait for both servers to start
3. Open browser: http://localhost:3000

### Method 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd "E:\Sri\Smart Health & Doctor Appointment System\healthcare-plus\backend"
node server.js
```

**Terminal 2 - Frontend:**
```bash
cd "E:\Sri\Smart Health & Doctor Appointment System\healthcare-plus\frontend"
node node_modules\vite\bin\vite.js
```

---

## ✅ Verify It's Working

1. **Backend Check:**
   - Go to: http://localhost:5000
   - Should see: "Welcome to HealthCare+ API"

2. **Frontend Check:**
   - Go to: http://localhost:3000
   - Should see: Login page

3. **MongoDB Check:**
   - Backend terminal should show: "MongoDB Connected"

---

## 🎉 Using the Application

### 1. Register Your First Account
- Click "Sign up"
- Fill in your details
- Choose role: "Patient"
- Click "Create Account"

### 2. Add a Health Record
- You'll land on Dashboard
- Scroll to "Add Health Record"
- Enter your vital signs:
  - Blood Pressure (e.g., 120/80)
  - Sugar Level (e.g., 100)
  - Weight (e.g., 70)
  - Heart Rate (optional)
  - Temperature (optional)
- Click "Add Health Record"
- **See AI-generated health advice!** (if Claude API key is set)

### 3. Book an Appointment
- Go to "Appointments" page
- Click "Book Appointment"
- Select a doctor (create doctor account first if needed)
- Choose date and time
- Enter reason
- Submit!

---

## 👨‍⚕️ Create a Doctor Account

To book appointments, you need doctors in the system:

1. **Logout** (top right)
2. **Register** a new account
3. Choose role: **Doctor**
4. Fill details and complete registration
5. Login as doctor
6. Complete doctor profile (specialization, fees, etc.)

Now you can book appointments with this doctor!

---

## 🔧 Troubleshooting

### Issue: "Cannot find module"
**Solution:** Double-click `start-frontend.bat` or `start-backend.bat`

### Issue: "MongoDB Connection Error"
**Solution:**
- Make sure MongoDB is running: `mongod`
- Or use MongoDB Atlas connection string

### Issue: "Port already in use"
**Solution:**
```bash
# Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: "No AI advice showing"
**Solution:**
- Add your Claude API key to `backend\.env`
- Restart backend server

---

## 📚 Documentation

| File | What It Does |
|------|-------------|
| [START_HERE.md](START_HERE.md) | This file - quickest start |
| [QUICKSTART.md](QUICKSTART.md) | Quick setup guide |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Fixes for common issues |
| [README.md](README.md) | Complete project overview |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Detailed setup |
| [API_REFERENCE.md](API_REFERENCE.md) | API documentation |

---

## 🎯 Next Steps

1. ✅ Start the application
2. ✅ Register an account
3. ✅ Add health records
4. ✅ Book appointments
5. ✅ Explore all features!

---

## ⚡ Quick Commands Reference

```bash
# Start both servers (after moving project)
START.bat

# Start backend only
start-backend.bat

# Start frontend only
start-frontend.bat

# Install all dependencies
INSTALL.bat
```

---

## 🆘 Need Help?

1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Read error messages carefully
3. Make sure MongoDB is running
4. Verify .env files are configured

---

## 🎉 You're Ready!

**Just double-click `start-both.bat` and open http://localhost:3000**

Enjoy HealthCare+! 🏥💚

---

**Pro Tip:** For the best experience, move the project to `E:\Sri\healthcare-plus` (no spaces in path)
