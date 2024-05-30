import { Test } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        const users: User[] = [];
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email);

                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                const user = { id: Math.floor(Math.random() * 9999), email, password } as User;
                users.push(user);
                
                return Promise.resolve(user);
            }
        }

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService,
                }
            ]
        }).compile();

        service = module.get(AuthService);
    });

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    it('creates new user with a salted and hashed password', async () => {
        const user = await service.signUp('test@test.com', 'asdf');

        expect(user.password).not.toEqual('asdf');

        const [salt, hash] = user.password.split('.');

        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws an error if user sign up with email that is in use', async () => {
        fakeUsersService.find = () => Promise.resolve([
            { id: 1, email: 'test@test.com', password: 'asdf' } as User
        ]);
        await expect(service.signUp('test@test.com', 'asdf'))
            .rejects
            .toThrow(BadRequestException);
    });

    it('throws if sign in is called with an unused email', async () => {
        await expect(service.signIn('test@test.com', 'asdf'))
            .rejects
            .toThrow(NotFoundException);
    })

    it('throws if an invalid password is provided', async () => {
        fakeUsersService.find = () => Promise.resolve([{ email: 'test@test.com', password: 'asdf'} as User]);

        await expect(
            service.signIn('exception@test.com', '123')
        ).rejects.toThrow(BadRequestException);        
    })

    it('returns a user if correct password is provided', async () => {
        await service.signUp('any@teste.com', 'any');
        const user = await service.signIn('any@teste.com', 'any');

        expect(user).toBeDefined();
    })
})
