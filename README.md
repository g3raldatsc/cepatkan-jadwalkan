# 📅 Cepatkan Jadwalkan — Smart Schedule Dashboard

![Status](https://img.shields.io/badge/status-active-success)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Tech](https://img.shields.io/badge/tech-HTML%20%7C%20CSS%20%7C%20JavaScript-orange)
![Storage](https://img.shields.io/badge/storage-localStorage-lightgrey)

**Jadwal Pintar** adalah aplikasi web sederhana berbasis **Front-End Only** yang membantu pengguna:
- Mengelola jadwal pribadi
- Mendeteksi bentrokan waktu
- Mengelola jadwal secara terpisah untuk setiap user
- Belajar konsep **auth, session, dan data isolation** tanpa backend

> Project ini dibuat sebagai **project pembelajaran & portofolio**, dengan arsitektur yang mudah dikembangkan ke backend (SQLite / API).

---

## ✨ Fitur Utama

### 🔐 Autentikasi User
- Register akun baru
- Login & Logout
- Session user (simulasi backend)

### 👥 Multi User
- Setiap user memiliki **jadwal masing-masing**
- Data **tidak tercampur** antar user
- Contoh:
  - `excel@gmail.com` → jadwal sendiri
  - `yanto@gmail.com` → jadwal sendiri

### 🗓️ Manajemen Jadwal (CRUD)
- Tambah jadwal
- Edit jadwal
- Hapus jadwal
- Validasi jam mulai & selesai
- Deteksi **jadwal bentrok otomatis**

### 🎨 UI Modern & Responsif
- Menggunakan **Bootstrap 5**
- Clean layout
- Mudah dikembangkan menjadi admin dashboard

---

## 🧠 Konsep Arsitektur

```text
User
 │
 │ Login / Register
 ▼
Session (localStorage)
 │
 ▼
Data User
 ├── password
 └── jadwal[]
      ├── judul
      ├── tanggal
      ├── jam mulai
      └── jam selesai
