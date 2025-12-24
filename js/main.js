// js/main.js

const tombolMasuk = document.getElementById("tombol-masuk-google");
const tombolKeluar = document.getElementById("tombol-keluar");
const halamanMasuk = document.getElementById("halaman-masuk");
const halamanDashboard = document.getElementById("halaman-dashboard");
const loadingScreen = document.getElementById("loading-screen"); 

const teksSapaan = document.getElementById("teks-sapaan");
const namaProfil = document.getElementById("nama-profil");
const emailProfil = document.getElementById("email-profil");
const imgProfil = document.getElementById("img-profil");

if(tombolMasuk) tombolMasuk.addEventListener("click", masukGoogle);
if(tombolKeluar) tombolKeluar.addEventListener("click", keluarSistem);

auth.onAuthStateChanged((user) => {
    if (user) {
        const namaDepan = user.displayName ? user.displayName.split(" ")[0] : "User";
        teksSapaan.innerText = namaDepan;
        namaProfil.innerText = user.displayName;
        emailProfil.innerText = user.email;
        if (user.photoURL) imgProfil.src = user.photoURL;

        updateTanggal();
        muatJadwalBeranda();
        muatDataLevel(user); 
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

function gantiMenu(menu) {
    document.getElementById("fitur-beranda").style.display = "none";
    document.getElementById("fitur-atur").style.display = "none";
    document.getElementById("fitur-informasi").style.display = "none"; 
    document.getElementById("fitur-profil").style.display = "none";

    if (menu === 'beranda') {
        document.getElementById("fitur-beranda").style.display = "block";
        muatJadwalBeranda();
    } else if (menu === 'atur') {
        document.getElementById("fitur-atur").style.display = "block";
    } else if (menu === 'informasi') {
        document.getElementById("fitur-informasi").style.display = "block"; 
    } else if (menu === 'profil') {
        document.getElementById("fitur-profil").style.display = "block";
    }

    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => item.classList.remove("active"));

    if (menu === 'beranda') navItems[0].classList.add("active");
    if (menu === 'atur') navItems[1].classList.add("active");
    if (menu === 'informasi') navItems[2].classList.add("active");
    if (menu === 'profil') navItems[3].classList.add("active");
}

// logic game

function muatDataLevel(user) {
    db.collection("users").doc(user.uid).onSnapshot((doc) => {
        const data = doc.data();
        const currentXP = (data && data.xp) ? data.xp : 0; 

        let gelar = "Perintis";
        let nextRankXP = 280;
        let badgeColor = "#b2bec3"; 

        if (currentXP >= 2000) {
            gelar = "Pencipta Kedisiplinan";
            nextRankXP = "MAX";
            badgeColor = "#fab1a0"; 
        } else if (currentXP >= 1400) {
            gelar = "Pahlawan Kedisiplinan";
            nextRankXP = 2000;
            badgeColor = "#e17055"; 
        } else if (currentXP >= 840) {
            gelar = "Master Disiplin";
            nextRankXP = 1400;
            badgeColor = "#fdcb6e"; 
        } else if (currentXP >= 280) {
            gelar = "Pemula Disiplin";
            nextRankXP = 840;
            badgeColor = "#00b894"; 
        } else {
            gelar = "Perintis";
            nextRankXP = 280;
            badgeColor = "#74b9ff"; 
        }

        let xpProgress = 0;
        let xpTextNext = "";

        if (nextRankXP === "MAX") {
            xpProgress = 100;
            xpTextNext = "Level Max!";
        } else {
            let prevRankXP = 0;
            if (currentXP >= 1400) prevRankXP = 1400;
            else if (currentXP >= 840) prevRankXP = 840;
            else if (currentXP >= 280) prevRankXP = 280;
            
            const range = nextRankXP - prevRankXP;
            const currentInRank = currentXP - prevRankXP;
            
            xpProgress = Math.round((currentInRank / range) * 100);
            xpTextNext = `Next: ${nextRankXP} Poin`;
        }

        const badge = document.getElementById("level-badge");
        if(badge) {
            badge.innerText = currentXP + " Points"; 
            badge.style.background = badgeColor;
        }
        
        const gelarText = document.getElementById("gelar-user");
        if(gelarText) {
            gelarText.innerText = gelar;
            gelarText.style.color = badgeColor;
        }
        
        const xpCur = document.getElementById("text-xp-current");
        if(xpCur) xpCur.innerText = currentXP + " Poin";
        
        const xpNext = document.getElementById("text-xp-next");
        if(xpNext) xpNext.innerText = xpTextNext;
        
        const xpBar = document.getElementById("xp-bar-fill");
        if(xpBar) {
            xpBar.style.width = xpProgress + "%";
            xpBar.style.background = badgeColor; 
        }
    });
}

// Efek Salju
setInterval(buatSalju, 300);

function kirimLaporanWA() {
    const nama = document.getElementById("input-lapor-nama").value;
    const tipe = document.getElementById("input-lapor-tipe").value;
    const ket = document.getElementById("input-lapor-ket").value;
    const desk = document.getElementById("input-lapor-desk").value;

    if (nama === "" || ket === "" || desk === "") {
        alert("Harap isi semua kolom laporan!");
        return;
    }

    const nomorWA = "6281234008004";
    const pesan = `Halo Developer, saya ingin ${tipe}.\n\nNama: ${nama}\nJudul: ${ket}\nDeskripsi: ${desk}\n\nMohon dicek, terima kasih!`;

    const url = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;
    window.open(url, "_blank");
}

/* blog */

function tampilkanDev() {
    document.getElementById("modal-developer").style.display = "flex";
}

function tutupDev() {
    document.getElementById("modal-developer").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    const logos = document.querySelectorAll(".nav-logo");
    logos.forEach(logo => {
        logo.style.cursor = "pointer"; 
        logo.onclick = tampilkanDev;   
    });

    document.getElementById("Update-Tahun-Otomatis").innerText = new Date().getFullYear();
});

window.onclick = function(event) {
    const modal = document.getElementById("modal-developer");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}