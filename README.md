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

#### Stable (v1.0.0)

```html
<script src="https://cdn.front.nu/1.0.0/front.js"></script>
```

_(Also available: `front.min.js`)_

#### Development (latest)

> ⚠️ **Development** — The latest changes. May be unstable.

```html
<script src="https://cdn.front.nu/nightly/front.js"></script>
```

_(Also available: `front.min.js`)_

### Download Locally

- [Stable (v1.0.0)](/1.0.0/front.js)
- [Development (latest)](/nightly/front.js)

## Documentation

Visit [front.nu/documentation](https://www.front.nu/documentation) for guides, API reference, and examples.

## Testing

Run the complete test suite:

```sh
make test
```

This runs the unit, integration, and performance test suites. You can run an individual suite with:

```sh
make test:unit
make test:integration
make test:performance
```

For example, run one specific test from each suite:

```sh
make test:unit TEST=app.call
make test:integration TEST=bottom
make test:performance TEST=core.dom
```

> ⚠️ The test commands require Python 3 and Google Chrome or Chromium for headless execution.

## License

[MIT](https://github.com/aleptra/front/blob/master/LICENSE)
