// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, push, set, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFF8-lkYMG5zhyx17YfsACTqFrvLBPAaU",
  authDomain: "finance-tracker-8ecc1.firebaseapp.com",
  databaseURL: "https://finance-tracker-8ecc1-default-rtdb.firebaseio.com",
  projectId: "finance-tracker-8ecc1",
  storageBucket: "finance-tracker-8ecc1.appspot.com",
  messagingSenderId: "1073060390332",
  appId: "1:1073060390332:web:020ebfd01f31c59f2af7b9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Elements
const loginButton = document.querySelector('.btn-head.login');
const signupButton = document.querySelector('.btn-head.signup');
const logoutButton = document.getElementById('logout-button');
const userInfo = document.getElementById('user-info');
const currentBalanceElement = document.getElementById('balance');
let userUid = null;

// Authentication state observer
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    userUid = user.uid;
    userInfo.textContent = `Logged in as: ${user.email}`;
    userInfo.style.display = 'block';
    loginButton.style.display = 'none';
    signupButton.style.display = 'none';
    logoutButton.style.display = 'block';
    loadTransactions(); // Load transactions only when a user is logged in
  } else {
    // No user is signed in
    userUid = null;
    userInfo.textContent = '';
    userInfo.style.display = 'none';
    loginButton.style.display = 'block';
    signupButton.style.display = 'block';
    logoutButton.style.display = 'none';
    clearTransactions(); // Clear transactions from the screen
  }
});

// Logout function
logoutButton.addEventListener('click', () => {
  signOut(auth).then(() => {
    alert('Logged out successfully');
  }).catch((error) => {
    console.error('Error logging out: ', error);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const addButton = document.getElementById('add-transaction-button');
  if (addButton) {
    addButton.addEventListener('click', addTransaction);
  }
  // Load transactions will now be called within the onAuthStateChanged observer
});

function addTransaction() {
  if (!userUid) {
    alert('You must be logged in to add transactions.');
    return;
  }

  const description = document.getElementById('description').value;
  const amount = document.getElementById('amount').value;
  const type = document.getElementById('type').value;
  const date = document.getElementById('date').value;

  // Validate inputs
  if (!description || !amount || !type || !date) {
    alert('Please fill out all fields.');
    return;
  }

  const transactionRef = push(ref(database, `users/${userUid}/transactions`));
  set(transactionRef, {
    description: description,
    amount: parseFloat(amount), // Ensure the amount is saved as a number
    type: type,
    date: date
  }).then(() => {
    console.log('Transaction added!');
    loadTransactions(); // Reload transactions after adding
    // Clear input fields after adding transaction
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('type').value = 'income';
    document.getElementById('date').value = '';
  }).catch((error) => {
    console.error('Error adding transaction: ', error);
  });
}

function loadTransactions() {
  if (!userUid) return;

  const transactionTable = document.getElementById('transaction-table');

  // Clear existing rows except header
  transactionTable.innerHTML = `
    <tr>
      <th>Date</th>
      <th>Description</th>
      <th>Amount</th>
      <th>Type</th>
      <th>Action</th>
    </tr>
  `;

  const transactionsRef = ref(database, `users/${userUid}/transactions`);
  onValue(transactionsRef, (snapshot) => {
    let balance = 0; // Initialize balance

    snapshot.forEach((childSnapshot) => {
      const transaction = childSnapshot.val();
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${transaction.date}</td>
        <td>${transaction.description}</td>
        <td>${transaction.amount}</td>
        <td>${transaction.type}</td>
        <td><button class="delete-button" onclick="deleteTransaction('${childSnapshot.key}')">Delete</button></td>
      `;
      transactionTable.appendChild(row);

      // Calculate the balance
      if (transaction.type === 'income') {
        balance += parseFloat(transaction.amount);
      } else if (transaction.type === 'expense') {
        balance -= parseFloat(transaction.amount);
      }
    });

    // Update the current balance display
    currentBalanceElement.textContent = `${balance.toFixed(2)}`;
  });
}

function clearTransactions() {
  const transactionTable = document.getElementById('transaction-table');
  transactionTable.innerHTML = `
    <tr>
      <th>Date</th>
      <th>Description</th>
      <th>Amount</th>
      <th>Type</th>
      <th>Action</th>
    </tr>
  `;
  currentBalanceElement.textContent = '0.00';
}

window.deleteTransaction = function(transactionId) {
  if (!userUid) {
    alert('You must be logged in to delete transactions.');
    return;
  }

  const transactionRef = ref(database, `users/${userUid}/transactions/${transactionId}`);
  remove(transactionRef).then(() => {
    console.log('Transaction deleted!');
    loadTransactions(); // Reload transactions after deleting
  }).catch((error) => {
    console.error('Error deleting transaction: ', error);
  });
}
