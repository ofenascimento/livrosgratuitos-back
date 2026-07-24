const Livro = require('../../../models/Livro');

exports.create = (data) => new Livro(data).save();

exports.findBySlug = (slug) => Livro.findOne({ slug });

exports.findWithPdf = () =>
  Livro.find({ pdf: { $exists: true, $ne: '' } }).select(
    'titulo autor descricao categoria capa pdf slug'
  );

exports.aggregate = (pipeline) => Livro.aggregate(pipeline);

exports.save = (livroDoc) => livroDoc.save();

exports.deleteOne = (livroDoc) => livroDoc.deleteOne();