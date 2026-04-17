import { test, expect } from '@playwright/test';

test('BUG - Le titre de la page produits est incorrect', async ({ page }) => {

    await page.goto('https://www.saucedemo.com');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');

    // On vérifie un titre qui n'existe pas — ça va échouer !
    await expect(page.locator('.title')).toHaveText('Mauvais titre');

});