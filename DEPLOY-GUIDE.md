# 🚀 GUIA DE DEPLOY - BeautyPro MVP

## ✅ ARQUIVOS PRONTOS PARA DEPLOY

Todos os arquivos de configuração já foram criados:
- `railway.json` - Configuração do Railway
- `Procfile` - Comando de inicialização 
- `requirements-production.txt` - Dependências do Python
- `.env.production` - Variáveis de ambiente (template)

## 📋 PASSO A PASSO DO DEPLOY

### 1. MONGODB ATLAS (Database - GRATUITO)

1. Acesse: https://mongodb.com/atlas
2. Clique "Try Free"
3. Crie conta com Google/GitHub
4. Escolha "M0 Sandbox" (GRATUITO)
5. Região: AWS - São Paulo (sa-east-1)
6. Cluster Name: beautypro-cluster
7. **IMPORTANTE**: Anote usuário e senha
8. Network Access → Add IP Address → "Allow Access from Anywhere" (0.0.0.0/0)
9. Database Access → Add New User → beautypro_user
10. Connect → Drivers → Copy Connection String

**SUA CONNECTION STRING:**
```
mongodb+srv://beautypro_user:<password>@beautypro-cluster.xxxxx.mongodb.net/beautypro_prod?retryWrites=true&w=majority
```

### 2. RAILWAY (Backend - $5/mês)

1. Acesse: https://railway.app
2. Login com GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Selecione seu repositório
5. Railway detecta Python automaticamente
6. **Configurar Variáveis de Ambiente:**
   - `MONGO_URL`: sua connection string do MongoDB
   - `DB_NAME`: beautypro_prod
   - `CORS_ORIGINS`: https://seu-app.vercel.app
   - `JWT_SECRET`: beautypro-prod-secret-2024-xyz
   - `PORT`: 8001

7. Deploy automático acontece
8. **Anote a URL:** https://beautypro-api-production.up.railway.app

### 3. VERCEL (Frontend - GRATUITO)

1. Acesse: https://vercel.com
2. Login com GitHub
3. "Import Project"
4. Selecione seu repositório
5. **Configurações:**
   - Framework: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

6. **Environment Variables:**
   - `REACT_APP_BACKEND_URL`: URL do Railway

7. Deploy automático
8. **Anote a URL:** https://beautypro-mvp.vercel.app

## 🔧 CONFIGURAÇÕES FINAIS

### Atualizar CORS no Railway:
1. Railway → Variables → Edit `CORS_ORIGINS`
2. Colocar: `https://beautypro-mvp.vercel.app`
3. Redeploy

### Testar Sistema:
1. Acesse seu Vercel URL
2. Registre uma conta teste
3. Crie um serviço
4. Teste agendamento público

## 🆘 TROUBLESHOOTING

### Backend não inicia:
- Checar logs no Railway
- Verificar MONGO_URL
- Verificar se todas as variáveis estão definidas

### Frontend não conecta:
- Verificar REACT_APP_BACKEND_URL
- Testar URL do backend diretamente: https://seu-backend.railway.app/api/

### Banco não conecta:
- Verificar IP whitelist no MongoDB Atlas
- Testar connection string

## ✅ CHECKLIST PÓS-DEPLOY

- [ ] Sistema acessível via internet
- [ ] Registro de usuário funciona
- [ ] Login funciona  
- [ ] Dashboard carrega
- [ ] Cadastro de serviços funciona
- [ ] Link de agendamento público funciona
- [ ] Agendamento externo funciona

## 💰 CUSTOS

- MongoDB Atlas: R$ 0/mês (gratuito)
- Railway: ~R$ 25/mês ($5)
- Vercel: R$ 0/mês (gratuito)
- **TOTAL: ~R$ 25/mês**

## 🎯 PRÓXIMOS PASSOS

1. ✅ Deploy funcionando
2. 🔄 Comprar domínio (beautypro.app)
3. 🔄 Integração Mercado Pago
4. 🔄 Primeiros clientes teste