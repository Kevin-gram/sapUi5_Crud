const { expect } = require('expect-webdriverio');

describe('My SAPUI5 application', () => {
    it('should have the right title', () => {
        browser.url('/'); 
        const currentUrl = browser.getUrl();
        console.log('Navigated to URL:', currentUrl); 
        const title = browser.getTitle();
        console.log('Page title:', title); 
        expect(title).toBe('SAPUI5 App'); 
    });

    it('should open the detail column when a product is clicked', () => {
        browser.url('/'); 
        const currentUrl = browser.getUrl();
        console.log('Navigated to URL:', currentUrl); 
        const product = $('selector-for-product'); 
        product.click();
        const detailColumn = $('selector-for-detail-column'); 
        expect(detailColumn).toBeDisplayed();
    });
});