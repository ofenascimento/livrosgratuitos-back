const slugify = require('slugify');
const booksRepository = require('../repositories/books.repository');
const User = require('../../../models/User');
const ReadingProgress = require('../../../models/ReadingProgress');
const NotFoundError = require('../../../utils/errors/NotFoundError');

function buildMatchQuery(query) {
  const matchQuery = {};
  if (query.titulo) matchQuery.titulo = { $regex: new RegExp(query.titulo, 'i') };
  if (query.categoria) matchQuery.categoria = { $in: query.categoria.split(',') };
  if (query.autor) matchQuery.autor = query.autor;
  if (query.destaque) matchQuery.destaque = query.destaque === 'true';
  return matchQuery;
}

function applySortOrLimit(pipeline, query) {
  if (query.sort === 'true') {
    const size = query.q ? parseInt(query.q, 10) : 10;
    pipeline.push({ $sample: { size } });
  } else if (query.q) {
    const limit = parseInt(query.q, 10);
    pipeline.push({ $limit: limit });
  }
}

exports.createLivro = (body) => {
  const slug = slugify(body.titulo, { lower: true, strict: true });

  return booksRepository.create({
    titulo: body.titulo,
    autor: body.autor,
    descricao: body.descricao,
    categoria: body.categoria,
    capa: body.capa,
    txt: body.txt,
    pdf: body.pdf,
    epub: body.epub,
    urlHtml: body.urlHtml,
    slug,
    destaque: body.destaque,
    epubInfo: body.epubInfo,
  });
};

exports.updateLivro = (livroDoc, body) => {
  const fields = ['titulo', 'autor', 'descricao', 'categoria', 'capa', 'txt', 'pdf', 'epub'];

  fields.forEach((field) => {
    if (body[field] != null) {
      livroDoc[field] = body[field];
    }
  });

  return booksRepository.save(livroDoc);
};

exports.deleteLivro = (livroDoc) => booksRepository.deleteOne(livroDoc);

exports.getLivros = (query) => {
  const pipeline = [{ $match: buildMatchQuery(query) }];
  applySortOrLimit(pipeline, query);
  return booksRepository.aggregate(pipeline);
};

exports.getPublicLivros = (query) => {
  const pipeline = [
    { $match: buildMatchQuery(query) },
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
  applySortOrLimit(pipeline, query);
  return booksRepository.aggregate(pipeline);
};

exports.getLivrosComPdf = () => booksRepository.findWithPdf();

exports.getPublicLivro = (livroDoc) => {
  const response = {
    titulo: livroDoc.titulo,
    autor: livroDoc.autor,
    descricao: livroDoc.descricao,
    categoria: livroDoc.categoria,
    capa: livroDoc.capa,
    txt: livroDoc.txt,
    pdf: livroDoc.pdf,
    epub: livroDoc.epub,
    _id: livroDoc.id,
    epubInfo: livroDoc.epubInfo,
  };

  if (livroDoc.urlHtml) response.urlHtml = livroDoc.urlHtml;
  if (livroDoc.slug) response.slug = livroDoc.slug;

  return response;
};

exports.getLivro = async (livroDoc, userId, authenticatedUserId) => {
  const user = await User.findById(userId).populate('readingList');
  if (!user) throw new NotFoundError('Usuário não encontrado.');

  const livroId = livroDoc._id;
  const progressItem = user.readingProgress.find((item) => item.bookId.equals(livroId));

  const epubProgress = await ReadingProgress.findOne({
    userId: authenticatedUserId,
    livroId,
  });

  const livroData = livroDoc.toObject ? livroDoc.toObject() : livroDoc;
  const isFavorite = user.favoriteBooks.includes(livroId);
  const isFinished = user.finishedBooks.includes(livroId);

  return {
    ...livroData,
    isFavorite,
    isFinished,
    progressPercentage: progressItem?.progressPercentage,
    progress: progressItem?.progress,
    currentParagraph: progressItem?.currentParagraph,
    epubProgress,
  };
};

exports.getBookBySlug = async (slug, userId) => {
  const livro = await booksRepository.findBySlug(slug);
  if (!livro) throw new NotFoundError('Livro não encontrado');

  const user = await User.findById(userId).populate('readingList');
  if (!user) throw new NotFoundError('Usuário não encontrado');

  const progressItem = user.readingProgress.find((item) => item.bookId.equals(livro._id));
  const isFavorite = user.favoriteBooks.includes(livro._id);
  const isFinished = user.finishedBooks.includes(livro._id);

  return {
    ...livro.toObject(),
    isFavorite,
    isFinished,
    progressPercentage: progressItem?.progressPercentage,
    progress: progressItem?.progress,
    currentParagraph: progressItem?.currentParagraph,
  };
};