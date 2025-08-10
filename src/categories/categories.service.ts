import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  create(dto: CreateCategoryDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findAll(q?: string) {
    return this.repo.find({
      where: q ? { name: ILike(`%${q}%`) } : {},
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Category ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const existing = await this.findOne(id);
    const merged = this.repo.merge(existing, dto);
    return this.repo.save(merged);
  }

  async remove(id: string) {
    const existing = await this.findOne(id);
    await this.repo.remove(existing);
  }
}
