---
name: frontend-filter
description: Regles generiques pour concevoir et relire des filtres de listes dans le frontend Angular du projet de jeu de role. Utiliser cette skill quand il faut creer, corriger ou uniformiser des zones de filtres et de recherche dans une liste ou un tableau.
---

# Frontend Filter

## Purpose

Definir des regles UI simples et coherentes pour les filtres de listes Angular.

Produire des zones de filtres compactes, lisibles, repliables et correctement alignees avec le titre de la liste.

## When to use

Utiliser cette skill lorsque l'on demande de :

- creer une nouvelle zone de filtres pour une liste ou un tableau
- corriger l'ergonomie de filtres existants
- harmoniser plusieurs ecrans de recherche
- verifier qu'un ecran respecte les conventions de filtres du projet

## Target architecture

Toute zone de filtres de liste doit suivre ce schema :

- un en-tete de liste avec le titre principal
- une action de filtre visible dans cet en-tete
- un panneau de filtres qui s'ouvre et se ferme sans navigation
- des champs de filtre dimensionnes selon leur contenu

Le comportement doit rester compatible avec une organisation Angular par feature.

## Folder rules

- garder la logique d'ouverture et fermeture dans le composant de la feature concernee
- garder le template de filtres dans la page ou le composant de liste concerne
- garder les styles de mise en page et de compacite dans le fichier SCSS local du composant
- ne pas creer de composant partage tant qu'au moins deux ecrans n'ont pas un besoin commun stable

## Checks

### Layout

- verifier que les filtres sont places a cote du titre de leur liste ou directement rattaches a cet en-tete
- verifier que l'action d'ouverture des filtres est visible sans faire defiler la page
- verifier que le panneau ouvert ne casse pas la mise en page sur telephone, tablette ou desktop

### Interaction

- verifier que les filtres s'ouvrent et se ferment au clic sur une icone ou un bouton iconique
- verifier que l'etat ouvert ou ferme est explicite visuellement
- verifier que l'utilisateur peut lancer la recherche sans devoir parcourir un grand formulaire

### Sizing

- verifier que les champs de filtre et de recherche restent compacts
- verifier que les largeurs s'adaptent au contenu attendu plutot que d'occuper toute la largeur par defaut
- verifier que les boutons d'action restent proportionnes a la densite de la zone de filtres

## Dependency rules

Respecter les dependances suivantes :

- composant Angular -> porte l'etat d'ouverture des filtres
- template Angular -> affiche l'en-tete, l'action de filtre et le panneau repliable
- SCSS local -> definit la compacite, l'alignement et le comportement responsive

Interdits :

- une zone de filtres detachee visuellement de la liste qu'elle pilote
- des champs de recherche pleine largeur sans justification metier
- un panneau de filtres toujours ouvert par defaut quand il surcharge inutilement l'ecran

## Review questions

1. Les filtres sont-ils visuellement rattaches au titre de la liste ?
2. L'ouverture et la fermeture se font-elles au clic sur une action de filtre explicite ?
3. Les champs de filtres sont-ils compacts et adaptes a leur contenu ?
4. Le panneau de filtres reste-t-il lisible sur telephone et tablette ?
5. Le template evite-t-il un bloc massif de filtres toujours visible ?
6. Les actions de recherche et de reinitialisation sont-elles faciles a trouver ?

## Migration rule

Si un ecran existant ne respecte pas cette skill :

1. deplacer la commande de filtre au niveau de l'en-tete de liste
2. transformer la zone de filtres en panneau repliable
3. reduire les largeurs des champs de saisie et de recherche
4. verifier le comportement responsive et ajuster les points de rupture

## Output format

Quand cette skill est utilisee, fournir :

- le verdict global : `OK` ou `KO`
- les ecrans de liste concernes
- les ecarts prioritaires sur l'ergonomie des filtres
- la correction recommandee

## Expected review style

Le verdict doit etre concret, centré sur l'ergonomie, l'alignement visuel et la compacite.

Exemples :

- `KO - les filtres de la liste des personnages sont au-dessus de la liste et non rattaches au titre`
- `KO - le panneau de filtres est toujours ouvert alors que l'ecran est deja dense`
- `KO - les champs de recherche occupent toute la largeur sans raison`
- `OK - les filtres sont compacts, repliables et alignes avec l'en-tete de liste`
