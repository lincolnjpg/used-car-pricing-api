import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';
import { User } from '../src/users/user.entity';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    const dataSource = app.get(DataSource)
    await dataSource.createQueryBuilder().delete().from(User).execute();
  });

  it('handles a sign up request', () => {
    const email = 'abcd@test.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: '123' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;

        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  it('sign up as a new user then get currently logged in user', async () => {
    const email = 'abcd@test.com';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: '123' })
      .expect(201)
    const cookie = res.get('Set-Cookie')

    const { body } = await request(app.getHttpServer())
        .get('/auth/whoami')
        .set('Cookie', cookie)
        .expect(200)

    expect(body.email).toEqual(email);
  })
});
