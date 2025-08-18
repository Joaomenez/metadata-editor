from flask import Flask, request, jsonify, redirect, url_for, render_template_string
from flask_cors import CORS
import jwt
import uuid
import datetime
import base64
import json
import secrets
from urllib.parse import urlencode, parse_qs, urlparse
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY', secrets.token_hex(32))
TENANT_ID = os.getenv('TENANT_ID', 'mock-tenant-' + str(uuid.uuid4()))
CLIENT_ID = os.getenv('CLIENT_ID', 'mock-client-' + str(uuid.uuid4()))
ISSUER = os.getenv('ISSUER', f'https://login.microsoftonline.com/{TENANT_ID}/v2.0')

app = Flask(__name__)
app.secret_key = SECRET_KEY  # Para usar sessions
app.config['SECRET_KEY'] = SECRET_KEY
CORS(app, supports_credentials=True)

# Middleware para debug de todas as requisições
@app.before_request
def log_request_info():
    if request.endpoint and 'token' in request.endpoint:
        print(f"DEBUG: Before request - Method: {request.method}, URL: {request.url}")
        print(f"DEBUG: Before request - Content-Type: {request.content_type}")
        print(f"DEBUG: Before request - Headers: {dict(request.headers)}")
        print(f"DEBUG: Before request - Raw data: {request.get_data()}")

# Handler para erro 415  
@app.errorhandler(415)
def handle_unsupported_media_type(e):
    print(f"DEBUG: 415 Error - Method: {request.method}, URL: {request.url}")
    print(f"DEBUG: 415 Error - Content-Type: {request.content_type}")
    print(f"DEBUG: 415 Error - Raw data: {request.get_data()}")
    return jsonify({'error': 'unsupported_media_type', 'message': str(e)}), 415

authorization_codes = {}
access_tokens = {}
refresh_tokens = {}

mock_users = {
    'user@example.com': {
        'password': 'password123',
        'name': 'Mock User',
        'oid': str(uuid.uuid4()),
        'preferred_username': 'user@example.com',
        'roles': ['User', 'Admin']
    },
    'admin@example.com': {
        'password': 'admin123',
        'name': 'Admin User',
        'oid': str(uuid.uuid4()),
        'preferred_username': 'admin@example.com',
        'roles': ['Admin']
    }
}

LOGIN_TEMPLATE = '''
<!DOCTYPE html>
<html>
<head>
    <title>Mock Azure AD Login</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .login-container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            width: 350px;
        }
        h2 {
            margin-bottom: 30px;
            text-align: center;
            color: #333;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            color: #666;
            font-size: 14px;
        }
        input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
            box-sizing: border-box;
        }
        button {
            width: 100%;
            padding: 12px;
            background: #0078d4;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.3s;
        }
        button:hover {
            background: #006bb3;
        }
        .error {
            color: #d93025;
            font-size: 14px;
            margin-top: 10px;
            text-align: center;
        }
        .info {
            background: #f0f8ff;
            border: 1px solid #0078d4;
            padding: 10px;
            border-radius: 5px;
            font-size: 12px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <h2>Mock Azure AD</h2>
        <div class="info">
            <strong>Test Accounts:</strong><br>
            Email: user@example.com / Password: password123<br>
            Email: admin@example.com / Password: admin123
        </div>
        <form method="POST">
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit">Sign In</button>
            {% if error %}
            <div class="error">{{ error }}</div>
            {% endif %}
        </form>
    </div>
</body>
</html>
'''

@app.route('/')
def home():
    return jsonify({
        'service': 'Mock Azure AD OAuth2.0/MSAL',
        'endpoints': {
            'authorize': '/oauth2/v2.0/authorize',
            'token': '/oauth2/v2.0/token',
            'jwks': '/.well-known/jwks.json',
            'openid-configuration': '/.well-known/openid-configuration'
        },
        'test_accounts': list(mock_users.keys())
    })

@app.route('/oauth2/v2.0/authorize', methods=['GET', 'POST'])
@app.route('/mock-tenant/oauth2/v2.0/authorize', methods=['GET', 'POST'])
@app.route('/mock-tenant/v2.0/authorize', methods=['GET', 'POST'])
def authorize():
    if request.method == 'GET':
        client_id = request.args.get('client_id')
        redirect_uri = request.args.get('redirect_uri')
        response_type = request.args.get('response_type')
        scope = request.args.get('scope', 'openid profile email')
        state = request.args.get('state', '')
        
        response_mode = request.args.get('response_mode', 'query')
        code_challenge = request.args.get('code_challenge')
        code_challenge_method = request.args.get('code_challenge_method')
        nonce = request.args.get('nonce')
        
        print(f"DEBUG: Authorization request - response_type: {response_type}, response_mode: {response_mode}, redirect_uri: {redirect_uri}")
        print(f"DEBUG: PKCE - code_challenge: {code_challenge is not None}, method: {code_challenge_method}")
        print(f"DEBUG: Nonce: {nonce}")
        
        if not all([client_id, redirect_uri, response_type]):
            return jsonify({'error': 'Missing required parameters'}), 400
            
        # Armazenar os parâmetros da sessão para o POST
        from flask import session
        session['auth_params'] = {
            'client_id': client_id,
            'redirect_uri': redirect_uri,
            'response_type': response_type,
            'response_mode': response_mode,
            'scope': scope,
            'state': state,
            'code_challenge': code_challenge,
            'code_challenge_method': code_challenge_method,
            'nonce': nonce
        }
        
        return render_template_string(LOGIN_TEMPLATE, error=None)
    
    elif request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        # Recuperar parâmetros da sessão
        from flask import session
        auth_params = session.get('auth_params', {})
        redirect_uri = auth_params.get('redirect_uri')
        state = auth_params.get('state', '')
        response_type = auth_params.get('response_type')
        response_mode = auth_params.get('response_mode', 'query')
        code_challenge = auth_params.get('code_challenge')
        nonce = auth_params.get('nonce')
        
        print(f"DEBUG: Login attempt - response_type: {response_type}, response_mode: {response_mode}, email: {email}")
        print(f"DEBUG: Login attempt - nonce: {nonce}")
        
        if email in mock_users and mock_users[email]['password'] == password:
            user = mock_users[email]
            
            if response_type == 'code':
                code = str(uuid.uuid4())
                authorization_codes[code] = {
                    'user': user,
                    'email': email,
                    'expires': datetime.datetime.utcnow() + datetime.timedelta(minutes=10),
                    'code_challenge': code_challenge,
                    'nonce': nonce
                }
                
                params = {
                    'code': code,
                    'state': state
                }
                
                # Usar fragment se response_mode=fragment, senão query
                if response_mode == 'fragment':
                    return redirect(f"{redirect_uri}#{urlencode(params)}")
                else:
                    return redirect(f"{redirect_uri}?{urlencode(params)}")
            
            elif response_type == 'token':
                access_token = generate_access_token(user, email)
                params = {
                    'access_token': access_token,
                    'token_type': 'Bearer',
                    'expires_in': 3600,
                    'state': state
                }
                return redirect(f"{redirect_uri}#{urlencode(params)}")
            
            elif response_type == 'id_token':
                id_token = generate_id_token(user, email)
                params = {
                    'id_token': id_token,
                    'token_type': 'Bearer',
                    'expires_in': 3600,
                    'state': state
                }
                return redirect(f"{redirect_uri}#{urlencode(params)}")
            
            elif response_type == 'code id_token' or response_type == 'id_token code':
                code = str(uuid.uuid4())
                authorization_codes[code] = {
                    'user': user,
                    'email': email,
                    'expires': datetime.datetime.utcnow() + datetime.timedelta(minutes=10)
                }
                id_token = generate_id_token(user, email)
                params = {
                    'code': code,
                    'id_token': id_token,
                    'state': state
                }
                return redirect(f"{redirect_uri}#{urlencode(params)}")
                
            elif response_type == 'id_token token':
                access_token = generate_access_token(user, email)
                id_token = generate_id_token(user, email)
                params = {
                    'access_token': access_token,
                    'id_token': id_token,
                    'token_type': 'Bearer',
                    'expires_in': 3600,
                    'state': state
                }
                return redirect(f"{redirect_uri}#{urlencode(params)}")
        
        return render_template_string(LOGIN_TEMPLATE, error="Invalid email or password")

@app.route('/oauth2/v2.0/token', methods=['POST'])
@app.route('/mock-tenant/oauth2/v2.0/token', methods=['POST']) 
@app.route('/mock-tenant/v2.0/token', methods=['POST'])
def token():
    print(f"DEBUG: Token endpoint reached!")
    
    # Forçar aceitar qualquer content-type
    try:
        # Debug: verificar content-type e dados recebidos
        print(f"DEBUG: Token request - Method: {request.method}")
        print(f"DEBUG: Token request - Content-Type: {request.content_type}")
        print(f"DEBUG: Token request - Headers: {dict(request.headers)}")
        print(f"DEBUG: Token request - Form data: {dict(request.form)}")
        
        # Tentar obter dados como JSON
        json_data = None
        try:
            json_data = request.get_json(force=True)  # force=True ignora content-type
            print(f"DEBUG: Token request - JSON data (forced): {json_data}")
        except:
            print(f"DEBUG: Could not parse as JSON")
        
        # Dados raw
        raw_data = request.get_data(as_text=True)
        print(f"DEBUG: Token request - Raw data: {raw_data}")
    except Exception as e:
        print(f"DEBUG: Error in token debug: {e}")
    
    # Tentar obter grant_type de diferentes fontes
    grant_type = None
    if request.form:
        grant_type = request.form.get('grant_type')
    elif request.json:
        grant_type = request.json.get('grant_type')
    else:
        # Tentar parsear dados raw
        try:
            from urllib.parse import parse_qs
            raw_data = request.get_data(as_text=True)
            parsed_data = parse_qs(raw_data)
            grant_type = parsed_data.get('grant_type', [None])[0]
        except:
            pass
    
    print(f"DEBUG: Extracted grant_type: {grant_type}")
    
    # Função helper para extrair dados
    def get_param(key):
        if request.form:
            return request.form.get(key)
        elif request.json:
            return request.json.get(key)
        else:
            try:
                from urllib.parse import parse_qs
                raw_data = request.get_data(as_text=True)
                parsed_data = parse_qs(raw_data)
                return parsed_data.get(key, [None])[0]
            except:
                return None
    
    if grant_type == 'authorization_code':
        code = get_param('code')
        
        if code in authorization_codes:
            auth_data = authorization_codes[code]
            
            if auth_data['expires'] > datetime.datetime.utcnow():
                user = auth_data['user']
                email = auth_data['email']
                nonce = auth_data.get('nonce')
                
                access_token = generate_access_token(user, email)
                id_token = generate_id_token(user, email, nonce)
                refresh_token = str(uuid.uuid4())
                
                refresh_tokens[refresh_token] = {
                    'user': user,
                    'email': email
                }
                
                del authorization_codes[code]
                
                return jsonify({
                    'access_token': access_token,
                    'id_token': id_token,
                    'token_type': 'Bearer',
                    'expires_in': 3600,
                    'refresh_token': refresh_token,
                    'scope': 'openid profile email'
                })
        
        return jsonify({'error': 'invalid_grant'}), 400
    
    elif grant_type == 'refresh_token':
        refresh_token = get_param('refresh_token')
        
        if refresh_token in refresh_tokens:
            token_data = refresh_tokens[refresh_token]
            user = token_data['user']
            email = token_data['email']
            
            access_token = generate_access_token(user, email)
            id_token = generate_id_token(user, email)
            
            return jsonify({
                'access_token': access_token,
                'id_token': id_token,
                'token_type': 'Bearer',
                'expires_in': 3600,
                'refresh_token': refresh_token,
                'scope': 'openid profile email'
            })
        
        return jsonify({'error': 'invalid_grant'}), 400
    
    elif grant_type == 'client_credentials':
        access_token = generate_client_credentials_token()
        
        return jsonify({
            'access_token': access_token,
            'token_type': 'Bearer',
            'expires_in': 3600
        })
    
    return jsonify({'error': 'unsupported_grant_type'}), 400

@app.route('/.well-known/openid-configuration')
@app.route('/mock-tenant/.well-known/openid-configuration')
@app.route('/mock-tenant/v2.0/.well-known/openid-configuration')
def openid_configuration():
    base_url = request.url_root.rstrip('/')
    
    return jsonify({
        'issuer': f'{base_url}/mock-tenant',
        'authorization_endpoint': f'{base_url}/mock-tenant/v2.0/authorize',
        'token_endpoint': f'{base_url}/mock-tenant/v2.0/token',
        'jwks_uri': f'{base_url}/.well-known/jwks.json',
        'userinfo_endpoint': f'{base_url}/v1.0/me',
        'end_session_endpoint': f'{base_url}/mock-tenant/v2.0/logout',
        'response_types_supported': ['code', 'token', 'id_token', 'code id_token', 'id_token token'],
        'response_modes_supported': ['query', 'fragment', 'form_post'],
        'subject_types_supported': ['pairwise'],
        'id_token_signing_alg_values_supported': ['HS256'],
        'scopes_supported': ['openid', 'profile', 'email', 'offline_access'],
        'token_endpoint_auth_methods_supported': ['client_secret_post', 'client_secret_basic', 'private_key_jwt'],
        'claims_supported': ['sub', 'iss', 'aud', 'exp', 'iat', 'auth_time', 'acr', 'nonce', 'preferred_username', 'name', 'tid', 'ver', 'at_hash', 'c_hash', 'email', 'oid', 'roles'],
        'request_uri_parameter_supported': False,
        'http_logout_supported': True,
        'frontchannel_logout_supported': True
    })

@app.route('/.well-known/jwks.json')
def jwks():
    # Para HS256, retornamos uma chave simétrica (embora seja incomum no JWKS real)
    # Em um cenário real, seria RSA, mas para o mock usamos HS256
    return jsonify({
        'keys': [
            {
                'kty': 'oct',
                'use': 'sig',
                'kid': 'mock-key-1',
                'k': base64.urlsafe_b64encode(SECRET_KEY.encode()).decode('utf-8').rstrip('='),
                'alg': 'HS256'
            }
        ]
    })

@app.route('/v1.0/me')
@app.route('/v2.0/me')
def userinfo():
    auth_header = request.headers.get('Authorization')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'unauthorized'}), 401
    
    token = auth_header.split(' ')[1]
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return jsonify({
            'id': payload.get('oid'),
            'displayName': payload.get('name'),
            'givenName': payload.get('name', '').split()[0] if payload.get('name') else '',
            'surname': payload.get('name', '').split()[-1] if payload.get('name') and len(payload.get('name', '').split()) > 1 else '',
            'userPrincipalName': payload.get('preferred_username'),
            'mail': payload.get('email')
        })
    except jwt.InvalidTokenError:
        return jsonify({'error': 'invalid_token'}), 401

def generate_access_token(user, email):
    # Usar a URL base da requisição como issuer
    base_url = request.url_root.rstrip('/')
    
    payload = {
        'aud': CLIENT_ID,
        'iss': base_url,
        'iat': datetime.datetime.utcnow(),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1),
        'name': user['name'],
        'preferred_username': user['preferred_username'],
        'oid': user['oid'],
        'email': email,
        'roles': user.get('roles', []),
        'scp': 'openid profile email',
        'ver': '2.0'
    }
    
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def generate_id_token(user, email, nonce=None):
    # Usar a URL base da requisição como issuer
    base_url = request.url_root.rstrip('/')
    
    payload = {
        'aud': CLIENT_ID,
        'iss': base_url,
        'iat': datetime.datetime.utcnow(),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1),
        'name': user['name'],
        'preferred_username': user['preferred_username'],
        'oid': user['oid'],
        'email': email,
        'ver': '2.0'
    }
    
    # Incluir nonce se fornecido (necessário para MSAL)
    if nonce:
        payload['nonce'] = nonce
        print(f"DEBUG: Including nonce in id_token: {nonce}")
    
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def generate_client_credentials_token():
    # Usar a URL base da requisição como issuer
    base_url = request.url_root.rstrip('/')
    
    payload = {
        'aud': CLIENT_ID,
        'iss': base_url,
        'iat': datetime.datetime.utcnow(),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1),
        'appid': CLIENT_ID,
        'ver': '2.0'
    }
    
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

if __name__ == '__main__':
    print(f"Mock Azure AD Server")
    print(f"Tenant ID: {TENANT_ID}")
    print(f"Client ID: {CLIENT_ID}")
    print(f"Issuer: {ISSUER}")
    
    # Usar HTTPS em desenvolvimento para compatibilidade com MSAL
    use_https = os.getenv('USE_HTTPS', 'true').lower() == 'true'
    
    if use_https:
        print(f"Running on https://localhost:5000 (with self-signed certificate)")
        print("WARNING: You may need to accept the certificate warning in your browser")
        app.run(debug=True, port=5000, ssl_context='adhoc')
    else:
        print(f"Running on http://localhost:5000")
        app.run(debug=True, port=5000)