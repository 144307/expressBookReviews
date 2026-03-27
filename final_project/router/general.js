// @ts-nocheck
const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username: username, password: password });

  return res.status(201).json({ message: "User successfully registered" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return Promise.resolve(books)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(500).json({ message: error.message }));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const id = Number.parseInt(req.params.isbn);
  if (!id) {
    return res.status(404).json({ message: "no id provided" });
  }

  return Promise.resolve(books[id])
    .then((details) => {
      if (!details) {
        return res
          .status(404)
          .json({ message: `items with id ${id} doesn't exists` });
      }
      return res.status(200).json(details);
    })
    .catch((error) => res.status(500).json({ message: error.message }));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const parsed = req.params.author;
  if (!parsed) {
    return res.status(404).json({ message: `author "${parsed}" not found` });
  }
  const booksByAuthor = Object.values(books).filter(
    (value) => value.author.localeCompare(parsed) === 0,
  );
  if (booksByAuthor.length > 0) {
    return res.status(200).json({ books: booksByAuthor });
  }
  return res.status(404).json({ message: "No found" });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const parsed = req.params.title;
  if (!parsed) {
    return res.status(404).json({ message: `title "${parsed}" not found` });
  }
  const booksByTitle = Object.values(books).filter(
    (value) => value.title.localeCompare(parsed) === 0,
  );
  if (booksByTitle.length > 0) {
    return res.status(200).json({ books: booksByTitle });
  }
  return res.status(404).json({ message: "Not found" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const id = Number.parseInt(req.params.isbn);
  if (!id) {
    return res.status(404).json({ message: "no id provided" });
  }
  const reviews = books[id];
  return res.status(200).json({ reviews: reviews });
});

module.exports.general = public_users;
