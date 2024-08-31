import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { BlogService } from './blog.service';
import { JwtAuthGuard } from 'src/auth/guard/auth.guard';
import { ObjectId } from 'mongoose';
import { CreateBlogDto } from './dto/createBlog.dto';
import { UpdateBlogDto } from './dto/updateBlog.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { Console } from 'console';

@Controller('posts')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/currentUser')
  getUser(@Req() req) {
    try {
      return this.blogService.getUserById(req.user._id);
    } catch (error) {
      return;
    }
  }

  @Get('test')
  tryMethod() {
    return 'hello';
  }

  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  @UseGuards(JwtAuthGuard)
  @Post('/')
  create(
    @Body() dto: CreateBlogDto,
    @Req() req,
    @UploadedFile() image: Express.Multer.File,
  ) {
    console.log(req.user);
    try {
      return this.blogService.create(
        dto,
        req.user._id,
        req.user.userName,
        image.filename,
      );
    } catch (error) {
      return {
        message: error.message,
        statusCode: error.status,
      };
    }
  }

  @Post('field')
  getBySpecificField(@Body() bdy) {
    try {
      console.log('value', bdy);
      return this.blogService.getBlogByFieldName(bdy.fieldName, bdy.value);
    } catch (error) {
      console.log(error);
      return error.mesage;
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
  @Get('location/:place')
  getLocation(@Param('place') place: string) {
    try {
      console.log(place);
      return this.blogService.findCityName(place);
    } catch (error) {
      return error.mesage;
    }
  }
}
