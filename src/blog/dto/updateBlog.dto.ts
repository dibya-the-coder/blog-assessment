import { IsMongoId, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateBlogDto {
  [x: string]: any;
  @IsOptional()
  @IsString()
  @MinLength(5)
  title: string;

  @IsOptional()
  @IsMongoId()
  author: string;

  @IsOptional()
  @MinLength(10)
  content: string;
}
