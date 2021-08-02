const admin = require("firebase-admin");
const functions = require("firebase-functions");
const db = admin.firestore();

module.exports.retrieveApplicantData = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      return { message: "Authentication Required!", code: 401 };
    }
    let applications = { masterApplications: [] };
    const ref = db.collection("testApplication").doc("Fall 2021");
    const collection = await ref.listCollections();
    collection.forEach(subCol => {
      applications[subCol.id] = [];
      subCol.forEach(element => {
        applications.masterApplications.push(element.data());
        applications[subCol.id].push(element.data());
      });
    });
    return applications;
  }
);
