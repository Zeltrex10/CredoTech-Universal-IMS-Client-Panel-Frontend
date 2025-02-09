import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "AUTH_DOMAIN",
  projectId: "PROJECT_ID",
  storageBucket: "STORAGE_BUCKET",
  messagingSenderId: "MESSENGER_ID",
  appId: "APP_ID",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
