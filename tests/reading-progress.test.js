const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../src/app');
const ReadingProgress = require('../src/models/ReadingProgress');
const Book = require('../src/models/Book');

function generateToken(userId) {
  return jwt.sign({ _id: userId }, process.env.TOKEN_SECRET);
}

describe('Reading Progress', () => {
  let userId;
  let bookId;
  let token;

  beforeEach(async () => {
    userId = new mongoose.Types.ObjectId();
    token = generateToken(userId);

    const book = await Book.create({
      title: 'Livro de Teste',
      author: 'Autor de Teste',
      slug: 'livro-de-teste',
    });
    bookId = book._id;
  });

  test('POST /reading-progress cria progresso novo', async () => {
    const res = await request(app)
      .post('/reading-progress')
      .set('Authorization', `Bearer ${token}`)
      .send({
        bookId,
        progressPercentage: 42,
        currentCfi: 'epubcfi(/6/2!/4)',
      });

    expect(res.status).toBe(200);
    expect(res.body.progressPercentage).toBe(42);
    expect(res.body.currentCfi).toBe('epubcfi(/6/2!/4)');
  });

  test('POST /reading-progress atualiza progresso existente (upsert)', async () => {
    await ReadingProgress.create({
      userId,
      bookId,
      progressPercentage: 10,
    });

    const res = await request(app)
      .post('/reading-progress')
      .set('Authorization', `Bearer ${token}`)
      .send({ bookId, progressPercentage: 90 });

    expect(res.status).toBe(200);
    expect(res.body.progressPercentage).toBe(90);

    const count = await ReadingProgress.countDocuments({ userId, bookId });
    expect(count).toBe(1); // confirma que fez update, não criou duplicado
  });

  test('GET /reading-progress/:bookId retorna null se não houver progresso', async () => {
    const res = await request(app)
      .get(`/reading-progress/${bookId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeNull();
  });

  test('POST /reading-progress sem token retorna 401', async () => {
    const res = await request(app)
      .post('/reading-progress')
      .send({ bookId, progressPercentage: 50 });

    expect(res.status).toBe(401);
  });
});