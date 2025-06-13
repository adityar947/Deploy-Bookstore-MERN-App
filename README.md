# 📚 Bookstore API

A simple RESTful API built with **Express**, **MongoDB**, and **JWT** authentication. It supports book CRUD operations, user registration, login, and protected routes.

---

## 🚀 Features

- User authentication with hashed passwords (`bcryptjs`)
- JWT-based login system
- CRUD operations for books
- Search books by author (case-insensitive)
- CORS-enabled for frontend integration
- MongoDB (via Mongoose) for data storage

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- bcryptjs
- jsonwebtoken
- CORS

---

## 📦 Installation

1. **Clone the repo:**

```bash
git clone https://github.com/adityar947/Deploy-Bookstore-MERN-App.git
cd Deploy-Bookstore-MERN-App
```

Install dependencies:

```
npm install
```

Create .env file:

Create a .env file in the root directory:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
FRONTEND_ORIGIN=https://your-frontend-url.com
JWT_SECRET=your_jwt_secret_key
```

Run the server:

```
npm start
Server will run on:
http://localhost:3000
```

📚 API Endpoints

🔐 Authentication
```
POST /signup – Create new user

POST /login – Login and receive JWT token
```

📘 Book Management
```
GET /books – List all books

POST /books – Add a book

PUT /books/:id – Edit a book

DELETE /books/:id – Delete a book

GET /search?author=xyz – Search books by author
```

📘 Books
```
GET /books – Get all books

GET /books/:id – Get book by ID

POST /books – Add new book

PUT /books/:id – Update book by ID

DELETE /books/:id – Delete book by ID

GET /search?author=name – Search books by author
```

🌐 CORS Configuration
The API allows requests only from the frontend defined in FRONTEND_ORIGIN in your .env:

```
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Frontend Setup**
The index.html is a simple static file with embedded JavaScript. It depends on the backend API URL, which is loaded via a config.json file.

Create build/config.json
```
{
  "API_BASE": "https://backend-express-iohh.onrender.com"
}
```
This avoids hardcoding the API URL in the HTML file. Make sure this file is accessible in the same folder where index.html lives.

🛡️ Security Notes
Never expose .env or hardcode secrets like MongoDB URIs or JWT keys in code.
Always use .env config.json or environment variables to manage URLs and secrets securely.

📁 Folder Structure
```
.
├── server.js
├── package.json
├── .env             # (not committed)
└── README.md
```

📄 License
MIT License

✍️ Author
Aditya Ranjan
