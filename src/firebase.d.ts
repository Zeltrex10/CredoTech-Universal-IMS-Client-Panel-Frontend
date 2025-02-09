declare module "../../firebase" {
  import { FirebaseApp } from "firebase/app";
  import { FirebaseStorage } from "firebase/storage";

  const firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };

  const app: FirebaseApp;
  const storage: FirebaseStorage;

  export { storage, app, firebaseConfig };
}