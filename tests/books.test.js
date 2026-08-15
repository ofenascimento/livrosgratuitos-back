const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const Book = require('../src/models/Book');

function generateAdminToken() {
  return jwt.sign({ _id: 'admin123', isAdmin: true }, process.env.TOKEN_SECRET);
}

function generateUserToken() {
  return jwt.sign({ _id: 'user123', isAdmin: false }, process.env.TOKEN_SECRET);
}

describe('Books', () => {
  let adminToken;
  let userToken;

  beforeEach(() => {
    adminToken = generateAdminToken();
    userToken = generateUserToken();
  });

  describe('POST /books', () => {
    test('admin cria livro com sucesso e gera slug automaticamente', async () => {
      const res = await request(app)
        .post('/books')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Dom Casmurro', author: 'Machado de Assis' });

      expect(res.status).toBe(201);
      expect(res.body.slug).toBe('dom-casmurro');
      expect(res.body.title).toBe('Dom Casmurro');
    });

    test('usuário comum não pode criar livro (403)', async () => {
      const res = await request(app)
        .post('/books')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'Dom Casmurro', author: 'Machado de Assis' });

      expect(res.status).toBe(403);
    });

    test('sem token retorna 401', async () => {
      const res = await request(app)
        .post('/books')
        .send({ title: 'Dom Casmurro', author: 'Machado de Assis' });

      expect(res.status).toBe(401);
    });

    test('sem título retorna 400 (validação)', async () => {
      const res = await request(app)
        .post('/books')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ author: 'Machado de Assis' });

      expect(res.status).toBe(400);
    });

    test('slug duplicado retorna 409', async () => {
      await request(app)
        .post('/books')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Dom Casmurro', author: 'Machado de Assis' });

      const res = await request(app)
        .post('/books')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Dom Casmurro', author: 'Machado de Assis' });

      expect(res.status).toBe(409);
    });
  });

  describe('GET /books/public', () => {
    test('lista livros públicos sem precisar de token', async () => {
      await Book.create({
        title: 'O Alienista',
        author: 'Machado de Assis',
        slug: 'o-alienista',
      });

      const res = await request(app).get('/books/public');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe('O Alienista');
    });

    test('não retorna campos internos como epub/pdf/txt', async () => {
      await Book.create({
        title: 'O Alienista',
        author: 'Machado de Assis',
        slug: 'o-alienista',
        epub: 'http://exemplo.com/epub',
        pdf: 'http://exemplo.com/pdf',
      });

      const res = await request(app).get('/books/public');

      expect(res.body[0].epub).toBeUndefined();
      expect(res.body[0].pdf).toBeUndefined();
    });

    test('filtra por autor', async () => {
      await Book.create({ title: 'Livro A', author: 'Autor X', slug: 'livro-a' });
      await Book.create({ title: 'Livro B', author: 'Autor Y', slug: 'livro-b' });

      const res = await request(app).get('/books/public?author=Autor X');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe('Livro A');
    });
  });

  describe('PUT /books/:bookId', () => {
    test('admin atualiza livro com sucesso', async () => {
      const book = await Book.create({
        title: 'Título Original',
        author: 'Autor Original',
        slug: 'titulo-original',
      });

      const res = await request(app)
        .put(`/books/${book._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Título Atualizado' });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Título Atualizado');
    });

    test('atualizar livro inexistente retorna 404', async () => {
      const fakeId = '64f000000000000000000000';

      const res = await request(app)
        .put(`/books/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Novo Título' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /books/:bookId', () => {
    test('admin deleta livro com sucesso', async () => {
      const book = await Book.create({
        title: 'Livro a Deletar',
        author: 'Autor',
        slug: 'livro-a-deletar',
      });

      const res = await request(app)
        .delete(`/books/${book._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);

      const deleted = await Book.findById(book._id);
      expect(deleted).toBeNull();
    });

    test('usuário comum não pode deletar livro (403)', async () => {
      const book = await Book.create({
        title: 'Livro Protegido',
        author: 'Autor',
        slug: 'livro-protegido',
      });

      const res = await request(app)
        .delete(`/books/${book._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });
  });
});