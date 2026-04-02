import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CharacterAllocationProfile, CharacterView } from '../../core/auth/auth.models';
import { CharactersApiService } from './characters-api.service';

@Component({
  selector: 'app-characters-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './characters-page.component.html',
  styleUrl: './characters-page.component.scss'
})
export class CharactersPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly api = inject(CharactersApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly characters = signal<CharacterView[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly filtersOpen = signal(false);

  protected readonly filtersForm = this.formBuilder.nonNullable.group({
    createdFrom: [''],
    createdTo: [''],
    lastName: ['']
  });

  constructor() {
    this.loadCharacters();
  }

  protected search(): void {
    this.loadCharacters();
  }

  protected toggleFilters(): void {
    this.filtersOpen.update((isOpen) => !isOpen);
  }

  protected remove(character: CharacterView): void {
    this.api.delete(character.id).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.loadCharacters(),
        error: (error) => this.error.set(error.error?.message ?? 'Suppression impossible.')
      });
  }

  protected allocationProfileLabel(profile: CharacterAllocationProfile): string {
    const labels: Record<CharacterAllocationProfile, string> = {
      POLYVALENT: 'Polyvalent',
      EXPERT: 'Expert',
      SPECIALISTE: 'Specialiste',
      LIBRE: 'Libre'
    };
    return labels[profile] ?? profile;
  }

  private loadCharacters(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.list(this.filtersForm.getRawValue()).pipe(takeUntilDestroyed(this.destroyRef))
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
