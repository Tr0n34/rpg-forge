---
name: backend-springboot
description: Regles generiques de conception, d'implementation et de revue pour des applications backend Spring Boot de jeu de role. Utiliser cette skill quand il faut creer, corriger ou relire du code Spring Boot, structurer des couches applicatives, definir des conventions REST, gerer la persistence, la transaction, la validation, les erreurs, les tests ou l'observabilite.
---

# Backend Spring Boot

## Purpose

Definir des regles de developpement Spring Boot generiques, stables et directement reutilisables pour une application de fiches, pouvoirs et campagnes.

Produire un backend lisible, testable, observable et facile a faire evoluer.

## Architecture rules

- Organiser le code par fonctionnalite ou par sous-domaine avant de l'organiser par framework.
- Garder des frontieres explicites entre API, application, domaine et infrastructure.
- Faire porter la logique metier par le domaine ou par des classes `UseCase` explicites, pas par les controllers.
- Utiliser Spring pour assembler les composants, pas pour melanger les responsabilites.
- Dans ce projet, structurer l'application en ordre couche-first : `application/command/<boundedContext>`, `application/query/<boundedContext>`, `application/view/<boundedContext>`, `application/usecases/<boundedContext>`.
- Dans ce projet, les ports de persistence restent dans `domain/ports/<boundedContext>` et sont implementes par l'infrastructure.

## API rules

- Exposer des DTO d'entree valides, sans jamais exposer des entites JPA directement.
- Mapper chaque DTO HTTP entrant vers une `command` ou une `query` applicative avant appel du use case.
- Faire renvoyer au use case une `View` applicative, pas un objet nomme `Response`.
- Appeler des classes `...UseCase` dediees avec une methode `execute`, pas un service applicatif generique de bounded context.
- Valider les entrees au bord du systeme avec Bean Validation.
- Garder les controllers minces : parsing HTTP, validation, delegation, mapping de reponse.
- Utiliser des codes HTTP coherents et stables.
- Centraliser la traduction des exceptions techniques ou metier en reponses HTTP.

## Injection and lifecycle rules

- Preferer l'injection par constructeur.
- Eviter l'injection par champ.
- Limiter la logique dans les annotations et la configuration implicite.
- Rendre explicites les dependances importantes dans les signatures de classe.

## Persistence rules

- Limiter JPA a la persistence et ne pas y cacher de logique metier non triviale.
- Eviter les relations bidirectionnelles si elles ne sont pas strictement necessaires.
- Controler explicitement les chargements pour eviter les problemes de N+1.
- Isoler les requetes specifiques dans des repositories ou adapters dedies.
- Ne pas faire fuiter les details SQL ou JPA dans l'API publique des couches metier.

## Transaction rules

- Poser les transactions au niveau des services applicatifs, pas dans les controllers.
- Garder des transactions courtes.
- Eviter les appels reseau ou I/O lents a l'interieur d'une transaction.
- Definir clairement ce qui doit etre atomique et ce qui peut etre eventual.

## Error handling rules

- Distinguer erreurs metier, erreurs techniques et erreurs de contrat d'API.
- Lever des exceptions explicites avec un vocabulaire metier.
- Eviter les `catch` generiques qui masquent la cause reelle.
- Journaliser les erreurs avec le contexte utile, sans exposer de secrets.

## Configuration and observability rules

- Utiliser des proprietes de configuration typees pour les reglages applicatifs.
- Ne pas hardcoder d'URL, de credentials ou de feature flags.
- Ajouter des logs structures et utiles aux points critiques.
- Prevoir health checks, metriques et tracing sur les flux importants.

## Testing rules

- Ecrire des tests unitaires pour la logique metier.
- Utiliser des tests d'integration pour les contrats Spring, JPA, SQL et HTTP.
- Tester les cas nominaux, les cas limites et les cas d'erreur.
- Eviter les tests fragiles qui dependent de details d'implementation sans valeur fonctionnelle.

## Review questions

1. Les responsabilites sont-elles clairement separees entre web, application, domaine et infrastructure ?
2. Les controllers deleguent-ils la logique au lieu de la porter eux-memes ?
3. Les DTO entrants sont-ils mappes vers des `command` ou `query` applicatives ?
4. Les use cases renvoient-ils des `View` applicatives ?
5. Les DTO sont-ils separes des entites de persistence ?
6. Les cas d'usage sont-ils portes par des classes `UseCase` dediees plutot que par un service global ?
7. Les transactions sont-elles posees au bon niveau ?
8. Les acces base sont-ils lisibles et maitrises ?
9. Les erreurs metier et techniques sont-elles distinguees proprement ?
10. Les regles critiques sont-elles couvertes par des tests utiles ?

## Output format

Quand cette skill est utilisee, fournir :

- le verdict global : `OK` ou `KO`
- les ecarts prioritaires
- les fichiers ou couches concernes
- la regle violee
- la correction recommandee
