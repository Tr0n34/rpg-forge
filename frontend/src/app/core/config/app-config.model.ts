export interface RuntimeAppConfig {
  apiBaseUrl: string;
  oauth: {
    issuer: string;
    clientId: string;
    redirectUri: string;
    scopes: string[];
  };
}
