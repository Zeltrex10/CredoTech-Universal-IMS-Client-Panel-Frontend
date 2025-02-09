import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDBQA4nzC1QorjegYC1-kHLXHoBF9PHb4k",
  authDomain: "facialrecognitionidscanner.firebaseapp.com",
  projectId: "facialrecognitionidscanner",
  storageBucket: "facialrecognitionidscanner.appspot.com",
  messagingSenderId: "1028897436260",
  appId: "1:1028897436260:web:569b6ea5454b06437c2571",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };