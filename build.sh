
echo "🔹 Starting frontend deployment..."

echo "📥 Pulling latest code from Git..."
git pull origin main

echo "📦 Installing dependencies..."
npm install

echo "⚡ Building frontend..."
npm run build


echo "✅ Frontend build successfully!"
