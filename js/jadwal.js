// js/jadwal.js

let hariTerpilih = "Senin"; 
let unsubscribeJadwal = null;

function pilihHariEdit(hari, elemen) {
    hariTerpilih = hari;
    document.getElementById("label-hari-terpilih").innerText = hari;
    
    const buttons = document.querySelectorAll('.hari-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    elemen.classList.add('active');

    muatJadwalEdit();
}

function tambahJadwal() {
    const user = auth.currentUser;
    if (!user) return;

    const jam = document.getElementById("input-jam").value;
    const kegiatan = document.getElementById("input-kegiatan").value;

    if (!jam || !kegiatan) {
        return alert("Mohon isi jam dan nama kegiatan!");
    }

    db.collection("users").doc(user.uid).collection("jadwal").add({
        hari: hariTerpilih,
        jam: jam,
        kegiatan: kegiatan,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        document.getElementById("input-kegiatan").value = "";
    }).catch((e) => alert("Error: " + e.message));
}

function muatJadwalEdit() {
    const user = auth.currentUser;
    if (!user) return;

    const listContainer = document.getElementById("list-edit-jadwal");
    if (unsubscribeJadwal) unsubscribeJadwal();

    unsubscribeJadwal = db.collection("users").doc(user.uid).collection("jadwal")
        .where("hari", "==", hariTerpilih)
        .orderBy("jam", "asc")
        .onSnapshot((snapshot) => {
            listContainer.innerHTML = "";
            
            if (snapshot.empty) {
                listContainer.innerHTML = `<p style="text-align:center; font-size:12px; color:#636e72; margin-top:20px;">Belum ada jadwal hari ${hariTerpilih}.</p>`;
                return;
            }

            snapshot.forEach((doc) => {
                const data = doc.data();
                const html = `
                    <div class="kartu-jadwal">
                        <div style="display:flex; align-items:center; width:80%;">
                            <span class="jam-kegiatan">${data.jam}</span>
                            <span class="nama-kegiatan">${data.kegiatan}</span>
                        </div>
                        <button onclick="hapusJadwal('${doc.id}')" class="btn-hapus-item">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>`;
                listContainer.innerHTML += html;
            });
        });
}

function hapusJadwal(idDoc) {
    if(confirm("Hapus kegiatan ini?")) {
        const user = auth.currentUser;
        db.collection("users").doc(user.uid).collection("jadwal").doc(idDoc).delete();
    }
}

function muatJadwalBeranda() {
    const user = auth.currentUser;
    if (!user) return;

    const hariIniIndo = new Date().toLocaleDateString('id-ID', { weekday: 'long' });
    const container = document.getElementById("container-jadwal-beranda");

    db.collection("users").doc(user.uid).collection("jadwal")
        .where("hari", "==", hariIniIndo)
        .orderBy("jam", "asc")
        .onSnapshot((snapshot) => {
            container.innerHTML = ""; 

            if (snapshot.empty) {
                container.innerHTML = `
                    <div class="area-jadwal-kosong">
                        <i class="fas fa-bed" style="font-size: 30px; margin-bottom:15px; color:#81ecec;"></i>
                        <p>Tidak ada jadwal hari ${hariIniIndo}.<br>Selamat beristirahat!</p>
                        <button class="btn-aksi-kecil" onclick="gantiMenu('atur')">Buat Jadwal</button>
                    </div>`;
                return;
            }

            snapshot.forEach((doc) => {
                const data = doc.data();
                const html = `
                    <div class="kartu-jadwal" style="border-left-color: #00cec9;">
                        <span class="jam-kegiatan">${data.jam}</span>
                        <span class="nama-kegiatan" style="font-size:16px;">${data.kegiatan}</span>
                    </div>`;
                container.innerHTML += html;
            });
        });
}