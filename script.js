let editIndex = null;

const loginBox = document.getElementById("loginBox");
const dashboard = document.getElementById("dashboard");
const jadwalList = document.getElementById("jadwalList");

/* ================= LOGIN ================= */
function login() {
  const email = document.getElementById("email").value;
  if (!email) return alert("Email wajib diisi");

  localStorage.setItem("user", email);
  showDashboard();
}

function logout() {
  localStorage.removeItem("user");
  location.reload();
}

function showDashboard() {
  loginBox.classList.add("d-none");
  dashboard.classList.remove("d-none");
  loadJadwal();
}

/* ================= NAV ================= */
function showSection(id) {
  document.querySelectorAll(".content").forEach(c => c.classList.add("d-none"));
  document.getElementById(id).classList.remove("d-none");
}

/* ================= JADWAL ================= */
function simpanJadwal() {
  const judul = judulInput.value;
  const tanggal = tanggalInput.value;
  const mulai = mulaiInput.value;
  const selesai = selesaiInput.value;

  if (!judul || !tanggal || !mulai || !selesai) {
    return alert("Semua field wajib diisi");
  }

  if (mulai >= selesai) {
    return alert("Jam mulai harus lebih kecil dari jam selesai");
  }

  const jadwal = JSON.parse(localStorage.getItem("jadwal")) || [];

  // VALIDASI BENTROK
  for (let i = 0; i < jadwal.length; i++) {
    if (editIndex !== null && i === editIndex) continue;

    const j = jadwal[i];
    if (j.tanggal === tanggal) {
      if (mulai < j.selesai && selesai > j.mulai) {
        return alert("Jadwal bentrok dengan: " + j.judul);
      }
    }
  }

  const data = { judul, tanggal, mulai, selesai };

  if (editIndex === null) {
    jadwal.push(data);
  } else {
    jadwal[editIndex] = data;
    editIndex = null;
  }

  localStorage.setItem("jadwal", JSON.stringify(jadwal));
  resetForm();
  loadJadwal();
  showSection("jadwal");
}

/* ================= EDIT ================= */
function editJadwal(index) {
  const jadwal = JSON.parse(localStorage.getItem("jadwal"));
  const j = jadwal[index];

  judulInput.value = j.judul;
  tanggalInput.value = j.tanggal;
  mulaiInput.value = j.mulai;
  selesaiInput.value = j.selesai;

  editIndex = index;
  document.getElementById("formTitle").innerText = "Edit Jadwal";
  showSection("tambah");
}

/* ================= HAPUS ================= */
function hapusJadwal(index) {
  if (!confirm("Yakin hapus jadwal?")) return;

  const jadwal = JSON.parse(localStorage.getItem("jadwal"));
  jadwal.splice(index, 1);
  localStorage.setItem("jadwal", JSON.stringify(jadwal));
  loadJadwal();
}

/* ================= LOAD ================= */
function loadJadwal() {
  jadwalList.innerHTML = "";
  const jadwal = JSON.parse(localStorage.getItem("jadwal")) || [];

  if (jadwal.length === 0) {
    jadwalList.innerHTML = "<p class='text-muted'>Belum ada jadwal</p>";
    return;
  }

  jadwal.forEach((j, i) => {
    jadwalList.innerHTML += `
      <div class="item">
        <strong>${j.judul}</strong><br>
        ${j.tanggal} | ${j.mulai} - ${j.selesai}
        <div class="mt-2">
          <button class="btn btn-sm btn-warning" onclick="editJadwal(${i})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="hapusJadwal(${i})">Hapus</button>
        </div>
      </div>
    `;
  });
}

/* ================= UTIL ================= */
function resetForm() {
  judulInput.value = "";
  tanggalInput.value = "";
  mulaiInput.value = "";
  selesaiInput.value = "";
  editIndex = null;
  document.getElementById("formTitle").innerText = "Tambah Jadwal";
}

/* ================= INIT ================= */
const judulInput = document.getElementById("judul");
const tanggalInput = document.getElementById("tanggal");
const mulaiInput = document.getElementById("mulai");
const selesaiInput = document.getElementById("selesai");

if (localStorage.getItem("user")) {
  showDashboard();
}
