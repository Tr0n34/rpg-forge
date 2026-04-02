# Feature ID: F-001

## Nom

Authentification OAuth2 et gestion des tokens.

## Contexte

Le backend doit exposer un serveur d'authentification standard OAuth2 capable d'emettre des JWT et des refresh tokens, puis d'utiliser ces JWT pour proteger les API metier.

## Acteurs

- Administrateur
- Utilisateur
- Client OAuth2

## Objectif

Fournir une authentification standardisee, persistante en base et exploitable par les API metier via les scopes transportes dans le JWT.

## Bounded context

- auth

## Regles metier

- le serveur d'authentification emet des access tokens JWT signes et des refresh tokens
- les autorisations emises pour un utilisateur sont stockees en base dans les tables OAuth2 standard
- les scopes utilises par les API metier proviennent du JWT emis par le serveur OAuth2

## Backend

### Cas d'usage
- authentifier un utilisateur via le serveur OAuth2
- emettre un access token JWT
- emettre un refresh token
- verifier le JWT sur les routes `/api/**`

### Domain
- utilisateur authentifie
- scopes
- client OAuth2

### Application
- generation du JWT
- chargement des utilisateurs
- enrichissement des claims

### Infrastructure
- Spring Authorization Server
- tables `oauth2_registered_client`
- tables `oauth2_authorization`
- tables `oauth2_authorization_consent`

### API
- GET `/oauth2/authorize`
- POST `/oauth2/token`
- GET `/.well-known/jwks.json`

## Frontend

### Ecrans
- ecran de login Spring Security

### Composants
- formulaire de connexion

### Appels API
- GET `/oauth2/authorize`
- POST `/oauth2/token`

### Navigation et comportements UI
- la connexion est declenchee par le flux OAuth2 standard
- les erreurs d'authentification sont gerees par Spring Security

## Criteres d'acceptation

- un client OAuth2 enregistre peut obtenir un JWT
- un refresh token est persiste avec l'autorisation OAuth2 associee
- les API metier lisent les scopes depuis le JWT
