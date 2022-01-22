import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "src/entities/Users";
import { Repository } from "typeorm";
import bcrypt from "bcrypt";
import { log } from "console";
import { JwtService } from "@nestjs/jwt";

export class SignInResponseDto {
  user: Users;
  access_token?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private jwtService: JwtService
  ) {}

  async findByUsername(username: string) {
    return this.usersRepository.findOne({
      where: { username },
      select: ["id", "username", "password"],
    });
  }

  async signUp(username: string, password: string): Promise<Users> {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await this.usersRepository.findOne({ where: { username } });
    if (user) {
      throw new Error("이미 존재하는 사용자");
    }
    const createUser = this.usersRepository.create({
      username: username,
      password: hashedPassword,
    });
    await this.usersRepository.save(createUser);
    delete createUser.password;
    return createUser;
  }

  async logIn(username: string, password: string) {
    const foundUser = await this.usersRepository.findOne({
      where: { username: username },
    });

    if (!bcrypt.compare(password, foundUser.password)) {
      return {
        ok: false,
        statusCode: 400,
        message: "패스워드를 확인하세요.",
      };
    }
    const payload = { username: foundUser.username, id: foundUser.id };
    delete foundUser.password;

    return {
      user: foundUser,
      access_token: this.jwtService.sign(payload),
    };
  }

  async userProfile(id: number, username: string) {
    const foundUser = await this.usersRepository.findOne({
      where: { id: id, username: username },
    });

    if (!foundUser) {
      return "does not found user";
    }
    delete foundUser.password;
    return foundUser;
  }
}
