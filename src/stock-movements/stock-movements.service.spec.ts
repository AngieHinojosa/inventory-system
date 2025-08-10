import { Test } from '@nestjs/testing';
import { StockMovementsService } from './stock-movements.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StockMovement } from './entities/stock-movement.entity';
import { Product } from '../products/entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MovementType } from './dto/create-stock-movement.dto';

type MockRepo<T = any> = Partial<{
  findOne: jest.Mock; save: jest.Mock; create: jest.Mock; find: jest.Mock;
}>;

const repoMockFactory = (): MockRepo => ({
  findOne: jest.fn(), save: jest.fn(), create: jest.fn(), find: jest.fn(),
});

describe('StockMovementsService', () => {
  let service: StockMovementsService;
  let smRepo: MockRepo<StockMovement>;
  let prodRepo: MockRepo<Product>;
  let ds: Partial<DataSource>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        StockMovementsService,
        { provide: DataSource, useValue: { transaction: jest.fn() } },
        { provide: getRepositoryToken(StockMovement), useFactory: repoMockFactory },
        { provide: getRepositoryToken(Product), useFactory: repoMockFactory },
      ],
    }).compile();

    service = module.get(StockMovementsService);
    smRepo = module.get(getRepositoryToken(StockMovement));
    prodRepo = module.get(getRepositoryToken(Product));
    ds = module.get(DataSource);
  });

  it('IN suma stock y crea movimiento', async () => {
    (ds.transaction as jest.Mock).mockImplementation(async (cb: any) => {
      // simulamos manager con mismas APIs usadas
      const manager = {
        findOne: jest.fn().mockResolvedValue({ id: 'p1', stock: 10 }),
        save: jest.fn().mockImplementation((_ent: any, obj: any) => Promise.resolve(obj)),
        create: jest.fn().mockImplementation((_ent: any, obj: any) => obj),
      };
      return cb(manager);
    });

    const res = await service.create({ productId: 'p1', type: MovementType.IN, quantity: 5 });
    expect(res.quantity).toBe(5);
  });

  it('OUT resta stock y valida no negativo', async () => {
    (ds.transaction as jest.Mock).mockImplementation(async (cb: any) => {
      const manager = {
        findOne: jest.fn().mockResolvedValue({ id: 'p1', stock: 3 }),
        save: jest.fn(),
        create: jest.fn(),
      };
      return cb(manager);
    });

    await expect(
      service.create({ productId: 'p1', type: MovementType.OUT, quantity: 4 }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('404 si no existe producto', async () => {
    (ds.transaction as jest.Mock).mockImplementation(async (cb: any) => {
      const manager = { findOne: jest.fn().mockResolvedValue(null) };
      return cb(manager);
    });

    await expect(
      service.create({ productId: 'x', type: MovementType.IN, quantity: 1 }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
