import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SkipAuth } from 'src/auth/decorators/skipAuth.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // remember to get the fuck rid of this ... just testing SkipAuth
  @SkipAuth()
  @Get('getallusers')
  findAll() {
    return this.userService.findAll();
  }

  @SkipAuth()
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @SkipAuth()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @SkipAuth()
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @SkipAuth()
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
