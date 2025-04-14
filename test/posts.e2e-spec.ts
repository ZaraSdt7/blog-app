import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('PostsController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
      });
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    token = loginRes.body.access_token;
  });

  it('/posts (POST) - create post', async () => {
    return request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Post',
        content: 'This is a test post.',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.title).toEqual('Test Post');
        expect(res.body.content).toEqual('This is a test post.');
      });
  });

  it('/posts (GET) - get all posts', async () => {
    await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Post',
        content: 'This is a test post.',
      });

    return request(app.getHttpServer())
      .get('/posts')
      .expect(200)
      .expect((res) => {
        expect(res.body.posts).toBeInstanceOf(Array);
        expect(res.body.total).toBeGreaterThan(0);
      });
  });

  it('/posts/:id (PUT) - update post', async () => {
    const postRes = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Post',
        content: 'This is a test post.',
      });

    return request(app.getHttpServer())
      .put(`/posts/${postRes.body._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Post',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.title).toEqual('Updated Post');
      });
  });

  it('/posts/:id (DELETE) - delete post', async () => {
    const postRes = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Post',
        content: 'This is a test post.',
      });

    return request(app.getHttpServer())
      .delete(`/posts/${postRes.body._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});