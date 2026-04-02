---
name: backend-error
description: Regles generiques pour gerer les erreurs backend de facon coherente dans une application Spring Boot du projet de jeu de role. Utiliser cette skill quand il faut definir, corriger ou relire la gestion des erreurs, la journalisation associee, l'externalisation d'un catalogue d'erreurs et la traduction en reponses HTTP.
---

# Backend Error

## Purpose

Definir une gestion d'erreurs backend coherente, observable et stable pour eviter les messages ad hoc disperses dans les controllers, services et adapters.

## When to use

Utiliser cette skill lorsque l'on demande de :

- creer ou corriger une gestion d'erreurs backend
- externaliser un catalogue d'erreurs
- homogeniser les reponses HTTP d'erreur
- verifier que les logs et exceptions backend sont coherents
- relire un backend Spring Boot sous l'angle observabilite et robustesse

## Target architecture

La gestion d'erreurs doit s'appuyer sur :

- un catalogue d'erreurs externalise dans `src/main/resources/configuration/errors.json`
- des exceptions backend qui referencent une cle d'erreur stable
- un composant central de resolution du catalogue d'erreurs
- un handler HTTP central pour traduire les exceptions en `ApiError`
- un logger dans chaque classe backend executable

## Folder rules

- stocker le catalogue d'erreurs backend dans `src/main/resources/configuration/errors.json`
- garder les classes de gestion d'erreurs dans une zone partagee du backend comme `common/api` ou `common/configuration`
- ne pas disperser des messages d'erreur litteraux dans les controllers ou services si une cle catalogue existe deja
- journaliser dans les classes qui executent du flux applicatif, de la configuration ou de l'integration

## Checks

- verifier que les erreurs backend connues sont declarees dans `configuration/errors.json`
- verifier que les handlers HTTP ne reconstruisent pas a la main les messages standards
- verifier qu'une exception metier ou applicative transporte une cle d'erreur stable
- verifier qu'un logger est present dans chaque classe backend executable
- verifier qu'une erreur inattendue est journalisee avec sa stacktrace
- verifier que les erreurs de validation, de contrat et d'autorisation restent differenciees

## Dependency rules

- `configuration/errors.json` -> catalogue source de verite des erreurs
- exceptions backend -> referencent une cle du catalogue
- resolver ou service de catalogue -> charge et valide le fichier JSON
- `RestExceptionHandler` ou equivalent -> traduit les exceptions vers HTTP

Interdits :

- messages d'erreur dupliques en dur dans plusieurs classes
- `catch` generiques silencieux
- reponses HTTP d'erreur construites directement dans les controllers
- erreurs inattendues non journalisees

## Review questions

1. Les erreurs backend fonctionnelles et techniques sont-elles centralisees dans `configuration/errors.json` ?
2. Les exceptions transportent-elles une cle d'erreur stable au lieu d'un message fragile ?
3. Le handler HTTP central reconstruit-il proprement `code`, `message` et `status` ?
4. Chaque classe backend executable declare-t-elle un logger ?
5. Les erreurs inattendues sont-elles journalisees avec le contexte utile ?
6. Les erreurs d'autorisation, validation, contrat et ressource absente sont-elles distinguees proprement ?

## Migration rule

Si le backend ne suit pas ces regles :

1. creer `configuration/errors.json`
2. introduire une resolution centralisee du catalogue d'erreurs
3. remplacer les messages hardcodes par des cles d'erreur stables
4. brancher le handler HTTP central sur le catalogue
5. ajouter un logger dans chaque classe backend executable

## Output format

Quand cette skill est utilisee, fournir :

- le verdict global : `OK` ou `KO`
- les ecarts de gestion d'erreurs prioritaires
- les fichiers backend concernes
- la regle violee
- la correction recommandee

## Expected review style

Le verdict doit etre concret, actionnable et oriente robustesse backend.
