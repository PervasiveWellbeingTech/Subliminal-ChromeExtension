# Breathing Edges Chrome Extension

Google Chrome extension that regulates breathing through entrainment. When activated, the edges of the browser change color and expand/contract at an interval that mimicks a human breath. The user can customize the color, opacity, and interval rate of the tool. 

Adaptive mode allows the tool to pair with a sensor via bluetooth to turn on or off when certain biological measurement thresholds are met. The repository for the website that allows adaptive mode can be found [here.](https://github.com/PervasiveWellbeingTech/Subliminal-ChromeExtension-BTHubWebsite)

For research purposes, we log the interactions that users have with the extension. The code for the server that allows for logging can be found [here.](https://github.com/PervasiveWellbeingTech/Subliminal-ChromeExtension-ServerLogger)

[Screenshot of Breathing Edges extension]

## Getting Started

The extension is available for download on the Google Chrome store through the following [link](https://chrome.google.com/webstore/detail/breathing-edges/bfdgeibniodkfndpedigokbjkffoaboc?fbclid=IwAR2xAAuKU682uMxKVfOiMegXmB47ibh72AprPQ61DGwR8LritvmorKvHkD0)

For development purposes, you can clone this repository to your local machine, make changes, and then follow the instructions on the official [Google Chrome Extension documentation site](https://developer.chrome.com/extensions/getstarted) to test in your browser:
1. Go to <chrome://extensions/>
2. Click on "load unpacked" and select folder with scripts
3. The extension will be downloaded to the browser

## Prerequisites

- Google Chrome

This project requires an updated version of the Google Chrome browser. You can download and install it by following the instructions in this [link](https://support.google.com/chrome/answer/95346?co=GENIE.Platform%3DDesktop&hl=en)

## Authors

Developed under the [**Pervasive Wellbeing Technology Lab**](http://med.stanford.edu/pervasivewellbeingtech.html)
* **Jonathan Burkle** - *Initial setup and development*
* **Marco Mora-Mendoza** - *Bluetooth link and hub; Server logging; Bug fixes*
