# 陣痛アプリ (Jintsu App)

陣痛の間隔を測定し、記録を管理するWebアプリケーション。本陣痛かどうかの判断を支援し、病院への連絡をサポートします。

## 主な機能

- 陣痛タイマー - ストップウォッチ形式で陣痛の開始・終了時刻を記録
- 間隔測定 - 陣痛終了から次の開始までの間隔を自動計算
- 視覚的警告 - 間隔に応じて色分け表示（10分以下で警告）
- 履歴管理 - 陣痛記録の一覧表示とグラフ表示
- 病院管理 - 病院情報の登録と緊急連絡先の管理

## 技術スタック

- フロントエンド - Nuxt 3, Vue 3, TypeScript
- バックエンド - Hono.js
- データベース - PostgreSQL
- バリデーション - Zod
- グラフ表示 - Chart.js
- 日付処理 - date-fns

## 環境構築

### 必要な環境

- Node.js 18以上
- Docker（PostgreSQLの実行用）

### セットアップ

1. リポジトリのクローン
```bash
git clone [repository-url]
cd jintsu-app
```

2. 依存関係のインストール
```bash
npm install
```

3. データベースの起動
```bash
docker-compose up -d
```

4. 環境変数の設定
```bash
cp .env.example .env
# 必要に応じて.envファイルを編集
```

## 開発

### 開発サーバーの起動

フロントエンドとバックエンドを同時に起動。
```bash
npm run dev
```

個別に起動する場合。
```bash
# フロントエンド (http://localhost:3000)
npm run dev

# APIサーバー (http://localhost:3001)
npm run api:dev
```

### コード品質チェック

```bash
# 型チェック
npm run typecheck

# ESLint
npm run lint

# テスト
npm run test
```

## 本番環境へのビルド

```bash
npm run build
npm run preview
```

## プロジェクト構造

```
jintsu-app/
├── components/          # Vueコンポーネント
├── composables/         # Composition API
├── pages/              # ページコンポーネント
├── server/             # サーバーサイド
│   ├── api/           # APIエンドポイント
│   ├── db/            # データベース設定
│   └── index.ts       # サーバーエントリーポイント
├── types/              # 型定義とZodスキーマ
└── docker-compose.yml  # PostgreSQL設定
```

## APIエンドポイント

### 陣痛記録
- `GET /api/contractions` - 全記録取得
- `POST /api/contractions` - 新規記録作成
- `PUT /api/contractions/:id` - 記録更新
- `DELETE /api/contractions/:id` - 記録削除

### 病院情報
- `GET /api/hospitals` - 全病院取得
- `POST /api/hospitals` - 新規登録
- `PUT /api/hospitals/:id` - 情報更新
- `DELETE /api/hospitals/:id` - 削除

## データベーススキーマ

### contractions テーブル
- 陣痛の開始・終了時刻と継続時間を記録

### hospitals テーブル
- 病院の名前、電話番号、住所、メモを管理
- プライマリ病院の設定が可能

## 開発方針

- TypeScriptの関数型プログラミングスタイル
- any型の使用禁止
- Zodによる型安全なバリデーション
- Composition APIによる状態管理

## ライセンス

[ライセンス情報を記載]。