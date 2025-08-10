import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../src/products/entities/product.entity';
import { Category } from '../src/categories/entities/category.entity';
import { ProductsModule } from '../src/products/products.module';
import { CategoriesModule } from '../src/categories/categories.module';

jest.setTimeout(30000);

describe('Products e2e (sql.js memory)', () => {
  let app: INestApplication;
  let server: any;
  let categoryId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqljs',         
          autoSave: false,
          synchronize: true,
          dropSchema: true,
          entities: [Product, Category],
        }),
        CategoriesModule,
        ProductsModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }));
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('POST /categories crea categoría', async () => {
    const res = await request(server)
      .post('/categories')
      .send({ name: 'Bebidas' })
      .expect(201);
    categoryId = res.body.id;
    expect(categoryId).toBeDefined();
  });

  it('POST /products crea producto', async () => {
    const res = await request(server)
      .post('/products')
      .send({
        sku: 'SKU-TEST-1',
        name: 'Agua',
        price: 990,
        stock: 10,
        categoryId,
      })
      .expect(201);
    expect(res.body.id).toBeDefined();
  });

  it('GET /products lista paginado', async () => {
    const res = await request(server)
      .get('/products?limit=10&offset=0')
      .expect(200);
    expect(res.body.total).toBeGreaterThan(0);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
