import type { Metadata } from 'next';
import { productRepo } from '@/lib/repositories';
import { ProductsClient } from './ProductsClient';

export const metadata: Metadata = { title: 'Products' };

export default async function ProductsPage() {
  const products = await productRepo.list({ sort: { field: 'createdAt', dir: 'desc' } });
  return <ProductsClient initial={products} />;
}
