# ovo

[![CircleCI](https://circleci.com/gh/psastras/ovo.svg?style=shield&circle-token=:circle-ci-badge-token)](https://circleci.com/gh/psastras/ovo/tree/master)
[![codecov](https://codecov.io/gh/psastras/ovo/branch/master/graph/badge.svg)](https://codecov.io/gh/psastras/ovo)

An alternate [Zipkin](http://zipkin.io/) UI.

![Screenshot](/screenshot.png "Screenshot")

## Running

### npm

The web server is available via the npm repository.

```
npm -i g @psastras/ovo
```

Note that this expects Zipkin to be running on `http://localhost:9411`.


### Node

To launch the server which will serve files out of `dist/`

```
node index.js
```

Note that this expects Zipkin to be running on `http://localhost:9411`.

### Docker

To quickly launch a demo the provided Docker compose file will launch both Zipkin and the UI.

```
docker-compose build
docker-compose up
```

## Development

The preferred way to install dependencies is [Yarn](https://github.com/yarnpkg/yarn).  This repo
includes a `yarn.lock` file to ensure dependencies are consistent on install.

```
npm i -g yarn
yarn install
```

For most development purposes running the `watch` command should be enough

```
yarn watch
```

The `watch` commands starts a webpack development server at
[http://127.0.0.1:8080](http://127.0.0.1:8080).  It also watches test files in the `test/` test
directory for changes and runs the changed tests as necessary.  When making changes to the source
code in `src/`, relavant tests will be run as well.

To manually run tests and generate a code coverage report (and lint the code),

```
yarn test
```

To build a production distribution (minified, etc.)

```
yarn build
```

The production build files will be located in `dist/`.

This project uses Selenium for integration tests.  Integration tests can be run using

```
yarn integrationtest
```