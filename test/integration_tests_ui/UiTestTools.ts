import net from 'net';
import { Browser, Builder, WebDriver } from 'selenium-webdriver';

export async function checkPortAvailable(port: number, host: string, maxTime = 5): Promise<boolean> {
  let attempts = 0;
  while (attempts < maxTime) {
    try {
      const client = new net.Socket();
      await new Promise<void>((resolve, reject) => {
        client.once('connect', () => {
          client.destroy();
          resolve();
        });

        client.once('error', (error) => {
          reject(error);
        });

        client.connect(port, host);
      });
      return true;
    } catch (error) {
      attempts++;
      await new Promise<void>((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
    }
  }
  return false;
}

export async function setDriver(controlServer: string, controlServerPort: number, maxTime = 5): Promise<WebDriver> {
  let browser = process.env.BROWSER;
  switch (browser) {
    case 'chrome':
      browser = Browser.CHROME;
      break;
    case 'firefox':
      browser = Browser.FIREFOX;
      break;
    default:
      browser = Browser.CHROME;
  }

  let attempts = 0;
  while (attempts < maxTime) {
    try {
      const driver = await new Builder()
        .usingServer(`http://${controlServer}:${controlServerPort}/`)
        .forBrowser(browser)
        .build();
      return driver;
    } catch (error) {
      attempts++;
      await new Promise<void>((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
    }
  }
  throw new Error('Failed to set the driver.');
}

export async function checkWebSiteAvailable(
  driver: WebDriver,
  url: string,
  maxTime = 5,
  logProgress = false,
): Promise<void> {
  let attempts = 0;
  while (attempts < maxTime) {
    try {
      console.log(`Checking ${url} #${attempts} ...`);
      await driver.get(url);
      console.log(`Webpage ${url} is now available!`);
      return;
    } catch (error) {
      if (logProgress) {
        console.log('Error: ', error as Error);
      }
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  console.log(`Webpage ${url} is not available!`);
}
