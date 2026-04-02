# Feature ID: F-003

## Nom

Gestion des personnages par proprietaire.

## Contexte

Chaque utilisateur gere uniquement ses propres personnages. Il peut les creer, les lister, les modifier, les supprimer et les filtrer par date de creation ou par nom.

## Acteurs

- Utilisateur

## Objectif

Exposer une API de gestion de personnages strictement bornee a leur proprietaire.

## Bounded context

- characters

## Regles metier

- un utilisateur possede les scopes `characters.read` et `characters.write`
- un utilisateur ne peut voir, modifier ou supprimer que ses propres personnages
- la liste des personnages supporte un filtre par date de creation et par nom

## Backend

### Cas d'usage
- creer un personnage
- lister ses personnages
- consulter un personnage
- modifier un personnage
- supprimer un personnage

### Domain
- personnage
- proprietaire
- port de persistence des personnages

### Application
- verification du proprietaire courant
- filtrage par date de creation
- filtrage par nom
- orchestration des cas d'usage sur le port de persistence du domaine

### Infrastructure
- table `character_sheet`
- filtre JPA par proprietaire et criteres de recherche

### API
- POST `/api/characters`
- GET `/api/characters`
- GET `/api/characters/{characterId}`
- PUT `/api/characters/{characterId}`
- DELETE `/api/characters/{characterId}`

## Frontend

### Ecrans
- ecran liste personnages
- ecran creation personnage
- ecran edition personnage

### Composants
- tableau compact
- formulaire personnage
- filtres `Date de creation du` / `Date de creation au` / `Nom`

### Appels API
- POST `/api/characters`
- GET `/api/characters`
- PUT `/api/characters/{characterId}`
- DELETE `/api/characters/{characterId}`

### Navigation et comportements UI
- la liste charge automatiquement les personnages du proprietaire connecte
- la creation, la mise a jour et la suppression rafraichissent la liste
- un personnage d'un autre utilisateur ne doit jamais etre visible dans la liste ni accessible par URL

## Criteres d'acceptation

- un utilisateur peut creer ses personnages
- un utilisateur ne peut pas consulter un personnage d'un autre utilisateur
- la liste est filtrable par date de creation et par nom
