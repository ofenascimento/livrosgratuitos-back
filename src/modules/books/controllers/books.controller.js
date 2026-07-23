const Livro = require('../../../models/Livro');
const User = require('../../../models/User');
const ReadingProgress = require('../../../models/ReadingProgress');
const slugify = require('slugify');
const catchAsync = require('../../../utils/catchAsync');
const NotFoundError = require('../../../utils/errors/NotFoundError');

exports.createLivro = catchAsync(async (req, res) => {
  const slug = slugify(req.body.titulo, { lower: true, strict: true });

  const livro = new Livro({
    titulo: req.body.titulo,
    autor: req.body.autor,
    descricao: req.body.descricao,
    categoria: req.body.categoria,
    capa: req.body.capa,
    txt: req.body.txt,
    pdf: req.body.pdf,
    epub: req.body.epub,
    urlHtml: req.body.urlHtml,
    slug,
    destaque: req.body.destaque,
    epubInfo: req.body.epubInfo,
  });

  const novoLivro = await livro.save();
  res.status(201).json(novoLivro);
});

exports.updateLivro = catchAsync(async (req, res) => {
  const fields = ['titulo', 'autor', 'descricao', 'categoria', 'capa', 'txt', 'pdf', 'epub'];

  fields.forEach((field) => {
    if (req.body[field] != null) {
      res.livro[field] = req.body[field];
    }
  });

  const livroAtualizado = await res.livro.save();
  res.json(livroAtualizado);
});

exports.deleteLivro = catchAsync(async (req, res) => {
  await res.livro.deleteOne();
  res.json({ message: 'Livro deletado' });
});

exports.getLivros = catchAsync(async (req, res) => {
  const matchQuery = {};

  if (req.query.titulo) {
    matchQuery.titulo = { $regex: new RegExp(req.query.titulo, 'i') };
  }
  if (req.query.categoria) {
    matchQuery.categoria = { $in: req.query.categoria.split(',') };
  }
  if (req.query.autor) {
    matchQuery.autor = req.query.autor;
  }
  if (req.query.destaque) {
    matchQuery.destaque = req.query.destaque === 'true';
  }

  const pipeline = [{ $match: matchQuery }];

  if (req.query.sort === 'true') {
    const size = req.query.q ? parseInt(req.query.q, 10) : 10;
    pipeline.push({ $sample: { size } });
  } else if (req.query.q) {
    const limit = parseInt(req.query.q, 10);
    pipeline.push({ $limit: limit });
  }

  const livros = await Livro.aggregate(pipeline);
  res.json(livros);
});

exports.getPublicLivros = catchAsync(async (req, res) => {
  const matchQuery = {};

  if (req.query.titulo) {
    matchQuery.titulo = { $regex: new RegExp(req.query.titulo, 'i') };
  }
  if (req.query.categoria) {
    matchQuery.categoria = { $in: req.query.categoria.split(',') };
  }
  if (req.query.autor) {
    matchQuery.autor = req.query.autor;
  }
  if (req.query.destaque) {
    matchQuery.destaque = req.query.destaque === 'true';
  }

  const pipeline = [
    { $match: matchQuery },
    {
      $project: {
        titulo: 1,
        autor: 1,
        descricao: 1,
        categoria: 1,
        capa: 1,
        urlHtml: { $ifNull: ['$urlHtml', null] },
        slug: { $ifNull: ['$slug', null] },
      },
    },
  ];

  if (req.query.sort === 'true') {
    const size = req.query.q ? parseInt(req.query.q, 10) : 10;
    pipeline.push({ $sample: { size } });
  } else if (req.query.q) {
    const limit = parseInt(req.query.q, 10);
    pipeline.push({ $limit: limit });
  }

  const livros = await Livro.aggregate(pipeline);
  res.json(livros);
});

exports.getLivrosComPdf = catchAsync(async (req, res) => {
  const livrosComPdf = await Livro.find({
    pdf: { $exists: true, $ne: '' },
  }).select('titulo autor descricao categoria capa pdf slug');

  res.json(livrosComPdf);
});

exports.getLivro = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId).populate('readingList');

  if (!user) throw new NotFoundError('Usuário não encontrado.');

  const livroId = res.livro._id;

  const progressItem = user.readingProgress.find((item) => item.bookId.equals(livroId));

  const epubProgress = await ReadingProgress.findOne({
    userId: req.user.id,
    livroId,
  });

  const livroData = res.livro.toObject ? res.livro.toObject() : res.livro;
  const isFavorite = user.favoriteBooks.includes(livroId);
  const isFinished = user.finishedBooks.includes(livroId);

  const response = {
    ...livroData,
    isFavorite,
    isFinished,
    progressPercentage: progressItem?.progressPercentage,
    progress: progressItem?.progress,
    currentParagraph: progressItem?.currentParagraph,
    epubProgress,
  };

  res.json(response);
});

exports.getPublicLivro = catchAsync(async (req, res) => {
  const response = {
    titulo: res.livro.titulo,
    autor: res.livro.autor,
    descricao: res.livro.descricao,
    categoria: res.livro.categoria,
    capa: res.livro.capa,
    txt: res.livro.txt,
    pdf: res.livro.pdf,
    epub: res.livro.epub,
    _id: res.livro.id,
    epubInfo: res.livro.epubInfo,
  };

  if (res.livro.urlHtml) response.urlHtml = res.livro.urlHtml;
  if (res.livro.slug) response.slug = res.livro.slug;

  res.json(response);
});

exports.getBookBySlug = catchAsync(async (req, res) => {
  const { userId, slug } = req.params;

  const livro = await Livro.findOne({ slug });
  if (!livro) throw new NotFoundError('Livro não encontrado');

  const user = await User.findById(userId).populate('readingList');
  if (!user) throw new NotFoundError('Usuário não encontrado');

  const progressItem = user.readingProgress.find((item) => item.bookId.equals(livro._id));

  const isFavorite = user.favoriteBooks.includes(livro._id);
  const isFinished = user.finishedBooks.includes(livro._id);

  const response = {
    ...livro.toObject(),
    isFavorite,
    isFinished,
    progressPercentage: progressItem?.progressPercentage,
    progress: progressItem?.progress,
    currentParagraph: progressItem?.currentParagraph,
  };

  res.json(response);
});