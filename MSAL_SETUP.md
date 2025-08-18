# Configuração MSAL para Mock Azure AD

## Setup para Desenvolvimento com Mock

1. **Inicie o servidor mock:**
```bash
cd mock-azuread
pip install -r requirements.txt
python app.py
```

⚠️ **Importante**: O servidor usa HTTPS com certificado auto-assinado. Quando acessar `https://localhost:5000` pela primeira vez, aceite o aviso de segurança do navegador.

2. **Configure as variáveis de ambiente:**
O arquivo `.env.development` já está configurado para usar o mock:
```
VITE_AZURE_CLIENT_ID=mock-client-id
VITE_AZURE_AUTHORITY=https://localhost:5000
VITE_REDIRECT_URI=http://localhost:5173
VITE_POST_LOGOUT_URI=http://localhost:5173
```

3. **Inicie sua aplicação React:**
```bash
cd metadata-editor-portal
npm run dev
```

## Contas de Teste Disponíveis

| Email | Senha | Roles |
|-------|-------|-------|
| user@example.com | password123 | User, Admin |
| admin@example.com | admin123 | Admin |

## Alternando para Azure AD Real

Para usar o Azure AD real em produção, crie um arquivo `.env.production`:

```env
VITE_AZURE_CLIENT_ID=seu-client-id-real
VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/seu-tenant-id
VITE_REDIRECT_URI=https://seu-dominio.com
VITE_POST_LOGOUT_URI=https://seu-dominio.com
```

## Como Funciona

A configuração em `src/config/authConfig.js` detecta automaticamente se você está usando localhost e aplica as configurações corretas:

- **Mock (localhost):** Usa `protocolMode: 'OIDC'` e `knownAuthorities: ['localhost:5000']`
- **Azure AD Real:** Usa configurações padrão do Azure AD

## Debugging

Se encontrar problemas, verifique:

1. O servidor mock está rodando em `http://localhost:5000`
2. As variáveis de ambiente estão carregadas corretamente
3. Não há conflitos de CORS (o mock já tem CORS habilitado)
4. O console do navegador para logs do MSAL