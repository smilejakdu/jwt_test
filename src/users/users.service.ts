import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { log } from 'console';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(Users) private usersRepository: Repository<Users>,
		private jwtService: JwtService
	) {}

  async findByUsername(username: string) {
		return this.usersRepository.findOne({
			where: { username },
			select: ['id', 'username', 'password'],
		});
	}

  async signUp(username: string, password: string) : Promise<Users>{
		const hashedPassword = await bcrypt.hash(password, 12);
		const user = await this.usersRepository.findOne({ where: { username } });
		if (user) {
			throw new Error('이미 존재하는 사용자');
		}

		const createUser = await this.usersRepository.save({
			username,
			password: hashedPassword,
		});
		return createUser;
	}

	async logIn(id:number , username:string) {
		const user = await this.usersRepository.findOne({
			 where: { id:id ,username :username},
			 select: ['id', 'username', 'createdAt' , 'updatedAt'],	
		}); 
    const payload = { username: username, sub: id };

		return { 
			user : user,
			access_token: this.jwtService.sign(payload),
		};
	}
}

