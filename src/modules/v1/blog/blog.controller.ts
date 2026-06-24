import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async create(@Body() props: CreateBlogDto) {
    return this.blogService.create(props);
  }

  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() props: UpdateBlogDto) {
    return this.blogService.update(id, props);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}
