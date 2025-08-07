# アーキテクチャ概要

## システムアーキテクチャ

Contoso Shopping Demo は、モダンな Web 技術を使用したフルスタック E コマースアプリケーションです。

### 全体構成

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   ブラウザ      │ ←→ │   Next.js App   │ ←→ │  データストレージ  │
│                 │    │                 │    │                 │
│  - React UI     │    │  - App Router   │    │  - LocalStorage │
│  - Tailwind CSS │    │  - API Routes   │    │  - Mock Data    │
│  - TypeScript   │    │  - SSR/SSG      │    │  - JSON Files   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 技術スタック

#### フロントエンド
- **Next.js 15**: App Router を使用したフルスタックフレームワーク
- **React 19**: UI ライブラリ（Server Components 対応）
- **TypeScript**: 型安全性を確保する静的型付け言語
- **Tailwind CSS**: ユーティリティファーストの CSS フレームワーク

#### バックエンド
- **Next.js API Routes**: サーバーサイド API エンドポイント
- **Mock データ**: 開発・デモ用のスタティックデータ
- **JWT**: 認証トークン（モック実装）

#### 状態管理
- **React Context API**: グローバル状態管理
- **useReducer**: 複雑な状態ロジックの管理
- **localStorage**: クライアントサイドデータ永続化

#### 開発ツール
- **ESLint**: コード品質チェック
- **PostCSS**: CSS 処理
- **npm**: パッケージ管理

## アプリケーション層構成

### プレゼンテーション層
- **Pages** (`src/app/`): Next.js App Router によるページルーティング
- **Components** (`src/components/`): 再利用可能な UI コンポーネント
- **Layout** (`src/components/layout/`): ヘッダー・フッターなどの共通レイアウト

### ビジネスロジック層
- **Contexts** (`src/contexts/`): グローバル状態管理
- **Lib** (`src/lib/`): ビジネスロジックとユーティリティ関数
- **Types** (`src/types/`): TypeScript 型定義

### データアクセス層
- **Products**: 商品データの取得・操作
- **Auth**: 認証処理（モック実装）
- **Cart**: ショッピングカートデータ管理

## 主要機能モジュール

### 1. 商品管理モジュール
```
src/lib/products.ts
├── mockProducts: 商品マスターデータ
├── getProductById(): 商品詳細取得
├── getProductsByCategory(): カテゴリ別商品取得
├── searchProducts(): 商品検索
└── sortProducts(): 商品ソート
```

### 2. 認証モジュール
```
src/lib/auth.ts + src/contexts/AuthContext.tsx
├── mockLogin(): ログイン処理
├── validateSession(): セッション検証
├── AuthProvider: 認証状態管理
└── useAuth(): 認証フック
```

### 3. カートモジュール
```
src/contexts/CartContext.tsx
├── CartProvider: カート状態管理
├── addItem(): 商品追加
├── updateItem(): 数量更新
├── removeItem(): 商品削除
└── localStorage 永続化
```

## データフロー

### 1. 商品閲覧フロー
```
ユーザー → ページアクセス → SSR/SSG → 商品データ取得 → UI 表示
```

### 2. カート操作フロー
```
ユーザー → カート操作 → Context 更新 → localStorage 保存 → UI 更新
```

### 3. 認証フロー
```
ユーザー → ログイン → 認証チェック → JWT発行（モック） → セッション管理
```

## セキュリティ考慮事項

### 現在の実装（デモ用）
- **認証**: モック実装（固定クレデンシャル）
- **セッション**: ローカルストレージベース
- **データ検証**: クライアントサイドのみ

### 本番環境での推奨事項
- **認証**: 実際の JWT トークン + リフレッシュトークン
- **セッション**: httpOnly Cookie + CSRF 対策
- **データ検証**: サーバーサイドバリデーション
- **HTTPS**: SSL/TLS 暗号化
- **入力サニタイゼーション**: XSS 対策

## パフォーマンス最適化

### 実装済み最適化
- **Server Components**: 初期レンダリング最適化
- **Image Optimization**: Next.js Image コンポーネント
- **Code Splitting**: 自動的なコード分割
- **Static Generation**: 静的ページ生成

### 将来の改善案
- **ISR**: Incremental Static Regeneration
- **CDN**: コンテンツ配信ネットワーク
- **Database Indexing**: データベースインデックス最適化
- **Caching**: Redis などのキャッシュシステム

## 拡張性

### 現在のアーキテクチャの利点
- **モジュラー設計**: 機能別の明確な分離
- **型安全性**: TypeScript による安全な開発
- **コンポーネント再利用**: React コンポーネントの高い再利用性

### 将来の拡張ポイント
- **マイクロサービス**: API の分離と独立デプロイ
- **データベース統合**: 実際のデータベース導入
- **支払い処理**: 決済システム統合
- **在庫管理**: リアルタイム在庫システム