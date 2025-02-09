import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "API KEY",
  authDomain: "AUTH_DOMAIN",
  projectId: "PROJECT_ID",
  storageBucket: "STORAGE_ID",
  messagingSenderId: "MESSENGER_ID",
  appId: "APP_ID",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, app, firebaseConfig };
