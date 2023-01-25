# UI5 Test runner

[![Node.js CI](https://github.com/ArnaudBuchholz/ui5-test-runner/actions/workflows/node.js.yml/badge.svg)](https://github.com/ArnaudBuchholz/ui5-test-runner/actions/workflows/node.js.yml)
[![Package Quality](https://npm.packagequality.com/shield/ui5-test-runner.svg)](https://packagequality.com/#?package=ui5-test-runner)
[![Known Vulnerabilities](https://snyk.io/test/github/ArnaudBuchholz/ui5-test-runner/badge.svg?targetFile=package.json)](https://snyk.io/test/github/ArnaudBuchholz/ui5-test-runner?targetFile=package.json)
[![ui5-test-runner](https://badge.fury.io/js/ui5-test-runner.svg)](https://www.npmjs.org/package/ui5-test-runner)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FArnaudBuchholz%2Fui5-test-runner.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FArnaudBuchholz%2Fui5-test-runner?ref=badge_shield)
[![Documentation](https://img.shields.io/badge/-📚documentation-blueviolet)](https://github.com/ArnaudBuchholz/ui5-test-runner/tree/master/doc/README.md)


A self-sufficient test runner for UI5 applications enabling parallel execution of tests.

> To put it in a nutshell, some applications have so many tests that when you run them in a browser, it ends up **crashing**. The main reason is **memory consumption** : the browser process goes up to 2 GB and it blows up. JavaScript is using garbage collecting but it needs time to operate and the stress caused by executing the tests does not let enough bandwidth for the browser to free up the memory.

> This tool is designed and built as a **substitute** of the [UI5 karma runner](https://github.com/SAP/karma-ui5). It executes all the tests in **parallel** thanks to several browser instances *(which also **reduces the total execution time**)*.

## 📚 Documentation

* Initial concept is detailed in the  article [REserve - Testing UI5](https://arnaud-buchholz.medium.com/reserve-testing-ui5-85187d5eb7f1)
* Tool was presented during UI5Con'21 : [A different approach to UI5 tests execution](https://youtu.be/EBp0bdIqu4s)
* Up-to-date documentation : [README](https://github.com/ArnaudBuchholz/ui5-test-runner/tree/master/doc/README.md)

## 💿 How to install

* Install the [LTS version of Node.js](https://nodejs.org/en/download/)
* `npm install -g ui5-test-runner`

**NOTE** : additional packages might be needed when running (`puppeteer`, `selenium-webdriver`, `nyc`...), they are installed **globally** if missing. They can be installed and used **locally** within your project.

## 🖥️ How to demo

* Clone the project [training-ui5con18-opa](https://github.com/ArnaudBuchholz/training-ui5con18-opa) and run `npm install`
* Use `npm run karma` to test with the karma runner
* *Hosting the application (a.k.a. legacy mode)*
  * `ui5-test-runner --port 8081 --ui5 https://ui5.sap.com/1.109.0/ --cache .ui5 --keep-alive`
  * Follow the progress of the test executions using http://localhost:8081/_/progress.html
  * When the tests are completed, check the code coverage with http://localhost:8081/_/coverage/lcov-report/index.html
* *Running the application with `@ui5/cli`*
  * Use `npm start` to serve the application with `@ui5/cli`
  * `ui5-test-runner --port 8081 --url http://localhost:8080/test/testsuite.qunit.html --keep-alive`
  * Follow the progress of the test executions using http://localhost:8081/_/progress.html


## ⚖️ License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FArnaudBuchholz%2Fui5-test-runner.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FArnaudBuchholz%2Fui5-test-runner?ref=badge_large)

## ⚠️ Breaking change

### From `1.x.y` to `2.y.z`

* Command line **syntax** has changed *(as well as configuration file structure)*
* Dependencies are installed **on demand**
* Browser instantiation command evolved in an **incompatible way** (see [documentation](https://github.com/ArnaudBuchholz/ui5-test-runner/tree/master/doc/browser.md)).
* Output is different (report, traces)
