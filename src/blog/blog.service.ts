import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId } from 'mongoose';
import { Blog } from 'src/schema/blog.schema';
import { User } from 'src/schema/user.schema';
import { CreateBlogDto } from './dto/createBlog.dto';
import { UpdateBlogDto } from './dto/updateBlog.dto';
import { Location } from 'src/schema/location.schema';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Location.name) private locationModel: Model<Location>,
  ) {}

  /**This method will update a single blog in the database
   *
   * @param {UpdateBlogDto} dto
   * @param {ObjectId} blogId
   * @param {ObjectId} userId
   * @returns return a message, a statusCode and a error or the updated user as per needed
   */
  async update(dto: UpdateBlogDto, blogId: ObjectId, userId: ObjectId) {
    try {
      const blog = await this.blogModel.findById(blogId);
      if (!blog) throw new NotFoundException('Blog Not Found');
      if (!(userId == blog.author)) {
        throw new UnauthorizedException(
          'You are not authorized to edit this blog',
        );
      }
      // console.log(dto);
      const data = await this.blogModel.findByIdAndUpdate(blogId, dto, {
        new: true,
      });
      // console.log(data, blogId, userId);
      return {
        message: 'Blog Updated Succcessfully',
        statusCode: HttpStatus.OK,
        payload: data,
      };
    } catch (error) {
      return {
        message: 'User Updation Failed',
        error: error.message,
        statusCode: error.status,
      };
    }
  }

  /**This method will create a new Blog in the database
   *
   * @param {CreateBlogDto} dto
   * @param {ObjectId} userId
   * @returns this will return a message for the, and a status code and a payload and error message as per needed
   */
  async create(dto: CreateBlogDto, userId: ObjectId, author: string, fileName) {
    try {
      console.log(fileName);
      const user = await this.userModel.findById(userId);
      if (!user) throw new NotFoundException('User not found');

      console.log('AUTHOR',author);
      const newBlog = new this.blogModel({
        ...dto,
        author: userId,
        authorName: author,
        image: `uploads/${fileName}`,
      });
      console.log(newBlog);
      const blog = await newBlog.save();
      return {
        message: 'Blog created successfully',
        statuscode: HttpStatus.CREATED,
        payload: blog,
      };
    } catch (error) {
      return {
        message: error.message,
        statusCode: error.status,
      };
    }
  }

  /**This method will delete a single blog in the database
   *
   * @param {ObjectId} blogId
   * @param {ObjectId} userId
   * @returns ret
   */
  async delete(blogId: ObjectId, userId: ObjectId) {
    try {
      const blog = await this.blogModel.findById(blogId);
      if (!(blog.author == userId))
        return new UnauthorizedException(
          'You are not authorized to delete this blog',
        );
      await this.blogModel.findByIdAndDelete(blogId);
      return {
        message: 'Blog deleted successfully',
        statuscode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: error.message,
        statusCode: error.status,
      };
    }
  }

  /**This method will return all the blog in the database
   *
   * @returns a message, a statusCode and a payload if present
   */
  async getAll() {
    try {
      const blogs = await this.blogModel.find({ isPublished: true });
      return {
        message: 'Data fatched Successfully',
        statusCode: HttpStatus.OK,
        payload: blogs,
      };
    } catch (error) {
      return {
        message: error.message,
        statusCode: error.status,
      };
    }
  }

  /**This method will give a data of single blog
   *
   * @param {ObjectId} id
   * @returns a single blog as per it's id
   */
  async getSingleBlogById(id: ObjectId) {
    try {
      if (!mongoose.isValidObjectId(id))
        throw new BadRequestException('Invalid Object Id');
      const blog = await this.blogModel.findById(id);
      if (!blog) return new NotFoundException('Blog not found');
      return {
        message: 'Data fetched successfully',
        statusCode: HttpStatus.OK,
        payload: blog,
      };
    } catch (error) {
      return {
        message: error.message,
        statusCode: error.status,
      };
    }
  }
  async getUserById(userId: ObjectId) {
    try {
      console.log('data user data');
      const user = await this.userModel.findById(userId);
      const blogs = await this.blogModel.find({ author: userId });
      if (!user) throw new NotFoundException('User not found');
      return {
        message: 'User found successfully',
        statusCode: HttpStatus.OK,
        payload: { user: user, blogs: blogs },
      };
    } catch (e) {
      return {
        message: e.message,
        statusCode: e.status,
      };
    }
  }
  async getBlogByFieldName(fieldname: string, value: string) {
    // console.log(fieldname, value);
    try {
      let data;

      if (fieldname == 'title') {
        data = await this.blogModel.find({ title: value, isPublished: true });
      } else if (fieldname == 'authorName') {
        data = await this.blogModel.find({
          authorName: value,
          isPublished: true,
        });
      }
      console.log(data);
      return {
        payload: data,
        message: 'Blogssssdddd Fetched Successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Something went wrong',
        statusCode: HttpStatus.NOT_FOUND,
      };
    }
  }
  async findCityName(option: string) {
    try {
      let cities;

      if (option != ' ') {
        cities = await this.locationModel.find({
          name: { $regex: `^${option}`, $options: 'i' },
        });
      } else {
        cities = await this.locationModel.find();
      }
      console.log(cities);
      return {
        statusCode: HttpStatus.OK,
        payload: cities,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
      };
    }
  }
}
