# ベースイメージ（軽量）
FROM node:20-alpine

# 作業ディレクトリ
WORKDIR /app

# 依存ファイルをコピーして install
COPY package*.json ./
RUN npm install

# アプリ本体をコピー
COPY . .

# ポートを公開（Vite のデフォルト）
EXPOSE 5173

# 開発サーバーを起動
CMD ["npm", "run", "dev"]
