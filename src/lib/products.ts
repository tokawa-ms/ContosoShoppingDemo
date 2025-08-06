import { Product } from '@/types';

// Mock product data for demo purposes
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'ワイヤレスイヤホン Pro',
    description: '高音質ワイヤレスイヤホン。ノイズキャンセリング機能付きで、長時間の使用も快適です。',
    price: 15800,
    images: ['/images/products/earphones-1.jpg'],
    category: 'エレクトロニクス',
    stock: 50,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'スマートウォッチ',
    description: '健康管理からエクササイズまで、様々な機能を搭載したスマートウォッチです。',
    price: 28900,
    images: ['/images/products/smartwatch-1.jpg'],
    category: 'エレクトロニクス',
    stock: 30,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    name: 'カジュアルTシャツ',
    description: '柔らかな素材で作られた、着心地の良いカジュアルTシャツです。',
    price: 3200,
    images: ['/images/products/tshirt-1.jpg'],
    category: 'ファッション',
    stock: 100,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
  {
    id: '4',
    name: 'デニムジャケット',
    description: 'クラシックなデザインのデニムジャケット。どんなスタイルにも合わせやすい定番アイテムです。',
    price: 8900,
    images: ['/images/products/denim-jacket-1.jpg'],
    category: 'ファッション',
    stock: 25,
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04'),
  },
  {
    id: '5',
    name: 'コーヒーメーカー',
    description: '本格的なコーヒーが楽しめる全自動コーヒーメーカーです。忙しい朝でも簡単操作。',
    price: 19800,
    images: ['/images/products/coffee-maker-1.jpg'],
    category: 'ホーム&ガーデン',
    stock: 15,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: '6',
    name: '観葉植物セット',
    description: 'お部屋を明るくする観葉植物のセットです。初心者でも育てやすい品種を厳選しました。',
    price: 5600,
    images: ['/images/products/plants-1.jpg'],
    category: 'ホーム&ガーデン',
    stock: 40,
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06'),
  },
  {
    id: '7',
    name: 'ヨガマット',
    description: '滑りにくい素材で作られた高品質なヨガマット。自宅でのエクササイズに最適です。',
    price: 4800,
    images: ['/images/products/yoga-mat-1.jpg'],
    category: 'スポーツ',
    stock: 60,
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-07'),
  },
  {
    id: '8',
    name: 'ランニングシューズ',
    description: '軽量で履き心地の良いランニングシューズ。毎日のランニングをサポートします。',
    price: 12600,
    images: ['/images/products/running-shoes-1.jpg'],
    category: 'スポーツ',
    stock: 35,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
  },
  {
    id: '9',
    name: 'プログラミング入門書',
    description: '初心者向けのプログラミング入門書。基礎から実践まで分かりやすく解説しています。',
    price: 2800,
    images: ['/images/products/programming-book-1.jpg'],
    category: '書籍',
    stock: 80,
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-09'),
  },
  {
    id: '10',
    name: 'デザイン思考の本',
    description: 'デザイン思考について学べる実践的な書籍。ビジネスに活かせるアイデアが満載です。',
    price: 3400,
    images: ['/images/products/design-book-1.jpg'],
    category: '書籍',
    stock: 45,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '11',
    name: 'ワイヤレス充電器',
    description: 'スマートフォンやワイヤレスイヤホンを置くだけで充電できる便利な充電器です。',
    price: 6800,
    images: ['/images/products/wireless-charger-1.jpg'],
    category: 'エレクトロニクス',
    stock: 70,
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
  },
  {
    id: '12',
    name: 'リュックサック',
    description: '通勤・通学に便利な大容量リュックサック。PCも安全に収納できる設計です。',
    price: 9800,
    images: ['/images/products/backpack-1.jpg'],
    category: 'ファッション',
    stock: 55,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
];

export const categories = [
  'エレクトロニクス',
  'ファッション',
  'ホーム&ガーデン',
  'スポーツ',
  '書籍',
];

// Helper functions
export function getProductById(id: string): Product | undefined {
  return mockProducts.find(product => product.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return mockProducts.filter(product => product.category === category);
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery) ||
    product.category.toLowerCase().includes(lowerQuery)
  );
}

export function sortProducts(products: Product[], sortBy: 'name' | 'price-asc' | 'price-desc' | 'newest'): Product[] {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'newest':
      return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    default:
      return sorted;
  }
}