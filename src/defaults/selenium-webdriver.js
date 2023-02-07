'use strict'

const { readFile, writeFile } = require('fs/promises')
const { join } = require('path')
const { Command } = require('commander')
const { boolean, integer } = require('../options')
const { buildCsvWriter } = require('../csv-writer')
const { InvalidArgumentError } = require('commander')

const browserMappings = {
  chrome: {
    browser: 'chrome',
    setOptions: 'setChromeOptions',
    subModule: 'chrome'
  }
}

function browser (value, defaultValue) {
  if (value === undefined) {
    return defaultValue
  }
  if (browserMappings[value] === undefined) {
    throw new InvalidArgumentError('Browser name')
  }
}

const command = new Command()
command
  .name('ui5-test-runner/@/selenium-webdriver')
  .description('Browser instantiation command for selenium-webdriver')
  .helpOption(false)
  .option('-b, --browser <name>', 'Browser', browser, 'chrome')
  .option('--visible [flag]', 'Show the browser', boolean, false)
  .option('-w, --viewport-width <width>', 'Viewport width', integer, 1920)
  .option('-h, --viewport-height <height>', 'Viewport height', integer, 1080)
  .option('-l, --language <lang...>', 'Language(s)', ['en-US'])

let consoleWriter = { ready: Promise.resolve() }
let networkWriter = { ready: Promise.resolve() }

let driver
let stopping = false

async function exit (code) {
  if (stopping) {
    return
  }
  stopping = true
  await Promise.all([consoleWriter.ready, networkWriter.ready])
  if (driver) {
    try {
      await driver.quit()
    } catch (e) {
      // ignore
    }
  }
  process.exit(code)
}

process.on('message', async message => {
  const { command } = message
  try {
    if (command === 'stop') {
      await exit(0)
    } else if (command === 'screenshot') {
      if (driver) {
        const data = await driver.takeScreenshot()
        await writeFile(message.filename, data.replace(/^data:image\/png;base64,/, ''), {
          encoding: 'base64'
        })
        process.send(message)
      } else {
        throw new Error('screenshot command received but page not ready')
      }
    }
  } catch (e) {
    console.error(e)
    exit(-2)
  }
})

async function main () {
  if (process.argv.length !== 3) {
    command.outputHelp()
    return exit(0)
  }

  const settings = JSON.parse((await readFile(process.argv[2])).toString())
  command.parse(settings.args, { from: 'user' })
  const options = command.opts()
  const { browser, setOptions, subModule } = browserMappings[options.browser]

  if (settings.capabilities && !settings.modules) {
    await writeFile(settings.capabilities, JSON.stringify({
      modules: ['selenium-webdriver'],
      screenshot: '.png',
      traces: ['console', 'network'],
      'probe-with-modules': true
    }))
    return exit(0)
  }

  const { Builder, logging } = require(settings.modules['selenium-webdriver'])
  const { Options: BrowserOptions } = require(join(settings.modules['selenium-webdriver'], subModule))

  const browserOptions = new BrowserOptions()
  browserOptions.excludeSwitches('enable-logging')
  if (!options.visible) {
    browserOptions.addArguments('headless')
  }

  logging.getLogger().setLevel(logging.Level.ALL)
  logging.getLogger(logging.Type.BROWSER).setLevel(logging.Level.ALL)
  logging.installConsoleHandler(entry => {
    console.log(entry)
  })

  const prefs = new logging.Preferences()
  prefs.setLevel(logging.Type.BROWSER, logging.Level.DEBUG)
  browserOptions.setLoggingPrefs(prefs)

  driver = await new Builder()
    .forBrowser(browser)
    [setOptions](browserOptions)
    .build()

  if (settings.capabilities) {
    await writeFile(settings.capabilities, JSON.stringify({
      modules: ['selenium-webdriver'],
      screenshot: '.png',
      scripts: true,
      traces: ['console', 'network']
    }))
    process.exit(0)
  }
  
  const { url, scripts } = settings

  if (scripts && scripts.length) {
    for await (const script of scripts) {
      await driver.sendDevToolsCommand('Page.addScriptToEvaluateOnNewDocument', { source: script })
    }
  }

  await driver.get(url)
}

main().catch(async error => {
  if (error.name === 'SessionNotCreatedError') {
    console.error(error.message)
  } else {
    console.error(error)
  }
  console.error('Please check https://www.npmjs.com/package/selenium-webdriver#installation for browser driver')
  try {
    await driver.quit()
  } catch (e) {
    // ignore
  }
  process.exit(-1)
})
