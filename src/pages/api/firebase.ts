import admin from "firebase-admin";
import { getDownloadURL, getStorage } from "firebase-admin/storage";
import { useEffect } from "react";
const sharp = require("sharp");

function b64_to_utf8(str: string) {
  return decodeURIComponent(escape(atob(str)));
}

const serviceAccount = {
  auth_provider_x509_cert_url:
  process.env.FIREBASE_ADMIN_auth_provider_x509_cert_url,
  auth_uri: process.env.FIREBASE_ADMIN_auth_uri,
  client_email: process.env.FIREBASE_ADMIN_client_email,
  client_id: process.env.FIREBASE_ADMIN_client_id,
  client_x509_cert_url: process.env.FIREBASE_ADMIN_client_x509_cert_url,
  private_key: b64_to_utf8(process.env.FIREBASE_ADMIN_private_key as string),
  private_key_id: process.env.FIREBASE_ADMIN_private_key_id,
  project_id: process.env.FIREBASE_ADMIN_project_id,
  token_uri: process.env.FIREBASE_ADMIN_token_uri,
  type: process.env.FIREBASE_ADMIN_type,
} as admin.ServiceAccount;

const app = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  return admin.app();
};

app();

const bucket = getStorage().bucket("xcs-v2.appspot.com");
// admin.storage().bucket("xcs-v2").upload("test.txt");

export { admin, app, bucket };

export async function tokenToID(token: string) {
  if (!token) {
    return null;
  }
  try {
    const user = await admin.auth().verifyIdToken(token);
    return user.uid;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function uploadProfilePicture(uid: string, picture: string) {
  // upload profile picture function
  // picture is passed as base64 string

  // convert to buffer
  // const buffer = Buffer.from(picture, "base64");

  // upload to firebase storage
  const file = bucket.file(`profile-pictures/${uid}.jpeg`);

  await file.save(picture, {
    metadata: {
      contentType: "image/jpeg",
    },
  }).then(() => {
    console.log("Uploaded profile picture");
  }).catch((error) => {
    console.log(error);
  });

  // get permanent url using getDownloadURL
  const url = await getDownloadURL(file).then((url) => {
    return url;
  }).catch((error) => {
    console.log(error);
  });

  return url;
}