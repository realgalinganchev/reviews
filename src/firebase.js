import firebase from 'firebase';
const config = {
    apiKey: "AIzaSyBOGJhvJ-WfAChcOp2klWry_8NgFTcFxck",
    authDomain: "reviews-system-230d4.firebaseapp.com",
    databaseURL: "https://reviews-system-230d4.firebaseio.com",
    projectId: "reviews-system-230d4",
    storageBucket: "reviews-system-230d4.appspot.com",
    messagingSenderId: "590282046635",
    appId: "1:590282046635:web:8ba8444c9147c15a104bee",
    measurementId: "G-LKT96SY8CS"
};
firebase.initializeApp(config);

firebase.firestore();

export default firebase;