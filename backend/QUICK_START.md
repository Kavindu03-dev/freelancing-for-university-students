# 🚀 Quick Start Guide - Get Signup Backend Working in 5 Minutes

## **Prerequisites**
- Node.js installed (v14 or higher)
- MongoDB installed and running
- Git (to clone the project)

## **Step 1: Setup Environment (1 minute)**

### 1.1 Create Environment File
```bash
cd backend
```

Create a `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/flexihire
JWT_SECRET=your_super_secret_key_123
PORT=5000
```

### 1.2 Install Dependencies
```bash
npm install
```

## **Step 2: Setup Database (2 minutes)**

### 2.1 Start MongoDB
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### 2.2 Seed Database
```bash
# Create admin user
npm run seed:admin

# Create test users
npm run seed:users
```

**Expected Output:**
```
✅ Admin user created successfully!
📧 Email: admin@flexihire.com
🔑 Password: admin123

✅ Test users created successfully!
📚 Student User: student@university.edu / password123
💼 Job Seeker User: client@company.com / password123
👨‍🏫 University Staff User: staff@university.edu / password123
```

## **Step 3: Start Backend Server (1 minute)**

```bash
npm run dev
```

**Expected Output:**
```
Server is running on port 5000
```

## **Step 4: Test Backend (1 minute)**

```bash
# In a new terminal
npm run test:api
```

**Expected Output:**
```
🚀 Starting API Tests...

🧪 Testing Signup API...
✅ Signup successful!

🔐 Testing Login API...
✅ Login successful!

👑 Testing Admin Login API...
✅ Admin login successful!

✨ API Tests completed!
```

## **🎉 You're Done!**

Your signup backend is now working! Users can:
- ✅ Register as Students, Job Seekers, or University Staff
- ✅ Login with their credentials
- ✅ Access role-based dashboards

## **🔧 Test the Frontend**

1. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Test Signup:**
   - Go to `/signup`
   - Fill out the form
   - Submit and check browser Network tab
   - Should see request to `http://localhost:5000/api/auth/signup`

3. **Test Login:**
   - Go to `/signin`
   - Use test credentials from step 2
   - Should redirect to appropriate dashboard

## **📱 Test Credentials**

| User Type | Email | Password | Dashboard |
|-----------|-------|----------|-----------|
| **Admin** | `admin@flexihire.com` | `admin123` | `/admin/dashboard` |
| **Student** | `student@university.edu` | `password123` | `/student/dashboard` |
| **Job Seeker** | `client@company.com` | `password123` | `/client/dashboard` |
| **University Staff** | `staff@university.edu` | `password123` | `/staff/dashboard` |

## **🚨 If Something Goes Wrong**

### **Common Issues & Quick Fixes:**

1. **"MongoDB connection failed"**
   ```bash
   # Start MongoDB
   net start MongoDB  # Windows
   sudo systemctl start mongod  # macOS/Linux
   ```

2. **"Port 5000 already in use"**
   ```bash
   # Find and kill process
   netstat -ano | findstr :5000  # Windows
   lsof -i :5000  # macOS/Linux
   ```

3. **"API tests failing"**
   ```bash
   # Reset database
   npm run seed:admin
   npm run seed:users
   ```

4. **"Frontend not connecting"**
   - Check if backend is running on port 5000
   - Verify CORS is working (already configured)
   - Check browser console for errors

## **🔍 Verify Everything is Working**

### **Backend Health Check:**
```bash
curl http://localhost:5000/
# Should return: {"message":"Welcome to Freelancing for University Students API"}
```

### **Database Check:**
```bash
mongosh
use flexihire
db.users.find().count()
# Should show number of users (admin + test users)
```

### **Frontend Check:**
- Open browser to `http://localhost:3000`
- Fill out signup form
- Check Network tab for successful API calls
- Verify user appears in database

## **📚 Next Steps**

Once everything is working:
1. **Customize User Fields:** Modify `backend/models/User.js`
2. **Add Validation:** Enhance `backend/controllers/authController.js`
3. **Implement Email Verification:** Add email service
4. **Add Password Reset:** Implement forgot password functionality
5. **Enhance Security:** Add rate limiting, input sanitization

## **🆘 Still Having Issues?**

Run the troubleshooting guide:
```bash
# Check the detailed troubleshooting guide
cat TROUBLESHOOTING.md
```

Or run a complete reset:
```bash
# Stop all processes
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Reset database
npm run seed:admin
npm run seed:users

# Start fresh
npm run dev
```

---

**🎯 Goal:** Get signup data flowing from frontend to database in under 5 minutes!

**✅ Success Criteria:** 
- Backend server running on port 5000
- API tests passing
- Frontend can register new users
- Users appear in MongoDB database

