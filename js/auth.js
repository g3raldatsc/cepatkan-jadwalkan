// js/auth.js

function masukGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            console.log("Login sukses:", user.displayName);

            db.collection("users").doc(user.uid).set({
                nama: user.displayName,
                email: user.email,
                foto: user.photoURL,
                terakhirLogin: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true }); 

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