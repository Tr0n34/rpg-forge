export interface AuthSession {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: number;
  scope: string[];
  username: string;
  userId: string | null;
  roles: string[];
}

export interface CreateUserPayload {
  username: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';
  permissions: string[];
}

export interface UserView {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER';
  permissions: string[];
  createdAt: string;
}

export interface CharacterPayload {
  firstName: string;
  lastName: string;
  title: string | null;
  birthDate: string | null;
  age: number | null;
  level: number;
  allocationProfile: CharacterAllocationProfile;
  attributes: CharacterAttributes;
}

export interface CharacterView extends CharacterPayload {
  id: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  derivedStats: CharacterDerivedStats;
}

export type CharacterAllocationProfile = 'POLYVALENT' | 'EXPERT' | 'SPECIALISTE' | 'LIBRE';

export interface CharacterAttributes {
  strength: number;
  agility: number;
  constitution: number;
  perception: number;
  intelligence: number;
  willpower: number;
  charisma: number;
}

export interface CharacterDerivedStats {
  healthPoints: number;
  woundPoints: number;
  manaPoints: number;
  luckPoints: number;
  hopePoints: number;
  actionPoints: number;
  passiveDefense: number;
  recovery: number;
}
