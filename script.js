// nyambungkan elemen html
const tombolMasuk = document.getElementById("tombol-masuk-google");
const tombolKeluar = document.getElementById("tombol-keluar");
const halamanMasuk = document.getElementById("halaman-masuk");
const halamanBeranda = document.getElementById("halaman-beranda");
const teksSapaan = document.getElementById("teks-sapaan");

// Sudah kunyalakan authorisasinya ya, lebih baik google only aja daripada buat pw sendiri
function masukGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    // Membuka jendela popup Google
    auth.signInWithPopup(provider)
        .then((result) => {
            console.log("Berhasil masuk sebagai:", result.user.displayName);
        })
        .catch((error) => {
            console.error("Gagal masuk:", error);
            alert("Ups! Gagal masuk: " + error.message);
        });
}

// Logout (Dipanggil saat tombol Keluar dipencet)
function keluarSistem() {
    auth.signOut()
        .then(() => {
            console.log("Berhasil keluar");
        })
        .catch((error) => {
            console.error("Gagal keluar:", error);
        });
}

// Kode login atau logout
auth.onAuthStateChanged((user) => {
    if (user) {
        // login
        console.log("User terdeteksi:", user.displayName);
        
        // 1. Ganti tampilan
        halamanMasuk.style.display = "none";     // Halaman login hilang
        halamanBeranda.style.display = "block";  // Halaman dashboard muncul
        
        // 2. Tampilkan nama user di sapaan
        teksSapaan.innerText = user.displayName; 
        
    } else {
        // belum login/logout
        console.log("Tidak ada user login.");
        
        // 1. Ganti tampilan
        halamanMasuk.style.display = "flex";     // Halaman login muncul (flex biar di tengah)
        halamanBeranda.style.display = "none";   // Halaman dashboard hilang
    }
});

tombolMasuk.addEventListener("click", masukGoogle);
tombolKeluar.addEventListener("click", keluarSistem);

/* PAKAI INI KALAU TEMA WINTER DI BAWAH SCRIPT TAMPILAN LOGIN, OKE??? */



/* Efek Salju untuk TEMA WINTER */
function buatSalju() {
    const salju = document.createElement('div');
    salju.classList.add('snowflake');
    
    salju.style.left = Math.random() * 100 + 'vw';
    
    const ukuran = Math.random() * 3 + 2; 
    salju.style.width = ukuran + 'px';
    salju.style.height = ukuran + 'px';
    
    const durasi = Math.random() * 7 + 8; 
    salju.style.animationDuration = durasi + 's';
    
    salju.style.opacity = Math.random() * 0.5 + 0.3;
    
    document.body.appendChild(salju);
    
    setTimeout(() => {
        salju.remove();
    }, durasi * 1000);
}

setInterval(buatSalju, 300);