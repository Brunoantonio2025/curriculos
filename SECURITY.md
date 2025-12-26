# 🔒 Guia de Segurança - CV Builder Pro

## ✅ Melhorias de Segurança Implementadas

### 1. **Proteção de Credenciais Sensíveis**
- ✅ Access Token do Mercado Pago movido para variáveis de ambiente
- ✅ Arquivo `.env.example` criado como template
- ✅ `.env` já está no `.gitignore`

### 2. **CORS Restrito**
- ✅ CORS configurado para aceitar apenas origens permitidas
- ✅ Fallback seguro caso origem não esteja na lista

### 3. **Validação de Entrada**
- ✅ Validação de email (formato correto)
- ✅ Validação de payment ID (apenas números)
- ✅ Validação de valores de pagamento (min/max)
- ✅ Sanitização de dados do usuário

### 4. **Rate Limiting**
- ✅ Limite de 5 requisições por minuto por IP
- ✅ Proteção contra ataques de força bruta

### 5. **Headers de Segurança**
- ✅ X-Frame-Options: DENY (previne clickjacking)
- ✅ X-XSS-Protection: 1; mode=block
- ✅ X-Content-Type-Options: nosniff
- ✅ Strict-Transport-Security (HSTS)
- ✅ Content Security Policy (CSP)
- ✅ Referrer-Policy
- ✅ Permissions-Policy

### 6. **Proteção de Erros**
- ✅ Mensagens de erro genéricas (não expõem detalhes internos)
- ✅ Logging adequado para debugging
- ✅ Timeouts configurados (10s)

### 7. **Validação de Métodos HTTP**
- ✅ Apenas POST para create-payment
- ✅ Apenas GET para check-status
- ✅ OPTIONS para CORS preflight

---

## 🚀 Configuração Necessária no Netlify

### Variáveis de Ambiente (Environment Variables)

Acesse: **Site Settings → Environment Variables** no Netlify e adicione:

1. **MERCADO_PAGO_ACCESS_TOKEN**
   - Valor: Seu Access Token do Mercado Pago
   - Exemplo: `APP_USR-xxxxxxxx-xxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx`

2. **ALLOWED_ORIGINS**
   - Valor: Lista de origens permitidas separadas por vírgula
   - Exemplo: `https://seu-site.netlify.app,https://www.seu-dominio.com`
   - Para desenvolvimento local: `http://localhost:5173,https://seu-site.netlify.app`

3. **MIN_PAYMENT_AMOUNT** (opcional)
   - Valor: `1.00`
   - Valor mínimo permitido para pagamento

4. **MAX_PAYMENT_AMOUNT** (opcional)
   - Valor: `10.00`
   - Valor máximo permitido para pagamento

---

## 📋 Checklist de Deploy Seguro

### Antes do Deploy:

- [ ] Configurar todas as variáveis de ambiente no Netlify
- [ ] Verificar se `.env` está no `.gitignore`
- [ ] Nunca commitar credenciais no código
- [ ] Testar CORS com o domínio de produção
- [ ] Verificar se o Access Token do Mercado Pago é válido

### Após o Deploy:

- [ ] Testar criação de pagamento
- [ ] Testar verificação de status
- [ ] Verificar headers de segurança (use https://securityheaders.com)
- [ ] Testar rate limiting (fazer 6+ requisições em 1 minuto)
- [ ] Verificar logs no Netlify Functions

---

## 🔍 Testes de Segurança Recomendados

### 1. Teste de Headers
```bash
curl -I https://seu-site.netlify.app
```

### 2. Teste de CORS
```bash
curl -H "Origin: https://site-malicioso.com" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://seu-site.netlify.app/.netlify/functions/create-payment
```

### 3. Teste de Rate Limiting
Execute 6 requisições seguidas e verifique se a 6ª retorna 429

### 4. Teste de Validação
Tente enviar:
- Email inválido
- Payment ID não numérico
- Valor fora do range permitido

---

## 🛡️ Boas Práticas Adicionais

### Para Produção:
1. **Use um serviço de Rate Limiting robusto** (ex: Cloudflare, AWS WAF)
2. **Implemente logging centralizado** (ex: Sentry, LogRocket)
3. **Configure alertas** para erros e tentativas suspeitas
4. **Faça backups regulares** dos dados
5. **Mantenha dependências atualizadas** (`npm audit`)
6. **Use HTTPS sempre** (Netlify já fornece)
7. **Configure webhooks do Mercado Pago** para confirmação de pagamento

### Monitoramento:
- Monitore logs de erro no Netlify
- Configure alertas para picos de requisições
- Revise regularmente os logs de pagamento

---

## 🚨 O Que Fazer em Caso de Incidente

1. **Se credenciais forem expostas:**
   - Revogue imediatamente o Access Token no Mercado Pago
   - Gere um novo token
   - Atualize a variável de ambiente no Netlify
   - Investigue como a exposição ocorreu

2. **Se detectar ataque:**
   - Verifique logs no Netlify Functions
   - Identifique IPs suspeitos
   - Considere bloquear IPs específicos
   - Reduza temporariamente o rate limit

3. **Se houver erro de pagamento:**
   - Verifique se o Access Token está válido
   - Confirme se as variáveis de ambiente estão corretas
   - Verifique status da API do Mercado Pago

---

## 📚 Recursos Adicionais

- [Mercado Pago API Docs](https://www.mercadopago.com.br/developers/pt/docs)
- [Netlify Functions Security](https://docs.netlify.com/functions/overview/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Security Headers](https://securityheaders.com)

---

**Última atualização:** 2025-12-26
**Versão:** 2.0.0
