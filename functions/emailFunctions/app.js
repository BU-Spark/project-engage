// const nodemailer = require('nodemailer')
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

async function doSomething() {
  const subject = "🤘 Hello 🤘";
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
  const messageParts = [
    "From: BU Spark <buspark@bu.edu>",
    "To: Jane Feng <jyfeng@bu.edu>",
    "Content-Type: text/html; charset=utf-8",
    "MIME-Version: 1.0",
    `Subject: ${utf8Subject}`,
    "",
    "This is a message just to say hello.",
    "So... <b>Hello!</b>  🤘❤️😎"
  ];
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
}

doSomething()
  .then(result => console.log("email sent ...", result))
  .catch(error => console.log(error.message));
