# project-engage

Project Engage

# Brief Overview
This project bridges the gap between a student's application to different Spark roles, and Spark's staff workflow in reviewing applications. The problem at hand is that applicants do not have a user friendly and easy to navigate system to apply to positions, the same can be said for the Spark! staff regarding the reviewing of applications.

Goal: This project has the potential to bring the website to fruition and become easy-to-navigate for both the students applying and admin receiving and reviewing the applications.

Pull Requests Submitted by the Spark! Applicant Student Portal Group (Fall 2022 CS519):
- Export CSV
- Update README.md with bugs and overview of the Project
- Expand button error 
- Add comments to illustrate where the bug is and how we plan to fix it 

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

## Quick overview of existing different bugs:
Double Login Bug- Upon initial login, when logging in as a student, the user would be pushed back to the homepage after logging in, and would be prompted to login again.
Trello link: https://trello.com/c/TL3PCAQz

Expand button bug- Profile now matches the user when the application expand button is clicked and the profile closes when the expand button is double-clicked or when there is no application open
Trello link: https://trello.com/c/GPWIkhRA , https://trello.com/c/TL3PCAQz

Resume opening bug- Bug in which an admin sees a corrupted file in place of user's resume when viewing student's profile. Bug couldn't be reproduced. 
Trello link: https://trello.com/c/xRw1nym1
