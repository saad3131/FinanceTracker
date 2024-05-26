// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

// Function to save user data
async function saveUserData(userId, data) {
  try {
    await setDoc(doc(db, "users", userId), data);
    console.log("User data saved successfully!");
  } catch (error) {
    console.error("Error saving user data: ", error);
  }
}

// Submit button event listener for user registration
const form = document.querySelector('.signup-form');
form.addEventListener("submit", function(event) {
  event.preventDefault();

  // Inputs
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      alert("Account created successfully!");

      // Save user data
      saveUserData(user.uid, { email: user.email });

      // Optionally, redirect the user to another page
      window.location.href = './login.html'; // Redirect to login page after signup
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
});
