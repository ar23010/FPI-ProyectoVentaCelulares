import { defineBoot } from '#q-app/wrappers'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { VueFire } from 'vuefire';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDo1zoTqM1jFmd4Db_4NDIsKbJGJtmo1xo",
  authDomain: "celularesventaebay.firebaseapp.com",
  projectId: "celularesventaebay",
  storageBucket: "celularesventaebay.firebasestorage.app",
  messagingSenderId: "445971863759",
  appId: "1:445971863759:web:4eafc5793b02ff9d107fba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default defineBoot( ( { app }) => {
  app.use(VueFire, {
  // imported above but could also just be created here
  app,
  modules: [
    // we will see other modules later on
  
  ],
})
})

export { db };
