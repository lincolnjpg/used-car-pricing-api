import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'asdf'} as User])
      },
      findOne: (id: number) => {
        return Promise.resolve({ id, email: 'asdf@test.com', password: 'asdf' } as User)
      },
      // update: () => {},
      // remove: () => {}
    };
    fakeAuthService = {
      // signUp: () => {},
      signIn: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the givel email', async () => {
    const users = await controller.findAllUsers('asdf@test.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf@test.com');
  });

  it('findUsers returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    // acho que faz mais sentido que esse, e outros testes, façam parte da camada da serviço
    // controller rest testa status code e retorno apenas (não testam as regras)
    // não sei como o nest coloca status code na resposta do controller
    fakeUsersService.findOne = () => {
      return Promise.reject(null).catch(
        () => {
          throw new NotFoundException()
        }
      );
    };
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signin updates session an returns user', async () => {
    const session = { userId: 10 };
    const user = await controller.signIn({ email: 'asdf@test.com', password: 'asdf' }, session);

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
