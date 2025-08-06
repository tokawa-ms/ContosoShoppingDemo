# デプロイメント仕様書

## デプロイメント戦略

### 環境構成

```
開発環境 (Development) → ステージング環境 (Staging) → 本番環境 (Production)
```

### 各環境の用途

- **開発環境**: 機能開発・単体テスト
- **ステージング環境**: 統合テスト・受入テスト
- **本番環境**: エンドユーザー向けサービス提供

## ホスティング環境

### 推奨プラットフォーム: Vercel

**選択理由**:

- Next.js との完全統合
- 自動的なビルド最適化
- Edge Functions サポート
- グローバル CDN
- 簡単なプレビューデプロイ

### 代替プラットフォーム

1. **Azure Static Web Apps**

   - Azure 環境との統合
   - 無料 SSL 証明書
   - カスタムドメイン対応

2. **Netlify**
   - 高いパフォーマンス
   - フォーム処理機能
   - A/B テスト機能

## インフラストラクチャ要件

### データベース: Azure Cosmos DB

**構成**:

- **開発環境**: Azure Cosmos DB Emulator (ローカル)
- **ステージング**: Standard tier (400 RU/s)
- **本番環境**: Standard tier (1000 RU/s, 自動スケーリング有効)

**バックアップ設定**:

- **本番環境**: 継続バックアップ有効
- **復旧ポイント**: 30 日間
- **地理的冗長**: 有効

### CDN・静的アセット

- **画像配信**: Vercel Image Optimization
- **静的ファイル**: Vercel Edge Network
- **キャッシュ戦略**:
  - 画像: 1 年間キャッシュ
  - JavaScript/CSS: ハッシュベースキャッシュ
  - HTML: キャッシュなし

## CI/CD パイプライン

### GitHub Actions ワークフロー

#### デプロイパイプライン設定

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Run E2E tests
        run: npm run test:e2e

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: .next/

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - name: Deploy to Staging
        run: |
          # Vercel staging deployment
          npx vercel --token ${{ secrets.VERCEL_TOKEN }}

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Production
        run: |
          # Vercel production deployment
          npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

### デプロイフロー

1. **プルリクエスト作成**: プレビューデプロイ自動実行
2. **ステージングブランチマージ**: ステージング環境自動デプロイ
3. **メインブランチマージ**: 本番環境自動デプロイ

## 環境変数管理

### 環境別設定

**開発環境 (.env.local)**:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=development-secret-key
COSMOS_DB_ENDPOINT=https://localhost:8081
COSMOS_DB_KEY=development-key
NODE_ENV=development
```

**ステージング環境**:

```env
NEXTAUTH_URL=https://nextshopdemo-staging.vercel.app
NEXTAUTH_SECRET=staging-secret-key
COSMOS_DB_ENDPOINT=https://nextshopdemo-staging.documents.azure.com:443/
COSMOS_DB_KEY=${COSMOS_DB_STAGING_KEY}
NODE_ENV=staging
```

**本番環境**:

```env
NEXTAUTH_URL=https://nextshopdemo.vercel.app
NEXTAUTH_SECRET=${NEXTAUTH_SECRET_PRODUCTION}
COSMOS_DB_ENDPOINT=https://nextshopdemo-prod.documents.azure.com:443/
COSMOS_DB_KEY=${COSMOS_DB_PRODUCTION_KEY}
NODE_ENV=production
```

### シークレット管理

- **開発**: ローカル .env.local ファイル
- **ステージング/本番**: Vercel Environment Variables
- **CI/CD**: GitHub Secrets

## パフォーマンス最適化

### ビルド最適化

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["example.com"],
    formats: ["image/webp", "image/avif"],
  },
  experimental: {
    optimizeCss: true,
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  assetPrefix: process.env.NODE_ENV === "production" ? "/cdn" : "",
};

module.exports = nextConfig;
```

### 静的生成最適化

- **商品一覧ページ**: ISR (Incremental Static Regeneration)
- **商品詳細ページ**: SSG with fallback
- **ユーザー固有ページ**: SSR
- **静的ページ**: SSG

## セキュリティ設定

### HTTPS 設定

- **SSL 証明書**: Vercel 自動提供
- **HSTS**: 有効化
- **リダイレクト**: HTTP → HTTPS 自動

### セキュリティヘッダー

```javascript
// next.config.js - Security Headers
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
];
```

### CORS 設定

```javascript
// API CORS設定
const corsHeaders = {
  "Access-Control-Allow-Origin":
    process.env.NODE_ENV === "production"
      ? "https://nextshopdemo.vercel.app"
      : "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
```

## 監視・ログ設定

### アプリケーション監視

- **エラー追跡**: Sentry (推奨)
- **パフォーマンス**: Vercel Analytics
- **アップタイム**: UptimeRobot

### ログ管理

```javascript
// 構造化ログ設定
const logger = {
  info: (message, metadata) => {
    console.log(
      JSON.stringify({
        level: "info",
        message,
        timestamp: new Date().toISOString(),
        ...metadata,
      })
    );
  },
  error: (message, error, metadata) => {
    console.error(
      JSON.stringify({
        level: "error",
        message,
        error: error.stack,
        timestamp: new Date().toISOString(),
        ...metadata,
      })
    );
  },
};
```

## バックアップ・復旧

### データベースバックアップ

- **自動バックアップ**: Azure Cosmos DB 継続バックアップ
- **手動バックアップ**: 週次スクリプト実行
- **復旧テスト**: 月次実施

### アプリケーションバックアップ

- **ソースコード**: GitHub リポジトリ
- **設定ファイル**: Git 管理
- **ビルドアーティファクト**: Vercel 自動保管

## トラフィック管理

### スケーリング設定

- **Vercel**: 自動スケーリング (Function 実行時間: 10 秒)
- **Azure Cosmos DB**: オートスケール (100-1000 RU/s)

### レート制限

```javascript
// API レート制限設定
const rateLimiter = {
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // 最大100リクエスト
  message: "Too many requests from this IP",
};
```

## 本番リリース手順

### リリース前チェックリスト

- [ ] 全テストの実行・パス確認
- [ ] セキュリティスキャン実行
- [ ] パフォーマンステスト実行
- [ ] データベースマイグレーション確認
- [ ] 環境変数設定確認
- [ ] ドメイン・SSL 証明書確認

### リリース手順

1. **ステージング環境での最終確認**
2. **メインブランチへのマージ**
3. **自動デプロイの監視**
4. **本番環境でのスモークテスト**
5. **ユーザー通知（必要に応じて）**

### ロールバック手順

1. **問題検知・報告**
2. **Vercel 管理画面から前バージョンに切り戻し**
3. **データベース復旧（必要に応じて）**
4. **動作確認・ユーザー通知**
