# CV Builder Pro

Criador de currículos profissional com pagamento via PIX (Mercado Pago).

## 🚀 Configuração

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais:
```env
MERCADO_PAGO_ACCESS_TOKEN=seu_access_token_aqui
VITE_APP_URL=http://localhost:5173
VITE_ALLOWED_ORIGINS=http://localhost:5173
```

### 3. Executar Localmente
```bash
npm run dev
```

## 🔒 Segurança

Este projeto implementa várias camadas de segurança:
- ✅ Credenciais em variáveis de ambiente
- ✅ CORS restrito
- ✅ Rate limiting
- ✅ Validação de entrada
- ✅ Headers de segurança (CSP, HSTS, etc)
- ✅ Sanitização de dados

Leia o arquivo [SECURITY.md](./SECURITY.md) para mais detalhes.

## 📦 Deploy no Netlify

### Configuração Automática
1. Conecte seu repositório ao Netlify
2. Configure as variáveis de ambiente:
   - `MERCADO_PAGO_ACCESS_TOKEN`
   - `ALLOWED_ORIGINS`
   - `MIN_PAYMENT_AMOUNT` (opcional)
   - `MAX_PAYMENT_AMOUNT` (opcional)

### Build Settings
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Functions directory:** `netlify/functions`

## 🛠️ Tecnologias

- React + TypeScript
- Vite
- TailwindCSS
- Mercado Pago API
- Netlify Functions
- html2pdf.js

## 📄 Licença

MIT
