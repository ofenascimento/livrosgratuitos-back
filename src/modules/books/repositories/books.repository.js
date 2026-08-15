const Book = require('../../../models/Book');

exports.create = (data) => new Book(data).save();

exports.findBySlug = (slug) => Book.findOne({ slug });

exports.findWithPdf = () =>
  Book.find({ pdf: { $exists: true, $ne: '' } }).select(
    'title author description categories cover pdf slug'
  );

exports.aggregate = (pipeline) => Book.aggregate(pipeline);

exports.save = (bookDoc) => bookDoc.save();

exports.deleteOne = (bookDoc) => bookDoc.deleteOne();