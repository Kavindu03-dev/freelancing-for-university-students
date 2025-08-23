# Troubleshooting Guide - Signup Backend Issues

## 🚨 **Problem: Signup Data Not Going to Database**

If your signup form is not sending data to the database, follow these troubleshooting steps:

## **Step 1: Check Backend Server Status**

### 1.1 Verify Server is Running
```bash
cd backend
npm run dev
```

**Expected Output:**
```
Server is running on port 5000
```

**If Error Occurs:**
- Check if MongoDB is running
- Verify `.env` file exists with correct `MONGODB_URI`
- Check if port 5000 is available

### 1.2 Check MongoDB Connection
```bash
# In a new terminal, check if MongoDB is running
mongosh
# or
mongo
```

**If MongoDB is not running:**
```bash
# Start MongoDB (Windows)
net start MongoDB

# Start MongoDB (macOS/Linux)
sudo systemctl start mongod
```

## **Step 2: Test Backend API Endpoints**

### 2.1 Run API Tests
```bash
cd backend
npm run test:api
```

**Expected Output:**
```
🚀 Starting API Tests...

🧪 Testing Signup API...
✅ Signup successful!
   User ID: [some_id]
   Token: Generated

🔐 Testing Login API...
✅ Login successful!
   User Type: student
   Name: Test User

👑 Testing Admin Login API...
✅ Admin login successful!
   Admin ID: [some_id]
   Token: Generated

✨ API Tests completed!
```

**If Tests Fail:**
- Check server logs for errors
- Verify database connection
- Check if seed scripts ran successfully

### 2.2 Manual API Testing with cURL
```bash
# Test signup endpoint
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "password123",
    "userType": "student",
    "agreeToTerms": true,
    "degreeProgram": "Computer Science",
    "university": "University of Colombo"
  }'

# Test login endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## **Step 3: Check Frontend-Backend Connection**

### 3.1 Verify Frontend is Calling Backend
Open browser Developer Tools (F12):
1. Go to **Network** tab
2. Fill out and submit signup form
3. Look for request to `http://localhost:5000/api/auth/signup`

**If No Request Found:**
- Frontend is not calling backend
- Check browser console for JavaScript errors
- Verify frontend code changes were saved

**If Request Found But Fails:**
- Check **Response** tab for error details
- Common issues: CORS, validation errors, database connection

### 3.2 Check Browser Console for Errors
Look for:
- Network errors (CORS, connection refused)
- JavaScript errors
- Validation errors

## **Step 4: Database Issues**

### 4.1 Check Database Connection
```bash
# In backend directory, check .env file
cat .env

# Should contain:
MONGODB_URI=mongodb://localhost:27017/flexihire
JWT_SECRET=your_secret_key_here
```

### 4.2 Verify Database Exists
```bash
mongosh
use flexihire
show collections
db.users.find().limit(1)
```

**Expected Output:**
```
switched to db flexihire
[collection names]
[user documents]
```

### 4.3 Reset Database (if needed)
```bash
cd backend
npm run seed:admin
npm run seed:users
```

## **Step 5: Common Error Solutions**

### 5.1 CORS Errors
**Error:** `Access to fetch at 'http://localhost:5000/api/auth/signup' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution:** CORS is already configured in `server.js`. If still having issues:
1. Restart backend server
2. Check if frontend is running on different port
3. Verify CORS middleware is loaded before routes

### 5.2 Validation Errors
**Error:** `Registration failed: [specific field] is required`

**Solution:** Check frontend form data:
1. Ensure all required fields are filled
2. Check field names match backend expectations
3. Verify `userType` is one of: `student`, `jobSeeker`, `universityStaff`

### 5.3 Database Connection Errors
**Error:** `MongoServerError: connect ECONNREFUSED 127.0.0.1:27017`

**Solution:**
1. Start MongoDB service
2. Check MongoDB configuration
3. Verify connection string in `.env`

### 5.4 Port Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000
# or (Windows)
netstat -ano | findstr :5000

# Kill the process
kill -9 [PID]
# or (Windows)
taskkill /PID [PID] /F
```

## **Step 6: Frontend Code Verification**

### 6.1 Check Signup Form Submission
In `frontend/src/pages/Signup.jsx`, verify:
```javascript
const handleSubmit = async (e) => {
  // ... validation code ...
  
  try {
    const signupData = {
      ...formData,
      userType,
      technicalSkills: selectedSkills,
      agreeToTerms: acceptedTerms,
      agreeToMarketing: formData.agreeToMarketing || false
    };

    // Remove confirmPassword as it's not needed by backend
    delete signupData.confirmPassword;

    // Make API call to backend
    const response = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData)
    });

    const result = await response.json();
    // ... handle response ...
  } catch (error) {
    // ... handle errors ...
  }
};
```

### 6.2 Check Login Form Submission
In `frontend/src/pages/Login.jsx`, verify:
```javascript
const handleSubmit = async (e) => {
  // ... validation code ...
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      })
    });

    const result = await response.json();
    // ... handle response ...
  } catch (error) {
    // ... handle errors ...
  }
};
```

## **Step 7: Environment Setup Verification**

### 7.1 Required Environment Variables
```env
# backend/.env
MONGODB_URI=mongodb://localhost:27017/flexihire
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

### 7.2 Required Dependencies
```bash
cd backend
npm install

# Verify these packages are installed:
# - express
# - mongoose
# - bcryptjs
# - jsonwebtoken
# - dotenv
# - cors (or custom CORS middleware)
```

## **Step 8: Testing Checklist**

- [ ] Backend server is running on port 5000
- [ ] MongoDB is running and accessible
- [ ] Database connection is successful
- [ ] Seed scripts ran without errors
- [ ] API tests pass (`npm run test:api`)
- [ ] Frontend is calling backend endpoints
- [ ] No CORS errors in browser console
- [ ] Form validation passes
- [ ] Database contains new user records

## **Step 9: Still Having Issues?**

If you've completed all steps and still have problems:

1. **Check Server Logs:** Look for detailed error messages in backend console
2. **Check Browser Network Tab:** Verify request/response details
3. **Check Database Logs:** Look for MongoDB connection issues
4. **Verify Ports:** Ensure no conflicts between frontend/backend ports
5. **Restart Everything:** Sometimes a fresh start resolves issues

## **Quick Fix Commands**

```bash
# Complete reset and restart
cd backend
npm install
npm run seed:admin
npm run seed:users
npm run dev

# In another terminal
cd frontend
npm install
npm run dev
```

## **Need More Help?**

If you're still experiencing issues:
1. Check the error messages in detail
2. Verify all code changes were applied correctly
3. Ensure MongoDB is properly installed and running
4. Check if there are any firewall or antivirus blocking connections

