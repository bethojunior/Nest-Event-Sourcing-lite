import { Injectable } from '@nestjs/common';
import { EventBusService } from 'src/providers/event-bus/event-bus.service';
import { PrismaReadProvider } from 'src/providers/prisma/prisma-read.provider';
import { PrismaWriteProvider } from 'src/providers/prisma/prisma-write.provider';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogCreatedEntity } from './entities/blogCreated.entity';

@Injectable()
export class BlogService {
  constructor(
    private readonly prisma: PrismaWriteProvider,
    private readonly prismaRead: PrismaReadProvider,
    private eventBus: EventBusService,
  ) {}

  async create(props: CreateBlogDto) {
    await this.eventBus.emit(
      'blog.created',
      new BlogCreatedEntity(props.title, props.content),
    );

    return {
      message: 'Blog creation requested',
    };
  }

  async findAll() {
    return await this.prismaRead.blog.findMany();
  }

  async findOne(id: string) {
    return await this.prismaRead.blog.findFirst({
      where: {
        id,
      },
    });
  }

  async update(id: string, props: UpdateBlogDto) {
    return await this.prisma.blog.update({
      where: {
        id,
      },
      data: { ...props },
    });
  }

  async remove(id: string) {
    return await this.prisma.blog.delete({
      where: {
        id,
      },
    });
  }
}
