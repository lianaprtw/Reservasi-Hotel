# Hotel Booking System

## 👥 Anggota Kelompok
1. Enno Elisabeth Eklesia Lerebulan (42230004)
2. Ni Kadek Liana Pratiwi (42230010)
3. Ni Made Rai Ardia Anggreni (42230019)
4. Ni Putu Likayuni Viona (42230025)

## 🎯 Tema Aplikasi

Sistem Pemesanan Kamar Hotel (Hotel Booking System)
Aplikasi ini memungkinkan pengguna untuk melihat kamar yang tersedia, melakukan booking, mengelola akun, serta menyediakan dashboard admin untuk mengelola data kamar dan booking.

## 📝 Deskripsi Singkat Proyek

Project ini adalah aplikasi fullstack yang dibangun menggunakan Node.js + Express (backend) dan React.js (frontend).
Aplikasi mendukung proses bisnis pemesanan kamar hotel, seperti:

## ✨ Fitur Utama
### 👤 User
* Registrasi & Login
* Melihat daftar kamar
* Melihat detail kamar
* Memilih dan booking kamar
* Melihat riwayat booking
* Mengatur akun pribadi

### 🛎 Admin
* Melihat seluruh booking
* Mengelola data kamar (CRUD)
* Memantau kapasitas & ketersediaan kamar
* Melihat user yang telah terdaftar

## 🌐 Teknologi yang Dipakai
* Frontend: React, React Router, TailwindCSS
* Backend: Node.js, Express.js, JWT Authentication
* Database: MongoDB
* DevOps: Docker & Docker Compose

## 🚀 Cara Menjalankan Proyek
1.  Jalankan Semua Service Menggunakan Docker

2. Pastikan sudah menginstall:
   * Docker
   * Docker Compose

3. Kemudian jalankan:

 docker compose up --build


4. Service yang akan berjalan:

| Service  | Port  | Keterangan        |
|----------|-------|-------------------|
| frontend | 5173  | React Vite Client |
| backend  | 5001  | REST API Server   |
| mongo_db | 27017 | MongoDB Database  |

Aplikasi utama dapat dibuka di:

    http://localhost:5173


## 📡 Dokumentasi API Sederhana

### 🔐 AUTH
| Method | Endpoint           | Deskripsi                      |
|--------|---------------------|--------------------------------|
| POST   | /api/auth/register | Registrasi user baru           |
| POST   | /api/auth/login    | Login & menghasilkan token JWT |

### 🏨 Rooms
| Method | Endpoint       | Deskripsi                   |
| ------ | -------------- | --------------------------- |
| GET    | /api/rooms     | Ambil semua kamar           |
| GET    | /api/rooms/:id | Detail kamar berdasarkan ID |
| POST   | /api/rooms     | Tambah kamar baru (Admin)   |
| PUT    | /api/rooms/:id | Edit data kamar (Admin)     |
| DELETE | /api/rooms/:id | Hapus kamar (Admin)         |

### 🧾 Booking
| Method | Endpoint         | Deskripsi                                  |
| ------ | ---------------- | ------------------------------------------ |
| POST   | /api/booking     | Membuat booking                            |
| GET    | /api/booking/me  | Ambil booking milik user yang sedang login |
| GET    | /api/booking/:id | Detail booking tertentu                    |
| GET    | /api/booking     | Semua booking (Admin)                      |

## 🏁 Status Proyek

Semua fitur utama sudah dapat berjalan, termasuk proses booking dan navigasi antar halaman.
Proyek sudah siap dijalankan menggunakan Docker untuk memudahkan deployment.