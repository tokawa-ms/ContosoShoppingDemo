# 開発ガイドライン

## コーディング規約

### TypeScript / JavaScript

- **ESLint**: `@typescript-eslint/recommended` を使用
- **Prettier**: 自動フォーマッティング
- **命名規則**:
  - 変数・関数: camelCase (`userName`, `calculateTotal()`)
  - コンポーネント: PascalCase (`ProductCard`, `ShoppingCart`)
  - 定数: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_CART_ITEMS`)
  - ファイル名: kebab-case (`product-card.tsx`, `shopping-cart.hooks.ts`)

### React コンポーネント

- **関数コンポーネント**: 関数宣言を優先
- **Hooks**: カスタムフックは `use` プレフィックス
- **Props**: TypeScript インターフェースで厳密に型定義
- **デフォルト Props**: ES6 デフォルトパラメータを使用

```typescript
// 良い例
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  showDiscount?: boolean;
}

export default function ProductCard({
  product,
  onAddToCart,
  showDiscount = false,
}: ProductCardProps) {
  // コンポーネント実装
}
```

### CSS / Tailwind

- **ユーティリティクラス**: Tailwind を優先使用
- **カスタム CSS**: 必要な場合は CSS Modules 使用
- **レスポンシブ**: モバイルファーストアプローチ
- **カラー**: デザインシステムで定義された変数使用

## ディレクトリ構造

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 認証関連ページグループ
│   │   ├── login/
│   │   └── register/
│   ├── products/          # 商品関連ページ
│   │   ├── [id]/          # 商品詳細ページ
│   │   └── page.tsx       # 商品一覧ページ
│   ├── cart/              # カートページ
│   ├── checkout/          # チェックアウトページ
│   ├── profile/           # プロフィールページ
│   ├── api/               # API Routes
│   │   ├── auth/
│   │   ├── products/
│   │   ├── cart/
│   │   └── orders/
│   ├── globals.css        # グローバルスタイル
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx           # ホームページ
├── components/            # 再利用可能コンポーネント
│   ├── ui/               # 基本UIコンポーネント
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── LoadingSpinner.tsx
│   ├── layout/           # レイアウトコンポーネント
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── product/          # 商品関連コンポーネント
│   │   ├── ProductCard.tsx
│   │   ├── ProductList.tsx
│   │   └── ProductDetail.tsx
│   └── cart/             # カート関連コンポーネント
│       ├── CartItem.tsx
│       ├── CartSummary.tsx
│       └── CartIcon.tsx
├── lib/                  # ユーティリティ・ライブラリ
│   ├── api.ts           # API呼び出し関数
│   ├── auth.ts          # 認証関連ユーティリティ
│   ├── db.ts            # データベース接続
│   ├── utils.ts         # 汎用ユーティリティ
│   └── validations.ts   # バリデーション関数
├── hooks/               # カスタムフック
│   ├── useAuth.ts
│   ├── useCart.ts
│   ├── useProducts.ts
│   └── useLocalStorage.ts
├── types/               # TypeScript型定義
│   ├── api.ts
│   ├── auth.ts
│   ├── product.ts
│   └── cart.ts
├── constants/           # 定数定義
│   ├── api.ts
│   ├── routes.ts
│   └── config.ts
└── __tests__/           # テストファイル
    ├── components/
    ├── hooks/
    ├── lib/
    └── api/
```

## Git ワークフロー

### ブランチ戦略

- **main**: 本番環境 (常にデプロイ可能状態)
- **develop**: 開発統合ブランチ
- **feature/**: 機能開発ブランチ (`feature/user-authentication`)
- **bugfix/**: バグ修正ブランチ (`bugfix/cart-calculation-error`)
- **hotfix/**: 緊急修正ブランチ (`hotfix/security-patch`)

### コミットメッセージ規約

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type**:

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント変更
- `style`: コードフォーマット変更
- `refactor`: リファクタリング
- `test`: テスト追加・修正
- `chore`: ビルドプロセス・依存関係更新

**例**:

```
feat(cart): カート商品の数量変更機能を追加

- カートページで数量の増減ボタンを追加
- 数量変更時の合計金額自動更新
- バリデーション追加（1-99の範囲）

Closes #123
```

## API 設計ガイドライン

### RESTful API 設計

- **リソース指向**: 名詞を使用 (`/products`, `/orders`)
- **HTTP メソッド**: 適切な動詞を使用
  - GET: データ取得
  - POST: リソース作成
  - PUT: リソース全体更新
  - PATCH: リソース部分更新
  - DELETE: リソース削除

### レスポンス形式

```typescript
// 成功レスポンス
{
  "success": true,
  "data": { /* レスポンスデータ */ },
  "pagination": { /* ページネーション情報 */ }
}

// エラーレスポンス
{
  "success": false,
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

### エラーハンドリング

```typescript
// API関数の例
export async function fetchProducts(
  params: ProductsParams
): Promise<ApiResponse<Product[]>> {
  try {
    const response = await fetch("/api/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, await response.json());
    }

    return await response.json();
  } catch (error) {
    console.error("商品取得エラー:", error);
    throw error;
  }
}
```

## 状態管理ガイドライン

### Zustand 使用例

```typescript
// stores/useCartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productId === product.id
          );

          if (existingItem) {
            return {
              ...state,
              items: state.items.map((item) =>
                item.productId === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            ...state,
            items: [
              ...state.items,
              {
                productId: product.id,
                productName: product.name,
                price: product.price,
                quantity,
              },
            ],
          };
        });
      },

      // 他のアクション実装...
    }),
    {
      name: "cart-storage",
    }
  )
);
```

## テスト戦略

### ユニットテスト

```typescript
// __tests__/components/ProductCard.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import ProductCard from "@/components/product/ProductCard";
import { mockProduct } from "@/test-utils/mocks";

describe("ProductCard", () => {
  const mockAddToCart = jest.fn();

  beforeEach(() => {
    mockAddToCart.mockClear();
  });

  test("商品情報が正しく表示される", () => {
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(
      screen.getByText(`¥${mockProduct.price.toLocaleString()}`)
    ).toBeInTheDocument();
    expect(screen.getByAltText(mockProduct.name)).toBeInTheDocument();
  });

  test("カート追加ボタンクリックで関数が呼ばれる", () => {
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);

    fireEvent.click(screen.getByRole("button", { name: "カートに追加" }));

    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
    expect(mockAddToCart).toHaveBeenCalledTimes(1);
  });
});
```

### E2E テスト

```typescript
// e2e/shopping-flow.spec.ts
import { test, expect } from "@playwright/test";

test("商品購入フロー", async ({ page }) => {
  // ホームページアクセス
  await page.goto("/");

  // 商品をカートに追加
  await page.click(
    '[data-testid="product-card"]:first-child [data-testid="add-to-cart"]'
  );

  // カートバッジの更新確認
  await expect(page.locator('[data-testid="cart-badge"]')).toContainText("1");

  // チェックアウトフロー
  await page.click('[data-testid="cart-icon"]');
  await page.click('[data-testid="checkout-button"]');

  // 注文完了確認
  await expect(page.locator("h1")).toContainText("注文が完了しました");
});
```

## セキュリティ考慮事項

### 入力検証

```typescript
// lib/validations.ts
import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "商品名は必須です")
    .max(100, "商品名は100文字以内で入力してください"),
  price: z.number().positive("価格は正の数値である必要があります"),
  description: z.string().max(1000, "説明は1000文字以内で入力してください"),
});

export const userRegistrationSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z
    .string()
    .min(8, "パスワードは8文字以上である必要があります")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "大文字、小文字、数字を含む必要があります"
    ),
  firstName: z.string().min(1, "名前は必須です"),
  lastName: z.string().min(1, "苗字は必須です"),
});
```

### 認証ミドルウェア

```typescript
// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  // 保護されたルートのチェック
  if (
    request.nextUrl.pathname.startsWith("/profile") ||
    request.nextUrl.pathname.startsWith("/orders")
  ) {
    const token = request.cookies.get("auth-token")?.value;

    if (!token || !(await verifyJWT(token))) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/orders/:path*", "/checkout"],
};
```

## パフォーマンス最適化

### 画像最適化

```typescript
// components/ui/OptimizedImage.tsx
import Image from "next/image";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      style={{
        objectFit: "cover",
      }}
    />
  );
}
```

### データ取得最適化

```typescript
// hooks/useProducts.ts
import useSWR from "swr";
import { fetchProducts } from "@/lib/api";

export function useProducts(params?: ProductsParams) {
  const { data, error, isLoading } = useSWR(
    ["products", params],
    () => fetchProducts(params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
    }
  );

  return {
    products: data?.data || [],
    isLoading,
    error,
  };
}
```
