# Azure Blob Proxy サンプルアプリ 要件定義・設計（簡易版）

## セットアップ手順


1. 必要なパッケージをインストール
	```sh
	cd App
	npm init -y
	npm install express @azure/storage-blob dotenv
	```

2. 不要なパッケージが入っていないか確認・削除
	```sh
	npm ls router path-to-regexp
	npm uninstall router path-to-regexp
	```

2. `.env` ファイルを作成（Appディレクトリ内）
	```env
	AZURE_STORAGE_CONNECTION_STRING=your-azure-connection-string
	CONTAINER_NAME=sample-container
	PORT=3000
	```

3. `.gitignore` に `.env` を追加（Appディレクトリ内）
	```
	.env
	```

4. アプリの起動
	```sh
	node app.js
	```

5. 動作確認
	- ブラウザやAPIクライアントで `http://localhost:3000/proxy/ファイルパス` にアクセス
	- 例: `http://localhost:3000/proxy/img/image.png`

※ Azure Blob Storage の接続情報は Azure ポータルから取得してください。

## 目的
Azure Blob Storage 上の静的コンテンツを AppServer 経由でプロキシ配信するサンプルアプリを作成する。

## 利用シナリオ
- クライアントが AppServer にリクエスト
- AppServer が Azure Blob Storage からコンテンツを取得し返却

## システム構成
- クライアント（Webブラウザ等）
- AppServer（Node.js/Express など）
- Azure Blob Storage

## 主要機能
- Blob Storage からのファイル取得・配信（プロキシ）
- 開発・デバッグ用のログ出力
- エラーハンドリング（Blob取得失敗時のメッセージ返却）

## 非機能要件
- 認証・認可は不要（サンプルのため）
- 開発・デバッグしやすい構成（詳細ログ、エラー内容表示、ホットリロード等）
- シンプルなAPI設計

## 利用技術
- Azure Blob Storage
- AppServer: Node.js/Express（例）
- Azure SDK for JavaScript/TypeScript

## API設計例
- `GET /proxy/:blobPath` … 指定パスのBlobファイルを返却

## ログ・監査
- 開発時は詳細なアクセスログ・エラーログを出力

## エラーハンドリング
- Blob取得失敗時はエラー内容を返却（開発時は詳細表示）

## デプロイ・運用
- ローカル環境で動作確認可能
- Azure App Service などでのデプロイも可能

## テスト方針
- API単体テスト
- Blob Storage 連携テスト

## 今後の拡張性
- 認証・認可追加
- ファイル一覧取得やアップロード機能追加
