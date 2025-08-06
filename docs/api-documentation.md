# API 仕様

Next Shop Demo は現在モック実装を使用していますが、将来的な API 統合に向けた設計を文書化します。

## 概要

### 現在の実装
- **データソース**: モックデータ（`src/lib/products.ts`, `src/lib/auth.ts`）
- **状態管理**: React Context API + localStorage
- **認証**: モックベース（固定クレデンシャル）

### 将来の API 設計
- **アーキテクチャ**: RESTful API
- **データ形式**: JSON
- **認証**: JWT Bearer Token
- **ベースURL**: `https://api.nextshopdemo.com/v1`

## 認証 API

### POST /api/auth/login
ユーザーログイン

**リクエスト:**
```json
{
  "email": "test@contoso.com",
  "password": "hogehoge"
}
```

**レスポンス（成功）:**
```json
{
  "success": true,
  "user": {
    "id": "user-001",
    "email": "test@contoso.com",
    "firstName": "テスト",
    "lastName": "ユーザー",
    "phone": "090-1234-5678"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "rt_abc123..."
}
```

**レスポンス（エラー）:**
```json
{
  "success": false,
  "error": "メールアドレスまたはパスワードが正しくありません"
}
```

### POST /api/auth/register
ユーザー登録

**リクエスト:**
```json
{
  "email": "new@example.com",
  "password": "securepassword",
  "passwordConfirm": "securepassword",
  "firstName": "新規",
  "lastName": "ユーザー",
  "phone": "090-1234-5678"
}
```

### POST /api/auth/logout
ログアウト

**ヘッダー:**
```
Authorization: Bearer <token>
```

### GET /api/auth/me
ユーザー情報取得

**レスポンス:**
```json
{
  "id": "user-001",
  "email": "test@contoso.com",
  "firstName": "テスト",
  "lastName": "ユーザー",
  "phone": "090-1234-5678"
}
```

## 商品 API

### GET /api/products
商品一覧取得

**クエリパラメータ:**
- `category`: カテゴリでフィルタ
- `search`: 検索キーワード
- `sort`: ソート順（`name`, `price-asc`, `price-desc`, `newest`）
- `page`: ページ番号（デフォルト: 1）
- `limit`: 1ページあたりの件数（デフォルト: 12）

**例:**
```
GET /api/products?category=エレクトロニクス&sort=price-asc&page=1&limit=12
```

**レスポンス:**
```json
{
  "products": [
    {
      "id": "1",
      "name": "ワイヤレスイヤホン Pro",
      "description": "高音質ワイヤレスイヤホン...",
      "price": 15800,
      "images": ["/images/earbuds-pro.png"],
      "category": "エレクトロニクス",
      "stock": 50,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 60,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### GET /api/products/{id}
商品詳細取得

**パスパラメータ:**
- `id`: 商品ID

**レスポンス:**
```json
{
  "id": "1",
  "name": "ワイヤレスイヤホン Pro",
  "description": "高音質ワイヤレスイヤホン。ノイズキャンセリング機能付きで、長時間の使用も快適です。",
  "price": 15800,
  "images": [
    "/images/earbuds-pro.png",
    "/images/earbuds-pro-2.png"
  ],
  "category": "エレクトロニクス",
  "stock": 50,
  "specifications": {
    "brand": "ContosoAudio",
    "model": "CA-EP100",
    "connectivity": "Bluetooth 5.0",
    "batteryLife": "8時間"
  },
  "reviews": {
    "averageRating": 4.5,
    "totalReviews": 128
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### GET /api/products/categories
カテゴリ一覧取得

**レスポンス:**
```json
{
  "categories": [
    "エレクトロニクス",
    "ファッション", 
    "ホーム&ガーデン",
    "スポーツ",
    "書籍"
  ]
}
```

## カート API

### GET /api/cart
カート内容取得

**ヘッダー:**
```
Authorization: Bearer <token>
```

**レスポンス:**
```json
{
  "id": "cart-001",
  "userId": "user-001",
  "items": [
    {
      "productId": "1",
      "quantity": 2,
      "product": {
        "id": "1",
        "name": "ワイヤレスイヤホン Pro",
        "price": 15800,
        "images": ["/images/earbuds-pro.png"]
      }
    }
  ],
  "total": 31600,
  "itemCount": 2,
  "updatedAt": "2024-01-06T10:30:00Z"
}
```

### POST /api/cart/items
カートに商品追加

**リクエスト:**
```json
{
  "productId": "1",
  "quantity": 1
}
```

### PUT /api/cart/items/{productId}
カート内商品数量更新

**リクエスト:**
```json
{
  "quantity": 3
}
```

### DELETE /api/cart/items/{productId}
カートから商品削除

### DELETE /api/cart
カート全体をクリア

## 注文 API

### POST /api/orders
注文作成

**リクエスト:**
```json
{
  "items": [
    {
      "productId": "1",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "zipCode": "100-0001",
    "prefecture": "東京都",
    "city": "千代田区",
    "addressLine1": "千代田1-1-1",
    "addressLine2": "サンプルビル101",
    "phone": "03-1234-5678"
  },
  "paymentMethod": "credit_card",
  "paymentDetails": {
    "cardNumber": "4111111111111111",
    "expiryDate": "12/25",
    "cvv": "123",
    "cardHolder": "TARO YAMADA"
  }
}
```

**レスポンス:**
```json
{
  "id": "order-001",
  "userId": "user-001",
  "orderNumber": "ORD-20240106-001",
  "items": [
    {
      "productId": "1",
      "productName": "ワイヤレスイヤホン Pro",
      "price": 15800,
      "quantity": 2
    }
  ],
  "totalAmount": 31600,
  "shippingAddress": {
    "zipCode": "100-0001",
    "prefecture": "東京都",
    "city": "千代田区",
    "addressLine1": "千代田1-1-1",
    "addressLine2": "サンプルビル101",
    "phone": "03-1234-5678"
  },
  "status": "pending",
  "createdAt": "2024-01-06T10:30:00Z",
  "updatedAt": "2024-01-06T10:30:00Z"
}
```

### GET /api/orders
注文履歴取得

**クエリパラメータ:**
- `page`: ページ番号
- `limit`: 1ページあたりの件数
- `status`: 注文ステータスでフィルタ

**レスポンス:**
```json
{
  "orders": [
    {
      "id": "order-001",
      "orderNumber": "ORD-20240106-001",
      "totalAmount": 31600,
      "status": "shipped",
      "createdAt": "2024-01-06T10:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25
  }
}
```

### GET /api/orders/{id}
注文詳細取得

## エラーレスポンス

すべてのAPIエンドポイントは統一されたエラーフォーマットを使用します：

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力データに問題があります",
    "details": [
      {
        "field": "email",
        "message": "有効なメールアドレスを入力してください"
      }
    ]
  }
}
```

### エラーコード一覧

| コード | 説明 |
|--------|------|
| `VALIDATION_ERROR` | 入力データのバリデーションエラー |
| `UNAUTHORIZED` | 認証が必要 |
| `FORBIDDEN` | アクセス権限なし |
| `NOT_FOUND` | リソースが見つからない |
| `CONFLICT` | データの競合（重複登録など） |
| `INTERNAL_ERROR` | サーバー内部エラー |

## 現在のモック実装

### 認証
**ファイル**: `src/lib/auth.ts`

有効なログイン情報：
- メールアドレス: `test@contoso.com`
- パスワード: `hogehoge`

### 商品データ
**ファイル**: `src/lib/products.ts`

- 12個の商品データを含む
- 5つのカテゴリ
- 検索・フィルタリング・ソート機能

### 利用可能な関数

```typescript
// 商品関連
getProductById(id: string): Product | undefined
getProductsByCategory(category: string): Product[]
searchProducts(query: string): Product[]
sortProducts(products: Product[], sortBy: SortOption): Product[]

// 認証関連
mockLogin(credentials: LoginRequest): Promise<LoginResult>
validateSession(user: AuthUser): boolean
getValidCredentials(): { email: string; password: string }
```

## HTTP ステータスコード

| コード | 説明 | 使用例 |
|--------|------|--------|
| 200 | OK | 正常なレスポンス |
| 201 | Created | リソース作成成功 |
| 400 | Bad Request | 不正なリクエスト |
| 401 | Unauthorized | 認証失敗 |
| 403 | Forbidden | アクセス権限なし |
| 404 | Not Found | リソースが存在しない |
| 409 | Conflict | リソースの競合 |
| 500 | Internal Server Error | サーバー内部エラー |

## API 実装への移行手順

1. **Next.js API Routes の作成**
   - `src/app/api/` ディレクトリに API エンドポイントを追加

2. **データベース統合**
   - MongoDB/PostgreSQL などのデータベースに接続
   - モックデータからの移行

3. **認証システム**
   - JWT トークン生成・検証の実装
   - リフレッシュトークンの管理

4. **ミドルウェア**
   - 認証チェック
   - レート制限
   - CORS 設定

5. **バリデーション**
   - リクエストデータの検証
   - セキュリティ対策