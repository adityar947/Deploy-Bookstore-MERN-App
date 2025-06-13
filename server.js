const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware for logging requests - place this **before** routes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// MongoDB connection (remove deprecated options)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Mongoose schema and model for books
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true }
});

const Book = mongoose.model('Book', bookSchema);

// Mongoose schema and model for users
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// ========== Book routes ==========

// GET all books
app.get('/books', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// GET book by id
app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).send("Book not found");
    res.json(book);
  } catch {
    res.status(400).send("Invalid book ID");
  }
});

// POST add new book
app.post('/books', async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PUT update book by id
app.put('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, author: req.body.author },
      { new: true, runValidators: true }
    );
    if (!book) return res.status(404).send("Book not found");
    res.json(book);
  } catch {
    res.status(400).send("Invalid book ID or data");
  }
});

// DELETE book by id
app.delete('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).send("Book not found");
    res.json(book);
  } catch {
    res.status(400).send("Invalid book ID");
  }
});

// Search books by author
app.get('/search', async (req, res) => {
  const author = req.query.author;
  if (!author) return res.status(400).send("Author query parameter is required");
  const regex = new RegExp(author, 'i'); // case-insensitive
  const filtered = await Book.find({ author: regex });
  res.json(filtered);
});

// ========== Auth routes ==========

// Signup route
app.post('/signup', async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);
    const user = new User({ email: req.body.email, password: hashed });
    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("User not found");

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.status(401).send("Invalid credentials");
    const jwtSecret = process.env.JWT_SECRET;
    const token = jwt.sign({ userId: user._id }, jwtSecret); // Use env var for secret in prod
    res.json({ token });
  } catch {
    res.status(500).send("Server error");
  }
});

// Start server
app.listen(port, () => {
  console.log(`Bookstore API is running at http://localhost:${port}`);
});
