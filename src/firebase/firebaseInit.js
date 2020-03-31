import firebase from 'firebase';
import firebaseConfig from './firebaseConfig';
const settings = {timestampsInSnapshots: true};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const myFirebase = firebaseApp.firestore().settings(settings);
export default myFirebase
 
