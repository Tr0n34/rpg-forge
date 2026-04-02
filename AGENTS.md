# AGENTS.md

## Contexte projet

Le projet est une application de jeu de role avec :

- Backend : Spring Boot
- Frontend : Angular
- Communication : API REST JSON + evenements applicatifs
- Build : Maven pour le backend, npm pour le frontend
- Base de donnees : PostgreSQL
- Tests : JUnit / Mockito / Spring Boot Test / Angular unit tests

Le backend pilote la logique metier du jeu, la securite, la persistance et les traitements asynchrones.
Le frontend Angular sert d'interface d'administration, de supervision et de consultation des donnees de jeu.

## Objectifs

L'application permet de :

- gerer des fiches de personnage, de creature ou de compagnon
- gerer des pouvoirs, competences, sorts, traits et effets
- gerer des classes, origines, archetypes et autres referentiels de jeu
- gerer l'inventaire, l'equipement, les ressources et les statistiques
- gerer des campagnes, sessions, journaux et historiques d'evolution
- gerer des automatisations, calculs, validations et resolutions de regles
- exposer une interface web d'administration
- suivre l'etat de l'application, de ses integrations et de ses erreurs
- recuperer, importer ou synchroniser des informations depuis des sources externes si necessaire

## Architecture attendue

Le projet doit respecter une separation claire des responsabilites.

### Backend

Le backend Spring Boot suit une architecture DDD modulaire avec une organisation de type :

- `domain`
- `application`
- `infrastructure`
- `api`

Exemple :

- `backend/rpg-manager-parent`
- `backend/character-sheet`
    - `character-sheet-domain`
    - `character-sheet-application`
    - `character-sheet-infrastructure`
    - `character-sheet-api`
- `backend/power`
    - `power-domain`
    - `power-application`
    - `power-infrastructure`
    - `power-api`
- `backend/campaign`
    - `campaign-domain`
    - `campaign-application`
    - `campaign-infrastructure`
    - `campaign-api`
- `backend/reference-data`
- `backend/shared-kernel`

### Frontend

Le frontend Angular est organise par fonctionnalite.

Structure cible :

- `frontend/src/app/core`
- `frontend/src/app/shared`
- `frontend/src/app/layout`
- `frontend/src/app/features`

Chaque feature Angular contient selon le besoin :

- `pages`
- `components`
- `services`
- `models`
- `routes`

## Regles globales

- separer strictement logique metier, exposition API, integration technique et persistance
- ne jamais exposer directement les entites de persistance dans les controllers
- utiliser des DTO explicites en entree
- mapper tout DTO entrant vers une Command ou une Query applicative avant appel du use case
- utiliser des View (model view) en sortie des use cases
- ne jamais faire prendre a un use case un objet HTTP de type `Request` ou `DTO`
- ne jamais nommer une sortie applicative `Response` ; utiliser `View`
- utiliser MapStruct pour les mappings backend
- garder les regles metier dans le domaine ou l'application, pas dans les controllers
- privilegier des noms metier clairs et stables
- centraliser les constantes techniques et routes HTTP
- traiter les integrations externes comme des systemes pilotes via adapters
- prevoir la testabilite de chaque couche

## Regles backend

### Domain

Le module `domain` contient exclusivement :

- agregats
- entites metier
- value objects
- services de domaine
- regles metier pures (Policies/Rules)
- ports metier si necessaire, y compris les ports de persistence

Interdits dans `domain` :

- annotations Spring de service ou repository
- dependances JPA
- DTO d'API
- clients techniques d'integration externe
- acces direct a la base

### Application

Le module `application` contient :

- cas d'usage
- services applicatifs
- commandes
- queries
- vues metier
- orchestration de flux

Regles :

- un cas d'usage orchestre sans contenir de logique technique
- les dependances passent par des interfaces definies dans le domaine quand elles portent un contrat metier ou de persistence
- pas d'appel direct a un repository JPA concret
- pas de logique de parsing HTTP ou de payload externe brut
- les entrees d'un usecase sont une commande ou une querie
- les sorties d'un usecase sont une view (qui represente une partie du bounded context en retour)
- les packages cibles sont `application/command/<boundedContext>`, `application/query/<boundedContext>`, `application/view/<boundedContext>`, `application/usecases/<boundedContext>`
- un bounded context ne doit pas etre porte par un service applicatif global ; il doit etre decoupe en classes `UseCase` dediees avec une methode `execute`
- les ports de persistence ne vivent pas dans `application` ; ils vivent dans `domain/ports/<boundedContext>`

### Infrastructure

Le module `infrastructure` contient :

- entities JPA
- repositories Spring Data
- adapters de persistance
- clients externes
- integrations techniques
- configuration technique
- schedulers
- publication d'evenements
- consommateurs de messages
- DTO de transport entrant si le projet choisit de les centraliser hors de l'API

Regles :

- les adapters implementent les ports de l'application ou du domaine
- les adapters de persistance implementent les ports definis dans le domaine
- les objets techniques restent confines a l'infrastructure
- la logique de bibliotheques externes ne fuit pas dans les couches metier
- les DTO web de ce projet vivent en `infrastructure/<boundedContext>/dto`

### API

Le module `api` contient :

- controllers REST
- mappers API
- gestion des erreurs HTTP
- validation de requetes
- definition des routes

Regles :

- un controller delegue a l'application
- un controller accepte un DTO d'entree et le mappe vers une Command ou une Query
- un controller renvoie une View applicative
- pas d'appel direct a une entity ou a un repository
- pas de logique metier lourde dans les endpoints
- validation d'entree explicite et lisible

## Regles integrations externes

Toute integration externe doit etre pensee comme un adaptateur.

- encapsuler les librairies et clients tiers dans des services ou adapters dedies
- representer les echanges externes par des objets applicatifs ou metier si necessaire
- eviter de propager les objets natifs d'une librairie dans tout le code
- isoler les synchronisations, handlers et importeurs dans l'infrastructure
- journaliser les erreurs de traitement et les refus metier
- prevoir la resilience sur les appels externes et les limitations de debit

## Regles frontend Angular

### Organisation

Le frontend est structure par fonctionnalite metier.

Chaque feature doit regrouper :

- ses pages
- ses composants
- ses models
- ses services
- ses routes

### Bonnes pratiques

- utiliser des composants presentionnels quand possible
- isoler les appels API dans des services dedies
- ne pas dupliquer les types backend inutilement
- preferer des interfaces ou models explicites
- centraliser les interceptors, guards et configuration dans `core`
- mutualiser les composants generiques dans `shared`

### Ecrans attendus

Le frontend peut inclure par exemple :

- tableau de bord de campagne ou de supervision
- gestion des fiches de personnage
- gestion des pouvoirs, sorts et competences
- gestion des inventaires, ressources et equipements
- gestion des campagnes, sessions et historiques
- supervision technique
- consultation des logs et traces

## Qualite et tests

### Backend

Utiliser selon le besoin :

- JUnit 5
- Mockito
- Spring Boot Test
- tests d'architecture
- tests d'integration repository
- tests de controllers

Attendus :

- tester les cas d'usage applicatifs
- tester les regles metier importantes
- tester les adapters critiques
- tester la serialisation des DTO quand utile

### Frontend

Utiliser selon le besoin :

- tests unitaires Angular
- tests de services
- tests de composants
- tests de navigation ou d'integration UI si en place

## Style de code

- noms explicites et metier
- classes courtes et focalisees
- pas de couche inutile
- pas de retour d'entities JPA hors infrastructure
- pas de logique metier cachee dans des utilitaires flous
- privilegier des contrats simples et lisibles
- garder les fichiers coherents avec la responsabilite de la feature

## Ce qu'un agent doit produire

Quand un agent ajoute une fonctionnalite, il doit fournir selon le besoin :

### Backend

- commandes et queries
- DTO d'entree en `infrastructure/<boundedContext>/dto`
- mapping DTO -> Command/Query
- controller REST
- use cases dedies
- views applicatives
- ports metier necessaires dans le domaine
- adapters d'infrastructure
- entities JPA et repository si besoin
- mappers MapStruct
- tests unitaires et d'integration pertinents

### Frontend

- page Angular
- composants associes
- service API
- model de donnees
- routes
- tests unitaires utiles

## Contraintes de conception

- toute fonctionnalite doit etre rattachee a un bounded context clair
- toute exposition HTTP doit etre explicite et documentee
- toute integration externe doit etre encapsulee
- toute logique de fiche, pouvoir, campagne ou referentiel doit rester testable hors service externe reel
- toute nouvelle feature doit pouvoir etre administree depuis Angular si elle a une valeur operationnelle

## Livrables attendus d'un agent

Quand il code, un agent doit viser :

- une structure de fichiers coherente avec l'architecture
- des classes compile-ready
- des imports propres
- des noms de fichiers conformes
- des tests minimaux utiles
- aucune fuite de logique technique dans le domaine
- aucune fuite d'objets de persistance dans l'API
- aucun `Request` web injecte dans l'application
- aucune `Response` applicative ; uniquement des `View`
