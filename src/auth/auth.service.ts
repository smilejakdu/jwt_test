import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "src/entities/Users";
import { Repository } from "typeorm";
import bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const foundUser = await this.usersRepository.findOne({
      where: { username: username },
    });

    if (!foundUser) {
      throw new Error("존재하지 않는 사용자");
    }

    const result = await bcrypt.compare(password, foundUser.password);
    if (result) {
      const { password, ...userWithoutPassword } = foundUser;
      return userWithoutPassword;
    }
    return null;
  }
}
