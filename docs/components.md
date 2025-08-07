# コンポーネント設計

Contoso Shopping Demo では、再利用可能で保守しやすいコンポーネント設計を採用しています。

## 設計原則

### 1. 単一責任原則
各コンポーネントは明確な責任を持ち、一つのことをうまくやる。

### 2. 合成（Composition）
複雑なUIを小さなコンポーネントの組み合わせで構築。

### 3. 型安全性
すべてのコンポーネントでTypeScriptの厳密な型定義を使用。

### 4. アクセシビリティ
適切なsemantic HTML要素とARIA属性を使用。

## コンポーネント分類

### レイアウトコンポーネント

#### Header.tsx
**場所**: `src/components/layout/Header.tsx`
**責任**: サイト全体のヘッダーUI

**主要機能**:
- ナビゲーションメニュー
- 商品検索バー
- カートアイコン（アイテム数表示）
- ユーザー認証状態表示
- レスポンシブメニュー

**使用している状態**:
- `useCart()`: カート内アイテム数
- `useAuth()`: ログイン状態

**Props**: なし（Context から状態を取得）

#### Footer.tsx
**場所**: `src/components/layout/Footer.tsx`
**責任**: サイト全体のフッター

**主要機能**:
- 会社情報
- リンク集
- コピーライト

### ビジネスロジックコンポーネント

#### ProductsList.tsx
**場所**: `src/components/ProductsList.tsx`
**責任**: 商品一覧の表示と操作

**主要機能**:
- 商品一覧表示
- カテゴリフィルタリング
- 検索機能
- ソート機能
- ページネーション
- カートへの追加

**状態管理**:
```typescript
const [filteredProducts, setFilteredProducts] = useState<Product[]>()
const [selectedCategory, setSelectedCategory] = useState('')
const [searchQuery, setSearchQuery] = useState('')
const [sortBy, setSortBy] = useState<SortOption>('newest')
const [currentPage, setCurrentPage] = useState(1)
```

**外部依存**:
- `useCart()`: カート操作
- `useSearchParams()`: URL パラメータ

## ページコンポーネント

### app/page.tsx（ホームページ）
**責任**: トップページの表示

**主要セクション**:
1. **Hero Section**: メインビジュアル
2. **Featured Products**: 特集商品（4件）
3. **Categories**: カテゴリ一覧
4. **New Products**: 新着商品（8件）
5. **CTA Section**: アクション誘導

**データ取得**:
```typescript
const featuredProducts = mockProducts.slice(0, 4)
const newestProducts = mockProducts.slice(-8)
```

### app/products/page.tsx
**責任**: 商品一覧ページのラッパー

```typescript
export default function ProductsPage() {
  return <ProductsList />;
}
```

### app/products/[id]/page.tsx
**責任**: 商品詳細ページ

**主要機能**:
- 商品詳細表示
- 画像表示
- 数量選択
- カートに追加
- 関連商品表示

**動的ルーティング**:
```typescript
export default function ProductDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const product = getProductById(params.id)
  // ...
}
```

### app/cart/page.tsx
**責任**: カート内容の表示と管理

**主要機能**:
- カート内商品一覧
- 数量変更
- 商品削除
- 合計金額表示
- チェックアウトへの遷移

### app/checkout/page.tsx
**責任**: 注文手続き

**主要機能**:
- 配送先入力
- 支払い情報入力
- 注文確認
- 注文処理

**フォーム管理**:
```typescript
const [shippingAddress, setShippingAddress] = useState<Address>()
const [paymentMethod, setPaymentMethod] = useState('credit')
const [isProcessing, setIsProcessing] = useState(false)
```

### app/login/page.tsx
**責任**: ユーザーログイン

**主要機能**:
- ログインフォーム
- バリデーション
- エラーハンドリング
- ログイン処理

## コンポーネントの props 設計

### 基本的なProps型定義

```typescript
// 商品コンポーネントの例
interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: string) => void
  showQuantity?: boolean
  className?: string
}

// レイアウトコンポーネントの例
interface LayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}
```

### オプショナルProps
- デフォルト値を持つ props は `?` を使用
- `className` は常にオプショナル（スタイルのカスタマイズ用）

### 関数Props
- イベントハンドラーは `on` プレフィックス
- 非同期操作は適切な型を使用

## スタイリング戦略

### Tailwind CSS
すべてのコンポーネントで Tailwind CSS を使用：

```typescript
// レスポンシブデザイン
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

// 状態によるスタイル変更
<button className={`px-4 py-2 rounded ${
  isActive ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
}`}>
```

### カスタムクラス
`app/globals.css` でプロジェクト共通のスタイルを定義：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors;
  }
}
```

## 状態管理との連携

### Context の使用
```typescript
// カート操作
const { addItem, updateItem, removeItem } = useCart()

// 認証状態
const { isLoggedIn, user, login, logout } = useAuth()
```

### ローカル状態
コンポーネント固有の状態は `useState` を使用：

```typescript
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState<string | null>(null)
```

## エラーハンドリング

### エラー境界
```typescript
// 将来的な実装案
class ProductErrorBoundary extends React.Component {
  // エラー境界の実装
}
```

### エラー表示
```typescript
{error && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
    {error}
  </div>
)}
```

## パフォーマンス最適化

### React.memo
不要な再レンダリングを防ぐ：

```typescript
const ProductCard = React.memo(({ product, onAddToCart }: ProductCardProps) => {
  // コンポーネント実装
})
```

### useCallback
関数の再作成を防ぐ：

```typescript
const handleAddToCart = useCallback((productId: string) => {
  addItem(productId, 1)
}, [addItem])
```

### useMemo
計算コストの高い処理をメモ化：

```typescript
const filteredProducts = useMemo(() => {
  return products.filter(product => 
    product.category === selectedCategory
  )
}, [products, selectedCategory])
```

## アクセシビリティ

### セマンティックHTML
```typescript
<main role="main">
  <section aria-labelledby="featured-heading">
    <h2 id="featured-heading">特集商品</h2>
    {/* コンテンツ */}
  </section>
</main>
```

### キーボードナビゲーション
```typescript
<button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
>
```

### ARIA属性
```typescript
<button
  aria-expanded={isMenuOpen}
  aria-controls="mobile-menu"
  aria-label="メニューを開く"
>
```

## テスト戦略

### コンポーネントテスト（将来実装）
```typescript
// ProductCard.test.tsx
describe('ProductCard', () => {
  it('商品情報を正しく表示する', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument()
  })
})
```

## ベストプラクティス

### 1. コンポーネント分割
- 1ファイル1コンポーネント
- 責任を明確に分離
- 50行を超えたら分割を検討

### 2. 命名規則
- コンポーネント: PascalCase
- プロパティ: camelCase
- イベントハンドラー: `handle` + 動詞

### 3. インポート順序
1. React / Next.js
2. 外部ライブラリ
3. 内部コンポーネント
4. 型定義
5. 相対パス

### 4. TypeScript
- すべての Props に型定義
- any の使用を避ける
- 適切なジェネリクスの使用

### 5. パフォーマンス
- 不要な state の作成を避ける
- Effect の依存配列を適切に設定
- メモ化を適切に使用