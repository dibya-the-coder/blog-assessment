import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SECRET, URI } from './config/env.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    BlogModule,
    MongooseModule.forRoot(URI),
    JwtModule.register({
      global: true,
      secret: SECRET,
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
