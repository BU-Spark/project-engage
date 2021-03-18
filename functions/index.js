const admin = require("firebase-admin");
const glob = require("glob");
const files = glob.sync("./**/*.function.js", {
  cwd: __dirname,
  ignore: "./node_modules/**"
});

admin.initializeApp();

// Deploys all the functions in the format separate_dir/thisfunc.function.js to Firebase
files.forEach(file => {
  const functionModule = require(file);
  const functionNames = Object.keys(functionModule);

  functionNames.forEach(functionName => {
    if (
      !process.env.FUNCTION_NAME ||
      process.env.FUNCTION_NAME === functionName
    ) {
      exports[functionName] = functionModule[functionName];
    }
  });
});
