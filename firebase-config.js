// Konfigurasinya


// Inisialisasinya

firebase.initializeApp(firebaseConfig);

// ini ingat ya. kubuat fungsi baru biar gampang manggil databasenya

const db = firebase.firestore();
const auth = firebase.auth();
