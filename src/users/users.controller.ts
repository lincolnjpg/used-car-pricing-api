import { Body, Controller, Get, Post, Patch, Param, Query, Delete } from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDTO } from './dtos/user.dto';

@Controller('auth')
@Serialize(UserDTO)
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post('/signup')
    createUser(@Body() body: CreateUserDTO) {
        this.usersService.create(body.email, body.password);
    }

    @Get('/:id')
    findUser(@Param('id') id: string) {
        return this.usersService.findOne(parseInt(id));
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDTO) {
        return this.usersService.update(parseInt(id), body);
    }
}
