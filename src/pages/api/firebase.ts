import admin from "firebase-admin";

function b64_to_utf8(str: string) {
  return decodeURIComponent(escape(atob(str)));
}

const serviceAccount = {
  auth_provider_x509_cert_url: process.env.FIREBASE_ADMIN_auth_provider_x509_cert_url,
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

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

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