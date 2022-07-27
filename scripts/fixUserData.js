// Script to fix data corrupted by Issue #148 on GitHub
// NOTE: This is only able to work as the Fall 2022 and Ongoing semesters as of making this has no overlapping programs
// Fall 2022 and Ongoing are the only semesters with displayed applications
// Employment Opporutnities (the only program of Ongoing sem) data is completely lost and cannot be restored
const firebase = require("firebase/app");
require("firebase/firestore");

// const config = {
//     apiKey: "AIzaSyB46JWorhyNJDzG20J0dujbIY46zNudibc",
//     authDomain: "auth.buspark.app",
//     projectId: "spark-project-engage",
//     storageBucket: "spark-project-engage.appspot.com",
//     messagingSenderId: "95521899365",
//     appId: "1:95521899365:web:faf942f1ef49f28af8178c",
//     measurementId: "G-L9TYR85MP5"
// };

const stagingConfig = {
  apiKey: "AIzaSyCRAkouqVNtyTWclJmg90BxEDIynahqOtM",
  authDomain: "spark-project-engage-staging.firebaseapp.com",
  projectId: "spark-project-engage-staging",
  storageBucket: "spark-project-engage-staging.appspot.com",
  messagingSenderId: "617899707305",
  appId: "1:617899707305:web:c98bef1def8c3734ed92b8"
};

const programList = [
  "Civic Tech Co-Lab Interest Form",
  "Employment Opportunities",
  "Innovation Fellowship | Innovator",
  "Innovation Fellowship | Technical Teammate",
  "Innovation Fellowship | UX Designer",
  "Internship Application",
  "Justice Media Co-Lab"
];

firebase.initializeApp(stagingConfig);
const db = firebase.firestore();

// Emulator
db.useEmulator("localhost", 8081);

// Function taken and customized from StudentApplications.vue
let getSemesters = () => {
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  let semester1;
  let semester2;
  let semester3;

  //checking for which semester to include on the application table. NOTE: Only display 3 semesters at a time
  if (month >= 7 && month <= 11) {
    semester1 = "Fall " + year;
    semester2 = "Spring " + (year + 1);
    semester3 = "Summer " + (year + 1);
  } else if (month >= 0 && month <= 4) {
    semester1 = "Spring " + year;
    semester2 = "Summer " + year;
    semester3 = "Fall " + year;
  } else {
    semester1 = "Summer " + year;
    semester2 = "Fall " + year;
    semester3 = "Spring " + (year + 1);
  }
  return [semester1, semester2, semester3, "Ongoing"];
};

// Get list of invalid user ids
// const getInvalidUsers = async () => {
//   const usersSnapshot = await db.collection("users").get();
//   let invalidUsers = [];
//   let numInvalid = 0;
//   let numUsers = 0;

//   usersSnapshot.forEach(user => {
//     if (!isUserValid(user)) {
//       invalidUsers.push(user.id);
//       numInvalid++;
//     }
//     numUsers++;
//   });
//   console.log("Invalid Users: " + numInvalid + " out of " + numUsers)
//   console.log(invalidUsers)
//   return invalidUsers;
// };

const isUserValid = user => {
  let apps = user.data().applications;
  return typeof apps == "object" && !Array.isArray(apps);
};

const fixUserData = async () => {
  const usersCol = await db.collection("users");
  let totalAppsUpdated = 0;

  for (let sem of getSemesters()) {
    const semRef = await db.collection("applications").doc(sem);
    for (let program of programList) {
      const progCol = await semRef.collection(program).get();
      progCol.forEach(async application => {
        let userRef = await usersCol.doc(application.id);
        let user = await userRef.get();

        // Check for invalid data, employment opportunities data is lost so dont check, and make sure we havent fixed this user's data already
        if (!isUserValid(user) && program != "Employment Opportunities") {
          // If invalud user does not have applications
          if (user.data().applications == undefined) {
            await userRef.update({
              applications: {}
            });
          } else {
            let invalidData = user.data().applications;
            let correctedData = {};
            correctedData[sem] = invalidData;
            await userRef.update({
              applications: correctedData
            });
          }
          totalAppsUpdated++;
        }
      });
    }
  }
  console.log("Applications Updated: " + totalAppsUpdated);
};

fixUserData();
