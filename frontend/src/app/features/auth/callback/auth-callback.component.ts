import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  templateUrl: './auth-callback.component.html'
})
export class AuthCallbackComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  protected readonly error = signal<string | null>(null);

  constructor() {
    void this.consumeCallback();
  }

  private async consumeCallback(): Promise<void> {
    const code = this.route.snapshot.queryParamMap.get('code');
    const state = this.route.snapshot.queryParamMap.get('state');

    if (!code) {
      this.error.set('Code OAuth2 manquant dans le callback.');
      return;
    }

    try {
      await this.authService.handleCallback(code, state);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Erreur de callback OAuth2');
    }
  }
}
