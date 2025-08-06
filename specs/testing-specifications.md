# テスト仕様書

## テスト戦略

### テストピラミッド

```
     ┌─────────────┐
     │   E2E Tests │  (少数)
     ├─────────────┤
     │ Integration │  (中程度)
     │    Tests    │
     ├─────────────┤
     │  Unit Tests │  (多数)
     └─────────────┘
```

### テスト種別と割合

- **ユニットテスト**: 70% - 個別関数・コンポーネント
- **インテグレーションテスト**: 20% - API・データベース連携
- **E2E テスト**: 10% - ユーザージャーニー全体

## テストツール

### フロントエンド

- **ユニットテスト**: Jest + React Testing Library
- **コンポーネントテスト**: Storybook + Chromatic
- **E2E テスト**: Playwright

### バックエンド

- **ユニットテスト**: Jest
- **API テスト**: Supertest
- **データベーステスト**: Jest + Test Database

## ユニットテスト仕様

### フロントエンドコンポーネント

#### 商品カードコンポーネント

```typescript
describe("ProductCard", () => {
  const mockProduct = {
    id: "1",
    name: "Test Product",
    price: 1000,
    image: "/test-image.jpg",
  };

  test("商品情報が正しく表示される", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("¥1,000")).toBeInTheDocument();
  });

  test("カート追加ボタンクリックで関数が呼ばれる", () => {
    const mockAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);

    fireEvent.click(screen.getByText("カートに追加"));
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});
```

#### ショッピングカートコンポーネント

```typescript
describe("ShoppingCart", () => {
  test("カート商品の合計金額が正しく計算される", () => {
    const cartItems = [
      { id: "1", name: "Product 1", price: 1000, quantity: 2 },
      { id: "2", name: "Product 2", price: 500, quantity: 1 },
    ];

    render(<ShoppingCart items={cartItems} />);
    expect(screen.getByText("合計: ¥2,500")).toBeInTheDocument();
  });

  test("数量変更時に再計算される", () => {
    // テスト実装
  });
});
```

### バックエンド API

#### 商品 API

```typescript
describe("Products API", () => {
  test("GET /api/products - 商品一覧取得", async () => {
    const response = await request(app).get("/api/products").expect(200);

    expect(response.body).toHaveProperty("products");
    expect(Array.isArray(response.body.products)).toBe(true);
  });

  test("GET /api/products/:id - 存在しない商品でエラー", async () => {
    await request(app).get("/api/products/nonexistent").expect(404);
  });
});
```

#### 認証 API

```typescript
describe("Auth API", () => {
  test("POST /api/auth/register - ユーザー登録成功", async () => {
    const userData = {
      email: "test@example.com",
      password: "password123",
      firstName: "Test",
      lastName: "User",
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData)
      .expect(201);

    expect(response.body).toHaveProperty("token");
  });

  test("POST /api/auth/login - ログイン成功", async () => {
    // ユーザーを事前に作成
    await createTestUser();

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "password123",
      })
      .expect(200);

    expect(response.body).toHaveProperty("token");
  });
});
```

## インテグレーションテスト仕様

### カート機能統合テスト

```typescript
describe("Cart Integration", () => {
  test("商品追加から購入まで一連の流れ", async () => {
    // 1. ユーザーログイン
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    const token = loginResponse.body.token;

    // 2. カートに商品追加
    await request(app)
      .post("/api/cart")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId: "1", quantity: 2 })
      .expect(200);

    // 3. カート内容確認
    const cartResponse = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(cartResponse.body.items).toHaveLength(1);

    // 4. 注文作成
    await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        shippingAddress: {
          zipCode: "100-0001",
          prefecture: "東京都",
          city: "千代田区",
          addressLine1: "千代田1-1-1",
        },
      })
      .expect(201);
  });
});
```

## E2E テスト仕様

### ユーザージャーニーテスト

#### 新規ユーザーの購入フロー

```typescript
test("新規ユーザーが商品を購入する", async ({ page }) => {
  // 1. ホームページアクセス
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Next Shop Demo");

  // 2. 商品一覧ページ遷移
  await page.click('[data-testid="products-link"]');
  await expect(page).toHaveURL("/products");

  // 3. 商品詳細ページ遷移
  await page.click('[data-testid="product-card"]:first-child');
  await expect(page.locator("h1")).toBeVisible();

  // 4. カートに追加
  await page.click('[data-testid="add-to-cart"]');
  await expect(page.locator('[data-testid="cart-badge"]')).toContainText("1");

  // 5. カートページ確認
  await page.click('[data-testid="cart-icon"]');
  await expect(page).toHaveURL("/cart");
  await expect(page.locator('[data-testid="cart-item"]')).toBeVisible();

  // 6. ユーザー登録
  await page.click('[data-testid="checkout-button"]');
  await page.click('[data-testid="register-link"]');

  await page.fill('[data-testid="email"]', "newuser@example.com");
  await page.fill('[data-testid="password"]', "password123");
  await page.fill('[data-testid="firstName"]', "Test");
  await page.fill('[data-testid="lastName"]', "User");
  await page.click('[data-testid="register-submit"]');

  // 7. チェックアウト
  await expect(page).toHaveURL("/checkout");

  // 配送先情報入力
  await page.fill('[data-testid="zipCode"]', "100-0001");
  await page.fill('[data-testid="prefecture"]', "東京都");
  await page.fill('[data-testid="city"]', "千代田区");
  await page.fill('[data-testid="addressLine1"]', "千代田1-1-1");

  // 注文確定
  await page.click('[data-testid="place-order"]');
  await expect(page).toHaveURL("/order-confirmation");
  await expect(page.locator("h1")).toContainText("注文が完了しました");
});
```

#### 既存ユーザーのリピート購入

```typescript
test("既存ユーザーがリピート購入する", async ({ page }) => {
  // 1. ログイン
  await page.goto("/login");
  await page.fill('[data-testid="email"]', "existing@example.com");
  await page.fill('[data-testid="password"]', "password123");
  await page.click('[data-testid="login-submit"]');

  // 2. 注文履歴確認
  await page.click('[data-testid="account-menu"]');
  await page.click('[data-testid="order-history"]');
  await expect(
    page.locator('[data-testid="order-item"]')
  ).toHaveCountGreaterThan(0);

  // 3. 同じ商品を再注文
  await page.click('[data-testid="reorder-button"]:first-child');
  await expect(page.locator('[data-testid="cart-badge"]')).toBeVisible();

  // 4. 迅速チェックアウト（保存済み住所使用）
  await page.click('[data-testid="cart-icon"]');
  await page.click('[data-testid="checkout-button"]');
  await page.click('[data-testid="use-saved-address"]');
  await page.click('[data-testid="place-order"]');

  await expect(page).toHaveURL("/order-confirmation");
});
```

## パフォーマンステスト

### ロードテスト要件

- **同時ユーザー数**: 100 ユーザー
- **レスポンス時間**: 95%ile < 2 秒
- **エラー率**: < 1%

### 主要エンドポイントの性能目標

```typescript
const performanceTargets = {
  "GET /api/products": { avgResponse: 200, maxResponse: 500 },
  "POST /api/cart": { avgResponse: 300, maxResponse: 1000 },
  "POST /api/orders": { avgResponse: 500, maxResponse: 2000 },
};
```

## セキュリティテスト

### 認証・認可テスト

```typescript
describe("Security Tests", () => {
  test("未認証ユーザーは保護されたリソースにアクセスできない", async () => {
    await request(app).get("/api/orders").expect(401);
  });

  test("不正なJWTトークンでアクセス拒否", async () => {
    await request(app)
      .get("/api/orders")
      .set("Authorization", "Bearer invalid-token")
      .expect(401);
  });

  test("SQLインジェクション対策", async () => {
    await request(app)
      .get('/api/products?search="; DROP TABLE products; --')
      .expect(200); // エラーではなく、安全に処理される
  });
});
```

## テスト環境

### テストデータベース

- Azure Cosmos DB Emulator 使用
- テスト実行前にデータリセット
- シードデータ自動投入

### CI/CD 統合

- GitHub Actions でテスト自動実行
- プルリクエスト時に全テスト実行
- カバレッジレポート生成 (最低 80%目標)

### テスト実行コマンド

```bash
# 全テスト実行
npm test

# ウォッチモード
npm run test:watch

# カバレッジ付き実行
npm run test:coverage

# E2Eテスト実行
npm run test:e2e

# 特定テストスイート実行
npm test -- --testNamePattern="Auth API"
```
