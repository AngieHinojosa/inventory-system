import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  // Create a new product and optionally attach a Category by its id
  async create(dto: CreateProductDto): Promise<Product> {
    const { categoryId, ...rest } = dto;

    const entity = this.repo.create({
      ...rest,
      // set relation by id if provided
      category: categoryId ? ({ id: categoryId } as Category) : undefined,
    });

    try {
      return await this.repo.save(entity);
    } catch (e: any) {
      // Postgres unique violation
      if (e?.code === '23505') {
        // Puedes personalizar el mensaje si quieres distinguir por constraint
        // e.constraint trae el nombre de la constraint única
        throw new ConflictException('SKU o barcode ya existen');
      }
      throw e;
    }
  }

  // List products with optional text search and category filter
  async findAll(params?: {
    q?: string;
    limit?: number;
    offset?: number;
    categoryId?: string;
  }): Promise<{ data: Product[]; total: number }> {
    const { q, limit = 10, offset = 0, categoryId } = params || {};

    const likeConds: FindOptionsWhere<Product>[] = q
      ? [{ name: ILike(`%${q}%`) }, { sku: ILike(`%${q}%`) }]
      : [{}];

    const baseFilter: Partial<Record<keyof Product, any>> = {};
    if (categoryId) {
      baseFilter.category = { id: categoryId } as any;
    }

    const where = likeConds.map((w) => ({ ...w, ...baseFilter }));

    const [data, total] = await this.repo.findAndCount({
      where,
      relations: { category: true },
      order: { createdAt: 'DESC' },
      take: Math.min(limit, 100),
      skip: offset,
    });

    return { data, total };
  }

  // Get a single product by id (with category relation)
  async findOne(id: string): Promise<Product> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!entity) throw new NotFoundException(`Product ${id} not found`);
    return entity;
  }

  // Update a product; if categoryId is provided, re-link the relation
  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const { categoryId, ...rest } = dto;
    const existing = await this.findOne(id);

    const merged = this.repo.merge(existing, {
      ...rest,
      category:
        categoryId !== undefined
          ? (categoryId ? ({ id: categoryId } as Category) : null)
          : existing.category,
    });

    try {
      return await this.repo.save(merged);
    } catch (e: any) {
      if (e?.code === '23505') {
        throw new ConflictException('SKU o barcode ya existen');
      }
      throw e;
    }
  }

  // Remove a product (will not delete the category)
  async remove(id: string): Promise<void> {
    const existing = await this.findOne(id);
    await this.repo.remove(existing);
  }
}
