---
name: lib-rpg-integration
description: Regles generiques d'usage des bibliotheques et clients d'integration pour une application de jeu de role. Utiliser cette skill quand il faut concevoir, relire ou corriger l'integration d'un moteur de regles, d'un compendium, d'un importeur de donnees, d'un service de calcul ou d'une bibliotheque externe, encapsuler ses details techniques, gerer les flux, les retries, les limitations de debit et la testabilite.
---

# RPG Integration Libraries

## Purpose

Definir des regles d'integration generiques pour utiliser une bibliotheque ou un service externe de jeu sans propager ses details techniques dans toute l'application.

## Library boundary rules

- Encapsuler la bibliotheque ou le client externe derriere des adapters ou services dedies.
- Eviter de faire dependre tout le coeur applicatif des types natifs d'une integration.
- Conserver des ports metier stables pour importer des fiches, resoudre des regles, lire un compendium ou synchroniser des donnees.

## Flow handling rules

- Garder les handlers et synchronisations idempotents autant que possible.
- Distinguer reception d'un flux externe, decision metier et effet de sortie.
- Eviter les traitements monolithiques qui lisent, decident et persistent tout dans la meme methode.
- Journaliser les flux critiques avec le contexte utile.

## Input and contract rules

- Valider explicitement les entrees recues depuis un service externe.
- Repondre rapidement quand un protocole impose un accus de reception ou une confirmation courte.
- Separer parsing, autorisation, validation et execution metier.
- Uniformiser les messages d'erreur et de refus.

## Resilience rules

- Respecter les limites de rate des API ou librairies externes.
- Prevoir retries, backoff et reprise la ou cela a du sens.
- Eviter les boucles agressives de polling ou de re-emission.
- Definir une strategie claire pour les erreurs reseau, de session ou d'indisponibilite distante.

## Data mapping rules

- Centraliser les mappings reutilisables entre formats externes et objets applicatifs.
- Eviter la duplication des traductions de champs ou des conventions de serialisation.
- Sanitizer, normaliser ou encoder les contenus importes si necessaire.

## Testing rules

- Tester la logique metier sans dependre d'un service externe reel.
- Utiliser des doubles pour les clients, SDK ou bibliotheques quand c'est possible.
- Garder quelques tests d'integration cibles sur les adapters critiques.

## Review questions

1. L'integration externe est-elle correctement encapsulee ?
2. Les handlers ou synchronisations sont-ils simples, idempotents et separables ?
3. Les contrats d'entree sont-ils valides explicitement ?
4. Les limites de rate et scenarios de reprise sont-ils traites explicitement ?
5. Les mappings entre formats externes et modele applicatif sont-ils centralises ?
6. La logique metier est-elle testable sans service externe reel ?

## Output format

Quand cette skill est utilisee, fournir :

- le verdict global : `OK` ou `KO`
- les ecarts d'integration prioritaires
- les adapters, handlers ou synchronisations concernes
- la regle violee
- la correction recommandee
