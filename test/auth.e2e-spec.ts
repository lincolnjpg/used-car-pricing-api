import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { promises, unlink } from 'fs';

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
    // resolve para o sqlite, que é apenas um arquivo
    // ver como fazer isso de um jeito melhor para o caso geral (utilizando o que o framework oferece para isso)
    console.log(process.cwd())
    console.log(__dirname)
    try {
        await promises.unlink(`${process.cwd()}/test.sqlite`);
    } catch (error) {        
    }
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
});
