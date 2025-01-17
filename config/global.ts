import { get, max, min } from 'lodash'
import { getInfos, updateStatus } from '../src/utils/browserstack'
import { screenshotOnFail } from '../src/utils/screenshots'
import reporter from '../src/utils/reporter'
import { FgMagenta, log } from '../src/utils/console'
import { NightwatchTestFunctions } from '../src/types/nightwatch'

const globals: NightwatchTestFunctions = {
  asyncHookTimeout: 60000,
  customReporterCallbackTimeout: 60000,
  reporter : async function (results, done) {
    await reporter(this, results)
    done()
  },
  beforeEach: async function (browser, done) {
    browser.globals.deviceName = get(browser, 'options.deviceName') || 'local'
    const deviceSize = get(browser, 'options.desiredCapabilities.resolution')
    if (deviceSize) {
      const realSize = deviceSize.split('x').map(size => Number(size.replace('x', '')))
      await new Promise(resolve => browser.resizeWindow(max(realSize), min(realSize), resolve))
    }
    log(`${FgMagenta}Running on ${browser.globals.deviceName} 🖥\n`)
    done()
  },
  afterEach: async function (browser, done) {
    browser.globals.sessionid = get(browser, 'capabilities[\'webdriver.remote.sessionid\']') || get(browser, 'sessionId')
    await getInfos(browser)
    await screenshotOnFail(browser)
    await updateStatus(browser)
    browser.end()
    done()
  },
}

module.exports = globals
