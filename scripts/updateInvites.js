const admin = require("firebase-admin");
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";

admin.initializeApp({
  projectId: "spark-project-engage",
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

var backupRef = db
  .collection("backup")
  .doc("backup@" + Date.now())
  .collection("invites");

const getAllInvites = async () => {
  return await db.collection("invites").get();
};

const main = async () => {
  // Get current snapshot and make a backup

  var snapshot = await getAllInvites();
  for (let doc of snapshot.docs) {
    var backupDocRef = backupRef.doc(doc.id);
    await backupDocRef.set(doc.data());
    console.log(doc.id);
    doc.ref.delete(); // Delete the original doc
  }
  console.log("Backup Finished");

  // Create new docs with key=email
  var invitesRef = db.collection("invites");
  for (let doc of snapshot.docs) {
    var data = doc.data();
    var newDocRef = invitesRef.doc(data.inviteeEmail);
    await newDocRef.set(data);
    console.log(newDocRef.id);
  }
  console.log("Rename Finished");
};

main();
