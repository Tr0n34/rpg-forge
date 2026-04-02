---
name: frontend-configuration
description: "Regles generiques de configuration d'une application Angular dans le contexte du projet de jeu de role. Utiliser cette skill quand il faut definir, relire ou corriger les mecanismes de configuration frontend : environnements de build, configuration runtime, endpoints API, feature flags, providers, bootstrap, variables exposees au navigateur ou strategie de separation entre config compilee et config chargee au demarrage."
---

# Frontend Configuration

## Purpose

Definir des regles de configuration Angular qui evitent le hardcode, limitent les regressions de deploiement et gardent un frontend de jeu de role portable entre environnements.

## Configuration strategy rules

- Distinguer clairement ce qui releve du build et ce qui releve du runtime.
- Garder les choix de configuration coherents sur toute l'application.
- Eviter de disperser les constantes d'environnement dans les composants et services.

## Runtime configuration rules

- Preferer une configuration chargee au demarrage pour les valeurs qui changent selon l'environnement de deploiement.
- Encapsuler l'acces a la configuration dans un service ou un token dedie.
- Faire echouer le bootstrap ou degrader proprement si une configuration critique manque.

## Build-time configuration rules

- Limiter les fichiers d'environnement aux variations necessaires a la compilation.
- Ne pas utiliser les remplacements de fichiers comme solution universelle a tout besoin de parametrage.
- Documenter implicitement la source de chaque valeur importante par sa structure de code.

## API and integration rules

- Centraliser les URLs de backend, timeouts, prefixes et options d'integration.
- Eviter la concatenation d'URLs dans les composants.
- Garder les cles, identifiants et toggles techniques derriere une abstraction stable.

## Security rules

- Ne jamais exposer dans le bundle frontend un secret qui doit rester prive.
- Considerer toute configuration chargee dans le navigateur comme lisible par l'utilisateur final.
- Distinguer identifiants publics, toggles UI et secrets reels.

## Provider rules

- Centraliser les providers lies a la configuration dans le bootstrap ou une couche dediee.
- Garder les valeurs injectees explicites et testables.
- Eviter les dependances implicites a `window` ou a des variables globales non encapsulees.

## Feature flag rules

- Utiliser des flags nommes avec une intention fonctionnelle claire.
- Prevoir une suppression des flags temporaires.
- Gerer explicitement le comportement par defaut.

## Review questions

1. La frontiere entre configuration de build et de runtime est-elle claire ?
2. Les valeurs critiques sont-elles centralisees et injectees proprement ?
3. Des secrets ont-ils ete exposes dans le frontend ?
4. Les URLs et integrations externes sont-elles configurees sans hardcode disperse ?
5. Le demarrage gere-t-il correctement l'absence de configuration critique ?
6. Les flags sont-ils maitrises et temporaires quand il le faut ?

## Output format

Quand cette skill est utilisee, fournir :

- le verdict global : `OK` ou `KO`
- les ecarts de configuration prioritaires
- les points de bootstrap, providers ou services concernes
- la regle violee
- la correction recommandee
