---
name: frontend-angular
description: Regles generiques de developpement frontend Angular pour structurer des composants, services, formulaires, etats UI, acces HTTP, routing, responsive design, tests et qualite de code dans le projet de jeu de role. Utiliser cette skill quand il faut creer, corriger ou relire une application Angular ou definir des conventions de developpement Angular reutilisables.
---

# Frontend Angular

## Purpose

Definir des regles Angular generiques pour produire une interface maintenable, testable, lisible et responsive pour la gestion des fiches, pouvoirs et campagnes.

## Architecture rules

- Organiser le code par fonctionnalite avant de l'organiser par type de fichier.
- Garder une separation nette entre presentation, orchestration UI et acces aux donnees.
- Limiter les composants partages a de vrais besoins transverses.
- Preserver les conventions existantes d'un projet si elles sont deja coherentes.

## Component rules

- Garder les composants focalises sur une responsabilite claire.
- Preferer des composants presentational quand un composant n'a pas a connaitre l'infrastructure.
- Eviter les composants massifs qui gerent affichage, orchestration, appels HTTP et mapping en meme temps.
- Rendre explicites les `input`, `output` et contrats d'utilisation.

## State and data flow rules

- Garder l'etat au niveau le plus bas raisonnable.
- Eviter les dependances implicites entre composants freres.
- Centraliser l'etat partage seulement quand il y a un besoin reel.
- Modeliser clairement les etats `loading`, `success`, `empty` et `error`.

## Service rules

- Utiliser les services pour encapsuler les appels HTTP, l'orchestration et les regles transverses.
- Ne pas transformer les services en conteneurs globaux de logique floue.
- Garder les facades ou services d'acces aux donnees stables et predictibles.

## Form rules

- Utiliser des formulaires reactifs pour les formulaires metier non triviaux.
- Centraliser les validateurs reutilisables.
- Distinguer validation de saisie, validation metier et messages utilisateurs.
- Ne pas disperser la logique de validation entre template, composant et utilitaires sans regle claire.

## Routing and HTTP rules

- Utiliser le routing pour delimitation fonctionnelle et navigation, pas comme substitut de gestion d'etat.
- Isoler la configuration des endpoints et options HTTP.
- Centraliser les interceptors pour auth, correlation, retry ou logging si necessaire.
- Gerer explicitement les erreurs reseau et les cas d'autorisation.

## Template and style rules

- Garder les templates lisibles et peu imbriques.
- Extraire une sous-vue ou un composant quand le template devient difficile a relire.
- Eviter la logique complexe inline dans les templates.
- Encapsuler les styles au niveau adequat et utiliser des design tokens quand ils existent.
- Concevoir les ecrans pour les tailles telephone, tablette et desktop des la phase de structure.
- Eviter les largeurs, espacements et grilles figes qui cassent sur petits ecrans.
- Prevoir des points de rupture explicites et des comportements de repli lisibles pour navigation, tableaux, formulaires et panneaux lateraux.
- Verifier que les actions principales, textes et zones interactives restent accessibles sans zoom sur mobile et tablette.
- Un sous-menu d'onglet ne doit pas deplacer la ligne de navigation quand il s'ouvre ; il doit se developper sous son onglet.
- Un sous-menu ouvert doit se refermer si l'utilisateur clique en dehors.
- Une page de creation ou d'edition doit separer clairement les blocs metier, sans etirer artificiellement les cadres ou les zones d'interaction.
- Les panneaux d'une page de creation doivent suivre la largeur utile de leur contenu et rester lisibles en desktop, tablette et mobile.

## Testing rules

- Tester les composants sur leur comportement observable.
- Tester les services sur leurs contrats et transformations.
- Eviter les tests trop couples a la structure interne du template.

## Review questions

1. Le code est-il organise par fonctionnalite plutot que par accumulation technique ?
2. Les composants ont-ils une responsabilite claire ?
3. L'etat UI est-il maitrise et explicite ?
4. Les appels HTTP et la configuration reseau sont-ils encapsules proprement ?
5. Les formulaires et validations sont-ils coherents ?
6. Les ecrans restent-ils utilisables et lisibles sur telephone et tablette ?
7. Les sous-menus et panneaux interactifs s'ouvrent-ils sans degrader la stabilite visuelle ?
8. Les tests couvrent-ils les comportements utiles ?

## Output format

Quand cette skill est utilisee, fournir :

- le verdict global : `OK` ou `KO`
- les ecarts Angular prioritaires
- les composants, services ou routes concernes
- la regle violee
- la correction recommandee
