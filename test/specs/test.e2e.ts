import { browser, $ } from '@wdio/globals';

describe('UI5 SAP Application', () => {
    it('should open application, verify title, and click the first available button', async () => {
        // Step 1: Maximize the browser window
        await browser.maximizeWindow();

        // Step 2: Open the SAPUI5 application URL
        await browser.url('http://localhost:8080/index.html#/main');

        // Step 3: Wait for the page to load (you can replace this with better waiting logic)
        await browser.pause(5000);

        // Step 4: Verify the title of the page
        const title = await browser.getTitle();
        console.log('Page Title:', title);
        expect(title).toContain('SAP');  // Adjust the condition based on your actual title

        // Step 5: Find the first button element on the page
        const firstButton = await $('button');  // Get the first button element

        // Step 6: Wait for the button to be clickable
        await firstButton.waitForClickable({ timeout: 5000 });

        // Step 7: Click the first available button
        await firstButton.click();

        // Step 8: Optionally, add a pause to observe the result (or use proper wait for a UI change)
        await browser.pause(2000);  // Adjust based on the behavior of your app

        // Step 9: Verify the result of the click (you can adjust based on expected UI behavior)
        // Example: Check if the current URL has changed or an element appears
        const currentUrl = await browser.getUrl();
        console.log('Current URL:', currentUrl);
        expect(currentUrl).toContain('desired-page');  // Adjust based on expected URL change

        // Optionally, you can add checks for specific elements that appear/disappear
        // Example: Check if a specific element is visible after clicking
        const resultElement = await $('#element-id');  // Replace with an actual element selector
        await resultElement.waitForDisplayed({ timeout: 5000 });
        expect(await resultElement.isDisplayed()).toBe(true);

        // Step 10: Wait for 2 minutes (120,000 milliseconds) to allow more time for the app to respond or complete
        await browser.pause(120000);  // Wait for 2 minutes before the test ends
    });
});
