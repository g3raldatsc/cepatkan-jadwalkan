// js/main.js

// Ambil elemen dom

const tombolMasuk = document.getElementById("tombol-masuk-google");
const tombolKeluar = document.getElementById("tombol-keluar");
const halamanMasuk = document.getElementById("halaman-masuk");
const halamanDashboard = document.getElementById("halaman-dashboard");
const loadingScreen = document.getElementById("loading-screen"); // Elemen Loading

const teksSapaan = document.getElementById("teks-sapaan");
const namaProfil = document.getElementById("nama-profil");
const emailProfil = document.getElementById("email-profil");
const imgProfil = document.getElementById("img-profil");

if(tombolMasuk) tombolMasuk.addEventListener("click", masukGoogle);
if(tombolKeluar) tombolKeluar.addEventListener("click", keluarSistem);

auth.onAuthStateChanged((user) => {
    
    if (user) {
        // Set data profil dulu di background
        const namaDepan = user.displayName ? user.displayName.split(" ")[0] : "User";
        teksSapaan.innerText = namaDepan;
        namaProfil.innerText = user.displayName;
        emailProfil.innerText = user.email;
        if (user.photoURL) imgProfil.src = user.photoURL;

        updateTanggal();
        muatJadwalBeranda();
        gantiMenu('beranda');

        halamanMasuk.style.display = "none";
        halamanDashboard.style.display = "block";

    } else {
        halamanDashboard.style.display = "none";
        halamanMasuk.style.display = "flex";
    }

    if(loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0'; 
            setTimeout(() => {
                loadingScreen.style.display = 'none'; 
            }, 500);
        }, 500);
    }
});

// Efek Salju
setInterval(buatSalju, 300);