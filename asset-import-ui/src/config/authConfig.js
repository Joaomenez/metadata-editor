// Debug: verificar se variáveis estão carregadas
console.log('VITE_AZURE_CLIENT_ID:', import.meta.env.VITE_AZURE_CLIENT_ID);
console.log('VITE_AZURE_AUTHORITY:', import.meta.env.VITE_AZURE_AUTHORITY);
console.log('Using mock server:', import.meta.env.VITE_AZURE_AUTHORITY?.includes('localhost'));

const isUsingMockServer = import.meta.env.VITE_AZURE_AUTHORITY?.includes('localhost');

export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || "YOUR_CLIENT_ID",
    authority: isUsingMockServer 
      ? "https://localhost:5000/mock-tenant" 
      : (import.meta.env.VITE_AZURE_AUTHORITY || "https://login.microsoftonline.com/YOUR_TENANT_ID"),
    redirectUri: import.meta.env.VITE_REDIRECT_URI || window.location.origin,
    postLogoutRedirectUri: import.meta.env.VITE_POST_LOGOUT_URI || window.location.origin,
    navigateToLoginRequestUrl: false,
    ...(isUsingMockServer && {
      knownAuthorities: ["localhost:5000"],
      validateAuthority: false,
      allowRedirectInIframe: true,
    }),
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    allowNativeBroker: false,
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case 0:
            console.error(message);
            return;
          case 1:
            console.warn(message);
            return;
          case 2:
            console.info(message);
            return;
          case 3:
            console.debug(message);
            return;
        }
      },
      logLevel: 3,
    },
  },
};

export const loginRequest = {
  scopes: ["User.Read", "openid", "profile", "email"],
};

export const graphConfig = {
  graphMeEndpoint: import.meta.env.VITE_AZURE_AUTHORITY?.includes('localhost') 
    ? "https://localhost:5000/v1.0/me" 
    : "https://graph.microsoft.com/v1.0/me",
};