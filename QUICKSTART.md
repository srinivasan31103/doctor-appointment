# HealthCare+ Quick Start Guide ⚡

Get up and running in 5 minutes!

## 🚀 Super Quick Start (Windows)

1. **Run Installation Script**
   ```bash
   INSTALL.bat
   ```

2. **Configure Environment**
   - Open `backend/.env`
   - Add your MongoDB URI
   - Add your Claude API key

3. **Start Application**
   ```bash
   START.bat
   ```

4. **Open Browser**
   - Go to: http://localhost:3000
   - Register and start using!

---

## 🚀 Super Quick Start (Mac/Linux)

1. **Make scripts executable**
   ```bash
   chmod +x install.sh start.sh
   ```

2. **Run Installation**
   ```bash
   ./install.sh
   ```

3. **Configure Environment**
   - Open `backend/.env`
   - Add your MongoDB URI
   - Add your Claude API key

4. **Start Application**
   ```bash
   ./start.sh
   ```

5. **Open Browser**
   - Go to: http://localhost:3000
   - Register and start using!

---

## 🔑 Required Setup

### 1. MongoDB
**Option A: Local**
- Install MongoDB Community Edition
- Start: `mongod`

**Option B: Cloud (Recommended)**
- Create free account at https://www.mongodb.com/cloud/atlas
- Get connection string
- Update `MONGODB_URI` in `backend/.env`

### 2. Claude API Key
- Sign up at https://console.anthropic.com/
- Create API key
- Add to `CLAUDE_API_KEY` in `backend/.env`

---

## 📝 Manual Installation (If scripts don't work)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env file with your credentials
npm run dev
```

### Frontend Setup (New Terminal)
```bash
cd frontend
npm install
npm run dev
```

---

## ✅ Verify Installation

1. **Backend Running**: http://localhost:5000
   - Should show: "Welcome to HealthCare+ API"

2. **Frontend Running**: http://localhost:3000
   - Should show: Login page

3. **MongoDB Connected**: Check backend terminal
   - Should show: "MongoDB Connected"

---

## 🎯 First Steps After Setup

1. **Register Account**
   - Choose role: Patient
   - Fill in details
   - Click "Create Account"

2. **Add Health Record**
   - Enter your vital signs
   - See AI-generated health advice!

3. **Book Appointment**
   - Go to Appointments
   - Select a doctor
   - Book your appointment

---

## 🐛 Quick Troubleshooting

### "Cannot connect to MongoDB"
- Make sure MongoDB is running
- Check connection string in `.env`

### "Port 5000 already in use"
- Change PORT in `backend/.env`

### "Port 3000 already in use"
- Change port in `frontend/vite.config.js`

### "No AI advice showing"
- Check Claude API key
- Verify you have API credits

---

## 📚 Next Steps

- Read [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions
- Check [API_REFERENCE.md](API_REFERENCE.md) for API testing
- See [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for features overview

---

## 🎉 You're Ready!

Start managing your health with HealthCare+! 🏥

For support, check the documentation files or create an issue.
