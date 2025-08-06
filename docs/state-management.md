# 状態管理

Next Shop Demo では、React Context API を使用してアプリケーション全体の状態を管理しています。

## 状態管理アーキテクチャ

### 全体構成

```
App Component
├── AuthProvider (認証状態)
│   └── CartProvider (カート状態)
│       └── アプリケーション全体
```

## AuthContext（認証状態管理）

### 場所
`src/contexts/AuthContext.tsx`

### 責任
- ユーザーの認証状態管理
- ログイン・ログアウト処理
- セッション永続化

### 状態定義

```typescript
interface AuthState {
  user: AuthUser | null      // ユーザー情報
  isLoading: boolean         // ログイン処理中フラグ
  error: string | null       // エラーメッセージ
}

interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
}
```

### アクション

```typescript
type AuthAction =
  | { type: 'LOGIN_START' }                    // ログイン開始
  | { type: 'LOGIN_SUCCESS'; payload: AuthUser } // ログイン成功
  | { type: 'LOGIN_ERROR'; payload: string }   // ログインエラー
  | { type: 'LOGOUT' }                         // ログアウト
  | { type: 'LOAD_USER'; payload: AuthUser | null } // ユーザー読み込み
```

### 提供するメソッド

```typescript
interface AuthContextType {
  // 状態
  user: AuthUser | null
  isLoading: boolean
  error: string | null
  isLoggedIn: boolean
  
  // アクション
  login: (credentials: LoginRequest) => Promise<boolean>
  logout: () => void
}
```

### 使用例

```typescript
// コンポーネント内での使用
const { isLoggedIn, user, login, logout } = useAuth()

// ログイン処理
const handleLogin = async (email: string, password: string) => {
  const success = await login({ email, password })
  if (success) {
    router.push('/dashboard')
  }
}

// 条件付きレンダリング
{isLoggedIn ? (
  <UserMenu user={user} onLogout={logout} />
) : (
  <LoginButton />
)}
```

### 永続化

```typescript
// localStorage への保存
useEffect(() => {
  if (state.user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state.user))
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }
}, [state.user])

// アプリ起動時の復元
useEffect(() => {
  const savedUser = localStorage.getItem(AUTH_STORAGE_KEY)
  if (savedUser) {
    const user = JSON.parse(savedUser)
    if (validateSession(user)) {
      dispatch({ type: 'LOAD_USER', payload: user })
    }
  }
}, [])
```

## CartContext（カート状態管理）

### 場所
`src/contexts/CartContext.tsx`

### 責任
- ショッピングカートの商品管理
- 数量・金額計算
- ローカルストレージへの永続化

### 状態定義

```typescript
interface CartState {
  items: CartItem[]          // カート内商品
  total: number             // 合計金額
  itemCount: number         // 合計商品数
}

interface CartItem {
  productId: string
  quantity: number
}

interface CartItemWithProduct extends CartItem {
  product: Product          // 商品詳細情報を含む
}
```

### アクション

```typescript
type CartAction =
  | { type: 'ADD_ITEM'; payload: { productId: string; quantity: number } }
  | { type: 'UPDATE_ITEM'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
```

### Reducer ロジック

```typescript
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { productId, quantity } = action.payload
      const existingItemIndex = state.items.findIndex(item => 
        item.productId === productId
      )
      
      let newItems: CartItem[]
      if (existingItemIndex >= 0) {
        // 既存アイテムの数量更新
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        // 新しいアイテム追加
        newItems = [...state.items, { productId, quantity }]
      }
      
      return calculateCartTotals(newItems)
    }
    // 他のケース...
  }
}
```

### 計算ロジック

```typescript
function calculateCartTotals(items: CartItem[]): CartState {
  const total = items.reduce((sum, item) => {
    const product = getProductById(item.productId)
    return sum + (product ? product.price * item.quantity : 0)
  }, 0)
  
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  
  return { items, total, itemCount }
}
```

### 提供するメソッド

```typescript
interface CartContextType extends CartState {
  // アクション
  addItem: (productId: string, quantity: number) => void
  updateItem: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  
  // ヘルパー
  getCartItems: () => CartItemWithProduct[]
}
```

### 使用例

```typescript
// コンポーネント内での使用
const { items, total, itemCount, addItem, updateItem, removeItem } = useCart()

// 商品をカートに追加
const handleAddToCart = (productId: string) => {
  addItem(productId, 1)
  alert('商品をカートに追加しました！')
}

// 数量更新
const handleQuantityChange = (productId: string, newQuantity: number) => {
  if (newQuantity <= 0) {
    removeItem(productId)
  } else {
    updateItem(productId, newQuantity)
  }
}

// カート内商品の表示
const cartItems = getCartItems()
```

## 状態の永続化

### localStorage の活用

```typescript
// カート状態の保存
useEffect(() => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items))
}, [state.items])

// アプリ起動時の復元
useEffect(() => {
  const savedCart = localStorage.getItem(CART_STORAGE_KEY)
  if (savedCart) {
    const cartItems = JSON.parse(savedCart)
    dispatch({ type: 'LOAD_CART', payload: cartItems })
  }
}, [])
```

### エラーハンドリング

```typescript
useEffect(() => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (savedCart) {
      const cartItems = JSON.parse(savedCart)
      dispatch({ type: 'LOAD_CART', payload: cartItems })
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error)
    // エラー時はカートをクリア
    dispatch({ type: 'CLEAR_CART' })
  }
}, [])
```

## プロバイダーの配置

### ルートレイアウト
`src/app/layout.tsx` でプロバイダーをネスト：

```typescript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
```

### プロバイダーの順序
1. **AuthProvider**: 認証状態を最外層に配置
2. **CartProvider**: カート状態は認証に依存する可能性があるため内側

## カスタムフック

### useAuth フック

```typescript
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

### useCart フック

```typescript
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
```

### エラーハンドリング
Context の範囲外での使用を防ぐため、エラーを投げて早期発見を促進。

## パフォーマンス最適化

### useReducer の利点
- 複雑な状態変更ロジックを集約
- アクションベースで予測可能な状態変更
- デバッグ時のアクション追跡が容易

### メモ化の活用

```typescript
// 計算コストの高い処理をメモ化
const cartItems = useMemo(() => {
  return state.items.map(item => {
    const product = getProductById(item.productId)
    return product ? { ...item, product } : null
  }).filter(Boolean)
}, [state.items])
```

### 不要な再レンダリングの防止

```typescript
// コンテキスト値をメモ化
const contextValue = useMemo(() => ({
  ...state,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  getCartItems
}), [state, addItem, updateItem, removeItem, clearCart])
```

## デバッグ

### Redux DevTools との連携（将来的）

```typescript
// Redux DevTools 拡張の活用例
const cartReducer = (state: CartState, action: CartAction): CartState => {
  // 開発環境でのアクションログ
  if (process.env.NODE_ENV === 'development') {
    console.log('Cart Action:', action)
    console.log('Previous State:', state)
  }
  
  const newState = cartReducerLogic(state, action)
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Next State:', newState)
  }
  
  return newState
}
```

### 状態の可視化

```typescript
// 開発用コンポーネント
const DebugPanel = () => {
  const auth = useAuth()
  const cart = useCart()
  
  if (process.env.NODE_ENV !== 'development') return null
  
  return (
    <div style={{ position: 'fixed', bottom: 0, right: 0, background: 'white', border: '1px solid #ccc', padding: '10px' }}>
      <details>
        <summary>Debug Info</summary>
        <pre>{JSON.stringify({ auth, cart }, null, 2)}</pre>
      </details>
    </div>
  )
}
```

## 将来の拡張案

### 状態の正規化
商品データの重複を避けるため、正規化されたストア構造の採用：

```typescript
interface NormalizedStore {
  entities: {
    products: { [id: string]: Product }
    users: { [id: string]: User }
  }
  ui: {
    cart: { productIds: string[] }
    auth: { currentUserId: string | null }
  }
}
```

### ミドルウェアの導入
非同期処理やロギングのためのミドルウェア：

```typescript
const thunkMiddleware = (action: any) => {
  if (typeof action === 'function') {
    return action(dispatch, getState)
  }
  return dispatch(action)
}
```

### 外部状態管理ライブラリ
アプリケーションの複雑化に応じて、Zustand や Redux Toolkit の導入を検討。