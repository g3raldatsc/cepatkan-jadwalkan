// js/jadwal.js

let hariTerpilih = "Senin"; 
let unsubscribeJadwal = null;
let isBusy = false; 

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
    const jamInput = document.getElementById("input-jam").value;
    const kegiatan = document.getElementById("input-kegiatan").value;

    if (!jamInput || !kegiatan) return alert("Isi lengkap dulu!");

    db.collection("users").doc(user.uid).collection("jadwal")
        .where("hari", "==", hariTerpilih).get().then((snapshot) => {
            let isTooClose = false;
            const [jamBaru, menitBaru] = jamInput.split(':').map(Number);
            const totalMenitBaru = (jamBaru * 60) + menitBaru;

            snapshot.forEach((doc) => {
                const [jamAda, menitAda] = doc.data().jam.split(':').map(Number);
                if (Math.abs(totalMenitBaru - ((jamAda * 60) + menitAda)) < 30) isTooClose = true;
            });

            if (isTooClose) return alert("Jarak antar kegiatan minimal 30 menit!");

            db.collection("users").doc(user.uid).collection("jadwal").add({
                hari: hariTerpilih, jam: jamInput, kegiatan: kegiatan, selesai: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                document.getElementById("input-kegiatan").value = "";
            });
        });
}

function muatJadwalEdit() {
    const user = auth.currentUser;
    if (!user) return;
    if (unsubscribeJadwal) unsubscribeJadwal();

    const listContainer = document.getElementById("list-edit-jadwal");
    unsubscribeJadwal = db.collection("users").doc(user.uid).collection("jadwal")
        .where("hari", "==", hariTerpilih).orderBy("jam", "asc")
        .onSnapshot((snapshot) => {
            listContainer.innerHTML = "";
            if (snapshot.empty) {
                listContainer.innerHTML = `<p style="text-align:center; margin-top:20px; color:#aaa;">Belum ada jadwal.</p>`;
                return;
            }
            snapshot.forEach((doc) => {
                const data = doc.data();
                listContainer.innerHTML += `
                    <div class="kartu-jadwal" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; margin-bottom: 10px; background: rgba(255,255,255,0.05); border-radius: 10px;">
                        <div style="display:flex; align-items:center; gap: 15px;">
                            <span class="jam-kegiatan" style="font-weight:bold; color: #00cec9;">${data.jam}</span>
                            <span class="nama-kegiatan">${data.kegiatan}</span>
                        </div>
                        <button onclick="hapusJadwal('${doc.id}')" class="btn-hapus-item" style="background:none; border:none; color:#ff7675; cursor:pointer;"><i class="fas fa-trash"></i></button>
                    </div>`;
            });
        });
}

function hapusJadwal(idDoc) {
    if(confirm("Hapus?")) db.collection("users").doc(auth.currentUser.uid).collection("jadwal").doc(idDoc).delete();
}

function muatJadwalBeranda() {
    const user = auth.currentUser;
    if (!user) return;

    const hariIniIndo = new Date().toLocaleDateString('id-ID', { weekday: 'long' });
    const container = document.getElementById("container-jadwal-beranda");
    const barFill = document.getElementById("progress-fill");
    const textProgress = document.getElementById("text-progress");
    const textTotal = document.getElementById("text-total");

    let alertBox = document.getElementById("alert-min-jadwal");
    if (!alertBox) {
        alertBox = document.createElement("div");
        alertBox.id = "alert-min-jadwal";
        alertBox.style.cssText = "background: #d63031; color: white; padding: 10px; border-radius: 8px; margin-bottom: 15px; text-align: center; display: none; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.2);";
        container.parentNode.insertBefore(alertBox, container);
    }

    db.collection("users").doc(user.uid).collection("jadwal")
        .where("hari", "==", hariIniIndo).orderBy("jam", "asc")
        .onSnapshot((snapshot) => {
            container.innerHTML = ""; 
            const totalTugas = snapshot.size;
            let tugasSelesai = 0;
            const now = new Date();
            const curMins = (now.getHours() * 60) + now.getMinutes();

            const MINIMAL_JADWAL = 10;
            const kurangJadwal = totalTugas < MINIMAL_JADWAL;

            if (kurangJadwal) {
                alertBox.style.display = "block";
                alertBox.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Wajib isi minimal 10 kegiatan! (Kurang ${MINIMAL_JADWAL - totalTugas} lagi)`;
            } else {
                alertBox.style.display = "none";
            }

            if (snapshot.empty) {
                barFill.style.width = "0%"; textProgress.innerText = "0%"; textTotal.innerText = "0/0";
                container.innerHTML = `<p style="text-align:center; margin-top:20px; color:#aaa;">Jadwal kosong. Isi minimal 10 kegiatan dulu!</p>`;
                return;
            }

            snapshot.forEach((doc) => {
                const data = doc.data();
                if(data.selesai) tugasSelesai++;

                const [h, m] = data.jam.split(':').map(Number);
                const schedMins = (h * 60) + m;
                
                let icon = `<i class="fas fa-check"></i>`;
                let disabled = "";
                let clickFunc = `onclick="presensiSekali('${doc.id}')"`;
                let statusClass = ""; 
                let statusLabel = "";
                let tombolColor = "#0984e3"; 

                if (data.selesai) {
                    icon = `<i class="fas fa-check-double"></i>`; 
                    disabled = "disabled"; 
                    clickFunc = "";        
                    statusClass = "selesai-style"; 
                    tombolColor = "#00b894"; 
                } 
                else if (kurangJadwal) {
                    icon = `<i class="fas fa-ban"></i>`; 
                    disabled = "disabled"; 
                    clickFunc = "";
                    tombolColor = "#636e72"; 
                    statusLabel = `<span style="font-size: 0.8em; color: #fab1a0; margin-left: auto; font-style: italic;">(Lengkapi 10 Jadwal)</span>`;
                }
                else {
                    if (curMins < schedMins) { 
                        icon = `<i class="fas fa-lock"></i>`; 
                        disabled = "disabled"; 
                        clickFunc = "";
                        tombolColor = "#636e72";
                    } else if (curMins > schedMins + 20) { 
                        icon = `<i class="fas fa-times"></i>`; 
                        disabled = "disabled"; 
                        clickFunc = "";
                        statusClass = "terlambat-style";
                        tombolColor = "#d63031"; 
                        statusLabel = `<span style="font-size: 0.8em; color: #ff7675; margin-left: auto;">(Hangus)</span>`;
                    }
                }

                container.innerHTML += `
                    <div class="kartu-jadwal ${statusClass}" style="
                        display: flex; align-items: center; justify-content: space-between;
                        background: #2d3436; padding: 15px; margin-bottom: 12px; border-radius: 12px; 
                        border-left: 5px solid ${data.selesai ? '#00b894' : (kurangJadwal ? '#d63031' : '#00cec9')};
                        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                    ">
                        <div style="margin-right: 15px;">
                            <button id="btn-${doc.id}" class="btn-check" ${disabled} ${clickFunc} style="
                                width: 45px; height: 45px; border-radius: 50%; border: none; 
                                cursor: ${disabled ? 'not-allowed' : 'pointer'}; 
                                background: ${tombolColor}; color: white; font-size: 1.2em;
                                display: flex; align-items: center; justify-content: center;
                                transition: transform 0.2s;
                            ">
                                ${icon}
                            </button>
                        </div>
                        <div style="flex-grow: 1; display: flex; flex-direction: column;">
                            <span style="font-size: 1.1em; font-weight: 500; color: #dfe6e9;">${data.kegiatan}</span>
                            <span style="font-size: 0.9em; color: #b2bec3; margin-top: 4px;">Pukul: ${data.jam}</span>
                        </div>
                        ${statusLabel}
                    </div>`;
            });

            const pct = totalTugas === 0 ? 0 : Math.round((tugasSelesai / totalTugas) * 100);
            barFill.style.width = pct + "%";
            textProgress.innerText = pct + "% Selesai";
            textTotal.innerText = `${tugasSelesai}/${totalTugas}`;
            
            if (totalTugas < 10) barFill.style.background = "#fab1a0"; 
            else if (pct === 100) barFill.style.background = "#00b894";
            else barFill.style.background = "#fdcb6e";
        });
}

async function presensiSekali(docId) {
    if (isBusy) return;
    isBusy = true; 

    const btn = document.getElementById(`btn-${docId}`);
    if(btn) {
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
        btn.disabled = true; 
    }

    try {
        const user = auth.currentUser;
        await db.collection("users").doc(user.uid).collection("jadwal").doc(docId).update({
            selesai: true 
        });
        await hitungDanSimpanXP(user.uid);

    } catch (err) {
        console.error(err);
        alert("Gagal koneksi atau data error.");
        if(btn) {
             btn.disabled = false; 
             btn.innerHTML = `<i class="fas fa-check"></i>`;
        }
    } finally {
        isBusy = false;
    }
}

function hitungDanSimpanXP(uid) {
    const hariIniIndo = new Date().toLocaleDateString('id-ID', { weekday: 'long' });
    
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000; 
    const todayStr = (new Date(now - offset)).toISOString().split('T')[0];

    console.log("Checking XP for date:", todayStr);

    return db.collection("users").doc(uid).collection("jadwal")
        .where("hari", "==", hariIniIndo).get()
        .then((snapshot) => {
            const total = snapshot.size;
            let selesai = 0;
            snapshot.forEach(doc => { if(doc.data().selesai) selesai++; });

            let targetXP = 0;
            const pct = total === 0 ? 0 : (selesai / total) * 100;

            // Logic Poin
            if (total < 10) {
                if (selesai > 0) targetXP = 2; 
            } else {
                if (pct === 100) targetXP = 10;
                else if (pct >= 50) targetXP = 5;
                else if (selesai > 0) targetXP = 2;
            }

            const userRef = db.collection("users").doc(uid);

            return db.runTransaction((t) => {
                return t.get(userRef).then((doc) => {
                    if (!doc.exists) return;
                    const data = doc.data();
                    
                    // Reset poin harian jika tanggal beda
                    let recordedDailyXP = data.dailyXP || 0;
                    if (data.lastXPDate !== todayStr) {
                        recordedDailyXP = 0; 
                    }

                    const delta = targetXP - recordedDailyXP;
                    
                    console.log(`Target: ${targetXP}, Recorded: ${recordedDailyXP}, Delta: ${delta}`);

                    if (delta !== 0) {
                        t.update(userRef, {
                            xp: firebase.firestore.FieldValue.increment(delta),
                            dailyXP: targetXP,
                            lastXPDate: todayStr
                        });
                    }
                });
            });
        });
}