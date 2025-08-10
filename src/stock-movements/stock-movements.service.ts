import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { StockMovement } from './entities/stock-movement.entity';
import { CreateStockMovementDto, MovementType } from './dto/create-stock-movement.dto';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class StockMovementsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(StockMovement) private readonly smRepo: Repository<StockMovement>,
    @InjectRepository(Product) private readonly prodRepo: Repository<Product>,
  ) {}

  async create(dto: CreateStockMovementDto): Promise<StockMovement> {
    return this.dataSource.transaction(async (manager) => {
      const prod = await manager.findOne(Product, { where: { id: dto.productId } });
      if (!prod) throw new NotFoundException(`Product ${dto.productId} not found`);

      const delta = dto.type === MovementType.IN ? dto.quantity : -dto.quantity;
      const nextStock = prod.stock + delta;
      if (nextStock < 0) {
        throw new BadRequestException('Stock no puede quedar negativo');
      }

      prod.stock = nextStock;
      await manager.save(Product, prod);

      const movement = manager.create(StockMovement, {
        product: { id: prod.id },
        type: dto.type,
        quantity: dto.quantity,
        note: dto.note,
      });
      return manager.save(StockMovement, movement);
    });
  }

  async findAll(params?: { productId?: string }) {
    const where = params?.productId ? { product: { id: params.productId } } : {};
    return this.smRepo.find({
      where: where as any,
      relations: { product: true },
      order: { createdAt: 'DESC' },
      take: 200,
    });
  }

  async findOne(id: string) {
    const sm = await this.smRepo.findOne({ where: { id }, relations: { product: true } });
    if (!sm) throw new NotFoundException(`Movement ${id} not found`);
    return sm;
  }
}
