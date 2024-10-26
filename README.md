# Drive Access History Extension

This Chrome extension displays your recent Google Drive access history in a popup, allowing you to quickly find and open recently accessed files.

[Chrome Web Store](https://chromewebstore.google.com/detail/google-drive-recent-files/opblkpgckdpdnlckcjbkphbffhkjfflm)
![](images/image.png)

## Features

* Displays a list of recently accessed Google Drive files.
* Filter files by type (Docs, Sheets, Slides, Forms, Folders, and All).
* Search for files by name.
* Opens the selected file in a new tab.
* Uses SVG spritesheet for efficient icon loading and rendering.


## Installation

1. Download the extension files.
2. Open Chrome and go to `chrome://extensions`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the extension directory.


## Usage

1. Click the extension icon in the toolbar.
2. A popup will appear with a list of your recent Google Drive access history.
3. Click on a file to open it in a new tab.
4. Use the tabs to filter files by type.
5. Use the search bar to search for files by name.


## Technologies Used

* HTML
* CSS
* JavaScript
* SVG

## Git Hooks

This project uses Git hooks to automate tasks during development. 
To use the Git hooks in this project, run the following command:
```bash
git config --local core.hooksPath .githooks
chmod +x .githooks/pre-commit
```
This will configure Git to use the hooks in the .githooks directory.
The pre-commit hook is used to automatically compress the extension directory into a zip file before each commit. This ensures that the extension is always ready to be packaged and distributed.


## Contributing

Contributions are welcome! Please feel free to submit bug reports, feature requests, or pull requests.


## License

This project is licensed under the MIT License.