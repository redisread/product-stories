import { readFile } from 'fs/promises';
import { join } from 'path';
import yaml from 'js-yaml';
import { glob } from 'fast-glob';
import type { Product } from '@/types/story';

const PRODUCTS_DIR = join(process.cwd(), 'content/products');

/**
 * 加载所有产品元数据
 */
export async function loadProducts(): Promise<Product[]> {
  try {
    const files = await glob('*.yml', { cwd: PRODUCTS_DIR });

    const products = await Promise.all(
      files.map(async (file) => {
        const content = await readFile(join(PRODUCTS_DIR, file), 'utf-8');
        const data = yaml.load(content) as Product;
        return {
          ...data,
          id: data.id || file.replace('.yml', ''),
        };
      })
    );

    // 按 order 排序
    return products.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Failed to load products:', error);
    return [];
  }
}

/**
 * 获取单个产品
 */
export async function getProduct(id: string): Promise<Product | undefined> {
  const products = await loadProducts();
  return products.find((p) => p.id === id);
}

/**
 * 获取产品名称（用于显示）
 */
export async function getProductDisplayName(id: string): Promise<string> {
  const product = await getProduct(id);
  return product?.name || id;
}

/**
 * 获取产品颜色
 */
export async function getProductColor(id: string): Promise<string> {
  const colors: Record<string, string> = {
    'design-system': '#8b5cf6',
    'web-platform': '#3b82f6',
    'mobile-app': '#10b981',
    'api-service': '#f59e0b',
    'ios': '#6366f1',
    'android': '#22c55e',
  };

  const product = await getProduct(id);
  return product?.color || colors[id] || '#6b7280';
}

/**
 * 从产品名称数组获取产品 ID
 */
export function normalizeProductName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * 产品选项列表（用于筛选器）
 */
export async function getProductOptions(): Promise<
  { value: string; label: string; color: string }[]
> {
  const products = await loadProducts();
  return products.map((p) => ({
    value: p.id,
    label: p.name,
    color: p.color || '#6b7280',
  }));
}
