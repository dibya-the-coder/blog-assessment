import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { User } from 'src/schema/user.schema';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from 'src/auth/dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwt: JwtService,
  ) {}
  /**This method create a new user in the database
   *
   * @param {RegisterDto} dto
   * @returns a response which contains a message, a status code and payload or a error message as per result
   */
  async create(dto: RegisterDto) {
    try {
      const newUser = new this.userModel({
        ...dto,
        username: `${dto.username}-${dto.email.split('@')[0]}`,
        password: await bcrypt.hash(dto.password, 10),
      });
      const user = await newUser.save();
      return {
        message: 'User created successfully',
        statusCode: HttpStatus.CREATED,
        payload: user,
      };
    } catch (error) {
      return {
        message: 'User creation failed',
        error: error.message,
        statusCode: error.status,
      };
    }
  }

  /** This method handles user login
   *
   * @param { LoginDto } dto
   * @returns a message, a status code and the access token
   */
  async login(dto: LoginDto) {
    try {
      const isUser = await this.userModel.findOne({ email: dto.email });
      if (!isUser)
        throw new NotFoundException(
          `User not found having email: ${dto.email}`,
        );
      if (!(await bcrypt.compare(dto.password, isUser.password))) {
        throw new UnauthorizedException('Incorrect Password');
      }
      const signUser = {
        username: isUser.username,
        email: isUser.email,
        _id: isUser._id,
      };
      console.log(signUser);
      return {
        message: 'login successful',
        statusCode: HttpStatus.OK,
        access_token: this.jwt.sign(signUser),
      };
    } catch (error) {
      return {
        message: 'Login failed',
        error: error.message,
        statusCode: error.status,
      };
    }
  }

  async googlelogin(dto: { name: string; email: string }) {
    try {
      const isExists = await this.userModel.findOne({ email: dto.email });
      if (isExists) {
        return {
          message: 'Login successFully',
          statusCode: HttpStatus.OK,
          access_token: this.jwt.sign({ _id: isExists._id }),
        };
      } else {
        const newUser = new this.userModel({
          ...dto,
          password: Math.random.toString(),
        });
        const user = await newUser.save();

        return {
          message: 'user created Successfully',
          statusCode: HttpStatus.CREATED,
          payload: user,
          access_token: this.jwt.sign({
            _id: user._id,
            userName: user.username,
          }),
        };
      }
    } catch (error) {
      return {
        message: 'user creataion failed',
        statusCode: HttpStatus.CONFLICT,
        error: error.message,
      };
    }
  }
}
