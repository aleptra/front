[![Integration tests](https://github.com/aleptra/front/actions/workflows/main.yml/badge.svg)](https://github.com/aleptra/front/actions/workflows/main.yml)
# Front (Experimental)
## Powered by JavaScript ES5

<img src="https://www.front.nu/assets/img/icon_black.svg" width="100">

## [Explore documentation][0]

## Browser support

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_32x32.png"><br>Firefox | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_32x32.png"><br>IExplorer | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_32x32.png"><br>Chrome | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_32x32.png"><br>Edge | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_32x32.png"><br>Safari | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_32x32.png"><br>iOS Safari |
| --------- | --------- | --------- | --------- | --------- | --------- |
| Yes | 10 & 11 | Yes | Yes | Yes | Yes

## Development Environment
### Requirements
- [x] Visual Studio Code
- [x] File Watcher for VS Code

### IDE
Visual Studio Code is recommended for this project.

### Watcher
A file watcher is recommended to be present and installed as an extension and the file watcher must run the command ```make``` for the CSS to be rebuilt.

#### File Watcher (settings.json)
```
{
    "filewatcher.commands" : [
        {
            "match": "\\.css*",
            "isAsync": true,
            "cmd": "echo '${file} file content Changed'; cd ${workspaceRoot} && make",
            "event": "onFileChange"
        },
        {
            "match": "\\.js*",
            "isAsync": true,
            "cmd": "echo '${file} file content Changed'; cd ${workspaceRoot} && make",
            "event": "onFileChange"
        }
    ]
}
```
#### CLI
make serve
make compress
make watch

[0]:https://www.front.nu
[1]:https://code.visualstudio.com
[2]:https://marketplace.visualstudio.com/items?itemName=appulate.filewatcher
