import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UsersApiService } from './users-api.service';
import { UserView } from '../../core/auth/auth.models';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss'
})
export class UsersPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly usersApi = inject(UsersApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly users = signal<UserView[]>([]);
  protected readonly loading = signal(true);
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly success = signal<string | null>(null);

  protected readonly form = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: ['USER' as 'ADMIN' | 'USER', Validators.required],
    usersRead: [false],
    usersWrite: [false]
  });

  constructor() {
    this.loadUsers();
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.error.set(null);
    this.success.set(null);
    this.submitting.set(true);

    const raw = this.form.getRawValue();
    const permissions = [
      raw.usersRead ? 'users.read' : null,
      raw.usersWrite ? 'users.write' : null
    ].filter((value): value is string => value !== null);

    this.usersApi.create({
      username: raw.username,
      email: raw.email,
      password: raw.password,
      role: raw.role,
      permissions
    }).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.success.set('Utilisateur créé.');
          this.form.reset({
            username: '',
            email: '',
            password: '',
            role: 'USER',
            usersRead: false,
            usersWrite: false
          });
          this.loadUsers();
        },
        error: (error) => {
          this.submitting.set(false);
          this.error.set(error.error?.message ?? 'Impossible de créer le compte.');
        }
      });
  }

  private loadUsers(): void {
    this.loading.set(true);
    this.usersApi.list().pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (users) => {
          this.users.set(users);
          this.loading.set(false);
        },
        error: (error) => {
          this.error.set(error.error?.message ?? 'Impossible de charger les utilisateurs.');
          this.loading.set(false);
        }
      });
  }
}
