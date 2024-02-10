import { v2 as compose } from 'docker-compose';
import fs from 'fs';
import { describe } from 'mocha';
import path from 'path';
import { By, WebDriver, until } from 'selenium-webdriver';
import { checkPortAvailable, checkWebSiteAvailable, setDriver } from './integration_tests_ui/UiTestTools';

const shutUpDownTimeout = 600000; // 10 minutes
const stdTestTimeout = 60000; // 1 minute

const controlServer = 'localhost';
const controlServerPort = 4444;

const screenShotDir = './test/integration_tests_ui/screenshots/';
fs.mkdir(screenShotDir, { recursive: true }, (err) => {
  if (err) throw err;
});

let driver: WebDriver; // To save resources always use just one WebDriver instance

const config: compose.IDockerComposeOptions = {
  cwd: path.join(__dirname),
  config: '../docker/dev-server_ui_tests/dev-server_and_selenium-grid.yml',
  log: true,
};

describe('UI Tests', function () {
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

    console.log('(-) Waiting for the server to be available ...');
    console.log('(1) Checking availabiliy of control server ...');
    await checkPortAvailable(controlServerPort, controlServer, 30);
    console.log('(2) Setting driver ...');
    driver = await setDriver(controlServer, controlServerPort, 60);
    console.log('(3) Checking availabiliy of the web site ...');
    await checkWebSiteAvailable(driver, 'http://iobroker-dev-server:8081', shutUpDownTimeout / 1000);
    console.log('The server is now available!');
    await driver.quit();
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
    driver = await setDriver(controlServer, controlServerPort);
  });

  afterEach(async function () {
    console.log('Taking screenshot of the result ...');
    const screenShotName = `${screenShotDir}/after_${this.currentTest?.title}.png`;
    await driver.takeScreenshot().then(function (image) {
      fs.writeFileSync(screenShotName, image, 'base64');
    });

    // Close the browser
    await driver.quit();
  });

  it('should open the app and check the title', async () => {
    // Open the app
    await driver.get('http://iobroker-dev-server:8081');
    await driver.wait(until.elementLocated(By.xpath('/html')), 20000);
    // Check the title
    const title = await driver.getTitle();
    console.log('Title: ', title);

    /*
    <h2 class="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root css-ohyacs" id=":re:">You have unread news!</h2>
    <button class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium css-1vannuk" tabindex="0" type="button"><span class="MuiButton-startIcon MuiButton-iconSizeMedium css-6xugel"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CheckIcon"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path></svg></span>Acknowledge<span class="MuiTouchRipple-root css-w0pj6f"></span></button>
    <div style="cursor: move; opacity: 1;" draggable="true" data-handler-id="T18"><a type="box" href="/#tab-gjsm-0" style="cursor: move; opacity: 1; color: inherit; text-decoration: none;" data-handler-id="T18"><div style="display: flex; align-items: center;"><div class="MuiButtonBase-root MuiListItemButton-root MuiListItemButton-gutters MuiListItemButton-root MuiListItemButton-gutters css-1gqh6g9" tabindex="0" role="button"><div class="MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-1 iob40 css-11hlwqc" aria-label=""><div class="MuiGrid-root MuiGrid-item css-1wxaqej"><div class="MuiListItemIcon-root css-5n5rd1" style="min-width: 0px;"><span class="MuiBadge-root css-1rzb3uu"><img class="iob19 iconOwn" src="adapter/gjsm/gjsm.png" alt=""><span class="MuiBadge-badge MuiBadge-standard MuiBadge-invisible MuiBadge-anchorOriginTopRight MuiBadge-anchorOriginTopRightRectangular MuiBadge-overlapRectangular MuiBadge-colorPrimary css-aava0t">0</span></span></div></div><div class="MuiGrid-root MuiGrid-item css-1wxaqej"><div class="MuiListItemText-root css-1tsvksn"><span class="MuiTypography-root MuiTypography-body1 MuiListItemText-primary css-yb0lig"><span class="MuiBadge-root css-1rzb3uu">GJSM<span class="MuiBadge-badge MuiBadge-standard MuiBadge-invisible MuiBadge-anchorOriginTopRight MuiBadge-anchorOriginTopRightRectangular MuiBadge-overlapRectangular MuiBadge-colorPrimary css-aava0t">0</span></span></span></div></div></div><span class="MuiTouchRipple-root css-w0pj6f"></span></div></div></a></div>
     */
  });
});
