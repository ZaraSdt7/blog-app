import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST) - register user', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: "User1",
        email: "user@gmail.com",
        password: 'password1234',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.access_token).toBeDefined();
      });
  });

  it('/auth/register (POST) - email already exists', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: "User1",
        email: "user@gmail.com",
        password: 'password1234',
      });

    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'New User',
        email: 'newuser@gmail.com',
        password: 'password1234',
      })
      .expect(409);
  });

  it('/auth/login (POST) - login user', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: " New User",
        email: "newuser@gmail.com",
        password: 'password1234',
      });

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: "newuser@gmail.com",
        password: 'password1234',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.access_token).toBeDefined();
      });
  });

  it('/auth/login (POST) - invalid credentials', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: "newuser@gmail.com",
        password: 'wrong',
      })
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});