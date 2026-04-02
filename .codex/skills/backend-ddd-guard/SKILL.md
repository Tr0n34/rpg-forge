---
name: backend-ddd-guard
description: Regles generiques de conception et de revue pour appliquer le domain-driven design dans un backend de jeu de role. Utiliser cette skill quand il faut structurer un domaine, separer domaine et infrastructure, definir des aggregates, entites, value objects, services de domaine, repositories, evenements de domaine ou controler qu'un code backend respecte des garde-fous DDD.
---

# Backend DDD Guard

## Purpose

Definir des garde-fous DDD pour empecher la dilution du domaine de jeu dans le framework, la persistence ou les details techniques.

## Domain rules

- Construire le modele autour du langage metier partage.
- Nommer classes, methodes et concepts avec le vocabulaire du domaine.
- Refuser les noms purement techniques pour des objets metier centraux.
- Modeliser explicitement les invariants et les regles critiques.

## Bounded context rules

- Delimiter clairement les bounded contexts.
- Pour ce projet, penser a des contexts comme `character-sheet`, `power`, `campaign`, `inventory` ou `reference-data`.
- Eviter les modeles globaux qui servent tout le systeme.
- Traduire les echanges entre contexts au lieu de partager directement les memes objets.
- Introduire une couche d'anticorruption quand un systeme externe impose un modele incompatible.
- Dans un backend monolithique organise par packages, imposer un ordre de dossiers par couche puis par bounded context, par exemple `api/characters`, `application/characters`, `domain/users`, `infrastructure/security`.
- Interdire l'ordre inverse du type `characters/api`, `users/infrastructure` ou `campaign/application`.
- Dans ce projet, les DTO de transport entrant doivent vivre en `infrastructure/<boundedContext>/dto`.
- Dans ce projet, les `command`, `query`, `view` et `usecases` doivent vivre en ordre couche-first : `application/command/<boundedContext>`, `application/query/<boundedContext>`, `application/view/<boundedContext>`, `application/usecases/<boundedContext>`.
- Dans ce projet, les ports de persistence et autres contrats metier utilises par l'application doivent vivre en `domain/ports/<boundedContext>`, pas en `application/ports`.
- Un controller ne doit jamais injecter un DTO HTTP directement dans un use case ; il doit le mapper vers une `command` ou une `query`.
- Un use case ne doit jamais renvoyer un objet nomme `Response` ; il renvoie une `View`.

## Aggregate rules

- Concevoir chaque aggregate comme gardien d'invariants metier.
- Limiter la taille d'un aggregate a ce qui doit rester coherent dans la meme transaction.
- Modifier l'etat via des methodes explicites du domaine.
- Eviter les setters publics qui contournent les regles.

## Entity and value object rules

- Utiliser une entite quand l'identite compte dans le temps.
- Utiliser un value object quand seule la valeur compte.
- Favoriser l'immutabilite des value objects.
- Encapsuler la validation et le comportement dans les objets du domaine plutot que dans des utilitaires disperses.

## Service rules

- Garder dans les entites et aggregates ce qui releve directement de leur responsabilite.
- Utiliser un service de domaine seulement pour une regle metier qui ne tient pas naturellement dans un seul aggregate.
- Modeliser explicitement les cas d'usage par des classes dediees nommees `...UseCase`.
- Interdire l'usage de services applicatifs de bounded context qui agglomèrent plusieurs cas d'usage.
- Exiger qu'un use case expose une methode standard `execute`.
- Exiger qu'un use case produise au moins une ligne de log au niveau `INFO` pour tracer son execution metier.
- Exiger qu'un use case expose des signatures en `command` ou `query`, jamais en DTO web.

## Repository and infrastructure rules

- Exprimer les repositories comme des ports du domaine.
- Cacher les details ORM, SQL, HTTP ou messaging derriere l'infrastructure.
- Ne pas faire dependre le domaine des annotations, types ou conventions d'un framework si cela peut etre evite.
- Mapper explicitement entre modele de domaine et modele de persistence si la complexite le justifie.

## Event rules

- Utiliser les evenements de domaine pour exprimer un fait metier significatif.
- Nommer un evenement au passe.
- Ne pas publier de faux evenements pour compenser une mauvaise modelisation.
- Distinguer evenement de domaine, evenement d'integration et message technique.

## Testing rules

- Tester les invariants du domaine sans dependre du framework.
- Utiliser des tests d'integration pour les adapters et la persistence.
- Verifier que les aggregates refusent les etats invalides.

## Review questions

1. Le vocabulaire du code reflete-t-il le langage metier ?
2. Les invariants sont-ils portes par les aggregates plutot que par des scripts applicatifs ?
3. Les bounded contexts sont-ils explicites ?
4. Le domaine depend-il inutilement de Spring, JPA ou d'autres details techniques ?
5. Les repositories et ports de persistence sont-ils des abstractions du domaine plutot que des fuites d'infrastructure ou des contrats applicatifs mal places ?
6. Les evenements representent-ils de vrais faits metier ?
7. Les controllers mappent-ils bien les DTO vers des `command` ou `query` applicatives ?
8. Les use cases renvoient-ils des `View` applicatives plutot que des `Response` ?
9. Chaque cas d'usage est-il porte par une classe `UseCase` dediee avec une methode `execute` ?
10. Chaque use case expose-t-il au moins une ligne de log `INFO` utile ?

## Output format

Quand cette skill est utilisee, fournir :

- le verdict global : `OK` ou `KO`
- les violations DDD majeures
- les objets ou couches concernes
- l'invariant ou la frontiere en cause
- le refactoring recommande
