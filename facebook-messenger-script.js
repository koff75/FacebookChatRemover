/**
 * Simple Chat Deletion Script for Facebook Messenger 
 *
 */
(async function() {
    // Fonction pour introduire un délai (en millisecondes)
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Fonction pour trouver un élément par son texte (insensible à la casse)
    function findElementByText(selector, texts, scope = document) {
        try {
            const elements = scope.querySelectorAll(selector);
            const lowerCaseTexts = texts.map(t => t.toLowerCase());
            for (const el of elements) {
                const elTextContent = (el.textContent || "").trim().toLowerCase();
                if (lowerCaseTexts.includes(elTextContent)) return el;
                const elInnerText = (el.innerText || "").trim().toLowerCase();
                 if (lowerCaseTexts.includes(elInnerText)) return el;
                const spans = el.querySelectorAll(':scope > span, :scope > div > span');
                for (const span of spans) {
                    const spanText = (span.textContent || span.innerText || "").trim().toLowerCase();
                    if (lowerCaseTexts.includes(spanText)) return el;
                }
                 const divs = el.querySelectorAll(':scope > div');
                 for (const div of divs) {
                      const divText = (div.textContent || div.innerText || "").trim().toLowerCase();
                     if (lowerCaseTexts.includes(divText)) return el;
                 }
            }
             // Fallback partiel (moins utile ici peut-être)
             for (const el of elements) {
                const elText = (el.textContent || el.innerText || "").trim().toLowerCase();
                for (const txt of lowerCaseTexts) {
                    if (elText.includes(txt)) return el;
                }
            }
        } catch (e) {
            console.error(`findElementByText: Erreur durant la recherche pour "${selector}" avec textes "${texts.join('/')}"`, e);
        }
        return null;
    }

    const maxLoops = 40;
    let chatsDeleted = 0;
    // console.log(`Messenger Chat Deleter (sans conteneur): Démarrage pour ${maxLoops} chats.`);

    for (let i = 0; i < maxLoops; i++) {
        // console.log(`--- Itération ${i + 1} sur ${maxLoops} ---`);
        if (i > 0) {
             await delay(500);
        } else {
            await delay(100);
        }

        // --- Étape 1 (Modifiée) : Trouver le PREMIER bouton "..." sur TOUTE la page ---
        // console.log(`Itération ${i + 1}: Recherche du premier bouton '...' globalement...`);
        const moreOptionsSelector = 'div[role="button"][aria-label^="More options"], div[role="button"][aria-label^="Plus d’options"]';
        let moreOptionsButton = null;
         try {
             // Recherche sur tout le document au lieu d'un conteneur spécifique
            moreOptionsButton = document.querySelector(moreOptionsSelector);
         } catch (e) {
             console.error(`Itération ${i + 1}: Erreur lors de la recherche globale du bouton '...' ('${moreOptionsSelector}'):`, e);
              break;
         }

        if (!moreOptionsButton) {
            console.error(`Itération ${i + 1}: Aucun bouton '...' ('${moreOptionsSelector}') trouvé sur la page. Arrêt.`);
             break;
        }
        // console.log(`Itération ${i + 1}: Premier bouton '...' trouvé globalement.`);

        // --- Les étapes suivantes restent les mêmes ---

        // console.log(`Itération ${i + 1}: Clic sur le bouton '...'...`);
         try {
             moreOptionsButton.click();
         } catch (e) {
              console.error(`Itération ${i + 1}: Erreur lors du clic sur le bouton '...':`, e);
              break;
         }
        await delay(100);

        // console.log(`Itération ${i + 1}: Recherche de l'option 'Delete chat' / 'Supprimer la discussion' dans le menu...`);
        const deleteMenuItemSelector = 'div[role="menuitem"]';
        const deleteMenuItemTexts = ['Delete chat', 'Supprimer la discussion'];
        let deleteMenuItem = findElementByText(deleteMenuItemSelector, deleteMenuItemTexts, document.body);

        if (!deleteMenuItem) {
            console.error(`Itération ${i + 1}: Option de menu '${deleteMenuItemTexts.join('/')}' ('${deleteMenuItemSelector}') introuvable. Arrêt.`);
            break;
        }

        // console.log(`Itération ${i + 1}: Clic sur l'option '${(deleteMenuItem.textContent || deleteMenuItem.innerText || "").trim()}'...`);
         try {
            deleteMenuItem.click();
         } catch(e) {
              console.error(`Itération ${i + 1}: Erreur lors du clic sur l'option de menu '${deleteMenuItemTexts.join('/')}':`, e);
              break;
         }
        await delay(600);

        // console.log(`Itération ${i + 1}: Recherche du bouton de confirmation 'Delete chat' / 'Supprimer'...`);
        const confirmButtonSelector = 'div[role="dialog"] button, div[role="dialog"] div[role="button"]';
        const confirmButtonTexts = ['Delete chat', 'Supprimer', 'Delete'];
        let confirmDeleteButton = null;
        let lastDialog = null;
         try {
             const dialogs = document.querySelectorAll('div[role="dialog"]');
             if (dialogs.length > 0) {
                 lastDialog = dialogs[dialogs.length - 1];
                 confirmDeleteButton = findElementByText(confirmButtonSelector, confirmButtonTexts, lastDialog);
             } else {
                 confirmDeleteButton = findElementByText('button, div[role="button"]', confirmButtonTexts);
             }
         } catch (e) {
              console.error(`Itération ${i + 1}: Erreur lors de la recherche du bouton de confirmation:`, e);
              break;
         }

        if (!confirmDeleteButton) {
            console.error(`Itération ${i + 1}: Bouton de confirmation '${confirmButtonTexts.join('/')}' introuvable. Arrêt.`);
            break;
        }

        // console.log(`Itération ${i + 1}: Clic sur le bouton de confirmation '${(confirmDeleteButton.textContent || confirmDeleteButton.innerText || "").trim()}'...`);
         try {
            confirmDeleteButton.click();
         } catch (e) {
             console.error(`Itération ${i + 1}: Erreur lors du clic sur le bouton de confirmation:`, e);
              break;
         }
        chatsDeleted++;
        // console.log(`Suppression ${chatsDeleted}/${maxLoops} initiée.`);

        if (chatsDeleted >= maxLoops) {
            // console.log(`Nombre maximum de ${maxLoops} suppressions atteint.`);
            break;
        }
    } // Fin de la boucle for

    console.log(`Messenger Chat Deleter (sans conteneur): Terminé. ${chatsDeleted} conversations potentiellement supprimées.`);

})(); // Exécute immédiatement la fonction