# Feature ID: F-002

## Nom

Creation des utilisateurs et des administrateurs.

## Contexte

Seuls les administrateurs ont le droit de creer des comptes et d'attribuer des droits de lecture ou d'ecriture sur les bounded contexts autorises.

## Acteurs

- Administrateur

## Objectif

Permettre la creation en base des utilisateurs et des administrateurs avec leurs scopes, puis proteger les endpoints grace aux droits presents dans le JWT.

## Bounded context

- users

## Regles metier

- seul un administrateur ayant le scope `users.write` peut creer un compte
- seul un administrateur ayant le scope `users.read` peut consulter les comptes
- les scopes sont sauvegardes en base pour chaque utilisateur
- un administrateur recupere automatiquement les scopes `users.read` et `users.write`
- tout utilisateur recupere les scopes `characters.read` et `characters.write`

## Backend

### Cas d'usage
- creer un utilisateur
- creer un administrateur
- consulter un utilisateur
- lister les utilisateurs

### Domain
- utilisateur
- administrateur
- scopes
- port de persistence des utilisateurs

### Application
- validation des doublons
- hash du mot de passe
- attribution des scopes
- orchestration des cas d'usage sur le port de persistence du domaine

### Infrastructure
- table `user_account`
- table `user_permission`
- verification des scopes depuis le JWT

### API
- POST `/api/users`
- GET `/api/users`
- GET `/api/users/{userId}`

## Frontend

### Ecrans
- ecran liste utilisateurs
- ecran creation utilisateur

### Composants
- tableau compact
- formulaire de creation
- zone d'attribution des scopes

### Appels API
- POST `/api/users`
- GET `/api/users`

### Navigation et comportements UI
- la liste se charge a l'ouverture pour un administrateur autorise
- la creation rafraichit la liste apres succes
- les erreurs de droits sont affichees a l'utilisateur

## Criteres d'acceptation

- un administrateur peut creer un utilisateur ou un administrateur
- un utilisateur non administrateur recoit `403` sur la creation
- les scopes attribues sont persistants
