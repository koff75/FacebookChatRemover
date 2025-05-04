# FacebookChatRemover for Facebook Messenger

Un script pour console de navigateur permettant de supprimer séquentiellement des conversations entières de Facebook Messenger.

**Testé le :** 04 Mai 2025 (Basé sur la structure de Messenger à cette date)

## Description

Ce snippet JavaScript automatise la suppression des conversations Facebook Messenger directement depuis la console de développement de votre navigateur. Il simule les clics nécessaires pour supprimer la discussion (via le menu "..."), attend que l'interface se mette à jour, puis répète le processus. Le script cible le *premier* bouton "..." trouvé sur la page à chaque itération, jusqu'à atteindre un nombre défini de répétitions (40 par défaut), permettant un nettoyage plus rapide de plusieurs fils de discussion.

⚠️ **Avertissements**

* **UTILISATION À VOS PROPRES RISQUES.** Ce script manipule directement la structure (DOM) de la page web de Messenger.
* **SUJET À CASSURE :** Facebook met fréquemment à jour le code de son site web (Messenger inclus). Ces mises à jour **casseront probablement le script** avec le temps. Vous devrez peut-être mettre à jour manuellement les sélecteurs CSS/JS (ex: `querySelector`) dans le script en inspectant les éléments dans votre navigateur s'il cesse de fonctionner.
* **VÉRIFIEZ LE PREMIER BOUTON "..." TROUVÉ :** Cette version du script cible le *premier* bouton "..." (`aria-label="More options..."` ou `aria-label="Plus d’options..."`) trouvé sur *toute* la page. Assurez-vous qu'aucun autre bouton similaire n'apparaît *avant* celui de la première conversation que vous souhaitez supprimer dans la structure de la page. Si le script clique sur le mauvais élément, la version plus robuste (qui identifie d'abord la liste de chats) pourrait être nécessaire.
* **OBJECTIF :** Conçu uniquement pour un usage personnel (par ex., nettoyer votre propre boîte de réception) et à des fins éducatives.

## Comment ça Marche

Lorsqu'il est exécuté dans la console du navigateur sur la page de Messenger (`messenger.com` ou `facebook.com/messages/t/`) :

1.  Trouve le **premier** bouton "..." (`More options` / `Plus d’options`) visible sur la page entière.
2.  Clique sur ce bouton "...".
3.  Attend brièvement l'ouverture du menu.
4.  Trouve et clique sur l'option "Delete chat" (ou "Supprimer la discussion") dans le menu.
5.  Attend brièvement l'apparition de la fenêtre modale de confirmation.
6.  Trouve et clique sur le bouton final "Delete" / "Delete chat" (ou "Supprimer") dans la modale.
7.  Attend une durée plus longue (par défaut 3 secondes) pour permettre à l'interface de Messenger de traiter la suppression et de rafraîchir la liste.
8.  Répète le processus depuis l'étape 1 (en trouvant le *nouveau* premier bouton "..." sur la page), jusqu'au nombre maximum défini dans le script (`maxLoops`).

## Comment Utiliser

1.  **Ouvrez Messenger :** Allez sur `www.messenger.com` ou `www.facebook.com/messages/t/` dans votre navigateur web (Chrome, Firefox, Edge recommandés) et connectez-vous.
2.  **Affichez la Liste :** Assurez-vous que votre liste de conversations est visible.
3.  **Ouvrez la Console de Développement :**
    * Appuyez sur `F12` sur votre clavier.
    * Ou, faites un clic droit n'importe où sur la page et sélectionnez "Inspecter" ou "Inspecter l'élément".
    * Trouvez et cliquez sur l'onglet "Console" dans les outils qui apparaissent.
4.  **Copiez le Script :** Ouvrez le fichier `.js` contenant le code du script Messenger et copiez **tout** son contenu.
5.  **Collez dans la Console :** Cliquez dans la zone de saisie de la console (souvent en bas, marquée par `>`), et collez le code (`Ctrl+V` ou `Cmd+V`). Vous devrez peut-être autoriser explicitement le collage si le navigateur vous avertit.
6.  **Lancez le Script :** Appuyez sur `Entrée`.
7.  **Observez :** Le script commencera à s'exécuter. Surveillez la console pour les messages (si décommentés) et la fenêtre du navigateur pendant qu'il effectue les clics. Le processus se répétera automatiquement pour les conversations suivantes. Il s'arrêtera après avoir supprimé le nombre de chats spécifié dans `maxLoops` ou s'il rencontre une erreur (par exemple, impossible de trouver un bouton requis).

## Configuration

* **Nombre de Suppressions :** Vous pouvez changer le nombre de chats à supprimer en une seule fois en modifiant la variable `maxLoops` au début du script (la valeur par défaut est `40`).
    ```javascript
    const maxLoops = 40; // Changez 40 par le nombre désiré
    ```
* **Langue :** Le script essaie de trouver le texte des boutons en anglais ("Delete chat", "Delete") et en français ("Supprimer la discussion", "Supprimer"). Si votre interface Messenger utilise une langue différente, vous devrez peut-être mettre à jour les tableaux `...Texts` correspondants dans le script pour correspondre exactement aux libellés que vous voyez.
    ```javascript
    // Exemples de variables à modifier si besoin
    const deleteMenuItemTexts = ['Delete chat', 'Supprimer la discussion'];
    const confirmButtonTexts = ['Delete chat', 'Supprimer', 'Delete'];
    ```
* **Délais :** Si le script s'exécute trop rapidement pour votre connexion ou votre ordinateur (provoquant des erreurs car les éléments n'ont pas le temps d'apparaître), vous pouvez augmenter les valeurs (en millisecondes) à l'intérieur des fonctions `delay()` (par exemple, `await delay(1000);` pour 1 seconde au lieu de `await delay(600);`). Le délai après la suppression finale (`await delay(3000);`) est particulièrement important pour laisser le temps à la liste de se rafraîchir.

## Dépannage

* **Erreurs "Button not found" / "Option de menu ... introuvable" / "Bouton de confirmation ... introuvable" :** Cela signifie généralement que Facebook/Messenger a mis à jour la structure de son site web. Vous devrez :
    1.  Effectuer manuellement l'étape où le script a échoué (par exemple, cliquer sur "...", puis inspecter l'élément "Supprimer la discussion" qui devrait apparaître).
    2.  Utiliser les Outils de Développement (onglet "Elements" ou "Inspecteur") pour trouver la nouvelle structure HTML ou les nouveaux attributs (comme `aria-label`, `role`) de l'élément que le script n'a pas pu trouver.
    3.  Mettre à jour les lignes `querySelector(...)` ou `findElementByText(...)` correspondantes dans le script avec les nouveaux sélecteurs ou textes corrects.
* **Le script clique sur le mauvais bouton "..." :** Cela confirme le risque de cette version du script. La solution la plus robuste est de revenir à la version précédente du script qui incluait la recherche du conteneur de la liste de chats (`chatListSelector`) et de trouver le sélecteur correct pour **ce conteneur** en utilisant l'inspecteur d'éléments.
