# デプロイメント

Next Shop Demo の本番環境へのデプロイ手順と設定について説明します。

## デプロイメント戦略

### 推奨プラットフォーム

1. **Vercel** (推奨)
   - Next.js のネイティブサポート
   - 自動最適化
   - Edge Functions サポート

2. **Netlify**
   - 静的サイト生成に最適
   - フォーム処理サポート

3. **AWS**
   - AWS Amplify
   - EC2 + S3
   - CloudFront CDN

## Vercel へのデプロイ

### 前提条件
- GitHub リポジトリ
- Vercel アカウント

### 手順

#### 1. Vercel プロジェクト作成

```bash
# Vercel CLI インストール
npm i -g vercel

# プロジェクトディレクトリで初期化
vercel

# または Vercel Dashboard から GitHub 連携
```

#### 2. 環境変数設定

Vercel Dashboard で以下の環境変数を設定：

```bash
# 必要に応じて設定
NEXT_PUBLIC_API_URL=https://yourdomain.vercel.app/api
NEXT_PUBLIC_APP_ENV=production
```

#### 3. ビルド設定

`vercel.json` (オプション):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "functions": {
    "src/app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "redirects": [
    {
      "source": "/shop",
      "destination": "/products",
      "permanent": true
    }
  ]
}
```

#### 4. 自動デプロイ

- main ブランチへの push で自動デプロイ
- プルリクエストで Preview デプロイ

### カスタムドメイン設定

```bash
# Vercel CLI でドメイン追加
vercel domains add yourdomain.com

# DNS 設定
# CNAME: www -> cname.vercel-dns.com
# A: @ -> 76.76.19.61
```

## Netlify へのデプロイ

### ビルド設定

`netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Functions 設定

Netlify Functions 用のディレクトリ構成：

```
netlify/
└── functions/
    ├── auth.ts
    ├── products.ts
    └── cart.ts
```

## Docker デプロイ

### Dockerfile

```dockerfile
# Next.js 用 Dockerfile
FROM node:18-alpine AS base

# 依存関係のインストール
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ビルド
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 本番用イメージ
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'
services:
  nextjs:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - nextjs
    restart: unless-stopped
```

## AWS Amplify デプロイ

### amplify.yml

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### 環境変数

AWS Amplify Console で設定：

```
NEXT_PUBLIC_API_URL=https://your-api-domain.com
AMPLIFY_DIFF_DEPLOY=false
AMPLIFY_MONOREPO_APP_ROOT=.
```

## パフォーマンス最適化

### Next.js 設定

`next.config.ts`:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 画像最適化
  images: {
    domains: ['your-image-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 圧縮設定
  compress: true,
  
  // 実験的機能
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
  
  // セキュリティヘッダー
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

export default nextConfig
```

### CDN 設定

#### Cloudflare

```javascript
// Cloudflare Workers でキャッシュ制御
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const cache = caches.default
  const cacheKey = new Request(request.url, request)
  
  // 静的リソースのキャッシュ
  if (request.url.includes('/static/') || request.url.includes('/_next/')) {
    const response = await cache.match(cacheKey)
    if (response) return response
  }
  
  const response = await fetch(request)
  
  // 成功レスポンスをキャッシュ
  if (response.status === 200) {
    event.waitUntil(cache.put(cacheKey, response.clone()))
  }
  
  return response
}
```

## セキュリティ設定

### HTTPS の強制

```javascript
// next.config.ts
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://yourdomain.com/:path*',
        permanent: true,
      },
    ]
  },
}
```

### CSP (Content Security Policy)

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self';"
  )
  
  return response
}
```

## 監視とログ

### Vercel Analytics

```typescript
// _app.tsx または layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### エラー監視

```bash
# Sentry の追加
npm install @sentry/nextjs

# sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
})
```

### ログ管理

```typescript
// utils/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    if (process.env.NODE_ENV === 'production') {
      // 本番環境では外部ログサービスに送信
      console.log(JSON.stringify({ level: 'info', message, meta, timestamp: new Date().toISOString() }))
    } else {
      console.log(message, meta)
    }
  },
  error: (message: string, error?: Error) => {
    if (process.env.NODE_ENV === 'production') {
      // Sentry などにエラー送信
    }
    console.error(message, error)
  }
}
```

## 環境別設定

### 環境変数

```bash
# .env.local (開発環境)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_ENV=development

# .env.production (本番環境)
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXT_PUBLIC_APP_ENV=production
```

### 環境別ビルド

```json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "build:staging": "NODE_ENV=staging next build",
    "start": "next start",
    "start:prod": "NODE_ENV=production next start"
  }
}
```

## CI/CD パイプライン

### GitHub Actions

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build project
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## バックアップとリストア

### データベースバックアップ
現在はモック実装のため不要ですが、将来的には：

```bash
# MongoDB の例
mongodump --uri="mongodb://user:pass@host:port/db" --out /backups/

# 復元
mongorestore --uri="mongodb://user:pass@host:port/db" /backups/db/
```

### 静的ファイルバックアップ

```bash
# S3 へのバックアップ
aws s3 sync ./public s3://your-backup-bucket/public/

# 復元
aws s3 sync s3://your-backup-bucket/public/ ./public
```

## トラブルシューティング

### よくある問題

1. **ビルドエラー**
   ```bash
   # キャッシュクリア
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. **環境変数が効かない**
   - `NEXT_PUBLIC_` プレフィックスの確認
   - ビルド時の環境変数設定

3. **画像が表示されない**
   - `next.config.ts` の images 設定
   - CDN の CORS 設定

### デプロイログの確認

```bash
# Vercel CLI
vercel logs

# Netlify CLI
netlify logs

# Docker
docker logs container_name
```