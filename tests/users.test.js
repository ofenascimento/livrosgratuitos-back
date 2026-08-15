const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const User = require('../src/models/User');
const Book = require('../src/models/Book');

describe('Users', () => {
  describe('POST /users/register', () => {
    test('registra usuário com sucesso', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({ email: 'teste@teste.com', password: '123456', name: 'Teste' });

      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
    });

    test('email duplicado retorna 400', async () => {
      await request(app)
        .post('/users/register')
        .send({ email: 'teste@teste.com', password: '123456', name: 'Teste' });

      const res = await request(app)
        .post('/users/register')
        .send({ email: 'teste@teste.com', password: '654321', name: 'Outro' });

      expect(res.status).toBe(400);
    });

    test('senha curta retorna 400 (validação)', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({ email: 'teste@teste.com', password: '123' });

      expect(res.status).toBe(400);
    });

    test('email inválido retorna 400 (validação)', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({ email: 'não-é-email', password: '123456' });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /users/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/users/register')
        .send({ email: 'teste@teste.com', password: '123456', name: 'Teste' });
    });

    test('login com sucesso', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({ email: 'teste@teste.com', password: '123456' });

      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
    });

    test('senha errada retorna 400', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({ email: 'teste@teste.com', password: 'senhaerrada' });

      expect(res.status).toBe(400);
    });

    test('email inexistente retorna 400', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({ email: 'naoexiste@teste.com', password: '123456' });

      expect(res.status).toBe(400);
    });
  });

  describe('Rotas protegidas por verifyUser', () => {
    let user;
    let token;
    let otherToken;

    beforeEach(async () => {
      user = await User.create({ email: 'dono@teste.com', password: '123456', name: 'Dono' });
      token = jwt.sign({ _id: user._id.toString() }, process.env.TOKEN_SECRET);
      otherToken = jwt.sign({ _id: 'outroUserId' }, process.env.TOKEN_SECRET);
    });

    test('dono consegue acessar o próprio perfil', async () => {
      const res = await request(app)
        .get(`/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe('dono@teste.com');
    });

    test('outro usuário não consegue acessar perfil alheio (403)', async () => {
      const res = await request(app)
        .get(`/users/${user._id}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(res.status).toBe(403);
    });

    test('sem token retorna 401', async () => {
      const res = await request(app).get(`/users/${user._id}`);

      expect(res.status).toBe(401);
    });
  });

  describe('Favoritos', () => {
    let user;
    let token;
    let book;

    beforeEach(async () => {
      user = await User.create({ email: 'leitor@teste.com', password: '123456' });
      token = jwt.sign({ _id: user._id.toString() }, process.env.TOKEN_SECRET);
      book = await Book.create({ title: 'Livro Teste', author: 'Autor', slug: 'livro-teste' });
    });

    test('adiciona livro aos favoritos', async () => {
      const res = await request(app)
        .put(`/users/${user._id}/favorites`)
        .set('Authorization', `Bearer ${token}`)
        .send({ bookId: book._id });

      expect(res.status).toBe(200);

      const updated = await User.findById(user._id);
      expect(updated.favoriteBooks.map(String)).toContain(book._id.toString());
    });

    test('remove livro dos favoritos', async () => {
      await User.findByIdAndUpdate(user._id, { $addToSet: { favoriteBooks: book._id } });

      const res = await request(app)
        .delete(`/users/${user._id}/favorites/${book._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);

      const updated = await User.findById(user._id);
      expect(updated.favoriteBooks.map(String)).not.toContain(book._id.toString());
    });

    test('lista livros favoritos', async () => {
      await User.findByIdAndUpdate(user._id, { $addToSet: { favoriteBooks: book._id } });

      const res = await request(app)
        .get(`/users/${user._id}/favorite-books`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe('Livro Teste');
    });
  });

  describe('Reading List', () => {
    let user;
    let token;
    let book;

    beforeEach(async () => {
      user = await User.create({ email: 'leitor2@teste.com', password: '123456' });
      token = jwt.sign({ _id: user._id.toString() }, process.env.TOKEN_SECRET);
      book = await Book.create({ title: 'Outro Livro', author: 'Autor', slug: 'outro-livro' });
    });

    test('adiciona livro à lista de leitura', async () => {
      const res = await request(app)
        .post(`/users/${user._id}/reading-list`)
        .set('Authorization', `Bearer ${token}`)
        .send({ bookId: book._id });

      expect(res.status).toBe(200);
    });

    test('lista a reading list corretamente', async () => {
      await User.findByIdAndUpdate(user._id, { $addToSet: { readingList: book._id } });

      const res = await request(app)
        .get(`/users/${user._id}/reading-list`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe('Outro Livro');
    });
  });
});