---
name: backend-policy
description: Regles generiques pour concevoir, refondre ou relire des policies backend composees de plusieurs Rule dans le projet de jeu de role. Utiliser cette skill quand il faut structurer un controle metier de type Policy/Rule, mutualiser des validations reutilisables ou migrer des validations inline vers des policies composees.
---

# Backend Policy

## Purpose

Definir un pattern simple pour exprimer des validations metier composees de plusieurs `Rule` et exposees par des factories de `Policy`.

## When to use

Utiliser cette skill lorsque l'on demande de :

- creer une nouvelle `Policy` backend
- migrer des validations inline vers des `Rule` nommees
- composer plusieurs regles pour une operation `CREATE`, `UPDATE`, `IMPORT` ou equivalente
- relire un code backend qui melange use case et validations metier repetitives

## Target architecture

Le pattern cible repose sur :

- une interface generique `Policy<T>` avec une methode `ensure`
- un type `Rule<T>` nomme, reutilisable et composeable
- une fabrique `Policies` pour `rule`, `allOf`, `forOperation` et `require`
- une factory metier finale comme `CharacterPolicies`
- des dependances de persistence resolues via des ports du domaine si une policy doit consulter un contrat externe au modele

Exemple cible :

```java
public final class CharacterPolicies {

    public static final Rule<Character> CHARACTER_REQUIRED =
            Policies.rule(ErrorKeys.VALIDATION_ERROR, character ->
                    Policies.require(character != null, ErrorKeys.VALIDATION_ERROR)
            );

    public static final Rule<Character> FIXED_ALLOCATION_MATCHES_PROFILE =
            Policies.rule(ErrorKeys.INVALID_CHARACTER_ALLOCATION, character -> {
                if (!character.allocationProfile().hasFixedScores()) {
                    return;
                }
                Policies.require(
                        character.attributes().asSortedScores().equals(character.allocationProfile().scores()),
                        ErrorKeys.INVALID_CHARACTER_ALLOCATION
                );
            });

    private CharacterPolicies() {
    }

    public static Policy<Character> forCreation() {
        return Policies.forOperation(
                Character.class.getSimpleName(),
                "CREATE",
                Policies.allOf(CHARACTER_REQUIRED, FIXED_ALLOCATION_MATCHES_PROFILE)
        );
    }
}
```

## Folder rules

- placer le socle generique dans un package partage de policies backend
- placer les factories metier dans `application/policies/<boundedContext>`
- garder les policies sans dependance Spring
- garder les `Rule` focalisees sur une seule contrainte metier lisible

## Checks

- verifier que `forCreation`, `forUpdate` ou equivalents composent explicitement plusieurs `Rule` via `Policies.allOf(...)`
- verifier qu'une validation repetee dans plusieurs use cases est centralisee dans une `Policy`
- verifier que les use cases appellent `policy.ensure(target)` plutot que repliquer la regle
- verifier qu'aucune logique HTTP n'est injectee dans la `Policy`
- verifier qu'une `Rule` echoue avec une erreur metier stable et explicite

## Dependency rules

Respecter les dependances suivantes :

- `Policy` -> contrat generique sans framework
- `Rule` -> encapsule une policy atomique nommee
- `Policies` -> fournit la composition et les helpers techniques minimaux
- `<Aggregate>Policies` -> assemble les `Rule` metier par operation
- `UseCase` -> invoque la `Policy` composee
- les dependances externes a la policy -> passent par des ports du domaine, jamais par des repositories concrets ou des ports applicatifs

Interdits :

- des validations metier critiques dupliquees dans plusieurs use cases
- une `Policy` qui depend d'un controller, DTO web ou repository concret
- une `Rule` qui couvre plusieurs sujets metier sans cohesion

## Review questions

1. Chaque regle importante est-elle nommee comme une `Rule` metier explicite ?
2. La factory `forOperation` assemble-t-elle bien un ensemble de regles plutot qu'une lambda monolithique ?
3. Les use cases s'appuient-ils sur `ensure(...)` au lieu de dupliquer les controles ?
4. Les errors keys sont-elles stables et coherentes avec le catalogue d'erreurs ?
5. Les tests couvrent-ils au moins un succes et un echec de la policy composee ?

## Migration rule

Si une policy est inline ou mal structuree :

1. extraire chaque contrainte distincte en `Rule`
2. centraliser les helpers dans `Policies`
3. recomposer `forCreation`, `forUpdate` ou equivalent avec `Policies.allOf(...)`
4. supprimer les duplications de validation dans les use cases ou helpers annexes
5. ajouter un test cible sur la policy composee

## Output format

Quand cette skill est utilisee, fournir :

- le verdict global : `OK` ou `KO`
- les policies concernees
- les `Rule` extraites ou manquantes
- les duplications eliminees
- les tests ajoutes ou manquants

## Expected review style

Le verdict doit etre concis, oriente refactoring et centre sur la composition des regles.
