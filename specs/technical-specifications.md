# 技術仕様書

## アーキテクチャ概要

### システム構成

```
[ブラウザ] ←→ [Next.js App] ←→ [Azure Cosmos DB]
                ↓
        [JWT認証サービス]
```

## フロントエンド技術仕様

### Next.js 15

- **App Router**: 最新のルーティング方式を採用
- **Server Components**: パフォーマンス向上のため積極的に活用
- **API Routes**: バックエンド API エンドポイントとして使用
- **Middleware**: 認証チェックとリダイレクト処理

### TypeScript

- **型定義**: 全コンポーネントと API で厳密な型定義
- **インター faces**: データモデルと API レスポンスの型定義
- **generics**: 再利用可能なコンポーネント設計

### Tailwind CSS

- **レスポンシブデザイン**: モバイルファーストアプローチ
- **カスタムテーマ**: ブランドカラーとフォント設定
- **コンポーネントクラス**: 再利用可能なスタイル定義

## バックエンド技術仕様

### API 設計

- **RESTful API**: 標準的な HTTP メソッドを使用
- **JSON 形式**: リクエスト・レスポンスデータ
- **エラーハンドリング**: 統一されたエラーレスポンス形式

### API エンドポイント

#### 認証関連

```
POST /api/auth/register  - ユーザー登録
POST /api/auth/login     - ログイン
POST /api/auth/logout    - ログアウト
GET  /api/auth/me        - ユーザー情報取得
PUT  /api/auth/profile   - プロフィール更新
```

#### 商品関連

```
GET    /api/products           - 商品一覧取得
GET    /api/products/[id]      - 商品詳細取得
GET    /api/products/category/[category] - カテゴリ別商品取得
```

#### カート関連

```
GET    /api/cart        - カート内容取得
POST   /api/cart        - カートに商品追加
PUT    /api/cart/[id]   - カート商品数量更新
DELETE /api/cart/[id]   - カート商品削除
DELETE /api/cart        - カート全削除
```

#### 注文関連

```
POST /api/orders        - 注文作成
GET  /api/orders        - 注文履歴取得
GET  /api/orders/[id]   - 注文詳細取得
```

## データベース設計

### Azure Cosmos DB

- **データベース名**: contososhoppingdemo
- **パーティションキー戦略**: エンティティタイプ別

### データモデル

#### Users Collection

```typescript
interface User {
  id: string;
  email: string;
  password: string; // ハッシュ化
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Products Collection

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Orders Collection

```typescript
interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: Address;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

interface Address {
  zipCode: string;
  prefecture: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  phone: string;
}
```

#### Cart Collection (Optional - alternatively use localStorage)

```typescript
interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  updatedAt: Date;
}

interface CartItem {
  productId: string;
  quantity: number;
}
```

## セキュリティ仕様

### 認証・認可

- **JWT (JSON Web Token)**: ステートレス認証
- **トークン有効期限**: 24 時間
- **リフレッシュトークン**: 7 日間有効
- **パスワードハッシュ化**: bcrypt 使用

### セキュリティ対策

- **HTTPS 強制**: 本番環境では必須
- **CORS 設定**: 許可されたオリジンのみ
- **Rate Limiting**: API 呼び出し制限
- **入力検証**: 全 API エンドポイントでバリデーション

## パフォーマンス仕様

### フロントエンド最適化

- **画像最適化**: Next.js Image コンポーネント使用
- **コード分割**: 動的インポートによる遅延読み込み
- **キャッシュ戦略**: SWR または TanStack Query によるデータキャッシュ

### バックエンド最適化

- **データベースインデックス**: よく使用されるクエリに対して設定
- **レスポンス圧縮**: gzip 圧縮有効化
- **CDN**: 静的アセットの配信最適化

## 開発・運用仕様

### 開発環境

- **Node.js**: v18.0.0 以上
- **パッケージマネージャー**: npm
- **開発サーバー**: Next.js dev server (Turbopack)

### デプロイメント

- **ホスティング**: Vercel 推奨
- **環境変数**: 本番・開発環境で分離
- **CI/CD**: GitHub Actions（オプション）

### 監視・ログ

- **エラー追跡**: コンソールログとエラーハンドリング
- **パフォーマンス監視**: Web Vitals 計測
- **ログ出力**: 構造化ログ形式
