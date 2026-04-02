import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  protected readonly isAuthenticated = this.authService.isAuthenticated;
  protected readonly isAdmin = this.authService.isAdmin;
  protected readonly session = this.authService.session;
  protected readonly displayName = computed(() => this.session()?.username ?? 'Guest');
  protected readonly primaryRole = computed(() => this.session()?.roles[0] ?? 'Aucun');
  protected readonly scopes = computed(() => this.session()?.scope ?? []);
  protected readonly isScopesModalOpen = signal(false);
  protected readonly isCharactersMenuOpen = signal(false);
  protected readonly isCharactersSectionActive = signal(this.router.url.startsWith('/characters'));

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.isCharactersSectionActive.set(event.urlAfterRedirects.startsWith('/characters'));
        this.isCharactersMenuOpen.set(false);
      });
  }

  protected login(): void {
    void this.authService.login();
  }

  protected logout(): void {
    this.authService.logout();
  }

  protected openScopes(): void {
    if (this.scopes().length === 0) {
      return;
    }
    this.isScopesModalOpen.set(true);
  }

  protected closeScopes(): void {
    this.isScopesModalOpen.set(false);
  }

  protected toggleCharactersMenu(): void {
    this.isCharactersMenuOpen.update((isOpen) => !isOpen);
  }

  protected closeCharactersMenu(): void {
    this.isCharactersMenuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  protected handleDocumentClick(event: MouseEvent): void {
    if (!this.isCharactersMenuOpen()) {
      return;
    }

    const target = event.target as Node | null;
    const host = this.elementRef.nativeElement;
    const navGroup = host.querySelector('.nav-group');
    if (target && navGroup?.contains(target)) {
      return;
    }

    this.closeCharactersMenu();
  }
}
