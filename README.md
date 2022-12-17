# project-engage

Project Engage

To add yourself to the repository, open a PR modifying `COLLABORATORS`, entering your GitHub username in a newline.

[![Actions Status](https://github.com/BU-Spark/project-engage/workflows/Build/badge.svg)](https://github.com/BU-Spark/project-engage/actions)
[![License](http://img.shields.io/badge/License-MIT-brightgreen.svg)](./LICENSE)

## Project setup

```bash
npm install
```

### Compiles and hot-reloads for development

```bash
npm run serve
```

### Compiles and minifies for production

```bash
npm run build
```

### Lints and fixes files

```bash
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Calling Firebase functions

With an authenticated @firebase/app object,

```javascript
firebase.functions().httpsCallable("name-of-function")(input_data).then(data => {...})
```

For more info on the types of functions, visit the official [Firebase Documentation](https://firebase.google.com/docs/functions).

## Making a Firestore transaction

With an authenticated @firebase/app object,

```javascript
import { db } from "../firebase/init";
db.collection("name-of-collection").doc("doc-identifier").action().then(data => {...})
```

For more info on actions that can be performed, visit the official [Firebase Documentation](https://firebase.google.com/docs/firestore).

## Installing firebase emulator and importing data
```bash
npm install -g firebase-tools
firebase login
firebase projects:list
firebase use spark-project-engage
```

Next export data from Cloud Firestore.
Unzip file and put folder into local machine.
- I named the folder "DevData" and put it in the root directory
- If you name it something else, make sure to put it into gitignore

To start the emulators run:
```bash
firebase emulators:start --import=./DevData
```
or run this shortcut:
```bash
npm run start-emulator
```

## Switching between staging and production

We have two projects on Firebase:

- `spark-project-engage`: Production environment.
- `spark-project-engage-staging`: Testing environment.

To see which one is active for Firebase CLI, run
```
$ firebase use
```

To switch between these two projects, run
```
$ firebase use <PROJECT_ID or ALIAS> 
```

**ALWAYS RUN `firebase use` FIRST** before deploying!

## Deployment

After running the buildscript, run the following command after installing the [Firebase CLI](https://firebase.google.com/docs/cli) to deploy the website as well as the functions.

```bash
firebase deploy
```

To deploy only functions,

```bash
firebase deploy --only functions
```

To deploy a specific function,

```bash
firebase deploy --only functions:(function name)
```

## User Flow Arch
![](/src/assets/userflow.png)

## Contributing

To contribute to Project Engage, view our [contribution guide](https://github.com/BU-Spark/project-engage/blob/master/CONTRIBUTING.md).

## Contributed

Azamat and John were able to implement functionality which would allow an administrator to download the student applications currently on screen, and represent them in CSV format. New dependencies were required, so they were placed in package.json.
