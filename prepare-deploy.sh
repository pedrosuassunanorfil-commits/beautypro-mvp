#!/bin/bash

echo "🚀 PREPARANDO DEPLOY DO BEAUTYPRO MVP"
echo "======================================"

echo "📦 1. Testando build do frontend..."
cd frontend
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Frontend build OK"
else
    echo "❌ Erro no build do frontend"
    exit 1
fi

cd ..

echo "📦 2. Verificando arquivos de deploy..."
files=("railway.json" "Procfile" "backend/requirements-production.txt")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file existe"
    else
        echo "❌ $file não encontrado"
        exit 1
    fi
done

echo "📦 3. Criando .gitignore se não existir..."
if [ ! -f ".gitignore" ]; then
    cat > .gitignore << EOF
# Logs
*.log
npm-debug.log*

# Dependencies  
node_modules/
__pycache__/

# Build outputs
frontend/build/
*.pyc

# Environment variables
.env
.env.local
.env.production.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
EOF
    echo "✅ .gitignore criado"
fi

echo ""
echo "🎉 TUDO PRONTO PARA DEPLOY!"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "1. git add ."
echo "2. git commit -m 'Deploy ready'"  
echo "3. git push origin main"
echo "4. Seguir guia DEPLOY-GUIDE.md"
echo ""
echo "🔗 LINKS ÚTEIS:"
echo "MongoDB Atlas: https://mongodb.com/atlas"
echo "Railway: https://railway.app"
echo "Vercel: https://vercel.com"