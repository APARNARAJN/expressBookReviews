const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;
  
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
  
    // Check if user already exists
    if (isValid(username)) {
      return res.status(409).json({ message: "User already exists" });
    }
  
    // Add new user
    users.push({ username: username, password: password });
  
    return res.status(200).json({ message: "User successfully registered" });
  });
  

// Get the book list available in the shop
public_users.get('/promisebooks', function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books);
  })
    .then(data => res.status(200).json(data))
    .catch(err => res.status(500).json({ message: "Error fetching books" }));
});


// Get book details based on ISBN
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

  
// Get book details based on author
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  const bookKeys = Object.keys(books);
  let filteredBooks = {};

  bookKeys.forEach(key => {
    if (books[key].author === author) {
      filteredBooks[key] = books[key];
    }
  });

  if (Object.keys(filteredBooks).length > 0) {
    return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});


// Get all books based on title
// Get book details based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  const bookKeys = Object.keys(books);
  let filteredBooks = {};

  bookKeys.forEach(key => {
    if (books[key].title === title) {
      filteredBooks[key] = books[key];
    }
  });

  if (Object.keys(filteredBooks).length > 0) {
    return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
// Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});


module.exports.general = public_users;
