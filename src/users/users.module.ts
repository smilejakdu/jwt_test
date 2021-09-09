import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { JwtModule, JwtService } from '@nestjs/jwt';


const jwt = process.env.JWT as string;

@Module({
  imports: [TypeOrmModule.forFeature([Users]),
  JwtModule.register({
    secret: jwt,
    signOptions: { expiresIn: 3600 },
    }),
  ],
  providers: [UsersService],
  exports: [UsersService ],
  controllers: [UsersController],
})
export class UsersModule {}
