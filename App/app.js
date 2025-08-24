// app.js
// Azure Blob Proxy サンプルアプリ（Node.js/Express）

const express = require('express');
const { BlobServiceClient } = require('@azure/storage-blob');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Azure Blob Storage 設定
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = process.env.CONTAINER_NAME || 'sample-container';

if (!AZURE_STORAGE_CONNECTION_STRING) {
    console.error('AZURE_STORAGE_CONNECTION_STRING が設定されていません');
    process.exit(1);
}

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

// プロキシAPI: Blobファイルを取得して返却

// /proxy/ で index.html をデフォルト返却
app.get('/proxy/', async (req, res) => {
    const blobPath = 'Content/index.html'; // デフォルトパス
    try {
        const blockBlobClient = containerClient.getBlockBlobClient(blobPath);
        const downloadBlockBlobResponse = await blockBlobClient.download();
        res.setHeader('Content-Type', downloadBlockBlobResponse.contentType || 'text/html');
        downloadBlockBlobResponse.readableStreamBody.pipe(res);
    } catch (err) {
        console.error('Blob取得失敗:', err.message);
        res.status(404).json({ error: 'Blob取得失敗', detail: err.message });
    }
});

// その他のファイルは従来通り
app.get('/proxy/*', async (req, res) => {
    const blobPath = req.path.replace(/^\/proxy\//, '');
    try {
        const blockBlobClient = containerClient.getBlockBlobClient(blobPath);
        const downloadBlockBlobResponse = await blockBlobClient.download();
        res.setHeader('Content-Type', downloadBlockBlobResponse.contentType || 'application/octet-stream');
        downloadBlockBlobResponse.readableStreamBody.pipe(res);
    } catch (err) {
        console.error('Blob取得失敗:', err.message);
        res.status(404).json({ error: 'Blob取得失敗', detail: err.message });
    }
});

// 開発用: ルートで簡易メッセージ

// ルートで index.html を返却
app.get('/', async (req, res) => {
    const blobPath = 'Content/index.html';
    try {
        const blockBlobClient = containerClient.getBlockBlobClient(blobPath);
        const downloadBlockBlobResponse = await blockBlobClient.download();
        res.setHeader('Content-Type', downloadBlockBlobResponse.contentType || 'text/html');
        downloadBlockBlobResponse.readableStreamBody.pipe(res);
    } catch (err) {
        console.error('Blob取得失敗:', err.message);
        res.status(404).json({ error: 'Blob取得失敗', detail: err.message });
    }
});

app.listen(port, () => {
    console.log(`AppServer 起動: http://localhost:${port}`);
});
