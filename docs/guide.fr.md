## À quoi ça sert

Quelques balises oubliées coûtent cher en référencement et en accessibilité : pas de `lang`, un titre trop long, deux `h1`, des images sans `alt`. Ce script audite vos pages HTML (un site statique, un export, un dossier de build) et liste les corrections.

## Avant de commencer

- Un dossier de fichiers `.html` (par exemple le résultat de votre build).

## Pas à pas

1. Auditez :
   ```bash
   node src/html-audit.mjs ./dist
   ```
2. Corrigez page par page ; relancez.
3. Commencez par `title`, `meta description` et `h1` : ce sont les plus rentables.

## Lire le résultat

Contrôles : attribut `lang`, `<title>` (présent, ≤ 65 caractères), meta description, meta viewport, un seul `<h1>`, `alt` sur chaque image, liens sans destination, `target="_blank"` sans `rel="noopener"`. Un `alt=""` est valide : il marque une image décorative.

## L'automatiser

En CI, sur le dossier de build : le code de sortie 2 bloque la livraison d'une page régressive.

## Pièges à éviter

- L'audit lit le HTML **statique** : une page rendue côté navigateur par JavaScript n'y est pas analysée telle que l'utilisateur la voit.
- Ce n'est pas un audit d'accessibilité complet ; il couvre les bases.
