import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { APP_CONFIG } from '../config/app-config.token';
import { AuthSession } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly config = inject(APP_CONFIG);
  private readonly storageKey = 'rpg-forge.auth.session';
  private readonly sessionState = signal<AuthSession | null>(this.readStoredSession());

  readonly session = this.sessionState.asReadonly();
  readonly isAuthenticated = computed(() => this.sessionState() !== null);
  readonly isAdmin = computed(() => this.sessionState()?.roles.includes('ADMIN') ?? false);
  readonly scopes = computed(() => this.sessionState()?.scope ?? []);

  async login(): Promise<void> {
    const verifier = randomString(64);
    const state = randomString(32);
    sessionStorage.setItem('oauth.pkce.verifier', verifier);
    sessionStorage.setItem('oauth.pkce.state', state);

    const codeChallenge = await base64UrlEncodeSha256(verifier);
    const authorizeUrl = new URL('/oauth2/authorize', this.config.oauth.issuer);
    authorizeUrl.searchParams.set('response_type', 'code');
    authorizeUrl.searchParams.set('client_id', this.config.oauth.clientId);
    authorizeUrl.searchParams.set('redirect_uri', this.config.oauth.redirectUri);
    authorizeUrl.searchParams.set('scope', this.config.oauth.scopes.join(' '));
    authorizeUrl.searchParams.set('code_challenge_method', 'S256');
    authorizeUrl.searchParams.set('code_challenge', codeChallenge);
    authorizeUrl.searchParams.set('state', state);
    window.location.assign(authorizeUrl.toString());
  }

  async handleCallback(code: string, state: string | null): Promise<void> {
    const expectedState = sessionStorage.getItem('oauth.pkce.state');
    const verifier = sessionStorage.getItem('oauth.pkce.verifier');

    if (!state || state !== expectedState || !verifier) {
      throw new Error('OAuth state mismatch');
    }

    const body = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('client_id', this.config.oauth.clientId)
      .set('redirect_uri', this.config.oauth.redirectUri)
      .set('code_verifier', verifier)
      .set('code', code);

    const tokenResponse = await firstValueFrom(
      this.http.post<TokenResponse>(
        `${this.config.oauth.issuer}/oauth2/token`,
        body.toString(),
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
          })
        }
      )
    );

    const session = mapTokenResponse(tokenResponse);
    this.sessionState.set(session);
    localStorage.setItem(this.storageKey, JSON.stringify(session));
    sessionStorage.removeItem('oauth.pkce.state');
    sessionStorage.removeItem('oauth.pkce.verifier');
    await this.router.navigateByUrl('/');
  }

  logout(): void {
    this.sessionState.set(null);
    localStorage.removeItem(this.storageKey);
    sessionStorage.removeItem('oauth.pkce.state');
    sessionStorage.removeItem('oauth.pkce.verifier');
    void this.router.navigateByUrl('/');
  }

  getAccessToken(): string | null {
    return this.sessionState()?.accessToken ?? null;
  }

  hasScope(scope: string): boolean {
    return this.sessionState()?.scope.includes(scope) ?? false;
  }

  private readStoredSession(): AuthSession | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }
    try {
      const session = JSON.parse(raw) as AuthSession;
      if (session.expiresAt <= Date.now()) {
        localStorage.removeItem(this.storageKey);
        return null;
      }
      return session;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope?: string;
}

function mapTokenResponse(response: TokenResponse): AuthSession {
  const payload = parseJwtPayload(response.access_token);
  return {
    accessToken: response.access_token,
    refreshToken: response.refresh_token ?? null,
    expiresAt: Date.now() + response.expires_in * 1000,
    scope: (response.scope ?? '').split(' ').filter(Boolean),
    username: readStringClaim(payload, 'username') ?? readStringClaim(payload, 'sub') ?? 'unknown',
    userId: readStringClaim(payload, 'user_id'),
    roles: Array.isArray(payload['roles']) ? payload['roles'] : []
  };
}

function parseJwtPayload(token: string): Record<string, unknown> {
  const [, payload] = token.split('.');
  return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
}

function randomString(length: number): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => ('0' + (byte % 36).toString(36)).slice(-1)).join('');
}

async function base64UrlEncodeSha256(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return toBase64Url(digest);
}

function toBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function readStringClaim(payload: Record<string, unknown>, key: string): string | null {
  const value = payload[key];
  return typeof value === 'string' ? value : null;
}
