import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { User } from './user.schema';

export type BlogDocument = HydratedDocument<Blog>;

@Schema({ collection: 'Blogs', timestamps: true })
export class Blog {
  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop({ ref: User.name, type: mongoose.Schema.Types.ObjectId })
  author: ObjectId;
}

export const blogSchema = SchemaFactory.createForClass(Blog);
