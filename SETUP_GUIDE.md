# HealthCare+ Setup Guide 🚀

## Quick Start Guide

Follow these steps to get your HealthCare+ application up and running.

## Step 1: Install Dependencies

### Backend
```bash
cd healthcare-plus/backend
npm install
```

### Frontend
```bash
cd healthcare-plus/frontend
npm install
```

## Step 2: Environment Configuration

### Backend Environment (.env)

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/healthcare-plus
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
CLAUDE_API_KEY=your_claude_api_key_here
NODE_ENV=development

# Optional: Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

**Important Configuration Notes:**

1. **MONGODB_URI**:
   - For local MongoDB: `mongodb://localhost:27017/healthcare-plus`
   - For MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/healthcare-plus`

2. **JWT_SECRET**:
   - Use a strong, random string
   - Generate one: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

3. **CLAUDE_API_KEY**:
   - Get your API key from: https://console.anthropic.com/
   - Sign up for a free account
   - Navigate to API Keys section
   - Create a new key and copy it

### Frontend Environment (.env)

Create a `.env` file in the `frontend` folder (optional):

```env
VITE_API_URL=http://localhost:5000/api
```

## Step 3: Database Setup

### Option A: Local MongoDB

1. Install MongoDB Community Edition:
   - Windows: https://www.mongodb.com/try/download/community
   - Mac: `brew install mongodb-community`
   - Linux: Follow official MongoDB docs

2. Start MongoDB:
   ```bash
   # Windows
   mongod

   # Mac/Linux
   brew services start mongodb-community
   # or
   sudo systemctl start mongod
   ```

3. Verify MongoDB is running:
   ```bash
   mongo
   # or
   mongosh
   ```

### Option B: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (Free M0 tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Update `MONGODB_URI` in backend `.env`

## Step 4: Get Claude API Key

1. Visit https://console.anthropic.com/
2. Sign up for an account (you'll get free credits)
3. Go to "API Keys" in the dashboard
4. Click "Create Key"
5. Copy the key and add it to backend `.env`
6. **Note**: Free tier includes $5 credits which is enough for testing

## Step 5: Run the Application

### Terminal 1 - Start Backend
```bash
cd healthcare-plus/backend
npm run dev
```

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: localhost
```

### Terminal 2 - Start Frontend
```bash
cd healthcare-plus/frontend
npm run dev
```

You should see:
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

## Step 6: Access the Application

Open your browser and go to: **http://localhost:3000**

## Step 7: Create Test Accounts

### Create an Admin Account
1. Register a new account with these details:
   - Name: Admin User
   - Email: admin@healthcare.com
   - Password: admin123
   - Role: Patient (for now)

2. Then manually update in MongoDB:
   ```javascript
   // Using MongoDB Compass or mongosh
   use healthcare-plus
   db.users.updateOne(
     { email: "admin@healthcare.com" },
     { $set: { role: "admin" } }
   )
   ```

### Create a Doctor Account
1. Register with:
   - Role: Doctor
   - Fill in all required fields

2. After registration, create doctor profile:
   - Login as doctor
   - Complete the doctor profile form
   - Add specialization, experience, consultation fee

### Create a Patient Account
1. Register with:
   - Role: Patient
   - Fill in health details (age, blood group, etc.)

## Step 8: Test Features

### As a Patient
1. **Add Health Records**:
   - Go to Dashboard
   - Fill in vital signs (BP, sugar, weight, etc.)
   - Submit and see AI-generated advice

2. **Book Appointment**:
   - Go to Appointments
   - Select a doctor
   - Choose date and time
   - Submit booking

### As a Doctor
1. **View Appointments**:
   - Access Doctor Panel
   - See all patient appointments
   - Click on appointment to view details

2. **Manage Appointments**:
   - Update status (confirm/reject)
   - Add prescription and diagnosis
   - View patient health history

### As an Admin
1. **Monitor System**:
   - Access Admin Panel
   - View statistics
   - Manage users and doctors
   - Monitor appointments

## Common Issues & Solutions

### Issue 1: MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**:
- Make sure MongoDB is running
- Check if port 27017 is available
- Verify connection string in `.env`

### Issue 2: Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**:
```bash
# Find and kill the process using port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Issue 3: Claude API Error
```
Error calling Claude API
```
**Solution**:
- Verify API key is correct
- Check if you have API credits
- Ensure internet connectivity
- Check API key permissions

### Issue 4: JWT Token Errors
```
Not authorized, token failed
```
**Solution**:
- Clear browser localStorage
- Login again
- Check JWT_SECRET matches in `.env`

### Issue 5: CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**:
- Backend is already configured with CORS
- Make sure backend is running on port 5000
- Check API URL in frontend `.env`

## Production Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables on hosting platform
2. Update `MONGODB_URI` to production database
3. Set `NODE_ENV=production`
4. Deploy using Git or CLI

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Set environment variable:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

3. Deploy the `dist` folder

## Database Seeding (Optional)

If you want to populate the database with sample data, create this script:

```javascript
// backend/seeders/seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB Connected');
};

const seedDatabase = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany();
  await Doctor.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@healthcare.com',
    password: adminPassword,
    role: 'admin'
  });

  console.log('Database seeded successfully!');
  process.exit();
};

seedDatabase();
```

Run: `node backend/seeders/seed.js`

## Useful Commands

```bash
# Backend
npm run dev          # Start development server
npm start            # Start production server

# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# MongoDB
mongod              # Start MongoDB server
mongo               # Open MongoDB shell
mongosh             # Open MongoDB shell (newer versions)
```

## Next Steps

1. **Customize the application**:
   - Update color scheme in `tailwind.config.js`
   - Modify components to match your brand
   - Add more health metrics

2. **Add features**:
   - Video consultation
   - Payment integration
   - SMS notifications
   - Export health records to PDF

3. **Improve security**:
   - Add rate limiting
   - Implement 2FA
   - Add input sanitization
   - Set up SSL/HTTPS

## Support & Resources

- **MongoDB Documentation**: https://docs.mongodb.com/
- **React Documentation**: https://react.dev/
- **Express Documentation**: https://expressjs.com/
- **Claude AI Documentation**: https://docs.anthropic.com/
- **Tailwind CSS**: https://tailwindcss.com/docs

## Contact

For issues, create an issue in the GitHub repository or reach out to the development team.

---

**Happy Coding! 💻🏥**
