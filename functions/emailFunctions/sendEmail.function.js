const { google } = require("googleapis");
const functions = require("firebase-functions");
const CLIENT_ID = functions.config().authinfo.id;
const CLIENT_SECRET = functions.config().authinfo.secret;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = functions.config().authinfo.refreshtoken;
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
google.options({ auth: oAuth2Client });
const gmail = google.gmail("v1");

module.exports.sendEmail = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    return { message: "Authentication Required!", code: 401 };
  }
  const subject = data.subject;
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
  var attachments = "";
  var i = 0;
  for (i = 0; i < data.files.length; i++) {
    let attachment = [
      "--012boundary01",
      "MIME-Version: 1.0",
      `Content-Type: ${data.files[i].type}; name=${data.files[i].name}`,
      `Content-Disposition: attachment; filename=${data.files[i].name}`,
      "Content-Transfer-Encoding: base64",
      "",
      data.files[i].info,
      ""
    ].join("\n");
    attachments += attachment;
  }
  const messageParts = [
    "MIME-Version: 1.0",
    "From: BU Spark <buspark@bu.edu>",
    "To: " + data.to,
    `Subject: ${utf8Subject}`,
    "Content-Type: multipart/mixed; boundary=012boundary01",
    "",
    "--012boundary01",
    "Content-Type: multipart/alternative; boundary=012boundary02",
    "",
    "--012boundary02",
    "Content-type: text/html; charset=UTF-8",
    "",
    data.message,
    "",
    "--012boundary02--",
    attachments,
    "--012boundary01--"
  ];
  if (data.cc) {
    messageParts.splice(3, 0, "Cc: " + data.cc);
  }
  if (data.bcc) {
    messageParts.splice(3, 0, "Bcc: " + data.bcc);
  }
  const message = messageParts.join("\n");

  // The body needs to be base64url encoded.
  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage
    }
  });
  console.log(res.data);
});
// const { google } = require("googleapis");
// const functions = require("firebase-functions");
// const CLIENT_ID = functions.config().authinfo.id;
// const CLIENT_SECRET = functions.config().authinfo.secret;
// const REDIRECT_URI = "https://developers.google.com/oauthplayground";
// const REFRESH_TOKEN = functions.config().authinfo.refreshtoken;
// const oAuth2Client = new google.auth.OAuth2(
//   CLIENT_ID,
//   CLIENT_SECRET,
//   REDIRECT_URI
// );
// oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
// google.options({ auth: oAuth2Client });
// const gmail = google.gmail("v1");

// module.exports.sendEmail = functions.https.onCall(async (data, context) => {
//   if (!context.auth) {
//     return { message: "Authentication Required!", code: 401 };
//   }
//   const subject = data.subject;
//   const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
//   var attachments = "";
//   var i = 0;
//   for (i = 0; i < data.files.length; i++) {
//     let attachment = [
//       "--012boundary01",
//       "MIME-Version: 1.0",
//       `Content-Type: ${data.files[i].type}; name=${data.files[i].name}`,
//       `Content-Disposition: attachment; filename=${data.files[i].name}`,
//       "Content-Transfer-Encoding: base64",
//       "",
//       data.files[i].info,
//       ""
//     ].join("\n");
//     attachments += attachment;
//   }
//   const messageParts = [
//     "MIME-Version: 1.0",
//     "From: BU Spark <buspark@bu.edu>",
//     "To: " + data.to,
//     `Subject: ${utf8Subject}`,
//     "Content-Type: multipart/mixed; boundary=012boundary01",
//     "",
//     "--012boundary01",
//     "Content-Type: multipart/alternative; boundary=012boundary02",
//     "",
//     "--012boundary02",
//     "Content-type: text/html; charset=UTF-8",
//     "",
//     data.message,
//     "",
//     "--012boundary02--",
//     attachments,
//     "--012boundary01--"
//   ];
//   if (data.cc) {
//     messageParts.splice(3, 0, "Cc: " + data.cc);
//   }
//   if (data.bcc) {
//     messageParts.splice(3, 0, "Bcc: " + data.bcc);
//   }
//   const message = messageParts.join("\n");

//   // The body needs to be base64url encoded.
//   const encodedMessage = Buffer.from(message)
//     .toString("base64")
//     .replace(/\+/g, "-")
//     .replace(/\//g, "_")
//     .replace(/=+$/, "");

//   const res = await gmail.users.messages.send({
//     userId: "me",
//     requestBody: {
//       raw: encodedMessage
//     }
//   });
//   console.log(res.data);
// });
