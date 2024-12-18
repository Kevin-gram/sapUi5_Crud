import { browser, $$, $ } from '@wdio/globals';

describe('UI5 SAP Application', () => {
    it('should open application, click button, and fill create product dialog', async () => {
        // Step 1: Maximize the browser window
        await browser.maximizeWindow();

        // Step 2: Open the SAPUI5 application URL
        await browser.url('http://localhost:8080/index.html#/main');

        // Step 3: Wait for the page to load (extended wait time)
        await browser.pause(30000);  // Wait for page to load completely

        // Step 4: Verify the title of the page
        const title = await browser.getTitle();
        console.log('Page Title:', title);
        expect(title).toContain('SAP');  // Adjust based on your actual title

        // Step 5: Find and click the button to open the create product dialog
        const createProductButton = await $('#addButton');
        await createProductButton.waitForClickable({ timeout: 20000 });  // Increased wait time
        await createProductButton.click();

        // Step 6: Wait for the dialog to appear (increased timeout)
        const dialog = await $('#createProductDialog');
        console.log('Is dialog displayed:', await dialog.isDisplayed());
        await dialog.waitForDisplayed({ timeout: 20000 });  // Increased timeout to ensure dialog is visible

        // Step 7: Wait for each text field to be available before interacting

        // Product ID field
        const productIdInput = await $('#newProductId');
        console.log('Product ID field is displayed:', await productIdInput.isDisplayed());
        await productIdInput.waitForDisplayed({ timeout: 15000 });  // Wait until the field is displayed

        // Product Name field
        const productNameInput = await $('#newProductName');
        console.log('Product Name field is displayed:', await productNameInput.isDisplayed());
        await productNameInput.waitForDisplayed({ timeout: 15000 });  // Wait until the field is displayed

        // Product Price field
        const priceInput = await $('#newProductPrice');
        console.log('Product Price field is displayed:', await priceInput.isDisplayed());
        await priceInput.waitForDisplayed({ timeout: 15000 });  // Wait until the field is displayed

        // Product Rating field
        const ratingInput = await $('#newProductRating');
        console.log('Product Rating field is displayed:', await ratingInput.isDisplayed());
        await ratingInput.waitForDisplayed({ timeout: 15000 });  // Wait until the field is displayed

        // Product Release Date field
        const releaseDatePicker = await $('#newProductReleaseDate');
        console.log('Product Release Date field is displayed:', await releaseDatePicker.isDisplayed());
        await releaseDatePicker.waitForDisplayed({ timeout: 15000 });  // Wait until the field is displayed

        // Step 8: Fill out the dialog fields
        // Product ID (using a number above 20)
        await productIdInput.setValue(42);

        // Product Name
        await productNameInput.setValue('Advanced Smart Gadget');

        // Price
        await priceInput.setValue(299.99);

        // Rating
        await ratingInput.setValue(4);

        // Release Date
        await releaseDatePicker.setValue('2024-07-15');

        // Step 9: Find and click the Create button
        const createButton = await $('button=Create');  // This looks for a button with exact text "Create"
        await createButton.waitForClickable({ timeout: 20000 });  // Increased wait time to ensure the button is clickable
        await createButton.click();

        // Step 10: Add some wait time to observe the result (extended to ensure the action is processed)
        await browser.pause(60000);  // Increased pause for stability to ensure the action completes

        // Optional: Add verification steps
        // For example, check if the dialog is closed or a success message appears
        // Adjust the selector for success message as per your implementation
        const successMessage = await $('#successMessage');  // Assuming there's a success message after submission
        await successMessage.waitForDisplayed({ timeout: 20000 });
        expect(await successMessage.isDisplayed()).toBe(true);  // Verify that the success message is visible

        // Final wait to keep the test environment stable
        await browser.pause(60000);  // Final wait for stability before the test completes
    });

    it('should delete a random product successfully', async () => {
        // Step 1: Maximize the browser window
        await browser.maximizeWindow();

        // Step 2: Open the SAPUI5 application URL
        await browser.url('http://localhost:8080/index.html#/main');

        // Step 3: Wait for the page to load (extended wait time)
        await browser.pause(30000);  // Wait for page to load completely

        // Step 4: Verify the title of the page
        const title = await browser.getTitle();
        console.log('Page Title:', title);
        expect(title).toContain('SAP');  // Adjust based on your actual title

        // Step 5: Find all delete buttons
        const deleteButtons = await $$('.deleteButton');
        const randomIndex = Math.floor(Math.random() * deleteButtons.length);
        const randomDeleteButton = deleteButtons[randomIndex];

        // Step 6: Click the random delete button
        await randomDeleteButton.waitForClickable({ timeout: 20000 });  // Increased wait time
        await randomDeleteButton.click();

        // Step 7: Confirm the deletion if a confirmation dialog appears
        const confirmButton = await $('button=Yes');  // Assuming a confirmation dialog with a "Yes" button
        await confirmButton.waitForClickable({ timeout: 20000 });  // Increased wait time
        await confirmButton.click();

        // Step 8: Verify that the product is deleted
        const deletedProduct = await $('//*[text()="Advanced Smart Gadget"]');  // Adjust based on the product name
        const isDeleted = await deletedProduct.isExisting();
        expect(isDeleted).toBe(false);  // Verify that the product is no longer in the list

        // Final wait to keep the test environment stable
        await browser.pause(60000);  // Final wait for stability before the test completes
    });
});