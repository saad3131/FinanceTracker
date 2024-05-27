// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFF8-lkYMG5zhyx17YfsACTqFrvLBPAaU",
  authDomain: "finance-tracker-8ecc1.firebaseapp.com",
  projectId: "finance-tracker-8ecc1",
  storageBucket: "finance-tracker-8ecc1.appspot.com",
  messagingSenderId: "1073060390332",
  appId: "1:1073060390332:web:020ebfd01f31c59f2af7b9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to get user data
async function getUserData(userId) {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
    return null;
  }
}

// Form submission event for login
const form = document.querySelector('.login-form');
form.addEventListener('submit', function(event) {
  event.preventDefault();

  // Inputs
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;

      // Retrieve user data
      getUserData(user.uid).then(data => {
        console.log(data);
        // You can store user data in session storage or local storage if needed
        sessionStorage.setItem('userData', JSON.stringify(data));
      });

      // Redirect the user to another page
      window.location.href = './index.html'; // Change to your designated page
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
});

// Forgot Password functionality
const forgotPasswordLink = document.getElementById('forgot-password-link');
forgotPasswordLink.addEventListener('click', function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;

  if (!email) {
    alert('Please enter your email address to reset your password.');
    return;
  }

  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert('Password reset email sent! Check your inbox.');
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
});

// Google Sign-In functionality
const googleSignInButton = document.getElementById('google-signin-button');
const provider = new GoogleAuthProvider();

googleSignInButton.addEventListener('click', function() {
  signInWithPopup(auth, provider)
    .then((result) => {
      // The signed-in user info.
      const user = result.user;

      // Retrieve user data
      getUserData(user.uid).then(data => {
        console.log(data);
        // You can store user data in session storage or local storage if needed
        sessionStorage.setItem('userData', JSON.stringify(data));
      });

      // Redirect the user to another page
      window.location.href = './index.html'; // Change to your designated page
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
});
