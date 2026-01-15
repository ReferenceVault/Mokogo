#!/bin/bash

# ==============================
# Frontend Deployment Script
# ==============================
echo "🔹 Starting frontend deployment..."

echo "📥 Pulling latest code from Git..."
git pull origin main

echo "📦 Installing dependencies..."
npm install

echo "⚡ Building frontend..."
npm run build

echo "🔧 Testing NGINX config..."
sudo nginx -t

echo "🔄 Reloading NGINX..."
sudo systemctl reload nginx

echo "✅ Frontend deployed successfully!"

