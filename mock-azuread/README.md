# Mock Azure AD OAuth2.0/MSAL Server

Servidor mock para simular autenticação Azure AD OAuth2.0/MSAL para desenvolvimento e testes.

## Instalação

1. Instale as dependências:
```bash
pip install -r requirements.txt
```

2. Configure as variáveis de ambiente (opcional):
```bash
cp .env.example .env
```

## Execução

```bash
python app.py
```

O servidor será executado em `http://localhost:5000`

## Endpoints Disponíveis

- `GET /` - Informações do serviço
- `GET/POST /oauth2/v2.0/authorize` - Endpoint de autorização OAuth2.0
- `POST /oauth2/v2.0/token` - Endpoint para obter tokens
- `GET /.well-known/openid-configuration` - Configuração OpenID Connect
- `GET /.well-known/jwks.json` - JSON Web Key Set
- `GET /v1.0/me` ou `/v2.0/me` - Informações do usuário autenticado

## Contas de Teste

| Email | Senha | Roles |
|-------|-------|-------|
| user@example.com | password123 | User, Admin |
| admin@example.com | admin123 | Admin |

## Fluxos Suportados

### Authorization Code Flow

1. Redirecione o usuário para:
```
http://localhost:5000/oauth2/v2.0/authorize?
  client_id=your-client-id&
  redirect_uri=your-redirect-uri&
  response_type=code&
  scope=openid profile email&
  state=random-state
```

2. Após login, o usuário será redirecionado com o código:
```
your-redirect-uri?code=authorization-code&state=random-state
```

3. Troque o código por tokens:
```bash
POST http://localhost:5000/oauth2/v2.0/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=authorization-code&
client_id=your-client-id&
redirect_uri=your-redirect-uri
```

### Implicit Flow

1. Redirecione para:
```
http://localhost:5000/oauth2/v2.0/authorize?
  client_id=your-client-id&
  redirect_uri=your-redirect-uri&
  response_type=token&
  scope=openid profile email&
  state=random-state
```

2. Tokens retornados no fragment da URL:
```
your-redirect-uri#access_token=token&token_type=Bearer&expires_in=3600&state=random-state
```

### Client Credentials Flow

```bash
POST http://localhost:5000/oauth2/v2.0/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&
client_id=your-client-id&
client_secret=your-client-secret
```

### Refresh Token

```bash
POST http://localhost:5000/oauth2/v2.0/token
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&
refresh_token=your-refresh-token
```

## Integração com Aplicação React

Configure o MSAL no React para usar este servidor mock:

```javascript
const msalConfig = {
  auth: {
    clientId: "mock-client-id",
    authority: "http://localhost:5000",
    redirectUri: "http://localhost:3000",
    knownAuthorities: ["localhost:5000"],
    protocolMode: "OIDC"
  }
};
```

## Notas

- Este é um servidor mock apenas para desenvolvimento/testes
- Não use em produção
- Os tokens são assinados com HS256 (não RS256 como o Azure AD real)
- As validações de segurança são simplificadas