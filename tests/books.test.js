const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const Livro = require('../src/models/Livro');

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

  describe('POST /livros', () => {
    test('admin cria livro com sucesso e gera slug automaticamente', async () => {
      const res = await request(app)
        .post('/livros')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ titulo: 'Dom Casmurro', autor: 'Machado de Assis' });

      expect(res.status).toBe(201);
      expect(res.body.slug).toBe('dom-casmurro');
      expect(res.body.titulo).toBe('Dom Casmurro');
    });

    test('usuário comum não pode criar livro (403)', async () => {
      const res = await request(app)
        .post('/livros')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ titulo: 'Dom Casmurro', autor: 'Machado de Assis' });

      expect(res.status).toBe(403);
    });

    test('sem token retorna 401', async () => {
      const res = await request(app)
        .post('/livros')
        .send({ titulo: 'Dom Casmurro', autor: 'Machado de Assis' });

      expect(res.status).toBe(401);
    });

    test('sem título retorna 400 (validação)', async () => {
      const res = await request(app)
        .post('/livros')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ autor: 'Machado de Assis' });

      expect(res.status).toBe(400);
    });

    test('slug duplicado retorna 409', async () => {
      await request(app)
        .post('/livros')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ titulo: 'Dom Casmurro', autor: 'Machado de Assis' });

      const res = await request(app)
        .post('/livros')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ titulo: 'Dom Casmurro', autor: 'Machado de Assis' });

      expect(res.status).toBe(409);
    });
  });

  describe('GET /livros/public', () => {
    test('lista livros públicos sem precisar de token', async () => {
      await Livro.create({
        titulo: 'O Alienista',
        autor: 'Machado de Assis',
        slug: 'o-alienista',
      });

      const res = await request(app).get('/livros/public');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].titulo).toBe('O Alienista');
    });

    test('não retorna campos internos como epub/pdf/txt', async () => {
      await Livro.create({
        titulo: 'O Alienista',
        autor: 'Machado de Assis',
        slug: 'o-alienista',
        epub: 'http://exemplo.com/epub',
        pdf: 'http://exemplo.com/pdf',
      });

      const res = await request(app).get('/livros/public');

      expect(res.body[0].epub).toBeUndefined();
      expect(res.body[0].pdf).toBeUndefined();
    });

    test('filtra por autor', async () => {
      await Livro.create({ titulo: 'Livro A', autor: 'Autor X', slug: 'livro-a' });
      await Livro.create({ titulo: 'Livro B', autor: 'Autor Y', slug: 'livro-b' });

      const res = await request(app).get('/livros/public?autor=Autor X');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].titulo).toBe('Livro A');
    });
  });

  describe('PUT /livros/:id', () => {
    test('admin atualiza livro com sucesso', async () => {
      const livro = await Livro.create({
        titulo: 'Título Original',
        autor: 'Autor Original',
        slug: 'titulo-original',
      });

      const res = await request(app)
        .put(`/livros/${livro._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ titulo: 'Título Atualizado' });

      expect(res.status).toBe(200);
      expect(res.body.titulo).toBe('Título Atualizado');
    });

    test('atualizar livro inexistente retorna 404', async () => {
      const fakeId = '64f000000000000000000000';

      const res = await request(app)
        .put(`/livros/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ titulo: 'Novo Título' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /livros/:id', () => {
    test('admin deleta livro com sucesso', async () => {
      const livro = await Livro.create({
        titulo: 'Livro a Deletar',
        autor: 'Autor',
        slug: 'livro-a-deletar',
      });

      const res = await request(app)
        .delete(`/livros/${livro._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);

      const deleted = await Livro.findById(livro._id);
      expect(deleted).toBeNull();
    });

    test('usuário comum não pode deletar livro (403)', async () => {
      const livro = await Livro.create({
        titulo: 'Livro Protegido',
        autor: 'Autor',
        slug: 'livro-protegido',
      });

      const res = await request(app)
        .delete(`/livros/${livro._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });
  });
});