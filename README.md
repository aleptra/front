# Front (Experimental)

<img src="https://3el.github.io/front/assets/img/icon_black.svg" width="100">

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
A file watcher is recommended to be present and installed as extension.
The file watcher must run the command ```make``` so that source CSS can be rebuild.

#### File Watcher (settings.json)
```
{
    "filewatcher.commands" : [
        {
            "match": "\\.css*",
            "isAsync": true,
            "cmd": "echo '${file} file content Changed'; cd ${workspaceRoot} && make",
            "event": "onFileChange"
        }
    ]
}
```
[0]:https://3el.github.io/front
[1]:https://code.visualstudio.com
[2]:https://marketplace.visualstudio.com/items?itemName=appulate.filewatcher
