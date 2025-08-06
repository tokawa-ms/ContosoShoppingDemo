# 開発環境セットアップ

## 前提条件

開発を始める前に、以下のソフトウェアがインストールされていることを確認してください。

### 必須環境
- **Node.js**: v18.17.0 以上
- **npm**: v9.0.0 以上（Node.js に同梱）
- **Git**: バージョン管理

### 推奨環境
- **VS Code**: エディター（推奨拡張機能は後述）
- **Chrome**: 開発者ツール用ブラウザ

## プロジェクトのセットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/tokawa-ms/nextshopdemo.git
cd nextshopdemo
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

開発サーバーが起動したら、ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスしてください。

## 利用可能なコマンド

### 開発関連

```bash
# 開発サーバー起動（Turbopack使用）
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm run start

# コードリンティング
npm run lint
```

### 開発ツール

```bash
# TypeScript型チェック
npx tsc --noEmit

# ESLintによるコード修正
npm run lint -- --fix
```

## 開発環境の設定

### VS Code 推奨拡張機能

以下の拡張機能をインストールすることを推奨します：

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode", 
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

### VS Code 設定

プロジェクトルートに `.vscode/settings.json` を作成し、以下を設定：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "css.validate": false,
  "less.validate": false,
  "scss.validate": false
}
```

## 開発ワークフロー

### 1. 新機能開発

```bash
# 新しいブランチを作成
git checkout -b feature/新機能名

# 変更を加えてコミット
git add .
git commit -m "feat: 新機能の説明"

# プッシュしてプルリクエスト作成
git push origin feature/新機能名
```

### 2. コード品質チェック

開発中は以下のチェックを定期的に実行してください：

```bash
# リンティング
npm run lint

# TypeScript型チェック
npx tsc --noEmit

# ビルドテスト
npm run build
```

## デバッグ方法

### 1. ブラウザでのデバッグ

- Chrome DevTools を使用
- React Developer Tools 拡張機能の利用
- Next.js の Source Maps が自動で有効

### 2. VS Code でのデバッグ

`.vscode/launch.json` を作成：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

## 環境変数

現在、環境変数は使用していませんが、将来的に以下のような変数が必要になる可能性があります：

```bash
# .env.local（ローカル開発用）
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DATABASE_URL=mongodb://localhost:27017/nextshopdemo
JWT_SECRET=your-secret-key
```

## テストユーザー情報

開発中のテスト用ログイン情報：

- **メールアドレス**: `test@contoso.com`
- **パスワード**: `hogehoge`

## よくある問題と解決方法

### ポートが使用中のエラー

```bash
Error: listen EADDRINUSE :::3000
```

**解決方法**:
```bash
# 別のポートを使用
npm run dev -- -p 3001
```

### Node.js バージョンエラー

**解決方法**:
```bash
# Node.js バージョン確認
node --version

# nvm を使用してバージョン切り替え（推奨）
nvm use 18
```

### 依存関係のエラー

**解決方法**:
```bash
# node_modules を削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### TypeScript エラー

**解決方法**:
```bash
# TypeScript キャッシュをクリア
npx tsc --build --clean
```

## ホットリロード

開発サーバーは以下のファイル変更を監視し、自動的にリロードします：

- `.tsx`, `.ts` ファイル
- `.css` ファイル
- `public/` ディレクトリのファイル

## パフォーマンス監視

開発中のパフォーマンス確認：

```bash
# バンドルサイズ分析
npm run build
npm run analyze  # 追加設定が必要
```

## 次のステップ

セットアップが完了したら、以下のドキュメントを参照してください：

- [ディレクトリ構成](./directory-structure.md)
- [コンポーネント設計](./components.md)
- [API 仕様](./api-documentation.md)
- [コントリビューションガイド](./contributing.md)