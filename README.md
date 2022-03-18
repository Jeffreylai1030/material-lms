![APM](https://img.shields.io/apm/l/vim-mode)

# Library Management System

It only for demo and learning purpose.

## Demo

You can play around with the demo [here](https://lms-20190117.web.app/).

## Installation

* Install the latest npm package or node.js.
* Run `npm i` to install all packages.

## Development server

Run `ng serve` or `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Generate new component

Run `ng generate component views/{component-name}` to generate a new component.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Deploy to firebase manually

1. Run `ng build` to build the project
2. Run `npm install -g firebase-tools` to install firebase tool
3. Run `firebase login` and login using your gmail account
4. Run `firebase init` to init firebase project. If fail to access, run `firebase logout` and `firebase login`.
5. Run `firebase deploy`

## Deploy to firebase automatically

You can integrate deploys to Firebase Hosting via a GitHub Action. After commit and merger the code to `main` branch, it will automatic proceed and deploy to [demo](https://lms-20190117.web.app/) website.

* If you've __NOT__ set up Hosting, run this version of the command from the root of your local directory:

```
firebase init hosting
```

* If you've __ALREADY__ set up Hosting, then you just need to set up the GitHub Action part of Hosting. Run this version of the command from the root of your local directory:

```
firebase init hosting:github
```

* Follow the CLI prompts, and the command will automatically take care of setting up the GitHub Action.
