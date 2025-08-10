import { Test } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository, ILike, ObjectLiteral } from 'typeorm';

type MockRepo<T extends ObjectLiteral = any> =
  Partial<Record<keyof Repository<T>, jest.Mock>>;

const repoMockFactory = (): MockRepo => ({
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  merge: jest.fn(),
  remove: jest.fn(),
});

describe('ProductsService', () => {
  let service: ProductsService;
  let repo: MockRepo<Product>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Product), useFactory: repoMockFactory },
      ],
    }).compile();

    service = module.get(ProductsService);
    repo = module.get(getRepositoryToken(Product));
  });

  it('crea producto', async () => {
    const dto = { sku: 'SKU1', name: 'Té', price: 1000, stock: 5 } as any;
    const entity = { id: '1', ...dto } as Product;

    repo.create!.mockReturnValue(dto);
    repo.save!.mockResolvedValue(entity);

    const result = await service.create(dto);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalledWith(dto);
    expect(result).toEqual(entity);
  });

  it('lanza 409 en duplicado (SKU/barcode)', async () => {
    const dto = { sku: 'SKU1', name: 'Té', price: 1000, stock: 5 } as any;
    repo.create!.mockReturnValue(dto);
    repo.save!.mockRejectedValue({ code: '23505' });

    await expect(service.create(dto)).rejects.toBeInstanceOf(ConflictException);
  });

  it('findAll pagina y filtra', async () => {
    repo.findAndCount!.mockResolvedValue([[{ id: '1' }], 1]);
    const result = await service.findAll({ q: 'te', limit: 10, offset: 0 });
    expect(repo.findAndCount).toHaveBeenCalledWith(expect.objectContaining({
      where: [{ name: ILike('%te%') }, { sku: ILike('%te%') }],
      take: 10, skip: 0,
    }));
    expect(result.total).toBe(1);
  });

  it('findOne ok / not found', async () => {
    repo.findOne!.mockResolvedValueOnce({ id: '1' });
    await expect(service.findOne('1')).resolves.toEqual({ id: '1' });

    repo.findOne!.mockResolvedValueOnce(null);
    await expect(service.findOne('x')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('update mezcla y guarda', async () => {
    repo.findOne!.mockResolvedValue({ id: '1', name: 'A' });
    repo.merge!.mockReturnValue({ id: '1', name: 'B' });
    repo.save!.mockResolvedValue({ id: '1', name: 'B' });

    const res = await service.update('1', { name: 'B' } as any);
    expect(repo.merge).toHaveBeenCalled();
    expect(res.name).toBe('B');
  });

  it('remove elimina existente', async () => {
    repo.findOne!.mockResolvedValue({ id: '1' });
    repo.remove!.mockResolvedValue(undefined);
    await service.remove('1');
    expect(repo.remove).toHaveBeenCalledWith({ id: '1' });
  });
});
