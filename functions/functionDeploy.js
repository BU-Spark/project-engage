// Firebase Batch Functions Deploy (Alisson Enz)

// This script helps firebase users deploy their functions when they have more than 60 functions and
// it's not allowed to deploy all using `firebase deploy --only functions` due deployment quota.
// This script will get your functions export from index.js and deploy in batches of 30 and wait 30 seconds.
// This script will NOT delete your function when removed from index.js.

// Instructions
// 0. This instructions suppose that you already have firebase-tools installed and is logged to your account;
// 1. Install `shelljs` (npm install -g shelljs);
// 2. Change the path to point to your index.js at line 16;
// 3. run `yarn ./functionsDeploy` to deploy your functions;

const shell = require("shelljs");

const myFunctions = require("./index"); // Change here

if (!shell.which("firebase")) {
  shell.echo("Sorry, this script requires firebase");
  shell.exit(1);
}

const execShellCommand = cmd => {
  return new Promise(resolve => {
    shell.exec(cmd, (error, stdout, stderr) => {
      if (error) console.warn(error);
      resolve(stdout ? stdout : stderr);
    });
  });
};

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

let count = 0;
let batchesCount = 0;
let batches = [];
const LIMIT = 30;

batches[batchesCount] = "firebase deploy --only";

Object.keys(myFunctions).forEach(f => {
  if (count === 0) {
    batches[batchesCount] += ` functions:${f}`;
    count += 1;
  } else if (count < LIMIT) {
    batches[batchesCount] += `,functions:${f}`;
    count += 1;
  } else {
    count = 1;
    batchesCount += 1;
    batches[batchesCount] = `firebase deploy --only functions:${f}`;
  }
});

console.log("\nTotal: ", Object.keys(myFunctions).length);

const save = async () => {
  try {
    await asyncForEach(batches, async b => {
      console.log(b);
      await execShellCommand(`${b} --force`);
      await execShellCommand("sleep 30s");
    });
  } catch (e) {
    console.warn(e);
  } finally {
    console.log("\nDone!\n");
  }
};

return save();
