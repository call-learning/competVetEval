# CompetVetEval project

Evaluation des compétences vétérinaires dans des situations cliniques avec Moodle.

## Installation et compilation

Voir fichier BUILD.md

## Utilisation

Une fois que l'application a été compilée (`ionic build`) on peu la lancer via: `ionic serve`

## Tests

On peut tester l'application en local en utilisant une configuration différente de celle de production: `ionic serve --configuration localdev`

Le navigateur s'ouvre alors sur http://localhost:8100 et permet de sélectionner des environnements de developpement local (un Moodle installé
localement par exemple).

Tests automatiques:

- npm run test : tests unitaires
- npm run e2e: tests intégration
