import 'dotenv/config';
import dataSource from '../database/data-source';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';

async function run() {
  const ds = await dataSource.initialize();
  const catRepo = ds.getRepository(Category);
  const prodRepo = ds.getRepository(Product);

  const already = await catRepo.count();
  if (already > 0) {
    console.log('Seed: datos existentes, omito.');
    await ds.destroy();
    return;
  }

  const categories = catRepo.create([
    { name: 'Bebidas' },
    { name: 'Snacks' },
    { name: 'Limpieza' },
  ]);
  await catRepo.save(categories);

  const bebidas = categories.find(c => c.name === 'Bebidas')!;
  const snacks  = categories.find(c => c.name === 'Snacks')!;

  const products: Partial<Product>[] = [
    { sku: 'SKU-COCA-350', name: 'Coca 350ml', price: "1200", stock: 50, barcode: '7800000000001', category: { id: bebidas.id } as any },
    { sku: 'SKU-AGUA-500', name: 'Agua 500ml', price:  "900", stock: 80, barcode: '7800000000002', category: { id: bebidas.id } as any },
    { sku: 'SKU-PAPAS-90', name: 'Papas 90g',   price: "1500", stock: 40, barcode: '7800000000003', category: { id: snacks.id }  as any },
  ];

  await prodRepo.save(prodRepo.create(products));

  console.log('Seed: OK');
  await ds.destroy();
}

run().catch((e) => {
  console.error('Seed error:', e);
  process.exit(1);
});
