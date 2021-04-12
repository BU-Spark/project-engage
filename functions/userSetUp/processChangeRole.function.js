const admin = require("firebase-admin");
const functions = require("firebase-functions");

module.exports.processChangeRole = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      return { message: "Authentication Required!", code: 401 };
    }
    let customClaims;
    customClaims = {
      admin: true
    };
    // console.log(context.auth.uid);
    admin.auth().setCustomUserClaims(data.id, customClaims);
    return;
  }
);
