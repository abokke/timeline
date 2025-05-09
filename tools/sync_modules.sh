#!/bin/bash

# サービス名（docker-compose.yml の name に合わせる）
SERVICE="frontend"

# 引数チェック
if [ $# -eq 0 ]; then
  echo "📦 インストールするパッケージ名を指定してください（例: sh scripts/dev-install.sh html2canvas）"
  exit 1
fi

echo "📦 Installing in container [$SERVICE]: $@"
docker compose exec "$SERVICE" npm install "$@"