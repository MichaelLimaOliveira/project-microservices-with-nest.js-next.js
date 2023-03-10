import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import slugify from 'slugify';

interface CreateProductParams {
  title: string;
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  listProductById(id: string) {
    return this.prisma.product.findUnique({
      where: {
        id,
      },
    });
  }

  listAllProducts() {
    return this.prisma.product.findMany();
  }

  async createProduct({ title }: CreateProductParams) {
    const slug = slugify(title, {
      lower: true,
    });

    const productWithSameSlug = await this.prisma.product.findUnique({
      where: {
        slug,
      },
    });

    if (productWithSameSlug) {
      throw new Error('Another product with same slug already exists.');
    }

    const product = await this.prisma.product.create({
      data: {
        title,
        slug,
      },
    });

    return product;
  }
}
