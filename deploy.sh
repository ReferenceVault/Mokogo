

echo "🔧 Testing NGINX config..."
sudo nginx -t

echo "🔄 Reloading NGINX..."
sudo systemctl reload nginx

echo "✅ Frontend deployed successfully!"

