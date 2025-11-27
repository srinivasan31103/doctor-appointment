# HealthCare+ Troubleshooting Guide 🔧

## Issue: "'Doctor' is not recognized" Error

### Problem
```
'Doctor' is not recognized as an internal or external command
Error: Cannot find module 'E:\Sri\vite\bin\vite.js'
```

### Root Cause
This error occurs because your system's PATH environment variable contains a folder path with spaces (likely "Smart Health & Doctor Appointment System"), and Windows is incorrectly parsing it.

### Solutions

## ✅ Solution 1: Move Project to Path Without Spaces (Recommended)

1. **Move the project to a simpler path:**
   ```
   Move from: E:\Sri\Smart Health & Doctor Appointment System\healthcare-plus
   Move to: E:\Sri\healthcare-plus
   ```

2. **Then run:**
   ```bash
   cd E:\Sri\healthcare-plus\frontend
   npm install
   npm run dev
   ```

## ✅ Solution 2: Use Full Node Path

Instead of `npm run dev`, use:

**Frontend:**
```bash
cd "E:\Sri\Smart Health & Doctor Appointment System\healthcare-plus\frontend"
node node_modules\vite\bin\vite.js
```

**Backend:**
```bash
cd "E:\Sri\Smart Health & Doctor Appointment System\healthcare-plus\backend"
node node_modules\nodemon\bin\nodemon.js server.js
```

## ✅ Solution 3: Create Batch Files

Create these batch files in the `healthcare-plus` folder:

### `start-frontend.bat`
```batch
@echo off
cd /d "%~dp0frontend"
node node_modules\vite\bin\vite.js
pause
```

### `start-backend.bat`
```batch
@echo off
cd /d "%~dp0backend"
node server.js
pause
```

Then just double-click these files to start the servers.

## ✅ Solution 4: Fix npm Configuration

Run these commands:
```bash
npm config set script-shell "C:\\Windows\\System32\\cmd.exe"
npm config set shell "C:\\Windows\\System32\\cmd.exe"
```

Then try again:
```bash
cd "E:\Sri\Smart Health & Doctor Appointment System\healthcare-plus\frontend"
npm run dev
```

---

## Quick Test Commands

### Test if Node.js works:
```bash
node --version
```

### Test if npm works:
```bash
npm --version
```

### Test if vite is installed:
```bash
cd "E:\Sri\Smart Health & Doctor Appointment System\healthcare-plus\frontend"
dir node_modules\vite
```

---

## Other Common Issues

### Issue: MongoDB Connection Error
**Error:** `Error: connect ECONNREFUSED`

**Solution:**
1. Make sure MongoDB is installed and running
2. Start MongoDB: `mongod` in a new terminal
3. Or use MongoDB Atlas cloud connection

### Issue: Port Already in Use
**Error:** `EADDRINUSE :::5000`

**Solution:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Issue: Claude API Not Working
**Error:** No AI advice appearing

**Solution:**
1. Get API key from https://console.anthropic.com/
2. Add to `backend\.env`: `CLAUDE_API_KEY=your_key_here`
3. Restart backend server

---

## Step-by-Step Manual Start (If Scripts Fail)

### 1. Start Backend
```bash
# Open Command Prompt or PowerShell
cd "E:\Sri\Smart Health & Doctor Appointment System\healthcare-plus\backend"

# If npm run dev doesn't work, use:
node server.js
```

### 2. Start Frontend (New Terminal)
```bash
cd "E:\Sri\Smart Health & Doctor Appointment System\healthcare-plus\frontend"

# If npm run dev doesn't work, use:
node node_modules/vite/bin/vite.js
```

---

## Recommended: Move Project

**Best solution is to move the project to avoid path issues:**

1. Cut the `healthcare-plus` folder
2. Paste it to: `E:\Sri\`
3. New path: `E:\Sri\healthcare-plus`
4. Run commands from there

This avoids ALL path-related issues!

---

## Need More Help?

Check these files:
- [README.md](README.md) - Project overview
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup
- [QUICKSTART.md](QUICKSTART.md) - Quick start

---

**Still stuck? The path with spaces is the issue. Move the project to a simpler path!**
