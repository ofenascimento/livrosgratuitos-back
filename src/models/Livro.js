const mongoose = require("mongoose");

const livroSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  autor: {
    type: String,
    required: true
  },
  descricao: String,
  categoria: [String],
  capa: String,
  txt: String,
  pdf: String,
  epub: String,
  urlHtml: String,
  slug: {
    type: String,
    required: true,
    unique: true
  },
  destaque: {
    type: Boolean,
    default: false
  },
  epubInfo: {
    font: String,
    fontLink: String,
    license: String,
    licenseLink: String,
    modified: String
  }
});

const Livro = mongoose.model('Livro', livroSchema);

module.exports = Livro;
