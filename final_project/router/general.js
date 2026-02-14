const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

/* ================= REGISTER ================= */

public_users.post("/register", (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });

  return res.status(200).json({ message: "User successfully registered" });
});


/* =====================================================
   TASK 10 - Get All Books using Axios (async/await)
===================================================== */

public_users.get('/axios/books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch books" });
  }
});


/* =====================================================
   TASK 11 - Get Book by ISBN using Axios
===================================================== */

public_users.get('/axios/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/isbn/${req.params.isbn}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "Book not found" });
  }
});


/* =====================================================
   TASK 12 - Get Book by Author using Axios
===================================================== */

public_users.get('/axios/author/:author', async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/author/${req.params.author}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "No books found for this author" });
  }
});


/* =====================================================
   TASK 13 - Get Book by Title using Axios
===================================================== */

public_users.get('/axios/title/:title', async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/title/${req.params.title}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "No books found with this title" });
  }
});


/* ================= ORIGINAL ROUTES ================= */

// Get all books
public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});

// Get book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (book) return res.status(200).json(book);
  return res.status(404).json({ message: "Book not found" });
});

// Get book by author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  let filtered = {};

  Object.keys(books).forEach(key => {
    if (books[key].author === author) {
      filtered[key] = books[key];
    }
  });

  if (Object.keys(filtered).length > 0)
    return res.status(200).json(filtered);

  return res.status(404).json({ message: "No books found for this author" });
});

// Get book by title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  let filtered = {};

  Object.keys(books).forEach(key => {
    if (books[key].title === title) {
      filtered[key] = books[key];
    }
  });

  if (Object.keys(filtered).length > 0)
    return res.status(200).json(filtered);

  return res.status(404).json({ message: "No books found with this title" });
});

// Get reviews
public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (book) return res.status(200).json(book.reviews);
  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
