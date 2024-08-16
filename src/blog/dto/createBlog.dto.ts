import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateBlogDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  title: string;

  @IsNotEmpty()
  @MinLength(10)
  content: string;
}
