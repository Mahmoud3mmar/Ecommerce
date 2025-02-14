import { Injectable, UseGuards, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { ProductEntity } from 'src/product/entities/product.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
@UseGuards(AuthGuard())
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(

    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) { }


  createUser(createUserDto: CreateUserDto) {
    this.logger.log('createUser');
    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);

  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(username: string) {
    return this.usersRepository.findOne({ where: { username: username } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }

  async getUserProducts(id: number, products: ProductEntity): Promise<UserEntity> {
    return this.usersRepository.findOne({ where: { id, products } });
  }

  async getUserProductsById(id: number): Promise<UserEntity> {
    return this.usersRepository.findOne({ where: { id }, relations: ['products'] });
  }

  getUserByEmail(email: string): Promise<UserEntity> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async genResetCode(email: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ where: { email } });
    user.resetCode = Math.random().toString(36).substring(2);
    return this.usersRepository.save(user);
  }

  async verifyCodeAndUpdatePassword(email: string, resetCode: string, password: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user.resetCode === resetCode) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(password, salt);
      user.resetCode = null;
      return this.usersRepository.save(user);
    }
  }
}

