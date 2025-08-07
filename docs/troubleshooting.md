# トラブルシューティング

Contoso Shopping Demo の開発・運用中によく発生する問題と解決方法をまとめました。

## 開発環境の問題

### Node.js / npm 関連

#### 問題: `npm install` が失敗する
```bash
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**解決方法:**
```bash
# 1. Node.js バージョンを確認（18.17.0 以上必要）
node --version

# 2. npm キャッシュをクリア
npm cache clean --force

# 3. node_modules とロックファイルを削除
rm -rf node_modules package-lock.json

# 4. 再インストール
npm install

# 5. それでも失敗する場合は --legacy-peer-deps を使用
npm install --legacy-peer-deps
```

#### 問題: 開発サーバーが起動しない
```bash
Error: listen EADDRINUSE :::3000
```

**解決方法:**
```bash
# 1. ポートを変更して起動
npm run dev -- -p 3001

# 2. または、使用中のプロセスを終了
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

#### 問題: TypeScript エラーが解決されない
```bash
Type 'X' is not assignable to type 'Y'
```

**解決方法:**
```bash
# 1. TypeScript キャッシュをクリア
npx tsc --build --clean

# 2. TypeScript サーバーを再起動（VS Code）
Ctrl/Cmd + Shift + P → "TypeScript: Restart TS Server"

# 3. 型定義を再確認
npm install @types/node @types/react @types/react-dom --save-dev
```

### Next.js 関連

#### 問題: ページが 404 エラーになる
```bash
This page could not be found.
```

**確認事項:**
1. ファイル名が正しいか（`page.tsx`）
2. ディレクトリ構造が正しいか
3. `layout.tsx` が存在するか

**解決方法:**
```bash
# 開発サーバーを再起動
npm run dev

# ビルドキャッシュをクリア
rm -rf .next
npm run dev
```

#### 問題: 画像が表示されない
```bash
Error: Invalid src prop on `next/image`
```

**解決方法:**
```typescript
// 1. next.config.ts で画像ドメインを設定
const nextConfig = {
  images: {
    domains: ['example.com'],
    // または、外部画像を無効化
    unoptimized: true,
  },
}

// 2. public ディレクトリの画像パスを確認
<Image src="/images/product.png" alt="Product" />
```

#### 問題: 環境変数が読み込まれない
```bash
process.env.NEXT_PUBLIC_API_URL is undefined
```

**解決方法:**
1. 環境変数名に `NEXT_PUBLIC_` プレフィックスがあるか確認
2. `.env.local` ファイルが正しい場所にあるか確認
3. 開発サーバーを再起動

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# 再起動
npm run dev
```

## ビルド・デプロイの問題

### ビルドエラー

#### 問題: TypeScript エラーでビルドが失敗
```bash
Type error: Property 'X' does not exist on type 'Y'
```

**解決方法:**
```bash
# 1. 型定義を確認・修正
# 2. 厳密な型チェックを一時的に無効化（推奨しない）
// next.config.ts
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
}

# 3. 型エラーを段階的に修正
npx tsc --noEmit
```

#### 問題: ESLint エラーでビルドが失敗
```bash
Error: ESLint found problems in X files
```

**解決方法:**
```bash
# 1. 自動修正を試行
npm run lint -- --fix

# 2. 特定のルールを無効化
// eslint.config.mjs
export default [
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
]

# 3. ESLint チェックを一時的にスキップ（推奨しない）
// next.config.ts
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
}
```

### メモリ不足

#### 問題: ビルド時にメモリ不足
```bash
JavaScript heap out of memory
```

**解決方法:**
```bash
# 1. Node.js のメモリ制限を増加
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# 2. package.json のスクリプトを更新
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

## 認証関連の問題

### ログイン機能

#### 問題: ログインできない
**確認事項:**
1. 正しいクレデンシャルを使用しているか
   - メールアドレス: `test@contoso.com`
   - パスワード: `hogehoge`

**解決方法:**
```typescript
// 1. AuthContext のエラー状態を確認
const { error } = useAuth()
console.log('Auth error:', error)

// 2. ネットワークタブでリクエストを確認
// 3. localStorage をクリア
localStorage.removeItem('contososhoppingdemo_auth_user')
```

#### 問題: ログイン状態が保持されない
**解決方法:**
```typescript
// 1. localStorage の確認
console.log(localStorage.getItem('contososhoppingdemo_auth_user'))

// 2. セッション検証の確認
// src/lib/auth.ts の validateSession 関数をチェック

// 3. ブラウザの設定確認
// プライベートモードや Cookie 設定の確認
```

## カート機能の問題

### カート操作

#### 問題: カートに商品が追加されない
**デバッグ手順:**
```typescript
// 1. カート状態の確認
const { items, total, itemCount } = useCart()
console.log('Cart state:', { items, total, itemCount })

// 2. localStorage の確認
console.log(localStorage.getItem('contososhoppingdemo_cart'))

// 3. エラーの確認
try {
  addItem(productId, 1)
} catch (error) {
  console.error('Add to cart error:', error)
}
```

#### 問題: カート総額が正しく計算されない
**解決方法:**
```typescript
// CartContext.tsx の calculateCartTotals 関数を確認
function calculateCartTotals(items: CartItem[]): CartState {
  const total = items.reduce((sum, item) => {
    const product = getProductById(item.productId)
    if (!product) {
      console.warn('Product not found:', item.productId)
      return sum
    }
    return sum + (product.price * item.quantity)
  }, 0)
  
  return { items, total, itemCount: items.reduce((sum, item) => sum + item.quantity, 0) }
}
```

## パフォーマンスの問題

### 表示速度が遅い

#### 問題: ページ読み込みが遅い
**診断方法:**
```bash
# 1. Next.js ビルド分析
npm run build
# バンドルサイズを確認

# 2. Chrome DevTools で分析
# Network タブでリソース読み込み時間を確認
# Performance タブでレンダリング時間を確認
```

**最適化方法:**
```typescript
// 1. 画像最適化
import Image from 'next/image'
<Image
  src="/product.jpg"
  alt="Product"
  width={300}
  height={300}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// 2. 動的インポート
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
})

// 3. メモ化
const ProductList = React.memo(({ products }) => {
  // コンポーネント実装
})
```

#### 問題: 検索が遅い
**解決方法:**
```typescript
// デバウンス機能の追加
import { useMemo, useState, useEffect } from 'react'

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// 使用例
const [searchQuery, setSearchQuery] = useState('')
const debouncedSearchQuery = useDebounce(searchQuery, 300)

const filteredProducts = useMemo(() => {
  if (!debouncedSearchQuery) return products
  return searchProducts(debouncedSearchQuery)
}, [debouncedSearchQuery, products])
```

## ブラウザ固有の問題

### Safari

#### 問題: CSS が正しく表示されない
**解決方法:**
```css
/* Tailwind CSS で Safari 固有の問題を修正 */
.safari-fix {
  @apply transform-gpu; /* Hardware acceleration */
}

/* ベンダープレフィックスの追加 */
.custom-gradient {
  background: -webkit-linear-gradient(45deg, #667eea, #764ba2);
  background: linear-gradient(45deg, #667eea, #764ba2);
}
```

### Internet Explorer（サポート対象外）
Next.js 15 は IE をサポートしていませんが、モダンブラウザへの移行を促すメッセージを表示できます。

## データベース関連（将来実装）

### 接続エラー
```bash
MongoNetworkError: failed to connect to server
```

**解決方法:**
```typescript
// 接続リトライロジック
const connectWithRetry = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL)
  } catch (error) {
    console.error('Database connection failed, retrying...', error)
    setTimeout(connectWithRetry, 5000)
  }
}
```

## よくある質問（FAQ）

### Q: モック認証の本物の認証への移行方法は？
**A:** 
1. `src/lib/auth.ts` を実際の認証 API に置換
2. JWT トークンの検証実装
3. ミドルウェアでの認証チェック追加

### Q: 新しい商品カテゴリを追加する方法は？
**A:**
```typescript
// src/lib/products.ts
export const categories = [
  'エレクトロニクス',
  'ファッション',
  'ホーム&ガーデン',
  'スポーツ',
  '書籍',
  '新しいカテゴリ', // 追加
]
```

### Q: 決済機能を追加する方法は？
**A:**
1. Stripe や PayPal の SDK を統合
2. 決済フォームコンポーネントの作成
3. バックエンド API での決済処理実装

## ログ分析

### 開発環境でのデバッグ
```typescript
// デバッグ用のログ機能
const logger = {
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, data)
    }
  },
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error)
  },
}

// 使用例
logger.debug('Cart item added', { productId, quantity })
```

### 本番環境でのエラー追跡
```typescript
// Sentry などの外部サービスでエラー監視
import * as Sentry from '@sentry/nextjs'

Sentry.captureException(new Error('Something went wrong'))
```

## サポート

問題が解決しない場合は、以下の手順でサポートを求めてください：

1. **GitHub Issues** で同様の問題を検索
2. **再現手順** を明確にして新しい Issue を作成
3. **環境情報** を含める（OS、ブラウザ、Node.js バージョン）
4. **エラーメッセージ** の全文を記載
5. **スクリーンショット** があれば添付

### Issue テンプレート
```markdown
## 問題の概要


## 環境
- OS: 
- Node.js: 
- npm: 
- ブラウザ: 

## 再現手順
1. 
2. 
3. 

## 期待する結果


## 実際の結果


## エラーメッセージ
```

---

この文書で解決しない問題がある場合は、遠慮なく Issue を作成してください。コミュニティ全体の知識向上に貢献します。