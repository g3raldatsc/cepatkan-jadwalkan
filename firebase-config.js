// Konfigurasinya

const firebaseConfig = {
  apiKey: "AIzaSyBocDPFYJhdGkCgPW7oDECyqEiFs3GOF1U",
  authDomain: "cepatkan-jadwalkan.firebaseapp.com",
  projectId: "cepatkan-jadwalkan",
  storageBucket: "cepatkan-jadwalkan.firebasestorage.app",
  messagingSenderId: "138163356272",
  appId: "1:138163356272:web:38ccec0ff404588dc72ab5"
};

// Inisialisasinya

firebase.initializeApp(firebaseConfig);

// ini ingat ya. kubuat fungsi baru biar gampang manggil databasenya

const db = firebase.firestore();
const auth = firebase.auth();
testing;