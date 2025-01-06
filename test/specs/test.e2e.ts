import { browser, $$, $ } from '@wdio/globals';

// describe('UI5 SAP Application - Delete Product', () => {
//     it('should delete a random product successfully', async () => {
//         // Step 1: Maximize the browser window
//         await browser.maximizeWindow();

//         // Step 2: Open the SAPUI5 application URL
//         await browser.url('http://localhost:8080/index.html#/main');

//         // Step 3: Wait for the page to load (extended wait time)
//         await browser.pause(20000);  // Wait for page to load completely

//         // Step 4: Verify the title of the page
//         const title = await browser.getTitle();
//         console.log('Page Title:', title);
//         expect(title).toContain('SAP');  // Adjust based on your actual title

//         // Step 5: Find all delete buttons
//         const deleteButtons = await $$('.deleteButton');
//         const randomIndex = Math.floor(Math.random() * deleteButtons.length);
//         const randomDeleteButton = deleteButtons[randomIndex];

//         // Step 6: Click the random delete button
//         await randomDeleteButton.waitForClickable({ timeout: 5000 });  // Increased wait time
//         await randomDeleteButton.click();
//     });
// });

// describe('UI5 SAP Application - View Chart', () => {
//     it('should click the "View Chart" button and navigate to the chart page', async () => {
//         // Step 1: Maximize the browser window
//         await browser.maximizeWindow();

//         // Step 2: Open the SAPUI5 application URL
//         await browser.url('http://localhost:8080/index.html#/main');

//         // Step 3: Wait for the page to load (extended wait time)
//         await browser.pause(5000);  // Wait for page to load completely

//         // Step 4: Find and click the "View Chart" button
//         const viewChartButton = await $('button=View Chart');
//         await viewChartButton.waitForClickable({ timeout: 10000 });
//         await viewChartButton.click();

//         // Step 5: Wait for a minute on the chart page
//         await browser.pause(20000);  // Wait for a minute
//     });
// });

// describe('UI5 SAP Application - Detail Columns', () => {
//     it('should navigate to the main page and then to the Detail columns page', async () => {
//         // Step 1: Maximize the browser window
//         await browser.maximizeWindow();

//         // Step 2: Open the SAPUI5 application URL
//         await browser.url('http://localhost:8080/index.html#/main');

//         // Step 3: Wait for the page to load (extended wait time)
//         await browser.pause(10000);  // Wait for page to load completely

//         // Step 4: Verify the title of the page
//         const title = await browser.getTitle();
//         console.log('Page Title:', title);
//         expect(title).toContain('SAP');  // Adjust based on your actual title

//         // Step 5: Find and click the "Detail Column" button
//         const detailColumnButton = await $('button=Detail Column');
//         await detailColumnButton.waitForClickable({ timeout: 10000 });  // Increased wait time
//         await detailColumnButton.click();

//         await browser.pause(20000)
//         // Step 8: Find and click the "Close" button to close the details column
//         const closeButton = await $('button=Close');
//         await closeButton.waitForClickable({ timeout: 10000 });
//         await closeButton.click();
//         // Final wait to keep the test environment stable
//         await browser.pause(10000);  // Final wait for stability before the test completes
//     });

// });
describe('UI5 SAP Application - Product Management', () => {
    it('should create a new product', async () => {
        await browser.maximizeWindow();
        await browser.url('http://localhost:8080/index.html#/main');
        await browser.pause(20000);

        const pageTitle = await browser.getTitle();
        console.log('Page Title:', pageTitle);

        const addButton = await $('button=Add Product');
        await addButton.waitForClickable({ timeout: 20000 });
        await addButton.click();

        const testProduct = {
            id: '13',
            name: 'ye',
            price: '100',
            rating: '5',
            releaseDate: '2025-01-16'
        };

        await $('input[name="ID"]').setValue(testProduct.id);
        await $('input[name="Name"]').setValue(testProduct.name);
        await $('input[name="Price"]').setValue(testProduct.price);
        await $('input[name="Rate"]').setValue(testProduct.rating);
        await $('input[name="Date"]').setValue(testProduct.releaseDate);

        const createButton = await $('button=Create');
        await createButton.waitForClickable({ timeout: 20000 });
        await createButton.click();

        // Add verification step
        await browser.pause(5000); // Wait for UI to update
        console.log('Product created successfully');
    });

    it('should edit an existing product and change its name to kasongo', async () => {
        await browser.maximizeWindow();
        await browser.url('http://localhost:8080/index.html#/main');
        await browser.pause(20000);
        // Wait for the list of products to be displayed (you can remove table check)
        const productRow = await $(`//div[@data-id="13"]`); // Assuming the product row has a unique ID or identifier
        await productRow.waitForDisplayed({ timeout: 20000 });

        const editButton = await productRow.$('button=Edit');
        await editButton.waitForClickable({ timeout: 20000 });
        await editButton.click();

        const updateDialog = await $('#updateDialog');
        await updateDialog.waitForDisplayed({ timeout: 20000 });

        // Change the product name to 'kasongo'
        await $('input[name="Name"]').setValue('kasongo');

        const saveButton = await $('button=Save');
        await saveButton.waitForClickable({ timeout: 20000 });
        await saveButton.click();

        // Add verification for the name update
        await browser.pause(5000); // Wait for UI to update

        const updatedNameElement = await productRow.$('.sapMText');
        const updatedNameText = await updatedNameElement.getText();
        
        if (updatedNameText === 'kasongo') {
            console.log('Product name updated successfully');
        } else {
            throw new Error('Product name was not updated successfully');
        }
    });
});
