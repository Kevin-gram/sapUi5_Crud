import { browser, $ } from '@wdio/globals';

describe('UI5 sap Application', () => {
    it('should open application and verify title', async () => {
        await browser.maximizeWindow();
        await browser.url('http://localhost:8080/index.html#/main');
        await browser.pause(60000)
    });
});