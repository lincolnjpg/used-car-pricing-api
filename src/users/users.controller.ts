import { Body, Controller, Get, Post, Patch, Param, Query, Delete, Session, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDTO } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDTO)
export class UsersController {
    constructor(private usersService: UsersService, private authService: AuthService) {}

    // @Get('/whoami')
    // whoAmI(@Session() session: any) {
    //     return this.usersService.findOne(session.userId);
    // }

    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User) {
        return user;
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDTO, @Session() session: any) {
        const user = await this.authService.signUp(body.email, body.password);
        session.userId = user.id;

        return user;
    }

    @Post('/signout')
    @UseGuards(AuthGuard)
    signOut(@Session() session: any) {
        session.userId = null;
    }

    @Post('/signin')
    async signIn(@Body() body: CreateUserDTO, @Session() session: any) {
        const user = await this.authService.signIn(body.email, body.password);
        session.userId = user.id;

        return user;
    }

    @Get('/:id')
    @UseGuards(AuthGuard)
    findUser(@Param('id') id: string) {
        return this.usersService.findOne(parseInt(id));
    }

    @Get()
    @UseGuards(AuthGuard)
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email);
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id));
    }

    @Patch('/:id')
    @UseGuards(AuthGuard)
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDTO) {
        return this.usersService.update(parseInt(id), body);
    }
}
