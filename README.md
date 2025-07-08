# Project Management System

A full-stack **Project & Task Management** application built with:

*  Node.js + Express (Backend)
*  React.js (Frontend)
*  JWT Authentication with Role-Based Access
*  MongoDB Atlas (Database)
*  Hosted on Render & Netlify

---

##  Project Structure

```
/client   → React frontend
/server   → Node.js + Express backend
```

---

##  Installation & Setup

###  Environment Variables

Create a `.env` file in `/server` with the following keys:

```bash
PORT=5000
MONGO_URI=your-mongodb-connection-uri
JWT_SECRET=your_jwt_secret_key
```

---

###  Backend (Server)

```bash
cd server
npm install
npm run dev
```

The server will start at:

```
http://localhost:5000
```

---

###  Frontend (Client)

```bash
cd client
npm install
npm start
```

The frontend will start at:

```
http://localhost:3000
```

---

##  Backend API Base URL (Production)

```
https://project-management-lohi.onrender.com/api
```

Frontend Live URL:

```
https://stately-biscuit-bc8790.netlify.app/
```

---

##  Test Credentials

| Email                                               | Password | Role     |
| --------------------------------------------------- | -------- | -------- |
| [admin@gmail.com](mailto:admin@example.com)       | admin123   | Admin    |
| [emp@gmail.com](mailto:manager@example.com)   | emp123   | Employee  |
| [manager@gmail.com](mailto:employee@example.com) | manager123   | Manager |

---

##  Role Permissions

| Role     | Can Manage Users | Can Manage Projects | Can Manage Tasks | View Assigned Tasks |
| -------- | ---------------- | ------------------- | ---------------- | ------------------- |
| Admin    | ✅ Yes            | ✅ Yes               | ✅ Yes            | ✅ Yes               |
| Manager  | ❌ No             | ✅ Yes               | ✅ Yes            | ✅ Yes               |
| Employee | ❌ No             | ❌ No                | ✅ Update Status  | ✅ Yes               |

## Deployment

* **Backend:** [Render.com](https://render.com/)
* **Frontend:** [Netlify.com](https://netlify.com/)

