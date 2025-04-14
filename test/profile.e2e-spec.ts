import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as fs from 'fs';
import * as path from 'path';

describe('ProfileController (e2e)', () => {
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
        name: "User1",
        email: "user@gmail.com",
        password: 'password1234',
      });
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    token = loginRes.body.access_token;
  });

  it('/profile (GET) - get profile', async () => {
    return request(app.getHttpServer())
      .get('/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toEqual('user@gmail.com');
        expect(res.body.name).toEqual('User1');
        expect(res.body.password).toBeUndefined();
      });
  });

  it('/profile (PUT) - update profile', async () => {
    return request(app.getHttpServer())
      .put('/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated User',
        email: 'userupdate@gmail.com',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toEqual('Updated User');
        expect(res.body.email).toEqual('userupdate@gmail.com');
      });
  });

  it('/profile/change-password (POST) - change password', async () => {
    return request(app.getHttpServer())
      .post('/profile/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'password',
        newPassword: 'newpassword',
      })
      .expect(201);
  });

  it('/profile/change-password (POST) - incorrect current password', async () => {
    return request(app.getHttpServer())
      .post('/profile/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'wrong',
        newPassword: 'newpassword',
      })
      .expect(401);
  });

  it('/profile/profile-picture (POST) - upload profile picture', async () => {
    // Create a test image file really
    const filePath = path.join(__dirname, 'test-image.jpg');
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, 'fake image content');
    }

    return request(app.getHttpServer())
      .post('/profile/profile-picture')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', filePath)
      .expect(201)
      .expect((res) => {
        expect(res.body.profilePicture).toMatch(/^\/uploads\//);
      });
  });

  it('/profile/profile-picture (POST) - invalid file format', async () => {
    return request(app.getHttpServer())
      .post('/profile/profile-picture')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from('not an image'), { filename: 'uploads' })
      .expect(400);
  });

  afterAll(async () => {
    await app.close();
  });
});