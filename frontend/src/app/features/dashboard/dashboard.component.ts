import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CharacterView } from '../../core/auth/auth.models';
import { AuthService } from '../../core/auth/auth.service';
import { CharactersApiService } from '../characters/characters-api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly charactersApi = inject(CharactersApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isAuthenticated = this.authService.isAuthenticated;
  protected readonly characters = signal<CharacterView[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  constructor() {
    if (this.isAuthenticated()) {
      this.loadCharacters();
    }
  }

  protected login(): void {
    void this.authService.login();
  }

  protected retry(): void {
    this.loadCharacters();
  }

  private loadCharacters(): void {
    this.loading.set(true);
    this.error.set(null);
    this.charactersApi.list({}).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (characters) => {
          this.characters.set(characters);
          this.loading.set(false);
        },
        error: (error) => {
          this.error.set(error.error?.message ?? 'Impossible de charger vos personnages.');
          this.loading.set(false);
        }
      });
  }
}
