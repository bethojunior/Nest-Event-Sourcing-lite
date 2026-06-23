import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { BlogCreatedEventConsumer } from './consumers/blogCreated.consumer';

@Module({
  controllers: [BlogController, BlogCreatedEventConsumer],
  providers: [BlogService],
})
export class BlogModule {}
