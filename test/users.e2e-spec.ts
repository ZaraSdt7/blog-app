import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UsersController (e2e)', () => {
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
        name: 'Admin',
        email: 'admin@example.com',
        password: 'password',
      });
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'password' });
    token = loginRes.body.access_token;
  });

  it('/users (POST) - create user', async () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.email).toEqual('test@example.com');
        expect(res.body.name).toEqual('Test User');
      });
  });

  it('/users (GET) - get all users (admin only)', async () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeInstanceOf(Array);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});