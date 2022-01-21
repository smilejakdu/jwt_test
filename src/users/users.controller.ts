import {
  Body,
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { SignUpRequestDto } from "./dto/signup.request.dto";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UserDto } from "src/common/dto/user.dto";
import { LocalAuthGuard } from "src/auth/local-auth.guard";
import { LoginRequestDto } from "./dto/login.request.dto";
import { User } from "src/common/decorator/user.decorator";
import { Token } from "../common/decorator/token.decorator";

@ApiInternalServerErrorResponse({
  description: "서버 에러",
})
@ApiTags("USER")
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: "내정보조회" })
  @ApiResponse({
    status: 500,
    description: "서버 에러",
  })
  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async getProfile(@Token() user) {
    console.log("getprofile req:", user);
    return user || false;
  }

  @ApiOperation({ summary: "회원가입" })
  @ApiCreatedResponse({ description: "The user has been successfully created" })
  @Post("signup")
  async signUp(@Body() data: SignUpRequestDto) {
    try {
      const responseSignUp = await this.usersService.signUp(
        data.username,
        data.password
      );
      return responseSignUp;
    } catch (error) {
      return error;
    }
  }

  @ApiOkResponse({
    description: "성공",
    type: UserDto,
  })
  @UseGuards(LocalAuthGuard)
  @ApiResponse({ status: 200, description: "로그인" })
  @Post("login")
  async logIn(@Body() data: LoginRequestDto): Promise<any> {
    const { username, password } = data;
    return await this.usersService.logIn(username, password);
  }
}
