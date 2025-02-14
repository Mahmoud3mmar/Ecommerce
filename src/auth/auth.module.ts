import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth.strategy';

@Module({
  imports:[TypeOrmModule.forFeature([UserEntity]),
  PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: '1d'
    }
  }),
  
],
  providers: [AuthService , JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy , PassportModule]
})
export class AuthModule {}
