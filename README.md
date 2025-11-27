# HealthCare+ 🏥

A comprehensive full-stack health management and doctor appointment platform built with the MERN stack.

## 🌟 Features

### For Patients
- **Health Records Management**: Track blood pressure, sugar levels, weight, heart rate, and temperature
- **AI Health Advice**: Get personalized health suggestions powered by Claude AI
- **Interactive Charts**: Visualize health trends with Chart.js
- **Doctor Appointments**: Book appointments with doctors based on specialization
- **Appointment History**: Track past and upcoming appointments

### For Doctors
- **Patient Management**: View patient details and health records
- **Appointment Management**: Accept/reject appointments
- **Prescriptions & Diagnosis**: Add medical notes and prescriptions
- **Patient Health History**: Access comprehensive patient health data

### For Admins
- **System Overview**: Monitor all users, doctors, and appointments
- **User Management**: Manage system users
- **Statistics Dashboard**: View system-wide analytics

## 🛠️ Technology Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password encryption
- Claude AI API integration

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Chart.js for data visualization
- Context API for state management

## 📋 Prerequisites

Before running this application, make sure you have:
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Claude API key (from Anthropic)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
cd healthcare-plus
```

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your configurations:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/healthcare-plus
# JWT_SECRET=your_secure_jwt_secret_key
# CLAUDE_API_KEY=your_claude_api_key_here
# NODE_ENV=development
```

### 3. Frontend Setup

```bash
# Navigate to frontend folder
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env if needed (optional):
# VITE_API_URL=http://localhost:5000/api
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:
```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔑 Default Test Accounts

You can create these accounts for testing:

**Admin:**
- Email: admin@healthcare.com
- Password: admin123
- Role: admin

**Doctor:**
- Email: doctor@healthcare.com
- Password: doctor123
- Role: doctor

**Patient:**
- Email: user@healthcare.com
- Password: user123
- Role: user

## 📁 Project Structure

```
healthcare-plus/
│
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB configuration
│   │   └── mailer.js             # Email configuration
│   ├── models/
│   │   ├── userModel.js          # User schema
│   │   ├── doctorModel.js        # Doctor schema
│   │   ├── appointmentModel.js   # Appointment schema
│   │   └── recordModel.js        # Health record schema
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── appointmentRoutes.js
│   │   └── recordRoutes.js
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── doctorController.js
│   │   ├── appointmentController.js
│   │   └── recordController.js
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT authentication
│   │   └── errorMiddleware.js
│   ├── utils/
│   │   └── otpHelper.js          # Helper functions
│   ├── server.js                 # Express server
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── RecordForm.jsx
    │   │   ├── AppointmentForm.jsx
    │   │   ├── ChartCard.jsx
    │   │   └── AIAdviceBox.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Appointments.jsx
    │   │   ├── DoctorPanel.jsx
    │   │   └── AdminPanel.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx   # Authentication context
    │   ├── utils/
    │   │   └── api.js            # API utilities
    │   ├── styles/
    │   │   └── index.css
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

## 🎯 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update profile (Protected)

### Doctors
- `GET /api/doctors` - Get all doctors
- `POST /api/doctors` - Create doctor profile (Protected)
- `GET /api/doctors/:id` - Get doctor by ID
- `PUT /api/doctors/:id` - Update doctor profile (Protected)
- `GET /api/doctors/search/:specialization` - Search doctors

### Appointments
- `POST /api/appointments` - Create appointment (Protected)
- `GET /api/appointments/my-appointments` - Get user appointments (Protected)
- `GET /api/appointments/doctor-appointments` - Get doctor appointments (Protected/Doctor)
- `PUT /api/appointments/:id/status` - Update appointment status (Protected/Doctor)
- `PUT /api/appointments/:id/cancel` - Cancel appointment (Protected)

### Health Records
- `POST /api/records` - Create health record (Protected)
- `GET /api/records` - Get user records (Protected)
- `GET /api/records/stats/summary` - Get health statistics (Protected)
- `GET /api/records/user/:userId` - Get patient records (Protected/Doctor)

## 🤖 Claude AI Integration

The application uses Claude AI to provide personalized health advice based on vital signs:

```javascript
// When a health record is created, Claude AI analyzes:
- Blood Pressure (Systolic/Diastolic)
- Blood Sugar Level
- Weight
- Heart Rate (optional)
- Temperature (optional)

// Returns personalized, actionable health advice
```

To enable this feature, add your Claude API key to the backend `.env` file.

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Medical Theme**: Professional healthcare color scheme
- **Interactive Charts**: Real-time health trend visualization
- **Role-based Navigation**: Different interfaces for patients, doctors, and admins
- **Loading States**: Smooth user experience with loading indicators
- **Form Validation**: Client and server-side validation

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based access control (RBAC)
- Input validation and sanitization
- CORS configuration

## 📝 Usage Guide

### For Patients
1. Register an account as a "Patient"
2. Login and access your dashboard
3. Add health records with vital signs
4. View AI-generated health advice
5. Book appointments with doctors
6. Track your health trends with charts

### For Doctors
1. Register an account as a "Doctor"
2. Complete your doctor profile with specialization
3. Access the Doctor Panel
4. View and manage appointments
5. Access patient health records
6. Add prescriptions and diagnoses

### For Admins
1. Login with admin credentials
2. Access the Admin Panel
3. Monitor system statistics
4. Manage users and doctors
5. View all appointments and records

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network connectivity for Atlas

### Claude AI Not Working
- Verify API key is correct
- Check API key permissions
- Ensure sufficient API credits

### Port Already in Use
```bash
# Change ports in .env and vite.config.js
```

## 📄 License

This project is created for educational purposes.

## 👥 Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ using MERN Stack + Claude AI**
