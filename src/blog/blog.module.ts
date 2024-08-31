import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, blogSchema } from 'src/schema/blog.schema';
import { User, userSchema } from 'src/schema/user.schema';
import { MulterModule } from '@nestjs/platform-express';
import { Location, locationSchema } from 'src/schema/location.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: blogSchema },
      { name: User.name, schema: userSchema },
      { name: Location.name, schema: locationSchema },
    ]),

    MulterModule,
  ],
  providers: [BlogService],
  controllers: [BlogController],
})
export class BlogModule {}
