// js/auth.js

function masukGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            console.log("Login sukses:", result.user.displayName);
        })
        .catch((error) => {
            alert("Gagal masuk: " + error.message);
        });
}

function keluarSistem() {
    if (confirm("Yakin ingin keluar akun?")) {
        auth.signOut().then(() => {
            location.reload();
        });
    }
}