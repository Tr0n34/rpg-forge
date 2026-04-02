---
name: backend-configuration
description: "Regles generiques de configuration d'une application Spring Boot dans le contexte du projet de jeu de role. Utiliser cette skill quand il faut definir, relire ou corriger la gestion de configuration backend : `application.yml`, profils, variables d'environnement, secrets, `@ConfigurationProperties`, clients externes, feature flags, observabilite ou securisation des parametres techniques."
---

# Backend Configuration

## Purpose

Definir des regles de configuration robustes pour une application Spring Boot de gestion de jeu de role, sans coupler le code aux environnements.

## Source of truth rules

- Externaliser toute configuration variable selon l'environnement.
- Garder dans le code uniquement les valeurs stables et structurelles.
- Nommer les proprietes de facon coherente, explicite et regroupable par domaine fonctionnel.

## Binding rules

- Preferer `@ConfigurationProperties` pour les groupes de proprietes.
- Valider les configurations au demarrage pour echouer tot sur une config invalide.
- Eviter la multiplication de `@Value` isoles dans tout le code.
- Centraliser le mapping entre proprietes et objets de configuration types.

## Environment rules

- Utiliser les profils pour separer les variations d'environnement, pas pour redefinir toute l'application.
- Minimiser la divergence entre environnements.
- Garder une configuration locale simple a demarrer.
- Ne pas melanger secrets, URLs et toggles metier dans des emplacements incoherents.

## Secret management rules

- Ne jamais committer de secret reel.
- Injecter les secrets via variables d'environnement, coffre de secrets ou systeme dedie.
- Journaliser les configurations utiles sans exposer de donnees sensibles.

## External client rules

- Regrouper la configuration des clients externes par integration.
- Definir explicitement timeouts, retries, URLs de base et options critiques.
- Eviter les valeurs par defaut implicites pour les points reseau sensibles.

## Feature flag rules

- Nommer les feature flags selon une intention metier claire.
- Definir la duree de vie attendue des flags.
- Supprimer les flags obsoletes au lieu de les accumuler.

## Observability rules

- Configurer distinctement logs, metriques, traces et health checks.
- Rendre visibles les dependances critiques au demarrage et a l'execution.
- Isoler la configuration d'observabilite des autres reglages metier.

## Review questions

1. Toutes les valeurs variables sont-elles externalisees ?
2. Les proprietes sont-elles typees et validees ?
3. Les secrets sont-ils proteges correctement ?
4. Les configurations des clients externes sont-elles completes et explicites ?
5. Les profils sont-ils utilises avec parcimonie ?
6. Les flags et reglages d'observabilite sont-ils maitrises ?

## Output format

Quand cette skill est utilisee, fournir :

- le verdict global : `OK` ou `KO`
- les ecarts de configuration prioritaires
- les fichiers ou classes de configuration concernes
- la regle violee
- la correction recommandee
