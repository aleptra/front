<p align="center">
  <img src="https://www.front.nu/assets/img/icon_black.svg" width="100">
</p>

<h1 align="center">Front</h1>

<p align="center">Powered by JavaScript ES5</p>

<p align="center">
  <a href="https://github.com/aleptra/front/actions/workflows/main.yml">
    <img src="https://github.com/aleptra/front/actions/workflows/main.yml/badge.svg" alt="Integration tests">
  </a>
</p>

## Installation

### CDN

#### Stable (v1.1.0)

```html
<script src="https://cdn.front.nu/1.1.0/front.js"></script>
```

_(Also available: `front.min.js`)_

#### Development (latest)

> ⚠️ **Development** — The latest changes. May be unstable.

```html
<script src="https://cdn.front.nu/nightly/front.js"></script>
```

_(Also available: `front.min.js`)_

### Download Locally

- [Stable (v1.1.0)](/1.1.0/front.js)
- [Development (latest)](/nightly/front.js)

## Documentation

Visit [front.nu/documentation](https://www.front.nu/documentation) for guides, API reference, and examples.

## Testing

> ⚠️ The test commands require Python 3 and Google Chrome or Chromium for headless execution.

Run the complete test suite:

```sh
make test
```

This runs the unit, integration, and performance test suites.

Run an individual test suite:

```sh
make test:unit
make test:integration
make test:performance
```

Run a specific test from each suite:

```sh
make test:unit TEST=app.call
make test:integration TEST=bottom
make test:performance TEST=core.dom
```

Run the minified runtime test suite:

```sh
make test:minify
```

## Edge Deployment

Build and deploy the latest edge version:

```sh
make latest
```

This runs the test suite, updates the build number, synchronizes the runtime to the edge distribution, generates the minified file, and commits and pushes the deployment after confirmation.

> ⚠️ This command is for project maintainers or release managers only. Review your working tree before running it; it commits and pushes changes automatically.

## Official Release

Create and publish an official versioned release:

```sh
make release
```

The command runs the test suite, prepares the versioned runtime and minified file, updates the README, commits and pushes the release, creates a Git tag and archive, and publishes a GitHub release. It requires the GitHub CLI with an authenticated account and asks for confirmation before preparing and publishing the release.

> ⚠️ This command is for project maintainers or release managers only. Review your working tree before running it; it commits and pushes changes automatically.

## License

[MIT](https://github.com/aleptra/front/blob/master/LICENSE)
