import { join } from 'path';

export const config = {
  runner: 'local',
  specs: [join(__dirname, './test/**/*.e2e.ts')],  // Adjust path to your spec files
  exclude: [],
  maxInstances: 10,

  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: ['--no-sandbox', '--window-size=1920,1080', '--disable-gpu'],
      },
    },
  ],

  logLevel: 'info',
  baseUrl: 'http://localhost:8080/index.html#/',
  waitforTimeout: 60000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  services: ['chromedriver'],  // Ensure chromedriver service is installed

  framework: 'mocha',
  reporters: ['spec'],  // Add the spec reporter here
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },

  before: async () => {
    await browser.url('http://localhost:8080/index.html#/');
  },
};