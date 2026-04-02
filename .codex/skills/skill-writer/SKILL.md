---
name: skill-writer
description: Creer ou refondre des skills Codex locales pour le projet d'application de jeu de role avec un format homogene, valide et reutilisable. Utiliser cette skill quand il faut ajouter une nouvelle skill, normaliser une skill existante, ou transformer des regles techniques ou metier en skill exploitable par un autre agent.
---

# Skill Writer

## Purpose

Definir le format de reference des skills locales du projet.

Produire des skills homogenes, relisibles, reutilisables et faciles a valider avec l'outillage standard.

## When to use

Utiliser cette skill lorsque l'on demande de :

- creer une nouvelle skill
- refondre une skill existante
- transformer des regles metier ou techniques en skill reutilisable
- uniformiser des skills heterogenes
- corriger une skill invalide selon `quick_validate.py`

## Target architecture

Toute skill locale doit respecter cette structure minimale :

- `<skill-name>/SKILL.md`
- `<skill-name>/agents/openai.yaml` recommande

Le `SKILL.md` doit contenir :

- un frontmatter YAML avec `name` et `description`
- un corps markdown structure et directement actionnable

Le corps d'une skill doit suivre le schema de reference suivant :

- `## Purpose`
- `## When to use`
- `## Target architecture`
- `## Folder rules`
- `## Checks`
- `## Dependency rules`
- `## Review questions`
- `## Migration rule`
- `## Output format`
- `## Expected review style`

## Folder rules

- nommer le dossier de skill en lowercase avec tirets
- garder `SKILL.md` a la racine du dossier de skill
- ajouter `agents/openai.yaml` pour les metadonnees UI
- ne pas ajouter de documentation auxiliaire comme `README.md`, `CHANGELOG.md` ou `INSTALLATION_GUIDE.md`
- ne creer `scripts`, `references` ou `assets` que s'ils sont reellement utiles

## Checks

### Frontmatter

- verifier la presence du frontmatter YAML
- verifier que `name` correspond au nom du dossier
- verifier que `description` explique ce que fait la skill et quand l'utiliser
- verifier qu'aucun autre champ YAML n'est ajoute dans `SKILL.md`

### Body structure

- verifier la presence des sections principales du template
- verifier que le contenu reste concret et actionnable
- verifier que la skill n'est pas verbeuse inutilement
- verifier que les exemples restent utiles et courts

### Agents metadata

- verifier la presence de `agents/openai.yaml` quand la skill est maintenue activement
- verifier que `display_name`, `short_description` et `default_prompt` sont coherents avec `SKILL.md`
- verifier que `default_prompt` mentionne explicitement `$skill-name`

### Validation

- verifier que `quick_validate.py` passe
- verifier que la skill reste sous une taille raisonnable
- verifier que les ressources optionnelles ne sont pas creees sans besoin

## Dependency rules

Respecter les dependances suivantes :

- `SKILL.md` -> definit le comportement de la skill
- `agents/openai.yaml` -> derive de `SKILL.md`
- `scripts/`, `references/`, `assets/` -> seulement si le workflow le justifie

Interdits :

- une skill sans frontmatter YAML
- une skill sans description de declenchement claire
- `agents/openai.yaml` incoherent avec `SKILL.md`
- ajout de documentation annexe non necessaire

## Review questions

1. Le dossier de la skill respecte-t-il la convention de nommage ?
2. Le `SKILL.md` contient-il un frontmatter YAML valide ?
3. La description explique-t-elle bien quand utiliser la skill ?
4. Les sections principales du template sont-elles presentes ?
5. Le contenu est-il assez concret pour guider un autre agent ?
6. `agents/openai.yaml` est-il present et coherent ?
7. `default_prompt` mentionne-t-il bien `$skill-name` ?
8. La skill evite-t-elle le bruit documentaire inutile ?
9. Les ressources optionnelles sont-elles justifiees ?
10. `quick_validate.py` passe-t-il sur la skill ?

## Migration rule

Si une skill ne suit pas le template :

1. ajouter ou corriger le frontmatter YAML
2. reordonner le corps selon les sections du template
3. supprimer les sections inutiles ou redondantes
4. creer ou regenerer `agents/openai.yaml`
5. relancer `quick_validate.py`

Exemples :

- ajouter un frontmatter a une skill ancienne sans YAML
- renommer une section libre en `## Output format`
- remplacer une description vague par une description qui explique les triggers d'usage

## Output format

Quand cette skill est utilisee, fournir une sortie structuree avec :

- conformite globale : `OK` ou `KO`
- resume du niveau de conformite de la skill
- violations detectees
- fichiers concernes
- regle violee
- correctifs recommandes
- fichiers de metadonnees a creer ou regenerer

## Expected review style

Le verdict doit etre concret, actionnable et oriente correction.

Exemples :

- `KO - la skill backend-ddd-guard n'a pas de frontmatter YAML`
- `KO - le fichier agents/openai.yaml est absent ou incoherent avec SKILL.md`
- `KO - la description n'indique pas clairement quand utiliser la skill`
- `OK - la skill respecte le template local et passe quick_validate.py`
