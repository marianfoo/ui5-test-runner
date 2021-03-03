# UI5 Test runner

## Parameters

| name | default | description |
|---|---|---|
| cwd | `process.cwd()` | Current working directory |
| port | `0` | port to use (`0` to let REserve allocate one) |
| ui5 | `'https://ui5.sap.com/1.87.0'` | UI5 url |
| cache | `''` | Cache UI5 resources locally in the given folder *(empty to disable)* |
| webapp | `'webapp'` | base folder of the web application *(relative to `cwd`)* |
| keepAlive | `false` | Keeps the server alive *(enables debugging)* |
| logServer | `false` | Logs REserve traces |
| command | `'node'` | Browser instanciation command |
| args | *String, see description* | Browser instanciation arguments.<ul> <li>`'$url'` is replaced with the URL to open</li><li>`'$id'` is replaced with the browser id</li></ul> By default, use chromium through puppetteer. |
| parallel | `2` | Number of parallel tests executions (`0` to ignore tests) |
| coverage | `true` | Enables code coverage |
| covTempDir | `'.nyc_output'` | Directory to output raw coverage information to *(relative to `cwd`)* |
| covReportDir | `'coverage'` | Where to put the coverage report files *(relative to `cwd`)* |
