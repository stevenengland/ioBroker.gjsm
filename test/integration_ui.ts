import { v2 as compose } from 'docker-compose';
import { describe } from 'mocha';
import path from 'path';
import { Browser, Builder, By, WebDriver, until } from 'selenium-webdriver';

const shutUpDownTimeout = 600000; // 10 minutes
const stdTestTimeout = 60000; // 1 minute

describe('UI Tests', function () {
  let driver: WebDriver;
  const config: compose.IDockerComposeOptions = {
    cwd: path.join(__dirname),
    config: '../docker/dev-server_ui_tests/dev-server_and_selenium-grid.yml',
    log: true,
  };

  this.timeout(stdTestTimeout);

  before(async function () {
    this.timeout(shutUpDownTimeout);

    // setup docker
    console.log('Docker containers are about to start...');
    const upResult = await compose.upAll(config);
    console.log('Starting result:');
    console.log('Exit Code: ', upResult.exitCode);
    console.log('Out: ', upResult.out);
    console.log('Err: ', upResult.err);

    console.log('Waiting for the server to be available ...');
    await checkWebSiteAvailable('http://localhost:8081', shutUpDownTimeout / 1000);
  });

  after(async function () {
    this.timeout(shutUpDownTimeout);

    console.log('Docker containers are about to shut down...');
    const downResult = await compose.down(config);
    console.log('Shutdown result:');
    console.log('Exit Code: ', downResult.exitCode);
    console.log('Out: ', downResult.out);
    console.log('Err: ', downResult.err);
  });

  beforeEach(async () => {
    // setup browser
    let browser = process.env.BROWSER;
    switch (browser) {
      case 'chrome':
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        browser = Browser.CHROME;
        break;
      case 'firefox':
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        browser = Browser.FIREFOX;
        break;
      // case 'edge':
      //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      //   browser = Browser.EDGE;
      //   break;
      default:
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        browser = Browser.CHROME;
    }

    await setDriver(browser);
  });

  async function setDriver(browser: string): Promise<void> {
    const server = 'http://localhost:4444/';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    driver = await new Builder().usingServer(server).forBrowser(browser).build();
  }

  async function checkWebSiteAvailable(url: string, maxTime = 5): Promise<void> {
    let attempts = 0;
    while (attempts < maxTime) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          console.log(`Webpage ${url} is available!`);
          return;
        }
      } catch (error) {}
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    console.log(`Webpage ${url} is not available!`);
  }

  afterEach(async () => {
    // close browser
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (driver) {
      // Take a screenshot of the result page
      // [..]

      // Close the browser
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await driver.quit();
    }
  });

  it('should open the app and check the title', async () => {
    // Open the app
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await driver.get('http://iobroker-dev-server:8081');
    await driver.wait(until.elementLocated(By.xpath('/html')), 20000);
    // Check the title
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const title = await driver.getTitle();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log('Title: ', title);
  });
});
