import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  CharacterAllocationProfile,
  CharacterAttributes,
  CharacterDerivedStats,
  CharacterPayload
} from '../../core/auth/auth.models';
import { CharacteristicsEditorComponent } from '../characteristics/characteristics-editor.component';
import { AttributeField } from '../characteristics/characteristics.models';
import { CharactersApiService } from './characters-api.service';

interface AllocationProfileOption {
  value: CharacterAllocationProfile;
  label: string;
  scores: number[];
  description: string;
}

type AttributeControlValue = number | null;

@Component({
  selector: 'app-character-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CharacteristicsEditorComponent],
  templateUrl: './character-form-page.component.html',
  styleUrl: './character-form-page.component.scss'
})
export class CharacterFormPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly api = inject(CharactersApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly error = signal<string | null>(null);
  protected readonly saving = signal(false);
  protected readonly loading = signal(false);
  protected readonly draggedScore = signal<number | null>(null);
  protected readonly dragSourceAttribute = signal<keyof CharacterAttributes | null>(null);
  protected readonly characterId = signal<string | null>(this.route.snapshot.paramMap.get('characterId'));
  protected readonly isEditMode = computed(() => this.characterId() !== null);
  protected readonly allocationProfiles: AllocationProfileOption[] = [
    { value: 'POLYVALENT', label: 'Polyvalent', scores: [2, 2, 2, 1, 1, 0, -1], description: 'Profil equilibre pour couvrir plusieurs roles.' },
    { value: 'EXPERT', label: 'Expert', scores: [3, 2, 1, 1, 0, 0, -1], description: 'Un point fort net, avec encore de la souplesse.' },
    { value: 'SPECIALISTE', label: 'Specialiste', scores: [4, 2, 1, 0, 0, -1, -1], description: 'Tres fort sur un axe, plus fragile ailleurs.' },
    { value: 'LIBRE', label: 'Libre', scores: [], description: 'Saisie manuelle des caracteristiques sans pool impose.' }
  ];
  protected readonly attributeFields: AttributeField[] = [
    { key: 'strength', label: 'Force' },
    { key: 'agility', label: 'Agilite' },
    { key: 'constitution', label: 'Constitution' },
    { key: 'perception', label: 'Perception' },
    { key: 'intelligence', label: 'Intelligence' },
    { key: 'willpower', label: 'Volonte' },
    { key: 'charisma', label: 'Charisme' }
  ];

  protected readonly characterForm = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    title: ['', Validators.maxLength(100)],
    birthDate: [''],
    age: [null as number | null, Validators.min(0)],
    level: [1, [Validators.required, Validators.min(1)]],
    allocationProfile: ['POLYVALENT' as CharacterAllocationProfile, Validators.required],
    strength: [null as AttributeControlValue, Validators.required],
    agility: [null as AttributeControlValue, Validators.required],
    constitution: [null as AttributeControlValue, Validators.required],
    perception: [null as AttributeControlValue, Validators.required],
    intelligence: [null as AttributeControlValue, Validators.required],
    willpower: [null as AttributeControlValue, Validators.required],
    charisma: [null as AttributeControlValue, Validators.required]
  });

  constructor() {
    this.characterForm.controls.allocationProfile.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((profile) => this.applyProfileSelection(profile ?? 'POLYVALENT'));

    const existingCharacterId = this.characterId();
    if (existingCharacterId) {
      this.loadCharacter(existingCharacterId);
    } else {
      this.applyProfileSelection(this.characterForm.controls.allocationProfile.value ?? 'POLYVALENT');
    }
  }

  protected selectAllocationProfile(profile: CharacterAllocationProfile): void {
    this.characterForm.controls.allocationProfile.setValue(profile);
  }

  protected selectedProfile(): AllocationProfileOption {
    return this.allocationProfiles.find((profile) => profile.value === this.characterForm.controls.allocationProfile.value)
      ?? this.allocationProfiles[0];
  }

  protected isFreeAllocation(): boolean {
    return this.characterForm.controls.allocationProfile.value === 'LIBRE';
  }

  protected resetAttribute(attributeKey: keyof CharacterAttributes): void {
    this.characterForm.controls[attributeKey].setValue(null);
    this.characterForm.controls[attributeKey].markAsTouched();
  }

  protected startPoolDrag(score: number): void {
    this.draggedScore.set(score);
    this.dragSourceAttribute.set(null);
  }

  protected startAttributeDrag(attributeKey: keyof CharacterAttributes): void {
    const score = this.characterForm.controls[attributeKey].value;
    if (score === null) {
      return;
    }
    this.draggedScore.set(score);
    this.dragSourceAttribute.set(attributeKey);
  }

  protected allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  protected dropOnAttribute(event: DragEvent, attributeKey: keyof CharacterAttributes): void {
    event.preventDefault();
    const score = this.draggedScore();
    if (score === null) {
      return;
    }

    const sourceAttribute = this.dragSourceAttribute();
    const currentScore = this.characterForm.controls[attributeKey].value;

    if (sourceAttribute && sourceAttribute !== attributeKey) {
      this.characterForm.controls[sourceAttribute].setValue(currentScore);
    }

    this.characterForm.controls[attributeKey].setValue(score);
    this.clearDragState();
  }

  protected dropOnPool(event: DragEvent): void {
    event.preventDefault();
    const sourceAttribute = this.dragSourceAttribute();
    if (sourceAttribute) {
      this.characterForm.controls[sourceAttribute].setValue(null);
    }
    this.clearDragState();
  }

  protected onDragEnd(): void {
    this.clearDragState();
  }

  protected remainingScores(): number[] {
    if (this.isFreeAllocation()) {
      return [];
    }

    const remainingScores = [...this.selectedProfile().scores];
    for (const attribute of this.attributeFields) {
      const score = this.characterForm.controls[attribute.key].value;
      if (score === null) {
        continue;
      }
      const scoreIndex = remainingScores.indexOf(score);
      if (scoreIndex >= 0) {
        remainingScores.splice(scoreIndex, 1);
      }
    }
    return remainingScores.sort((left, right) => right - left);
  }

  protected assignedScores(): Record<string, number | null> {
    return Object.fromEntries(
      this.attributeFields.map((attribute) => [attribute.key, this.characterForm.controls[attribute.key].value])
    );
  }

  protected previewDerivedStats(): CharacterDerivedStats {
    const attributes = this.currentAttributesWithFallback();
    return {
      healthPoints: (10 + attributes.constitution) * 2,
      woundPoints: 8 + attributes.constitution,
      manaPoints: 10 + attributes.intelligence,
      luckPoints: 3,
      hopePoints: 1,
      actionPoints: 3,
      passiveDefense: 8 + attributes.agility,
      recovery: 2 + attributes.constitution
    };
  }

  protected save(): void {
    if (this.characterForm.invalid || this.hasMissingAttributes()) {
      this.characterForm.markAllAsTouched();
      this.error.set('Toutes les caracteristiques doivent etre renseignees avant validation.');
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    const payload = this.toPayload();
    const currentCharacterId = this.characterId();
    const request$ = currentCharacterId ? this.api.update(currentCharacterId, payload) : this.api.create(payload);

    request$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          void this.router.navigateByUrl('/characters/liste');
        },
        error: (error) => {
          this.saving.set(false);
          this.error.set(error.error?.message ?? 'Impossible d enregistrer le personnage.');
        }
      });
  }

  private loadCharacter(characterId: string): void {
    this.loading.set(true);
    this.api.get(characterId).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (character) => {
          this.loading.set(false);
          this.characterForm.reset({
            firstName: character.firstName,
            lastName: character.lastName,
            title: character.title ?? '',
            birthDate: character.birthDate ?? '',
            age: character.age,
            level: character.level,
            allocationProfile: character.allocationProfile,
            strength: character.attributes.strength,
            agility: character.attributes.agility,
            constitution: character.attributes.constitution,
            perception: character.attributes.perception,
            intelligence: character.attributes.intelligence,
            willpower: character.attributes.willpower,
            charisma: character.attributes.charisma
          }, { emitEvent: false });
        },
        error: (error) => {
          this.loading.set(false);
          this.error.set(error.error?.message ?? 'Impossible de charger le personnage.');
        }
      });
  }

  private applyProfileSelection(profile: CharacterAllocationProfile): void {
    if (this.isEditMode()) {
      return;
    }

    for (const attribute of this.attributeFields) {
      this.characterForm.controls[attribute.key].setValue(null, { emitEvent: false });
    }

    if (profile === 'LIBRE') {
      return;
    }
  }

  private clearDragState(): void {
    this.draggedScore.set(null);
    this.dragSourceAttribute.set(null);
  }

  private hasMissingAttributes(): boolean {
    return this.attributeFields.some((attribute) => this.characterForm.controls[attribute.key].value === null);
  }

  private currentAttributesWithFallback(): CharacterAttributes {
    return {
      strength: this.characterForm.controls.strength.value ?? 0,
      agility: this.characterForm.controls.agility.value ?? 0,
      constitution: this.characterForm.controls.constitution.value ?? 0,
      perception: this.characterForm.controls.perception.value ?? 0,
      intelligence: this.characterForm.controls.intelligence.value ?? 0,
      willpower: this.characterForm.controls.willpower.value ?? 0,
      charisma: this.characterForm.controls.charisma.value ?? 0
    };
  }

  private toPayload(): CharacterPayload {
    const raw = this.characterForm.getRawValue();
    return {
      firstName: raw.firstName ?? '',
      lastName: raw.lastName ?? '',
      title: raw.title || null,
      birthDate: raw.birthDate || null,
      age: raw.age === null ? null : Number(raw.age),
      level: Number(raw.level),
      allocationProfile: raw.allocationProfile ?? 'POLYVALENT',
      attributes: {
        strength: raw.strength ?? 0,
        agility: raw.agility ?? 0,
        constitution: raw.constitution ?? 0,
        perception: raw.perception ?? 0,
        intelligence: raw.intelligence ?? 0,
        willpower: raw.willpower ?? 0,
        charisma: raw.charisma ?? 0
      }
    };
  }
}
