const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  description: String,
  categories: [String],
  cover: String,
  txt: String,
  pdf: String,
  epub: String,
  htmlUrl: String,
  slug: {
    type: String,
    required: true,
    unique: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  epubInfo: {
    font: String,
    fontLink: String,
    license: String,
    licenseLink: String,
    modified: String,
    translatedByAI: Boolean
  }
});

const Book = mongoose.model('Book', bookSchema, 'books');

module.exports = Book;