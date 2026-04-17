import { test, expect } from '@playwright/test';

test('Connexion réussie avec un utilisateur valide', async ({ page }) => {
    
    // 1. Aller sur le site
    await page.goto('https://www.saucedemo.com');

    // 2. Remplir le username
    await page.fill('#user-name', 'standard_user');

    // 3. Remplir le password
    await page.fill('#password', 'secret_sauce');

    // 4. Cliquer sur le bouton Login
    await page.click('#login-button');

    // 5. Vérifier qu'on est bien connecté
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

});
test('Connexion échouée avec un mauvais mot de passe', async ({ page }) => {

    // 1. Aller sur le site
    await page.goto('https://www.saucedemo.com');

    // 2. Remplir avec un mauvais mot de passe
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'mauvais_password');

    // 3. Cliquer sur Login
    await page.click('#login-button');

    // 4. Vérifier qu'un message d'erreur apparaît
    await expect(page.locator('.error-message-container')).toBeVisible();

});
test('Connexion avec utilisateur bloqué', async ({ page }) => {

    await page.goto('https://www.saucedemo.com');
    await page.fill('#user-name', 'locked_out_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');

    await expect(page.locator('.error-message-container')).toBeVisible();
});

test('Connexion sans rien remplir', async ({ page }) => {

    await page.goto('https://www.saucedemo.com');
    await page.click('#login-button');

    await expect(page.locator('.error-message-container')).toBeVisible();
});