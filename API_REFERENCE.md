# HealthCare+ API Reference 📚

Complete API documentation for testing with Postman, Thunder Client, or cURL.

## Base URL
```
http://localhost:5000/api
```

---

## 🔐 Authentication APIs

### 1. Register User
**POST** `/users/register`

**Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user",
  "phone": "+1234567890",
  "age": 30,
  "gender": "male",
  "bloodGroup": "O+"
}
```

**Response:**
```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login User
**POST** `/users/login`

**Body (JSON):**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### 3. Get User Profile
**GET** `/users/profile`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### 4. Update User Profile
**PUT** `/users/profile`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "name": "John Smith",
  "phone": "+1234567890",
  "age": 31
}
```

---

## 👨‍⚕️ Doctor APIs

### 1. Get All Doctors
**GET** `/doctors`

**No authentication required**

### 2. Create Doctor Profile
**POST** `/doctors`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "specialization": "Cardiologist",
  "qualification": "MBBS, MD",
  "experience": 10,
  "consultationFee": 500,
  "availableSlots": [
    {
      "day": "Monday",
      "startTime": "09:00",
      "endTime": "17:00"
    },
    {
      "day": "Wednesday",
      "startTime": "09:00",
      "endTime": "17:00"
    }
  ],
  "hospital": "City Hospital",
  "address": "123 Main St, City"
}
```

### 3. Get Doctor by ID
**GET** `/doctors/:id`

**Example:**
```
GET /doctors/65abc123def456789
```

### 4. Update Doctor Profile
**PUT** `/doctors/:id`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "consultationFee": 600,
  "isAvailable": true
}
```

### 5. Search Doctors by Specialization
**GET** `/doctors/search/:specialization`

**Example:**
```
GET /doctors/search/cardio
```

### 6. Get Doctor by User ID
**GET** `/doctors/user/:userId`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📅 Appointment APIs

### 1. Create Appointment
**POST** `/appointments`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "doctorId": "65abc123def456789",
  "date": "2024-12-25",
  "time": "10:00",
  "reason": "Regular checkup",
  "symptoms": "Chest pain, shortness of breath"
}
```

### 2. Get My Appointments (Patient)
**GET** `/appointments/my-appointments`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### 3. Get Doctor Appointments
**GET** `/appointments/doctor-appointments`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Note:** User must be a doctor

### 4. Update Appointment Status (Doctor)
**PUT** `/appointments/:id/status`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "status": "confirmed",
  "prescription": "Tablet XYZ 10mg, twice daily",
  "diagnosis": "Hypertension",
  "notes": "Follow up in 2 weeks"
}
```

**Status options:** `pending`, `confirmed`, `rejected`, `completed`, `cancelled`

### 5. Cancel Appointment (Patient)
**PUT** `/appointments/:id/cancel`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### 6. Get Appointment by ID
**GET** `/appointments/:id`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### 7. Delete Appointment (Admin)
**DELETE** `/appointments/:id`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Note:** Admin only

---

## 📊 Health Records APIs

### 1. Create Health Record
**POST** `/records`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "bloodPressure": {
    "systolic": 120,
    "diastolic": 80
  },
  "sugarLevel": 100,
  "weight": 70,
  "heartRate": 72,
  "temperature": 98.6,
  "note": "Feeling good today"
}
```

**Response includes AI-generated health advice!**

### 2. Get My Health Records
**GET** `/records`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### 3. Get Health Statistics
**GET** `/records/stats/summary`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**
```json
{
  "totalRecords": 10,
  "latestRecord": {...},
  "averages": {
    "bloodPressure": {
      "systolic": 125,
      "diastolic": 82
    },
    "sugarLevel": 105,
    "weight": 71
  }
}
```

### 4. Get Patient Records (Doctor)
**GET** `/records/user/:userId`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Note:** Doctor only

### 5. Update Health Record
**PUT** `/records/:id`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "note": "Updated note"
}
```

### 6. Delete Health Record
**DELETE** `/records/:id`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### 7. Get All Records (Admin)
**GET** `/records/all`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Note:** Admin only

---

## 👥 Admin APIs

### 1. Get All Users
**GET** `/users`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Note:** Admin only

### 2. Delete User
**DELETE** `/users/:id`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Note:** Admin only

### 3. Get All Appointments
**GET** `/appointments`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Note:** Admin only

---

## 🧪 Postman Collection

### Quick Setup for Postman:

1. **Create Environment Variables:**
   - `base_url`: `http://localhost:5000/api`
   - `token`: (will be set automatically after login)

2. **Create a Collection** with these folders:
   - Authentication
   - Users
   - Doctors
   - Appointments
   - Health Records

3. **Add Tests Script** (for login/register):
```javascript
// In Tests tab of login/register request
pm.test("Save token", function() {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
});
```

4. **Set Authorization** for protected routes:
   - Type: Bearer Token
   - Token: `{{token}}`

---

## 🔍 Sample Test Flow

### 1. Register as Patient
```bash
POST {{base_url}}/users/register
```

### 2. Login
```bash
POST {{base_url}}/users/login
# Token saved automatically
```

### 3. Create Health Record
```bash
POST {{base_url}}/records
# See AI-generated advice in response!
```

### 4. Get Available Doctors
```bash
GET {{base_url}}/doctors
```

### 5. Book Appointment
```bash
POST {{base_url}}/appointments
```

### 6. Check Appointments
```bash
GET {{base_url}}/appointments/my-appointments
```

---

## 📝 cURL Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Health Record (with token)
```bash
curl -X POST http://localhost:5000/api/records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "bloodPressure": {"systolic": 120, "diastolic": 80},
    "sugarLevel": 100,
    "weight": 70
  }'
```

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "message": "Not authorized as admin"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error message",
  "stack": "..." // Only in development
}
```

---

## 🎯 Testing Checklist

- [ ] User registration
- [ ] User login
- [ ] Create health record
- [ ] View AI health advice
- [ ] Book appointment
- [ ] Doctor profile creation
- [ ] Doctor view appointments
- [ ] Doctor update appointment
- [ ] Admin view all users
- [ ] Admin delete user
- [ ] Get health statistics
- [ ] Search doctors

---

## 💡 Tips

1. **Save tokens**: After login/register, save the token for subsequent requests
2. **Check roles**: Some endpoints require specific roles (admin, doctor)
3. **Validate data**: Backend validates all inputs
4. **Test AI**: Make sure Claude API key is set to see AI advice
5. **MongoDB**: Ensure database is running before testing

---

**Happy Testing! 🧪**
