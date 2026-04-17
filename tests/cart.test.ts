import { test, expect } from '@playwright/test';

// Fonction réutilisable pour se connecter
async function login(page: any) {
    await page.goto('https://www.saucedemo.com');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
}

test('La page produits affiche bien des articles', async ({ page }) => {

    await login(page);

    // Vérifier qu'on est sur la bonne page
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // Vérifier qu'il y a des produits affichés
    const produits = page.locator('.inventory_item');
    await expect(produits).toHaveCount(6);

});
test('Ajouter un produit au panier', async ({ page }) => {

    await login(page);

    // Vérifier que le panier est vide au départ
    const badge = page.locator('.shopping_cart_badge');
    await expect(badge).not.toBeVisible();

    // Ajouter le premier produit
    await page.click('.inventory_item:first-child button');

    // Vérifier que le badge panier affiche "1"
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText('1');

});
test('Ajouter plusieurs produits et vérifier le panier', async ({ page }) => {

    await login(page);

    // Ajouter 3 produits
    const boutons = page.locator('.inventory_item button');
    await boutons.nth(0).click();
    await boutons.nth(1).click();
    await boutons.nth(2).click();

    // Vérifier que le badge affiche "3"
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');

    // Aller dans le panier
    await page.click('.shopping_cart_link');

    // Vérifier qu'on est bien sur la page panier
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');

    // Vérifier qu'il y a bien 3 articles dans le panier
    const articlesParier = page.locator('.cart_item');
    await expect(articlesParier).toHaveCount(3);

});
test('Supprimer un produit du panier', async ({ page }) => {

    await login(page);

    // Ajouter 2 produits
    const boutons = page.locator('.inventory_item button');
    await boutons.nth(0).click();
    await boutons.nth(1).click();

    // Vérifier badge = 2
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    // Aller dans le panier
    await page.click('.shopping_cart_link');

    // Supprimer le premier article
    await page.locator('.cart_item button').first().click();

    // Vérifier qu'il reste 1 article
    await expect(page.locator('.cart_item')).toHaveCount(1);

    // Vérifier que le badge affiche "1"
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

});

test('Panier vide — bouton continuer les achats fonctionne', async ({ page }) => {

    await login(page);

    // Aller directement dans le panier sans rien ajouter
    await page.click('.shopping_cart_link');

    // Vérifier qu'il n'y a pas d'articles
    await expect(page.locator('.cart_item')).toHaveCount(0);

    // Cliquer sur "Continue Shopping"
    await page.click('#continue-shopping');

    // Vérifier qu'on revient sur la page produits
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

});
test('Passer une commande complète', async ({ page }) => {

    await login(page);

    // Ajouter un produit
    await page.locator('.inventory_item button').first().click();

    // Aller dans le panier
    await page.click('.shopping_cart_link');

    // Cliquer sur Checkout
    await page.click('#checkout');

    // Vérifier qu'on est sur la page checkout
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');

    // Remplir les infos
    await page.fill('#first-name', 'Zeineb');
    await page.fill('#last-name', 'Ajroudi');
    await page.fill('#postal-code', '72000');

    // Continuer
    await page.click('#continue');

    // Vérifier qu'on est sur la page récapitulatif
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');

    // Finaliser la commande
    await page.click('#finish');

    // Vérifier le message de confirmation
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');

});