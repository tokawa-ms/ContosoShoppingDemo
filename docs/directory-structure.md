# ディレクトリ構成

このドキュメントでは、Contoso Shopping Demo プロジェクトのディレクトリ構成とファイル配置について説明します。

## プロジェクト全体構成

```
ContosoShoppingDemo/
├── .git/                    # Git バージョン管理
├── .next/                   # Next.js ビルド出力（自動生成）
├── node_modules/            # npm 依存関係（自動生成）
├── public/                  # 静的ファイル
├── src/                     # ソースコード
├── docs/                    # プロジェクトドキュメント
├── specs/                   # 技術仕様書
├── .gitignore              # Git 除外設定
├── eslint.config.mjs       # ESLint 設定
├── next.config.ts          # Next.js 設定
├── package.json            # プロジェクト設定・依存関係
├── package-lock.json       # 依存関係ロックファイル
├── postcss.config.mjs      # PostCSS 設定
├── README.md               # プロジェクト概要
└── tsconfig.json           # TypeScript 設定
```

## src/ ディレクトリ詳細

### 全体構成

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # グローバルスタイル
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # ホームページ
│   ├── favicon.ico        # ファビコン
│   ├── cart/              # カートページ
│   ├── checkout/          # チェックアウトページ
│   ├── login/             # ログインページ
│   └── products/          # 商品関連ページ
├── components/            # 再利用可能コンポーネント
├── contexts/              # React Context
├── lib/                   # ユーティリティ・ビジネスロジック
└── types/                 # TypeScript 型定義
```

### app/ ディレクトリ（Next.js App Router）

```
app/
├── layout.tsx             # ルートレイアウト（全ページ共通）
├── page.tsx               # ホームページ（/）
├── globals.css            # Tailwind CSS + カスタムスタイル
├── favicon.ico            # サイトアイコン
├── cart/
│   └── page.tsx           # カートページ（/cart）
├── checkout/
│   ├── page.tsx           # チェックアウトページ（/checkout）
│   └── success/
│       └── page.tsx       # 注文完了ページ（/checkout/success）
├── login/
│   └── page.tsx           # ログインページ（/login）
└── products/
    ├── page.tsx           # 商品一覧ページ（/products）
    └── [id]/
        └── page.tsx       # 商品詳細ページ（/products/[id]）
```

**ファイル説明**:
- `layout.tsx`: 全ページ共通のレイアウト（ヘッダー・フッター）
- `page.tsx`: 各ルートのページコンポーネント
- `[id]/`: 動的ルーティング（商品IDによる詳細ページ）

### components/ ディレクトリ

```
components/
├── layout/                # レイアウト関連コンポーネント
│   ├── Header.tsx         # ヘッダーコンポーネント
│   └── Footer.tsx         # フッターコンポーネント
└── ProductsList.tsx       # 商品一覧コンポーネント
```

**コンポーネント設計方針**:
- **layout/**: ページレイアウトに関するコンポーネント
- **再利用性**: 複数ページで使用されるコンポーネント
- **単一責任**: 各コンポーネントは明確な責任を持つ

### contexts/ ディレクトリ

```
contexts/
├── AuthContext.tsx        # 認証状態管理
└── CartContext.tsx        # カート状態管理
```

**Context 説明**:
- **AuthContext**: ログイン状態、ユーザー情報の管理
- **CartContext**: ショッピングカートの商品・数量・金額管理

### lib/ ディレクトリ

```
lib/
├── auth.ts                # 認証関連ロジック
└── products.ts            # 商品データ・操作ロジック
```

**ライブラリ説明**:
- **auth.ts**: ログイン・セッション管理のモック実装
- **products.ts**: 商品データ定義と検索・フィルタリング関数

### types/ ディレクトリ

```
types/
└── index.ts               # TypeScript 型定義
```

**型定義内容**:
- User, Product, Cart, Order などのデータモデル
- API リクエスト・レスポンスの型
- UI コンポーネントの Props 型

## public/ ディレクトリ

```
public/
├── images/                # 商品画像・アイコン
│   ├── earbuds-pro.png
│   ├── smartwatch.png
│   ├── casual-black-t-shirt.png
│   └── ...（その他商品画像）
└── （その他静的ファイル）
```

## docs/ ディレクトリ

```
docs/
├── README.md              # ドキュメント目次
├── architecture.md        # アーキテクチャ概要
├── development-setup.md   # 開発環境セットアップ
├── directory-structure.md # このファイル
├── api-documentation.md   # API 仕様
├── components.md          # コンポーネント設計
├── state-management.md    # 状態管理
├── deployment.md          # デプロイメント
├── troubleshooting.md     # トラブルシューティング
├── contributing.md        # コントリビューションガイド
└── coding-standards.md    # コーディング規約
```

## specs/ ディレクトリ

```
specs/
├── master.md                      # 仕様書マスター
├── overview.md                    # プロジェクト概要
├── functional-requirements.md     # 機能仕様
├── technical-specifications.md    # 技術仕様
├── ui-ux-design.md               # UI/UX 設計
├── testing-specifications.md     # テスト仕様
├── deployment-specifications.md  # デプロイ仕様
└── development-guidelines.md     # 開発ガイドライン
```

## 設定ファイル

### package.json
```json
{
  "name": "contoso-shopping-demo",
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build", 
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "19.1.0",
    "react-dom": "19.1.0", 
    "next": "15.4.5"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19", 
    "@types/react-dom": "^19",
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "15.4.5"
  }
}
```

### tsconfig.json
TypeScript設定でパスエイリアス（`@/`）を使用：
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## ファイル命名規則

### コンポーネント
- **PascalCase**: `ComponentName.tsx`
- **例**: `Header.tsx`, `ProductsList.tsx`

### ページ
- **kebab-case** (ディレクトリ) + **page.tsx**
- **例**: `products/page.tsx`, `checkout/success/page.tsx`

### ユーティリティ
- **camelCase**: `utilityName.ts`
- **例**: `auth.ts`, `products.ts`

### 型定義
- **camelCase**: `types/index.ts`

## インポート規則

### パスエイリアス使用
```typescript
// 推奨
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types';

// 非推奨
import { useCart } from '../../../contexts/CartContext';
```

### インポート順序
1. React / Next.js
2. 外部ライブラリ
3. 内部コンポーネント（`@/components`）
4. 内部ユーティリティ（`@/lib`, `@/types`）
5. 相対パス

## ビルド生成ファイル

### .next/ ディレクトリ
- Next.js のビルド出力
- 本番用最適化されたファイル
- Git管理対象外

### node_modules/
- npm 依存関係
- Git管理対象外

## 開発ベストプラクティス

### ファイル配置
1. **関連機能を近くに配置**: 関連するファイルは同じディレクトリに
2. **レイヤー別分離**: UI・ロジック・データアクセスを明確に分離
3. **再利用性を考慮**: 共通機能は適切な場所に配置

### コンポーネント設計
1. **単一責任原則**: 1つのコンポーネントは1つの責任
2. **Props の型定義**: すべてのProps にTypeScript型を定義
3. **デフォルトエクスポート**: 1ファイル1コンポーネント