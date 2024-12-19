import { browser, $$, $ } from '@wdio/globals';

describe('UI5 SAP Application', () => {
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

        // Final wait to keep the test environment stable
        await browser.pause(10000);  // Final wait for stability before the test completes
    });
    it('should click the "View Chart" button, navigate to the chart page, and return to the main page', async () => {
        // Step 1: Maximize the browser window
        await browser.maximizeWindow();
    await browser.url('http://localhost:8080/index.html#/main');

    // Step 3: Wait for the page to load (extended wait time)
    await browser.pause(30000);  // Wait for page to load completely

   

    // Step 5: Find and click the "View Chart" button
    const viewChartButton = await $('button=View Chart');
    await viewChartButton.waitForClickable({ timeout: 20000 });  // Increased wait time
    await viewChartButton.click();

    // Step 6: Wait for the chart page to load (adjust the selector as needed)
    const chartPage = await $('div.chartPage');  // Adjust the selector based on your implementation
    await chartPage.waitForDisplayed({ timeout: 20000 });  // Increased timeout to ensure the page is visible

 
    // Step 8: Wait for a minute on the chart page
    await browser.pause(60000);  // Wait for a minute

    // Step 9: Navigate back to the main page
    await browser.back();
    await browser.pause(60000);  // Wait for a minute to ensure the main page is loaded

    // Verify that the main page is displayed
    const mainPageTitle = await browser.getTitle();
    expect(mainPageTitle).toContain('SAP');  // Adjust based on your actual title

    // Final wait to keep the test environment stable
    await browser.pause(10000);  // Final wait for stability before the test completes
});
});