# コントリビューションガイド

Contoso Shopping Demo プロジェクトへのコントリビューションを歓迎します！このガイドでは、プロジェクトに貢献する方法を説明します。

## はじめに

### プロジェクトの目的
Contoso Shopping Demo は、最新の Web 技術を使用したモダンな E コマースアプリケーションのデモンストレーションです。学習目的と技術検証を主な目的としています。

### コントリビューションの種類
以下のような貢献を歓迎します：
- バグ修正
- 新機能の追加
- パフォーマンス改善
- ドキュメントの改善
- テストの追加
- UI/UX の改善

## 開発環境のセットアップ

### 前提条件
- Node.js 18.17.0 以上
- npm 9.0.0 以上
- Git

### セットアップ手順

1. **リポジトリのフォーク**
   ```bash
   # GitHub でリポジトリをフォーク
   git clone https://github.com/YOUR_USERNAME/ContosoShoppingDemo.git
   cd ContosoShoppingDemo
   ```

2. **依存関係のインストール**
   ```bash
   npm install
   ```

3. **開発サーバーの起動**
   ```bash
   npm run dev
   ```

4. **ブランチの作成**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## コーディング規約

### TypeScript
- 厳密な型定義を使用
- `any` の使用は避ける
- インターフェースの適切な定義

```typescript
// 良い例
interface ProductCardProps {
  product: Product
  onAddToCart: (productId: string) => void
  className?: string
}

// 避けるべき例
const props: any = { ... }
```

### React コンポーネント
- 関数コンポーネントを使用
- PascalCase でファイル名を命名
- デフォルトエクスポートを使用

```typescript
// ProductCard.tsx
interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return <div>{product.name}</div>
}
```

### CSS/Tailwind
- Tailwind CSS の使用を推奨
- レスポンシブデザインの実装
- 再利用可能なクラスの作成

```typescript
// レスポンシブ対応
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

// カスタムクラス（globals.css）
.btn-primary {
  @apply bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors;
}
```

### ファイル構成
- 機能別のディレクトリ構成
- インポートの適切な順序
- パスエイリアス（`@/`）の使用

```typescript
// インポート順序
import { useState } from 'react'          // React
import Link from 'next/link'             // Next.js
import { Product } from '@/types'         // 内部型定義
import { useCart } from '@/contexts/CartContext' // 内部Context
import './Component.css'                  // CSS（相対パス）
```

## 開発ワークフロー

### 1. Issue の確認
- 既存の Issue を確認
- 新しい機能や修正の提案は Issue で議論
- 担当者の確認と重複作業の防止

### 2. ブランチ戦略
```bash
# 機能追加
git checkout -b feature/add-user-profile

# バグ修正
git checkout -b fix/cart-calculation-error

# ドキュメント
git checkout -b docs/update-api-documentation

# 改善
git checkout -b improvement/optimize-image-loading
```

### 3. コミットメッセージ
[Conventional Commits](https://www.conventionalcommits.org/) に従う：

```bash
# 機能追加
git commit -m "feat: add user profile page"

# バグ修正
git commit -m "fix: resolve cart total calculation issue"

# ドキュメント
git commit -m "docs: update API documentation"

# スタイル
git commit -m "style: improve product card layout"

# リファクタリング
git commit -m "refactor: extract cart logic to custom hook"

# テスト
git commit -m "test: add unit tests for product utilities"
```

### 4. プルリクエスト

#### PR の作成前
```bash
# コードの品質チェック
npm run lint
npm run build
npm test

# 最新の main ブランチと同期
git checkout main
git pull origin main
git checkout your-feature-branch
git rebase main
```

#### PR テンプレート
```markdown
## 概要
この PR は何を変更しますか？

## 変更内容
- [ ] 機能A の追加
- [ ] バグB の修正
- [ ] ドキュメントC の更新

## テスト
- [ ] 既存のテストが通ることを確認
- [ ] 新しいテストを追加（該当する場合）
- [ ] 手動テストを実施

## スクリーンショット
UI 変更がある場合は、Before/After のスクリーンショットを添付

## チェックリスト
- [ ] ESLint エラーがない
- [ ] TypeScript エラーがない
- [ ] ビルドが成功する
- [ ] 関連ドキュメントを更新
```

## コードレビュー

### レビュー観点
1. **機能性**: 要件を満たしているか
2. **コード品質**: 読みやすく保守しやすいか
3. **パフォーマンス**: 不要な処理がないか
4. **セキュリティ**: 脆弱性がないか
5. **テスト**: 適切にテストされているか

### レビューコメント例
```markdown
# 建設的なフィードバック
💡 この部分は `useMemo` を使用することでパフォーマンスが向上しそうです

# 質問
❓ この実装の理由を教えてください

# 提案
🔧 この条件分岐は早期リターンパターンを使うとより読みやすくなります

# 称賛
👍 この実装は非常にエレガントですね！
```

## テスト

### テスト戦略
現在はテストの実装が未完了ですが、以下の方針で進めます：

#### ユニットテスト
```typescript
// utils/products.test.ts
import { getProductById, searchProducts } from '../products'

describe('Products utilities', () => {
  test('should return product by id', () => {
    const product = getProductById('1')
    expect(product).toBeDefined()
    expect(product?.id).toBe('1')
  })
  
  test('should return products matching search query', () => {
    const results = searchProducts('イヤホン')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].name).toContain('イヤホン')
  })
})
```

#### コンポーネントテスト
```typescript
// components/__tests__/ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import ProductCard from '../ProductCard'

const mockProduct = {
  id: '1',
  name: 'テスト商品',
  price: 1000,
  // ...
}

test('should render product information', () => {
  render(<ProductCard product={mockProduct} />)
  
  expect(screen.getByText('テスト商品')).toBeInTheDocument()
  expect(screen.getByText('¥1,000')).toBeInTheDocument()
})

test('should call onAddToCart when button clicked', () => {
  const mockAddToCart = jest.fn()
  render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />)
  
  fireEvent.click(screen.getByText('カートに追加'))
  expect(mockAddToCart).toHaveBeenCalledWith('1')
})
```

#### E2E テスト
```typescript
// e2e/shopping-flow.spec.ts
import { test, expect } from '@playwright/test'

test('complete shopping flow', async ({ page }) => {
  await page.goto('/')
  
  // 商品を選択
  await page.click('[data-testid="product-1"]')
  
  // カートに追加
  await page.click('[data-testid="add-to-cart"]')
  
  // カートページに移動
  await page.click('[data-testid="cart-icon"]')
  
  // チェックアウトページに移動
  await page.click('[data-testid="checkout-button"]')
  
  // フォーム入力
  await page.fill('[data-testid="email"]', 'test@example.com')
  // ...
  
  // 注文完了
  await page.click('[data-testid="place-order"]')
  
  // 成功ページの確認
  await expect(page.locator('[data-testid="order-success"]')).toBeVisible()
})
```

## ドキュメント

### ドキュメントの更新
新機能や変更に伴うドキュメントの更新：

1. **API 変更**: `docs/api-documentation.md`
2. **新コンポーネント**: `docs/components.md`
3. **設定変更**: `docs/development-setup.md`
4. **デプロイ手順**: `docs/deployment.md`

### ドキュメント作成ガイドライン
- 明確で簡潔な説明
- コード例の提供
- 図表の活用（必要に応じて）
- 段階的な手順説明

## Issue 報告

### バグ報告
```markdown
## バグの概要
何が起こっているかを簡潔に説明

## 再現手順
1. ページA にアクセス
2. ボタンB をクリック
3. エラーが発生

## 期待する動作
何が起こるべきかを説明

## 実際の動作
実際に何が起こったかを説明

## 環境
- OS: Windows 11
- Browser: Chrome 120.0.0.0
- Node.js: v18.17.0

## スクリーンショット
エラー画面のスクリーンショット

## 追加情報
その他の関連情報
```

### 機能要求
```markdown
## 機能の概要
提案する機能の説明

## 背景・動機
なぜこの機能が必要かを説明

## 提案する解決策
どのように実装するかのアイデア

## 代替案
他の実装方法があれば記載

## 追加コンテキスト
その他の関連情報
```

## リリースプロセス

### バージョニング
[Semantic Versioning](https://semver.org/) に従う：

- **MAJOR**: 破壊的変更
- **MINOR**: 機能追加（後方互換性あり）
- **PATCH**: バグ修正

### リリース手順
1. `main` ブランチで変更を確認
2. バージョン番号を更新
3. リリースノートを作成
4. タグを作成してプッシュ

```bash
# バージョン更新
npm version patch  # または minor, major

# タグの作成
git push origin main --tags
```

## コミュニティ

### 行動規範
- 相互尊重と建設的な議論
- 多様性と包括性の尊重
- 学習と成長の促進

### コミュニケーション
- GitHub Issues: バグ報告・機能要求
- GitHub Discussions: 一般的な議論
- Pull Requests: コードレビュー

### 質問とサポート
質問がある場合は、以下の順序で確認してください：

1. [ドキュメント](./README.md) を確認
2. [既存の Issues](https://github.com/tokawa-ms/ContosoShoppingDemo/issues) を検索
3. 新しい Issue を作成

## 認識

すべてのコントリビューターは [Contributors](https://github.com/tokawa-ms/ContosoShoppingDemo/graphs/contributors) ページで認識されます。

---

ご質問やご不明な点がございましたら、お気軽に Issue を作成してお知らせください。コントリビューションをお待ちしています！