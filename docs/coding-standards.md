# コーディング規約

Contoso Shopping Demo プロジェクトのコーディング規約とベストプラクティスを定めます。

## 全般的な原則

### 1. 一貫性
- プロジェクト全体で一貫したスタイルを維持
- 既存のコードスタイルに合わせる
- チーム内での規約遵守

### 2. 可読性
- 理解しやすいコードを書く
- 適切な命名と構造化
- 必要に応じたコメント

### 3. 保守性
- 変更しやすい設計
- モジュラーな構成
- 適切な抽象化

## TypeScript

### 型定義

#### 厳密な型付け
```typescript
// ✅ 良い例
interface Product {
  id: string
  name: string
  price: number
  images: string[]
  category: string
  stock: number
  createdAt: Date
  updatedAt: Date
}

// ❌ 避けるべき例
interface Product {
  id: any
  name: any
  price: any
  // ...
}
```

#### ユニオン型の活用
```typescript
// ✅ 良い例
type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered'

interface Order {
  id: string
  status: OrderStatus
}

// ❌ 避けるべき例
interface Order {
  id: string
  status: string // どんな値でも許可してしまう
}
```

#### オプショナルプロパティ
```typescript
// ✅ 良い例
interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string // オプショナル
}

// ❌ 避けるべき例
interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | undefined // undefined を明示的に許可
}
```

### 関数の型定義

#### 引数と戻り値の型
```typescript
// ✅ 良い例
function getProductById(id: string): Product | undefined {
  return mockProducts.find(product => product.id === id)
}

// 非同期関数
async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('/api/products')
  return response.json()
}

// ❌ 避けるべき例
function getProductById(id: any): any {
  return mockProducts.find(product => product.id === id)
}
```

#### ジェネリクス
```typescript
// ✅ 良い例
interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

function createApiResponse<T>(data: T): ApiResponse<T> {
  return {
    data,
    status: 200,
    message: 'Success'
  }
}

// 使用例
const productResponse: ApiResponse<Product[]> = createApiResponse(products)
```

## React

### コンポーネント定義

#### 関数コンポーネント
```typescript
// ✅ 良い例
interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: string) => void
  className?: string
}

export default function ProductCard({ 
  product, 
  onAddToCart, 
  className 
}: ProductCardProps) {
  return (
    <div className={className}>
      {/* コンポーネント実装 */}
    </div>
  )
}

// ❌ 避けるべき例
export default function ProductCard(props: any) {
  return <div>{/* 実装 */}</div>
}
```

#### Props の分割代入
```typescript
// ✅ 良い例
export default function Header({ title, showSearch = true }: HeaderProps) {
  // ...
}

// ❌ 避けるべき例
export default function Header(props: HeaderProps) {
  const title = props.title
  const showSearch = props.showSearch || true
  // ...
}
```

### フック使用

#### useState
```typescript
// ✅ 良い例
const [products, setProducts] = useState<Product[]>([])
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState<string | null>(null)

// ❌ 避けるべき例
const [products, setProducts] = useState([]) // 型推論に頼る
const [isLoading, setIsLoading] = useState() // 初期値なし
```

#### useEffect
```typescript
// ✅ 良い例
useEffect(() => {
  const fetchData = async () => {
    try {
      setIsLoading(true)
      const data = await fetchProducts()
      setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  fetchData()
}, []) // 依存配列を適切に設定

// ❌ 避けるべき例
useEffect(() => {
  fetchProducts().then(setProducts)
}) // 依存配列なし（無限ループの危険）
```

#### カスタムフック
```typescript
// ✅ 良い例
function useProductSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const search = useCallback(async (searchQuery: string) => {
    setIsLoading(true)
    try {
      const filtered = searchProducts(searchQuery)
      setResults(filtered)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (query) {
      search(query)
    } else {
      setResults([])
    }
  }, [query, search])

  return { query, setQuery, results, isLoading }
}
```

## 命名規則

### ファイル名
```bash
# ✅ コンポーネント（PascalCase）
ProductCard.tsx
UserProfile.tsx
ShoppingCart.tsx

# ✅ ページ（ディレクトリ + page.tsx）
products/page.tsx
checkout/success/page.tsx

# ✅ ユーティリティ（camelCase）
products.ts
auth.ts
cartUtils.ts

# ✅ 型定義
types/index.ts
types/api.ts
```

### 変数・関数名
```typescript
// ✅ 変数（camelCase）
const productList = []
const isUserLoggedIn = false
const currentCartTotal = 0

// ✅ 関数（動詞 + 名詞）
function getProductById(id: string) {}
function addItemToCart(item: CartItem) {}
function validateUserInput(input: string) {}

// ✅ boolean 変数（is/has/can/should）
const isLoading = false
const hasPermission = true
const canEdit = false
const shouldShow = true

// ❌ 避けるべき例
const flag = true // 意味が不明
const data = [] // 汎用的すぎる
const temp = null // 一時的な名前
```

### 定数
```typescript
// ✅ 良い例（SCREAMING_SNAKE_CASE）
const MAX_PRODUCTS_PER_PAGE = 12
const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  AUTH: '/api/auth',
  CART: '/api/cart'
} as const

const CART_STORAGE_KEY = 'contososhoppingdemo_cart'
```

### CSS クラス名
```typescript
// ✅ Tailwind CSS（既存のクラス使用）
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">

// ✅ カスタムクラス（kebab-case）
<div className="product-card product-card--featured">

// ✅ 条件付きクラス
<button className={`btn ${isPrimary ? 'btn-primary' : 'btn-secondary'}`}>
```

## インポート・エクスポート

### インポート順序
```typescript
// 1. React / Next.js
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// 2. 外部ライブラリ
import { clsx } from 'clsx'

// 3. 内部コンポーネント
import Header from '@/components/layout/Header'
import ProductCard from '@/components/ProductCard'

// 4. 内部ユーティリティ・型
import { useCart } from '@/contexts/CartContext'
import { Product } from '@/types'
import { getProductById } from '@/lib/products'

// 5. 相対パス
import './Component.css'
```

### エクスポート
```typescript
// ✅ デフォルトエクスポート（コンポーネント）
export default function ProductCard({ product }: ProductCardProps) {
  // ...
}

// ✅ 名前付きエクスポート（ユーティリティ）
export function getProductById(id: string): Product | undefined {
  // ...
}

export function searchProducts(query: string): Product[] {
  // ...
}

// ✅ 型のエクスポート
export type { Product, User, Cart } from './types'
```

## CSS / Tailwind CSS

### クラス名の構成
```typescript
// ✅ 良い例（論理的なグループ化）
<div className="
  flex items-center justify-between
  p-4 mb-4
  bg-white border border-gray-200
  rounded-lg shadow-md
  hover:shadow-lg transition-shadow
">

// ❌ 避けるべき例（順序がばらばら）
<div className="bg-white flex p-4 shadow-md border-gray-200 items-center rounded-lg mb-4 border hover:shadow-lg justify-between transition-shadow">
```

### レスポンシブデザイン
```typescript
// ✅ モバイルファーストアプローチ
<div className="
  grid grid-cols-1 gap-4
  md:grid-cols-2 md:gap-6
  lg:grid-cols-3 lg:gap-8
">

// ✅ ブレークポイント別の調整
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
```

### カスタムクラス
```css
/* globals.css */
@layer components {
  .btn-primary {
    @apply bg-primary-600 text-white px-4 py-2 rounded-lg;
    @apply hover:bg-primary-700 focus:ring-2 focus:ring-primary-500;
    @apply transition-colors duration-200;
  }
  
  .product-card {
    @apply bg-white rounded-lg shadow-md overflow-hidden;
    @apply hover:shadow-lg transition-shadow duration-300;
  }
}
```

## エラーハンドリング

### try-catch の使用
```typescript
// ✅ 良い例
async function fetchUserData(userId: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/${userId}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const userData = await response.json()
    return userData
  } catch (error) {
    console.error('Failed to fetch user data:', error)
    
    // 適切なエラーハンドリング
    if (error instanceof Error) {
      throw new Error(`ユーザーデータの取得に失敗しました: ${error.message}`)
    } else {
      throw new Error('ユーザーデータの取得に失敗しました')
    }
  }
}
```

### エラー境界
```typescript
// ✅ エラー境界コンポーネント
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ProductErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Product error boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>商品の読み込みでエラーが発生しました</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            再試行
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

## コメント

### JSDoc
```typescript
/**
 * 商品IDから商品情報を取得する
 * @param id - 商品ID
 * @returns 商品情報、見つからない場合は undefined
 */
function getProductById(id: string): Product | undefined {
  return mockProducts.find(product => product.id === id)
}

/**
 * 商品を検索する
 * @param query - 検索クエリ
 * @param options - 検索オプション
 * @param options.category - カテゴリフィルタ
 * @param options.sortBy - ソート順
 * @returns 検索結果の商品配列
 */
function searchProducts(
  query: string,
  options: {
    category?: string
    sortBy?: 'name' | 'price-asc' | 'price-desc' | 'newest'
  } = {}
): Product[] {
  // 実装
}
```

### インラインコメント
```typescript
// ✅ 必要な場合のみ説明を追加
const calculateTax = (price: number): number => {
  // 日本の消費税率（10%）を適用
  return Math.round(price * 0.1)
}

// ✅ 複雑なロジックの説明
const sortedProducts = useMemo(() => {
  // 1. カテゴリでフィルタリング
  let filtered = selectedCategory 
    ? products.filter(p => p.category === selectedCategory)
    : products

  // 2. 検索クエリでフィルタリング
  if (searchQuery) {
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  // 3. ソート処理
  return sortProducts(filtered, sortBy)
}, [products, selectedCategory, searchQuery, sortBy])

// ❌ 自明なコメントは避ける
const total = price + tax // 価格と税金を足す
```

## テスト

### テストファイル名
```bash
# ✅ テストファイル
components/__tests__/ProductCard.test.tsx
utils/__tests__/products.test.ts
hooks/__tests__/useCart.test.ts

# ✅ テストディレクトリ
__tests__/
├── components/
├── utils/
└── integration/
```

### テストケース
```typescript
// ✅ 良い例
describe('ProductCard', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'テスト商品',
    price: 1000,
    // ...
  }

  it('商品名を正しく表示する', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('テスト商品')).toBeInTheDocument()
  })

  it('カートに追加ボタンクリック時に適切な関数を呼び出す', () => {
    const mockAddToCart = jest.fn()
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />)
    
    fireEvent.click(screen.getByText('カートに追加'))
    expect(mockAddToCart).toHaveBeenCalledWith('1')
  })
})
```

## パフォーマンス

### メモ化
```typescript
// ✅ 適切なメモ化
const ExpensiveComponent = React.memo(({ data }: { data: Product[] }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      formattedPrice: `¥${item.price.toLocaleString()}`
    }))
  }, [data])

  return <div>{/* レンダリング */}</div>
})

// ✅ useCallback の適切な使用
const ProductList = ({ products }: { products: Product[] }) => {
  const handleAddToCart = useCallback((productId: string) => {
    addItem(productId, 1)
  }, [addItem])

  return (
    <div>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  )
}
```

## リンティング設定

### ESLint ルール
```javascript
// eslint.config.mjs
export default [
  {
    rules: {
      // TypeScript
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/prefer-const': 'error',
      
      // React
      'react/jsx-key': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      
      // 一般
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
]
```

この規約に従うことで、プロジェクト全体の品質と保守性を向上させることができます。