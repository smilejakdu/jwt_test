import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Index('username', ['username'], { unique: true })
@Entity({ schema: 'jwt_test', name: 'users' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'ash',
    description: 'username',
  })
  @Column('varchar', { name: 'username', length: 80 })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'password', length: 150, select: false }) // select: false 하면 password 빼고 불러온다.
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
