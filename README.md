# TaskFlow

TaskFlow adalah aplikasi manajemen tugas full-stack yang dibangun dengan Next.js di sisi frontend dan Express + Prisma di sisi backend. Aplikasi ini mendukung autentikasi pengguna, manajemen tugas, dan status tugas dengan database MySQL.

## 🔎 Deskripsi Singkat

TaskFlow membantu pengguna membuat, mengelola, dan memantau tugas mereka secara efisien. Backend menyediakan API terstruktur untuk otentikasi, pengelolaan tugas, dan data pengguna, sementara frontend menyediakan antarmuka pengguna modern dengan React, Next.js, Tailwind CSS, dan Zustand untuk state management.

## 📸 Tampilan Aplikasi

### 💻 Versi Web

Berikut adalah tampilan antarmuka TaskFlow ketika diakses melalui desktop:

|                                                     Halaman Login                                                     |                                                      Halaman Register                                                       |
| :-------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------: |
| <img src="https://raw.githubusercontent.com/dandyAji/taskflow/main/images/web_login.png" width="400" alt="Web Login"> | <img src="https://raw.githubusercontent.com/dandyAji/taskflow/main/images/web_register.png" width="400" alt="Web Register"> |

<br>

|                                                   Halaman Dashboard / Tugas                                                   |
| :---------------------------------------------------------------------------------------------------------------------------: |
| <img src="https://raw.githubusercontent.com/dandyAji/taskflow/main/images/web_task.png" width="820" alt="Web Task Dashboard"> |

---

### 📱 Versi Mobile

Tampilan responsif TaskFlow pada perangkat mobile:

|                                                            Login                                                            |                                                             Register                                                              |                                                      Manajemen Tugas                                                      |
| :-------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------: |
| <img src="https://raw.githubusercontent.com/dandyAji/taskflow/main/images/mobile_login.png" width="220" alt="Mobile Login"> | <img src="https://raw.githubusercontent.com/dandyAji/taskflow/main/images/mogile_register.png" width="220" alt="Mobile Register"> | <img src="https://raw.githubusercontent.com/dandyAji/taskflow/main/images/mobile_task.png" width="220" alt="Mobile Task"> |

## 🧩 Struktur Proyek

- `backend/` — server API Node.js menggunakan Express, Prisma, dan MySQL
- `frontend/` — aplikasi web Next.js untuk antarmuka pengguna

## 🚀 Menjalankan Backend

### 1. Instal dependensi

```bash
cd backend
npm install
```

### 2. Siapkan variabel lingkungan

Buat file `.env` di dalam folder `backend/` dengan variabel berikut:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1d
PORT=5000
```

- `DATABASE_URL`: koneksi MySQL untuk Prisma
- `JWT_SECRET`: kunci rahasia untuk menandatangani token JWT
- `JWT_EXPIRES_IN`: durasi kadaluarsa token JWT (default `1d`)
- `PORT`: port server (default `3000` jika tidak diatur)

### 3. Setup database dengan Prisma

Jalankan migrasi Prisma untuk membuat skema tabel:

```bash
npx prisma migrate dev --name init_uuid
```

Jika Anda ingin menghasilkan client Prisma secara manual:

```bash
npx prisma generate
```

### 4. Jalankan backend

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000` jika `PORT=5000`, atau `http://localhost:3000` jika tidak menentukan port.

## 🖥️ Menjalankan Frontend

### 1. Instal dependensi

```bash
cd ../frontend
npm install
```

### 2. Siapkan variabel lingkungan

Salin `env.local.example` ke `env.local`:

```bash
cp env.local.example .env.local
```

### 3. Jalankan frontend

```bash
npm run dev
```

Aplikasi frontend akan tersedia di `http://localhost:3000`.

## 📡 Endpoint API

Dokumentasi API tersedia di Postman:

https://documenter.getpostman.com/view/29030609/2sBXwqqVxH

## 📌 Catatan Penting

- Backend menggunakan MySQL melalui Prisma. Pastikan server MySQL berjalan dan URL `DATABASE_URL` sesuai.
- Frontend mengakses backend melalui `NEXT_PUBLIC_API_URL` yang ditentukan di `.env.local`.
- Jika mengganti port backend, sesuaikan juga `NEXT_PUBLIC_API_URL` di frontend.

## 🧪 Perintah Singkat

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```
