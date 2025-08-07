# Contoso Shopping Demo

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/tokawa-ms/ContosoShoppingDemo)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.x-06B6D4)](https://tailwindcss.com/)

モダンな Web 技術を使用した **E コマースアプリケーション** のデモンストレーションプロジェクトです。Next.js 15、React 19、TypeScript、Tailwind CSS を使用して、現代的なショッピングサイトの実装例を提供します。

![Contoso Shopping Demo Screenshot](./public/images/demo-screenshot.png)

## ✨ 主要機能

- 🛍️ **商品カタログ**: カテゴリ別表示、検索、フィルタリング、ソート機能
- 🛒 **ショッピングカート**: リアルタイム更新、永続化（localStorage）
- 👤 **ユーザー認証**: ログイン・ログアウト機能（モック実装）
- 📦 **注文処理**: チェックアウトフロー、注文履歴
- 📱 **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応
- 🎨 **モダンUI/UX**: Tailwind CSS による美しいデザイン
- ⚡ **高パフォーマンス**: Next.js 15 の最新機能を活用

## 🚀 クイックスタート

### 前提条件

- Node.js 18.17.0 以上
- npm 9.0.0 以上

### インストールと起動

```bash
# リポジトリのクローン
git clone https://github.com/tokawa-ms/ContosoShoppingDemo.git
cd ContosoShoppingDemo

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

開発サーバーが起動したら、ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスしてください。

### テストユーザー

デモアプリケーションには以下のテストユーザーが用意されています：

- **メールアドレス**: `test@contoso.com`
- **パスワード**: `hogehoge`

## 🛠️ 技術スタック

### フロントエンド
- **[Next.js 15](https://nextjs.org/)**: React フレームワーク（App Router使用）
- **[React 19](https://reactjs.org/)**: UI ライブラリ（Server Components対応）
- **[TypeScript](https://www.typescriptlang.org/)**: 静的型付け言語
- **[Tailwind CSS 4](https://tailwindcss.com/)**: ユーティリティファーストCSSフレームワーク

### 状態管理
- **React Context API**: グローバル状態管理
- **useReducer**: 複雑な状態ロジック
- **localStorage**: クライアントサイドデータ永続化

### 開発ツール
- **ESLint**: コード品質チェック
- **PostCSS**: CSS処理
- **Turbopack**: 高速バンドラー（開発時）

## 📁 プロジェクト構成

```
ContosoShoppingDemo/
├── src/
│   ├── app/                 # Next.js App Router（ページ）
│   │   ├── page.tsx         # ホームページ
│   │   ├── products/        # 商品関連ページ
│   │   ├── cart/            # カートページ
│   │   ├── checkout/        # チェックアウトページ
│   │   └── login/           # ログインページ
│   ├── components/          # 再利用可能コンポーネント
│   │   ├── layout/          # レイアウトコンポーネント
│   │   └── ProductsList.tsx # 商品一覧コンポーネント
│   ├── contexts/            # React Context
│   │   ├── AuthContext.tsx  # 認証状態管理
│   │   └── CartContext.tsx  # カート状態管理
│   ├── lib/                 # ユーティリティ・ビジネスロジック
│   │   ├── auth.ts          # 認証ロジック
│   │   └── products.ts      # 商品データ・操作
│   └── types/               # TypeScript型定義
├── docs/                    # プロジェクトドキュメント
├── specs/                   # 技術仕様書
└── public/                  # 静的ファイル
```

詳細なディレクトリ構成については、[ディレクトリ構成ドキュメント](./docs/directory-structure.md) を参照してください。

## 📖 ドキュメント

包括的なドキュメントが [docs/](./docs/) ディレクトリに用意されています：

### 基本ドキュメント
- 📋 [アーキテクチャ概要](./docs/architecture.md) - システム設計と技術選択
- 🔧 [開発環境セットアップ](./docs/development-setup.md) - 環境構築手順
- 📁 [ディレクトリ構成](./docs/directory-structure.md) - プロジェクト構造

### 技術ドキュメント
- 🔌 [API仕様](./docs/api-documentation.md) - APIエンドポイント詳細
- 🧩 [コンポーネント設計](./docs/components.md) - Reactコンポーネント設計
- 🔄 [状態管理](./docs/state-management.md) - Context APIによる状態管理

### 運用ドキュメント
- 🚀 [デプロイメント](./docs/deployment.md) - 本番環境デプロイ手順
- 🔧 [トラブルシューティング](./docs/troubleshooting.md) - よくある問題の解決方法

### 開発ガイド
- 🤝 [コントリビューションガイド](./docs/contributing.md) - 開発参加方法
- 📏 [コーディング規約](./docs/coding-standards.md) - プロジェクトのコーディングルール

## 🔧 利用可能なコマンド

```bash
# 開発サーバー起動（Turbopack使用）
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm run start

# コード品質チェック
npm run lint

# リンティングエラー自動修正
npm run lint -- --fix
```

## 🎯 主要ページ・機能

### ホームページ (`/`)
- ヒーローセクション
- 特集商品表示
- カテゴリ一覧
- 新着商品表示

### 商品関連 (`/products`)
- 商品一覧表示
- カテゴリフィルタリング
- 検索機能
- ソート機能（価格・名前・新着順）
- 商品詳細表示 (`/products/[id]`)

### ショッピングカート (`/cart`)
- カート内商品一覧
- 数量変更・削除
- 合計金額表示
- チェックアウトへの遷移

### 認証・注文 
- ログイン (`/login`)
- チェックアウト (`/checkout`)
- 注文完了 (`/checkout/success`)

## 🔒 セキュリティについて

このプロジェクトは **デモ・学習目的** のため、以下の点にご注意ください：

- 認証システムはモック実装です
- 実際の決済処理は含まれていません
- 本番環境では適切なセキュリティ対策が必要です

本番環境での実装については、[デプロイメントドキュメント](./docs/deployment.md)のセキュリティセクションを参照してください。

## 🤝 コントリビューション

プロジェクトへのコントリビューションを歓迎します！以下の方法で参加できます：

1. **Issue の報告**: バグ報告や機能要求
2. **Pull Request**: コードの改善や新機能の追加
3. **ドキュメント改善**: より良い説明や例の追加

詳細については [コントリビューションガイド](./docs/contributing.md) をご覧ください。

## 📄 ライセンス

このプロジェクトは [MIT License](./LICENSE) の下で公開されています。

## 🙏 謝辞

このプロジェクトは以下の優れたオープンソースプロジェクトを使用しています：

- [Next.js](https://nextjs.org/) - React フレームワーク
- [React](https://reactjs.org/) - UI ライブラリ
- [Tailwind CSS](https://tailwindcss.com/) - CSS フレームワーク
- [TypeScript](https://www.typescriptlang.org/) - 型安全な JavaScript

## 📞 サポート

質問や問題がある場合は、以下の方法でサポートを受けられます：

1. [GitHub Issues](https://github.com/tokawa-ms/ContosoShoppingDemo/issues) - バグ報告・機能要求
2. [ドキュメント](./docs/) - 包括的な技術文書
3. [トラブルシューティング](./docs/troubleshooting.md) - よくある問題の解決方法

---

**Contoso Shopping Demo** - モダンな Web 技術による E コマースアプリケーションのデモンストレーション
