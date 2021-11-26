importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

let firebaseConfig = firebaseConfig = {
  todo: "replace-dev",
  apiKey: "AIzaSyDeBNstctX_kc1Me1bAlk-ZFRpmSMMaYHk",
  authDomain: "test123-5ce26.firebaseapp.com",
  projectId: "test123-5ce26",
  storageBucket: "test123-5ce26.appspot.com",
  messagingSenderId: "29935327815",
  appId: "1:29935327815:web:cd67eba2601a07983aaf62",
  measurementId: "G-YWSNZ45NBR"
};

switch (window.location.hostname) {
  case 'app.altera.co':
    firebaseConfig = {
      todo: "replace-prod",
      apiKey: "AIzaSyDeBNstctX_kc1Me1bAlk-ZFRpmSMMaYHk",
      authDomain: "test123-5ce26.firebaseapp.com",
      projectId: "test123-5ce26",
      storageBucket: "test123-5ce26.appspot.com",
      messagingSenderId: "29935327815",
      appId: "1:29935327815:web:cd67eba2601a07983aaf62",
      measurementId: "G-YWSNZ45NBR"
    };
    break;
  case 'uat.altera.co':
    firebaseConfig = {
      todo: "replace-uat",
      apiKey: "AIzaSyDeBNstctX_kc1Me1bAlk-ZFRpmSMMaYHk",
      authDomain: "test123-5ce26.firebaseapp.com",
      projectId: "test123-5ce26",
      storageBucket: "test123-5ce26.appspot.com",
      messagingSenderId: "29935327815",
      appId: "1:29935327815:web:cd67eba2601a07983aaf62",
      measurementId: "G-YWSNZ45NBR"
    };
    break;
  case 'qa.altera.co':
    firebaseConfig = {
      todo: "replace-qa",
      apiKey: "AIzaSyDeBNstctX_kc1Me1bAlk-ZFRpmSMMaYHk",
      authDomain: "test123-5ce26.firebaseapp.com",
      projectId: "test123-5ce26",
      storageBucket: "test123-5ce26.appspot.com",
      messagingSenderId: "29935327815",
      appId: "1:29935327815:web:cd67eba2601a07983aaf62",
      measurementId: "G-YWSNZ45NBR"
    };
    break;
}

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
