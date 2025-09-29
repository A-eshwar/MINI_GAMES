import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyC-IWCgEOERZUB4WSTlb2eTav0yEsRDehA",
  authDomain: "project2048-ce88c.firebaseapp.com",
  projectId: "project2048-ce88c",
  storageBucket: "project2048-ce88c.appspot.com",
  messagingSenderId: "164814843394",
  appId: "1:164814843394:web:f46a463b5c24b5aad5c11b",
  measurementId: "G-V3DCZGNMVG"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
document.querySelector("form").addEventListener("submit", function(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("User registered successfully");
      window.location.href = "login.html";
    })
    .catch((error) => {
      alert(error.message);
    });
});
document.getElementById("googleSignIn").addEventListener("click", () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert(error.message);
    });
});
