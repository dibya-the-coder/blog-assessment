import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { User } from './user.schema';

export type BlogDocument = HydratedDocument<Blog>;

@Schema({ collection: 'Blogs', timestamps: true })
export class Blog {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  authorName: string;

  @Prop({ required: true })
  content: string;

  @Prop({
    required: true,
    ref: User.name,
    type: mongoose.Schema.Types.ObjectId,
  })
  author: ObjectId;
  @Prop({ default: false })
  isPublished: boolean;

  @Prop()
  image: string;
}

export const blogSchema = SchemaFactory.createForClass(Blog);
