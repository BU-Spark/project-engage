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

function makeBody(to, from, cc, bcc, subject, body) {
  var message = [
    'Content-Type: text/html; charset="UTF-8"\n',
    "MIME-Version: 1.0\n",
    "Content-Transfer-Encoding: 7bit\n",
    "to: ",
    to,
    "\n",
    "from: ",
    from,
    "\n",
    "cc: ",
    cc,
    "\n",
    "bcc: ",
    bcc,
    "\n",
    "subject: ",
    subject,
    "\n\n",
    body
  ].join("");

  var encodedMail = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return encodedMail;
}

module.exports.sendEmail = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    return { message: "Authentication Required!", code: 401 };
  }
  // const subject = data.subject;
  // const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
  // const messageParts = [
  //   "From: BU Spark <buspark@bu.edu>",
  //   "To:  <" + data.email + ">",
  //   "cc:  <" + data.cc + ">",
  //   "Content-Type: text/html; charset=utf-8",
  //   "MIME-Version: 1.0",
  //   `Subject: ${utf8Subject}`,
  //   "",
  //   data.text,
  // ];
  // const message = messageParts.join("\n");

  var raw = makeBody(
    data.email,
    "buspark@bu.edu",
    data.cc,
    data.bcc,
    data.subject,
    data.text
  );

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: raw
    }
  });
  return res.data;
});
