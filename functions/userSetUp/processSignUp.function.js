const admin = require("firebase-admin");
const functions = require("firebase-functions");
const db = admin.firestore();

module.exports.processSignUp = functions.auth.user().onCreate(async user => {
  //check user qualification
  let customClaims;
  const usersRef = db.collection("invites");
  const snapshot = await usersRef.where("inviteeEmail", "==", user.email).get();
  //if user is invited to be an admin, set up admin claim to true
  if (!snapshot.empty) {
    customClaims = {
      admin: true
    };
    admin.auth().setCustomUserClaims(user.uid, customClaims);
    createFirestoreUser(user);
    //if user is not invited but has a BU email, set up admin claim to be false(student)
  } else if (user.email && user.email.endsWith("@bu.edu")) {
    customClaims = {
      admin: false
    };
    admin.auth().setCustomUserClaims(user.uid, customClaims);
    createFirestoreUser(user);
    //else delete the account
  } else {
    admin.auth().deleteUser(user.uid);
  }
  return;
});

function createFirestoreUser(user) {
  db.collection("users")
    .doc(user.uid)
    .set({
      displayName: user.displayName,
      uid: user.uid,
      email: user.email,
      photoURL: user.photoURL
    });
}
