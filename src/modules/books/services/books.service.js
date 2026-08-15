const slugify = require('slugify');
const booksRepository = require('../repositories/books.repository');
const User = require('../../../models/User');
const ReadingProgress = require('../../../models/ReadingProgress');
const NotFoundError = require('../../../utils/errors/NotFoundError');

function buildMatchQuery(query) {
  const matchQuery = {};
  if (query.title) matchQuery.title = { $regex: new RegExp(query.title, 'i') };
  if (query.categories) matchQuery.categories = { $in: query.categories.split(',') };
  if (query.author) matchQuery.author = query.author;
  if (query.featured) matchQuery.featured = query.featured === 'true';
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

exports.createBook = (body) => {
  const slug = slugify(body.title, { lower: true, strict: true });

  return booksRepository.create({
    title: body.title,
    author: body.author,
    description: body.description,
    categories: body.categories,
    cover: body.cover,
    txt: body.txt,
    pdf: body.pdf,
    epub: body.epub,
    htmlUrl: body.htmlUrl,
    slug,
    featured: body.featured,
    epubInfo: body.epubInfo,
  });
};

exports.updateBook = (bookDoc, body) => {
  const fields = ['title', 'author', 'description', 'categories', 'cover', 'txt', 'pdf', 'epub'];

  fields.forEach((field) => {
    if (body[field] != null) {
      bookDoc[field] = body[field];
    }
  });

  return booksRepository.save(bookDoc);
};

exports.deleteBook = (bookDoc) => booksRepository.deleteOne(bookDoc);

exports.getBooks = (query) => {
  const pipeline = [{ $match: buildMatchQuery(query) }];
  applySortOrLimit(pipeline, query);
  return booksRepository.aggregate(pipeline);
};

exports.getPublicBooks = (query) => {
  const pipeline = [
    { $match: buildMatchQuery(query) },
    {
      $project: {
        title: 1,
        author: 1,
        description: 1,
        categories: 1,
        cover: 1,
        htmlUrl: { $ifNull: ['$htmlUrl', null] },
        slug: { $ifNull: ['$slug', null] },
      },
    },
  ];
  applySortOrLimit(pipeline, query);
  return booksRepository.aggregate(pipeline);
};

exports.getBooksWithPdf = () => booksRepository.findWithPdf();

exports.getPublicBook = (bookDoc) => {
  const response = {
    title: bookDoc.title,
    author: bookDoc.author,
    description: bookDoc.description,
    categories: bookDoc.categories,
    cover: bookDoc.cover,
    txt: bookDoc.txt,
    pdf: bookDoc.pdf,
    epub: bookDoc.epub,
    _id: bookDoc.id,
    epubInfo: bookDoc.epubInfo,
  };

  if (bookDoc.htmlUrl) response.htmlUrl = bookDoc.htmlUrl;
  if (bookDoc.slug) response.slug = bookDoc.slug;

  return response;
};

exports.getBook = async (bookDoc, userId, authenticatedUserId) => {
  const user = await User.findById(userId).populate('readingList');
  if (!user) throw new NotFoundError('Usuário não encontrado.');

  const bookId = bookDoc._id;

  const epubProgress = await ReadingProgress.findOne({
    userId: authenticatedUserId,
    bookId,
  });

  const bookData = bookDoc.toObject ? bookDoc.toObject() : bookDoc;
  const isFavorite = user.favoriteBooks.includes(bookId);
  const isFinished = user.finishedBooks.includes(bookId);

  return {
    ...bookData,
    isFavorite,
    isFinished,
    epubProgress,
  };
};

exports.getBookBySlug = async (slug, userId) => {
  const book = await booksRepository.findBySlug(slug);
  if (!book) throw new NotFoundError('Livro não encontrado');

  const user = await User.findById(userId).populate('readingList');
  if (!user) throw new NotFoundError('Usuário não encontrado');

  const isFavorite = user.favoriteBooks.includes(book._id);
  const isFinished = user.finishedBooks.includes(book._id);

  return {
    ...book.toObject(),
    isFavorite,
    isFinished,
  };
};