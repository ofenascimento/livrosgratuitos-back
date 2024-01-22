const mongoose = require("mongoose")

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
  categoria: String,
  urlCapa: String,
  urlConteudo: String,
})

const Livro = mongoose.model('Livro', livroSchema)

module.exports = Livro