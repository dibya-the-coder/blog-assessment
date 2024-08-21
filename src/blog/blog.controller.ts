import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { BlogService } from './blog.service';
import { JwtAuthGuard } from 'src/auth/guard/auth.guard';
import { ObjectId } from 'mongoose';
import { CreateBlogDto } from './dto/createBlog.dto';
import { UpdateBlogDto } from './dto/updateBlog.dto';

@Controller('posts')
export class BlogController {
  constructor(private blogService: BlogService) {}
  @UseGuards(JwtAuthGuard)

  @Get('/current')
  getUser() {
    try {
      return this.blogService.getAll();
    } catch (error) {
      console.log('get current user error');
      return;
    }
  }
  @Get('test')
  tryMethod(){
    return 'hello';
  }

  // @UseGuards(JwtAuthGuard)
  @Post('/')
  create(@Body() dto: CreateBlogDto, @Req() req) {
    try {
      return this.blogService.create(dto, req.user._id);
    } catch (error) {
      return {
        message: error.message,
        statusCode: error.status,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Body() dto: UpdateBlogDto, @Param('id') id: ObjectId, @Req() req) {
    try {
      return this.blogService.update(dto, id, req.user._id);
    } catch (error) {
      return {
        message: error.message,
        statusCode: error.status,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') blogId, @Req() req) {
    try {
      return this.blogService.delete(blogId, req.user._id);
    } catch (error) {
      return {
        message: error.message,
        statusCode: error.status,
      };
    }
  }

  @Get('/')
  getAllBlogs() {
    try {
      return this.blogService.getAll();
    } catch (error) {
      return {
        message: error.message,
        statusCode: error.status,
      };
    }
  }

  @Get(':id')
  getbyId(@Param('id') id) {
    try {
      return this.blogService.getSingleBlogById(id);
    } catch (error) {
      return {
        message: error.message,
        statusCode: error.status,
      };
    }
  }

 

}
