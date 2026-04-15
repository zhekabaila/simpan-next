# MANUAL BOOK SIMPAN

## Sistem Informasi Penyaluran Bantuan Sosial Terintegrasi dengan QR Code

---

## Daftar Isi

1. [Pengenalan Sistem](#pengenalan-sistem)
2. [Panduan Admin](#panduan-admin)
3. [Panduan Masyarakat](#panduan-masyarakat)
4. [Panduan Petugas](#panduan-petugas)
5. [FAQ & Troubleshooting](#faq--troubleshooting)

---

## Pengenalan Sistem

### Tentang SIMPAN

SIMPAN adalah sistem informasi terintegrasi untuk mengelola penyaluran bantuan sosial dengan teknologi QR Code. Sistem ini dirancang untuk memudahkan:

- **Admin**: Mengelola data pengajuan, pengguna, dan penugasan petugas
- **Masyarakat**: Mengajukan permohonan bantuan dan melacak status pengajuan
- **Petugas**: Melakukan verifikasi lapangan dan pencatatan penyaluran bantuan

### Alur Umum Proses Penyaluran Bantuan

```
Masyarakat Mengajukan Bantuan
  ↓
Admin Menerima & Menetapkan Petugas
  ↓
Petugas Melakukan Verifikasi Lapangan
  ↓
Admin Menyetujui/Menolak Pengajuan
  ↓
Petugas Melakukan Penyaluran & Scan QR Code
  ↓
Masyarakat Menerima Bantuan
```

### Fitur Keamanan

- Autentikasi berbasis role (Admin, Masyarakat, Petugas)
- QR Code unik untuk setiap pengajuan
- Riwayat lengkap aktivitas pengguna
- Notifikasi real-time untuk setiap perubahan status

---

# PANDUAN ADMIN

## 1. Login Sebagai Admin

### Langkah-langkah:

1. Buka website SIMPAN di browser
2. Anda akan diarahkan ke halaman `/login`
3. Masukkan **Email** yang sudah terdaftar sebagai Admin
4. Masukkan **Password** yang sesuai
5. Klik tombol **"Masuk"**
6. Jika berhasil, Anda akan diarahkan ke `/admin/dashboard`

**Catatan:** Akun Admin harus didaftarkan oleh sistem administrator sebelumnya.

---

## 2. Dashboard Admin (`/admin/dashboard`)

### Fungsi Utama:

- Menampilkan ringkasan data sistem
- Statistik pengajuan bantuan
- Grafik status penyaluran
- Quick action untuk navigasi cepat

### Komponen Dashboard:

| Komponen                | Fungsi                                                    |
| ----------------------- | --------------------------------------------------------- |
| **Total Pengajuan**     | Jumlah seluruh pengajuan yang masuk                       |
| **Pengajuan Menunggu**  | Pengajuan yang belum diproses                             |
| **Pengajuan Disetujui** | Pengajuan yang sudah disetujui                            |
| **Pengajuan Ditolak**   | Pengajuan yang ditolak                                    |
| **Grafik Status**       | Visualisasi distribusi status pengajuan                   |
| **Tombol Quick Action** | Tautan langsung ke halaman Pengajuan, Pengguna, Penugasan |

### Cara Penggunaan:

1. Amati ringkasan data di halaman utama
2. Jika ingin melihat detail pengajuan, klik **"Lihat Semua Pengajuan"**
3. Untuk mengelola pengguna, klik **"Kelola Pengguna"**
4. Untuk membuat penugasan petugas, klik **"Buat Penugasan"**

---

## 3. Kelola Pengajuan Bantuan (`/admin/pengajuan`)

### Fungsi Utama:

- Melihat daftar semua pengajuan dari masyarakat
- Memfilter berdasarkan status (Menunggu, Disetujui, Ditolak, Selesai)
- Mencari pengajuan berdasarkan nama atau NIK penerima

### Status Pengajuan:

| Status                  | Deskripsi                                       |
| ----------------------- | ----------------------------------------------- |
| **Menunggu Verifikasi** | Pengajuan baru yang belum ditugaskan ke petugas |
| **Dalam Verifikasi**    | Petugas sedang melakukan pemeriksaan lapangan   |
| **Verifikasi Selesai**  | Petugas telah menyelesaikan verifikasi lapangan |
| **Disetujui**           | Admin telah menyetujui pengajuan                |
| **Ditolak**             | Admin menolak pengajuan (diberikan alasan)      |
| **Sedang Disalurkan**   | Petugas sedang melakukan penyaluran bantuan     |
| **Selesai**             | Bantuan telah diterima oleh masyarakat          |

### Cara Penggunaan:

#### a. Melihat Daftar Pengajuan:

1. Klik menu **"Pengajuan"** di sidebar
2. Anda akan melihat tabel daftar pengajuan dengan kolom:
   - Nomor Pengajuan
   - Nama Penerima
   - NIK
   - Jenis Bantuan
   - Tanggal Pengajuan
   - Status
   - Aksi (Lihat Detail, Edit, Hapus)

#### b. Memfilter Pengajuan:

1. Gunakan dropdown **"Filter Status"** untuk melihat pengajuan berdasarkan status
2. Contoh: Pilih **"Menunggu Verifikasi"** untuk melihat pengajuan baru
3. Daftar akan otomatis tersaring

#### c. Mencari Pengajuan:

1. Gunakan kolom pencarian dengan field:
   - **Nama Penerima**
   - **NIK**
   - **Nomor Pengajuan**
2. Ketik kata kunci dan tekan **Enter** atau klik tombol **"Cari"**

#### d. Mengakses Detail Pengajuan:

1. Klik tombol **"Lihat Detail"** pada baris pengajuan yang ingin dilihat
2. Anda akan diarahkan ke `/admin/pengajuan/[id]`

---

## 4. Detail Pengajuan & Persetujuan (`/admin/pengajuan/[id]`)

### Informasi yang Ditampilkan:

#### Bagian 1: Data Penerima

| Field         | Deskripsi                     |
| ------------- | ----------------------------- |
| Nama Lengkap  | Nama penerima bantuan         |
| NIK           | Nomor Identitas Kependudukan  |
| Tanggal Lahir | Tanggal lahir penerima        |
| Jenis Kelamin | Laki-laki / Perempuan         |
| Alamat        | Alamat lengkap penerima       |
| No. Telepon   | Nomor HP yang dapat dihubungi |
| Email         | Email penerima (opsional)     |

#### Bagian 2: Data Pengajuan

| Field                  | Deskripsi                          |
| ---------------------- | ---------------------------------- |
| Nomor Pengajuan        | ID unik pengajuan (auto-generated) |
| Tanggal Pengajuan      | Tanggal pengajuan dibuat           |
| Jenis Bantuan          | Jenis bantuan yang dimohon         |
| Deskripsi Kebutuhan    | Alasan pengajuan                   |
| Dokumentasi (Lampiran) | File pendukung (foto, surat, dll)  |

#### Bagian 3: Status & Verifikasi

| Field              | Deskripsi                     |
| ------------------ | ----------------------------- |
| Status Saat Ini    | Status pengajuan              |
| Petugas Penugasan  | Nama petugas yang ditugaskan  |
| Tanggal Penugasan  | Tanggal petugas ditugaskan    |
| Catatan Verifikasi | Catatan dari petugas lapangan |
| Tanggal Verifikasi | Tanggal verifikasi dilakukan  |

### Alur Pengajuan & Aksi Admin:

#### Tahap 1: Pengajuan Baru (Status: "Menunggu Verifikasi")

**Aksi yang dapat dilakukan:**

1. **Membaca Detail Pengajuan**: Periksa semua informasi penerima dan alasan pengajuan
2. **Membuat Penugasan Petugas**:
   - Klik tombol **"Tugaskan Petugas"**
   - Akan muncul dialog dengan pilihan petugas yang tersedia
   - Pilih petugas dari dropdown **"Pilih Petugas"**
   - Klik **"Konfirmasi Penugasan"**
   - Status berubah menjadi **"Dalam Verifikasi"**

#### Tahap 2: Hasil Verifikasi (Status: "Verifikasi Selesai")

**Aksi yang dapat dilakukan:**

1. **Membaca Laporan Verifikasi**:
   - Lihat catatan/kesimpulan dari petugas
   - Review foto verifikasi (jika ada)
2. **Menyetujui Pengajuan**:
   - Klik tombol **"Setujui Pengajuan"**
   - Opsional: Tambahkan catatan persetujuan
   - Klik **"Konfirmasi Persetujuan"**
   - Status berubah menjadi **"Disetujui"**
   - Notifikasi dikirim ke masyarakat

3. **Menolak Pengajuan**:
   - Klik tombol **"Tolak Pengajuan"**
   - Wajib mengisi **"Alasan Penolakan"** (diperlukan untuk transparansi)
   - Klik **"Konfirmasi Penolakan"**
   - Status berubah menjadi **"Ditolak"**
   - Notifikasi dikirim ke masyarakat dengan alasan penolakan

#### Tahap 3: Setelah Persetujuan (Status: "Disetujui")

**Aksi yang dapat dilakukan:**

1. Monitor penyaluran bantuan
2. Tunggu hingga petugas melakukan scan QR Code
3. Status akan otomatis berubah menjadi **"Selesai"**

---

## 5. Kelola Pengguna (`/admin/pengguna`)

### Fungsi Utama:

- Melihat daftar seluruh pengguna (Admin, Masyarakat, Petugas)
- Menambah pengguna baru
- Mengedit informasi pengguna
- Menonaktifkan/mengaktifkan akun pengguna
- Mengelola role dan permission

### Cara Penggunaan:

#### a. Melihat Daftar Pengguna:

1. Klik menu **"Pengguna"** di sidebar
2. Anda akan melihat tabel dengan kolom:
   - No. Urut
   - Nama Pengguna
   - Email
   - Role (Admin/Masyarakat/Petugas)
   - Status (Aktif/Nonaktif)
   - Tanggal Terdaftar
   - Aksi (Edit, Hapus, Nonaktifkan)

#### b. Memfilter Pengguna Berdasarkan Role:

1. Gunakan dropdown **"Filter Role"**
2. Pilihan: Semua, Admin, Masyarakat, Petugas
3. Daftar akan tersaring sesuai role yang dipilih

#### c. Mencari Pengguna:

1. Gunakan kolom pencarian dengan field:
   - **Nama Pengguna**
   - **Email**
2. Ketik kata kunci dan tekan **Enter**

#### d. Menambah Pengguna Baru:

1. Klik tombol **"+ Tambah Pengguna"**
2. Isi form dengan data:
   - **Nama Lengkap**: Nama pengguna
   - **Email**: Email unik (belum terdaftar)
   - **Password**: Password sementara (user bisa ubah saat login pertama)
   - **Role**: Pilih role (Admin, Masyarakat, Petugas)
   - **Status**: Pilih Aktif (default)
3. Klik **"Simpan"**
4. Sistem akan mengirimkan email notifikasi ke pengguna baru dengan kredensial login

#### e. Mengedit Pengguna:

1. Klik tombol **"Edit"** pada baris pengguna yang ingin diubah
2. Ubah informasi yang diperlukan:
   - Nama Lengkap
   - Email
   - Role
   - Status
3. Klik **"Simpan Perubahan"**

#### f. Menonaktifkan Pengguna:

1. Klik tombol **"Nonaktifkan"** pada baris pengguna
2. Konfirmasi dengan klik **"Ya, Nonaktifkan"**
3. Pengguna tidak akan dapat login (akun tetap ada untuk riwayat)

#### g. Mengaktifkan Kembali Pengguna:

1. Filter status atau cari pengguna yang nonaktif
2. Klik tombol **"Aktifkan"**
3. Pengguna dapat kembali login

---

## 6. Penugasan Petugas (`/admin/penugasan`)

### Fungsi Utama:

- Membuat penugasan petugas untuk verifikasi lapangan
- Melihat riwayat penugasan
- Tracking progress penugasan

### Cara Penggunaan:

#### a. Melihat Daftar Penugasan:

1. Klik menu **"Penugasan"** di sidebar
2. Anda akan melihat tabel dengan kolom:
   - ID Penugasan
   - Petugas
   - Pengajuan (Nama Penerima)
   - Tanggal Penugasan
   - Tanggal Target Verifikasi
   - Status (Belum Dimulai, Dalam Proses, Selesai)
   - Aksi (Lihat Detail, Ubah, Hapus)

#### b. Membuat Penugasan Baru:

1. Klik tombol **"+ Buat Penugasan"**
2. Isi form:
   - **Pilih Petugas**: Dropdown daftar petugas yang tersedia
   - **Pilih Pengajuan**: Dropdown pengajuan dengan status "Menunggu Verifikasi"
   - **Tanggal Target**: Tanggal target penyelesaian verifikasi
   - **Catatan Penugasan**: Informasi tambahan untuk petugas (opsional)
3. Klik **"Simpan Penugasan"**
4. Sistem akan mengirim notifikasi ke petugas dan perubahan status pengajuan menjadi "Dalam Verifikasi"

#### c. Tracking Progress Penugasan:

1. Lihat kolom **"Status"** di tabel penugasan
2. Status dapat berupa:
   - **Belum Dimulai**: Petugas belum memulai verifikasi
   - **Dalam Proses**: Petugas sedang melakukan verifikasi lapangan
   - **Selesai**: Verifikasi telah selesai
3. Klik **"Lihat Detail"** untuk melihat:
   - Waktu mulai verifikasi
   - Catatan dari petugas
   - Foto dokumentasi (jika ada)
   - Rekomendasi petugas

#### d. Mengubah Penugasan:

1. Klik tombol **"Ubah"** pada baris penugasan
2. Ubah data yang diperlukan:
   - Petugas (reassign ke petugas lain)
   - Tanggal target
   - Catatan penugasan
3. Klik **"Simpan Perubahan"**

#### e. Membatalkan Penugasan:

1. Klik tombol **"Hapus"** pada baris penugasan
2. Konfirmasi dengan klik **"Ya, Batalkan Penugasan"**
3. Status pengajuan kembali menjadi "Menunggu Verifikasi"
4. Notifikasi dikirim ke petugas

---

## 7. Notifikasi Admin (`/admin/notifikasi`)

### Fungsi Utama:

- Melihat notifikasi sistem
- Menandai notifikasi sebagai sudah dibaca
- Menghapus notifikasi

### Jenis Notifikasi yang Diterima:

| Jenis                       | Deskripsi                                    |
| --------------------------- | -------------------------------------------- |
| **Pengajuan Baru**          | Notifikasi ketika ada pengajuan bantuan baru |
| **Verifikasi Selesai**      | Notifikasi ketika petugas selesai verifikasi |
| **Pengguna Baru Terdaftar** | Notifikasi ketika ada pendaftar baru         |
| **Penyaluran Selesai**      | Notifikasi ketika penyaluran bantuan selesai |

### Cara Penggunaan:

1. Klik menu **"Notifikasi"** di sidebar
2. Baca daftar notifikasi terbaru
3. Klik notifikasi untuk melihat detail dan navigasi ke halaman terkait
4. Notifikasi otomatis ditandai sebagai **"Sudah Dibaca"** setelah diklik
5. Untuk menghapus, klik ikon **"Hapus"** pada notifikasi

---

# PANDUAN MASYARAKAT

## 1. Registrasi Akun Masyarakat

### Langkah-langkah:

1. Buka website SIMPAN
2. Klik tombol **"Daftar"** atau akses `/register`
3. Isi form registrasi dengan data:
   - **Nama Lengkap**: Sesuai KTP/identitas
   - **Email**: Email aktif yang bisa diverifikasi
   - **Password**: Minimal 8 karakter (kombinasi huruf besar, huruf kecil, angka)
   - **Konfirmasi Password**: Ketik ulang password
   - **Nomor Telepon**: Nomor HP yang aktif (untuk notifikasi)
4. Centang checkbox **"Saya setuju dengan Syarat & Ketentuan"**
5. Klik tombol **"Daftar"**
6. Sistem akan mengirim email verifikasi
7. Buka email dan klik link verifikasi
8. Akun siap digunakan, lanjut ke login

---

## 2. Login Sebagai Masyarakat

### Langkah-langkah:

1. Buka website SIMPAN di `/login`
2. Masukkan **Email** dan **Password** yang terdaftar
3. Klik tombol **"Masuk"**
4. Jika berhasil, Anda akan diarahkan ke `/masyarakat/dashboard`

**Tips Keamanan:**

- Jangan bagikan password kepada orang lain
- Gunakan password yang kuat dan mudah diingat
- Jika lupa password, klik **"Lupa Password?"** di halaman login

---

## 3. Dashboard Masyarakat (`/masyarakat/dashboard`)

### Fungsi Utama:

- Menampilkan ringkasan status pengajuan
- Quick action untuk berbagai fitur
- Notifikasi terbaru

### Komponen Dashboard:

| Komponen                | Fungsi                                                      |
| ----------------------- | ----------------------------------------------------------- |
| **Profil Singkat**      | Menampilkan nama, email, foto profil                        |
| **Status Pengajuan**    | Statistik pengajuan (Menunggu, Disetujui, Ditolak, Selesai) |
| **Pengajuan Terbaru**   | Daftar 5 pengajuan terbaru dengan status                    |
| **Notifikasi Terbaru**  | 5 notifikasi terbaru                                        |
| **Tombol Quick Action** | Tautan langsung ke Pengajuan, Profil, QR Code               |

### Cara Penggunaan:

1. Setelah login, Anda langsung masuk ke dashboard
2. Baca ringkasan status pengajuan Anda
3. Jika ingin mengajukan bantuan baru, klik **"Buat Pengajuan Baru"**
4. Jika ingin melihat riwayat pengajuan, klik **"Lihat Semua Pengajuan"**
5. Untuk mengecek status terbaru, lihat kolom **"Pengajuan Terbaru"**

---

## 4. Profil Masyarakat (`/masyarakat/profil`)

### Fungsi Utama:

- Menampilkan data profil lengkap
- Melengkapi data pribadi
- Update informasi kontak

### Data yang Ditampilkan:

| Kategori            | Field                                                  |
| ------------------- | ------------------------------------------------------ |
| **Data Pribadi**    | Nama Lengkap, NIK, Tempat/Tanggal Lahir, Jenis Kelamin |
| **Kontak**          | Email, No. Telepon, Alamat Lengkap                     |
| **Dokumen**         | Nomor Rekening Bank, Nama Bank, Atas Nama Pemilik      |
| **Profil Lanjutan** | Pekerjaan, Pendidikan, Status Keluarga (opsional)      |

### Cara Penggunaan:

#### a. Melihat Profil Lengkap:

1. Klik menu **"Profil"** di sidebar
2. Anda akan melihat halaman overview profil
3. Data ditampilkan dalam beberapa bagian sesuai kategori

#### b. Mengubah/Melengkapi Profil (Step by Step):

1. Klik tombol **"Edit Profil"**
2. Sistem akan membawa Anda ke `/masyarakat/profil/[step]` dengan form bertahap
3. **Step 1 - Data Pribadi**:
   - Masukkan/ubah Nama Lengkap
   - Masukkan NIK (tidak dapat diubah setelah verifikasi)
   - Pilih Tempat Lahir
   - Pilih Tanggal Lahir
   - Pilih Jenis Kelamin
   - Klik **"Lanjut ke Step Berikutnya"**

4. **Step 2 - Alamat & Kontak**:
   - Masukkan Alamat Lengkap (Jalan, No. Rumah)
   - Pilih Kelurahan/Desa
   - Pilih Kecamatan
   - Pilih Kabupaten/Kota
   - Pilih Provinsi
   - Masukkan Nomor Telepon (untuk notifikasi)
   - Klik **"Lanjut ke Step Berikutnya"**

5. **Step 3 - Dokumen & Bank**:
   - Masukkan Nomor Rekening Bank (untuk penyaluran bantuan)
   - Pilih Nama Bank
   - Masukkan Nama Pemilik Rekening
   - Upload Foto KTP (untuk verifikasi)
   - Klik **"Lanjut ke Step Berikutnya"**

6. **Step 4 - Informasi Tambahan** (opsional):
   - Masukkan Pekerjaan
   - Pilih Pendidikan Terakhir
   - Pilih Status Keluarga
   - Masukkan Jumlah Anggota Keluarga
   - Klik **"Selesaikan Profil"**

7. Data tersimpan otomatis di setiap step

#### c. Verifikasi Data Profil:

1. Setelah melengkapi semua data, sistem akan memverifikasi data Anda
2. Notifikasi akan dikirim ketika verifikasi selesai
3. Data yang terverifikasi tidak dapat diubah

---

## 5. Membuat Pengajuan Bantuan (`/masyarakat/pengajuan`)

### Fungsi Utama:

- Membuat pengajuan bantuan baru
- Melihat riwayat pengajuan
- Melacak status pengajuan

### Cara Penggunaan:

#### a. Melihat Daftar Pengajuan:

1. Klik menu **"Pengajuan"** di sidebar
2. Anda akan melihat tabel pengajuan dengan kolom:
   - Nomor Pengajuan
   - Jenis Bantuan
   - Tanggal Pengajuan
   - Status
   - Aksi (Lihat Detail, Edit, Hapus)

#### b. Membuat Pengajuan Baru:

**Syarat:**

- Profil sudah dilengkapi dengan data yang valid
- Email sudah diverifikasi
- NIK sudah terverifikasi

**Langkah-langkah:**

1. Klik tombol **"+ Buat Pengajuan Baru"**
2. Isi form pengajuan:

   **Bagian 1 - Informasi Dasar:**
   - **Jenis Bantuan**: Pilih dari dropdown (Makanan, Kesehatan, Pendidikan, Tempat Tinggal, dll)
   - **Jumlah Bantuan**: Isi jumlah yang dimohon (jika ada)

   **Bagian 2 - Deskripsi Kebutuhan:**
   - **Alasan Pengajuan**: Uraikan dengan jelas alasan mengapa Anda membutuhkan bantuan
   - **Kondisi Keluarga**: Jelaskan situasi keluarga Anda saat ini
   - **Usaha yang Sudah Dilakukan**: Tuliskan upaya apa saja yang sudah dilakukan

   **Bagian 3 - Dokumentasi:**
   - **Upload Foto/Bukti**: Upload hingga 5 file pendukung (foto, surat, dokumen)
   - Format file: JPG, PNG, PDF (max 5 MB per file)
   - Contoh: Foto keadaan rumah, surat keterangan tidak mampu, kartu keluarga

3. Klik **"Lihat Preview"** untuk mengecek data sebelum submit
4. Klik **"Kirim Pengajuan"** untuk submit
5. Sistem akan menampilkan nomor pengajuan dan status **"Menunggu Verifikasi"**
6. Notifikasi dikirim ke admin dan email Anda

#### c. Melacak Status Pengajuan:

1. Di halaman daftar pengajuan, lihat kolom **"Status"**

**Status yang Mungkin Muncul:**
| Status | Arti | Aksi Masyarakat |
|--------|------|-----------------|
| **Menunggu Verifikasi** | Admin belum menugaskan petugas | Tunggu notifikasi |
| **Dalam Verifikasi** | Petugas sedang melakukan pemeriksaan lapangan | Siapkan diri untuk kunjungan petugas |
| **Verifikasi Selesai** | Petugas selesai, menunggu keputusan admin | Tunggu persetujuan/penolakan |
| **Disetujui** | Admin menyetujui pengajuan | Tunggu notifikasi penyaluran |
| **Ditolak** | Admin menolak pengajuan | Baca alasan penolakan, bisa buat pengajuan baru |
| **Sedang Disalurkan** | Petugas akan melakukan penyaluran | Siapkan diri untuk menerima bantuan |
| **Selesai** | Bantuan sudah diterima | Notifikasi penerima |

2. Untuk melihat detail lengkap, klik tombol **"Lihat Detail"** pada baris pengajuan

#### d. Melihat Detail Pengajuan:

1. Klik tombol **"Lihat Detail"** pada pengajuan yang ingin dilihat
2. Halaman akan menampilkan:
   - Data lengkap pengajuan (jenis bantuan, tanggal, deskripsi)
   - Timeline status (kapan status berubah)
   - Catatan verifikasi dari petugas (jika ada)
   - Alasan penolakan (jika ditolak)
   - Informasi penyaluran (jika disetujui)

#### e. Mengedit Pengajuan:

1. **Hanya dapat mengedit jika status masih "Menunggu Verifikasi"**
2. Klik tombol **"Edit"** pada pengajuan
3. Ubah informasi yang diperlukan
4. Klik **"Simpan Perubahan"**
5. Notifikasi dikirim ke admin tentang perubahan pengajuan

#### f. Membatalkan Pengajuan:

1. **Hanya dapat dibatalkan jika status "Menunggu Verifikasi"**
2. Klik tombol **"Hapus"** pada pengajuan
3. Konfirmasi dengan klik **"Ya, Batalkan Pengajuan"**
4. Pengajuan berubah status menjadi **"Dibatalkan"**

---

## 6. QR Code Masyarakat (`/masyarakat/qrcode`)

### Fungsi Utama:

- Melihat QR Code unik Anda
- Menggunakan QR Code saat penyaluran bantuan
- Riwayat scan QR Code

### Cara Penggunaan:

#### a. Melihat QR Code Pribadi:

1. Klik menu **"QR Code"** di sidebar
2. Anda akan melihat:
   - QR Code unik Anda (linked ke profil)
   - Nomor ID QR Code
   - Informasi: "Tunjukkan QR Code ini saat menerima bantuan"

#### b. Saat Petugas Datang Menyalurkan Bantuan:

1. Petugas akan meminta Anda untuk menunjukkan QR Code
2. Anda dapat menampilkan QR Code dari:
   - Layar smartphone ini (online)
   - Screenshot QR Code (offline)
3. Petugas akan menscan QR Code menggunakan aplikasi petugas
4. Sistem akan mencatat bahwa bantuan telah diterima

#### c. Melihat Riwayat Penerimaan:

1. Di halaman QR Code, gulir ke bawah
2. Lihat tabel **"Riwayat Penerimaan Bantuan"** dengan kolom:
   - Nomor Pengajuan
   - Jenis Bantuan
   - Tanggal Diterima
   - Nama Petugas
   - Jumlah Bantuan
3. Setiap scan QR Code akan tercatat di sini

---

## 7. Notifikasi Masyarakat (`/masyarakat/notifikasi`)

### Fungsi Utama:

- Menerima notifikasi perubahan status pengajuan
- Menerima informasi penting dari sistem

### Jenis Notifikasi:

| Jenis                       | Deskripsi                                             |
| --------------------------- | ----------------------------------------------------- |
| **Pengajuan Diterima**      | Konfirmasi pengajuan Anda sudah diterima sistem       |
| **Penugasan Petugas**       | Pemberitahuan petugas akan segera mengunjungi Anda    |
| **Verifikasi Selesai**      | Petugas sudah selesai verifikasi lapangan             |
| **Pengajuan Disetujui**     | Admin menyetujui pengajuan Anda                       |
| **Pengajuan Ditolak**       | Admin menolak pengajuan, baca alasan penolakan        |
| **Bantuan Siap Disalurkan** | Pemberitahuan petugas akan datang menyalurkan bantuan |
| **Bantuan Sudah Diterima**  | Konfirmasi penerimaan bantuan (setelah scan QR)       |

### Cara Penggunaan:

1. Klik menu **"Notifikasi"** di sidebar
2. Baca daftar notifikasi terbaru
3. Klik notifikasi untuk melihat detail atau navigasi ke halaman terkait
4. Notifikasi otomatis ditandai **"Sudah Dibaca"** setelah diklik
5. Untuk menghapus notifikasi, klik ikon **"Hapus"**

**Tips:**

- Enable notifikasi push di browser untuk menerima alert real-time
- Pastikan nomor telepon terdaftar untuk menerima SMS notifikasi
- Check notifikasi secara berkala untuk update terbaru

---

# PANDUAN PETUGAS

## 1. Login Sebagai Petugas

### Langkah-langkah:

1. Buka website SIMPAN di `/login`
2. Masukkan **Email** dan **Password** petugas (diberikan oleh admin)
3. Klik tombol **"Masuk"**
4. Jika berhasil, Anda akan diarahkan ke `/petugas/dashboard`

**Catatan:** Akun petugas dibuat dan diaktifkan oleh admin sistem.

---

## 2. Dashboard Petugas (`/petugas/dashboard`)

### Fungsi Utama:

- Menampilkan ringkasan penugasan
- Daftar pengajuan yang ditugaskan
- Quick action untuk scan QR Code

### Komponen Dashboard:

| Komponen                      | Fungsi                                     |
| ----------------------------- | ------------------------------------------ |
| **Profil Singkat**            | Menampilkan nama petugas, lokasi penugasan |
| **Penugasan Aktif**           | Jumlah penugasan yang sedang berjalan      |
| **Penugasan Selesai**         | Jumlah penugasan yang sudah diselesaikan   |
| **Pengajuan yang Ditugaskan** | Daftar pengajuan yang perlu diverifikasi   |
| **Tombol Quick Action**       | Tautan langsung ke Scan QR, Riwayat        |

### Cara Penggunaan:

1. Setelah login, Anda langsung masuk ke dashboard
2. Lihat **"Penugasan Aktif"** untuk mengetahui jumlah pekerjaan
3. Di bagian **"Pengajuan yang Ditugaskan"**, lihat daftar:
   - Nama Penerima
   - Alamat Penerima
   - Tanggal Penugasan
   - Status (Belum Dimulai, Dalam Proses, Selesai)
4. Klik **"Mulai Verifikasi"** untuk pengajuan yang belum dikerjakan
5. Untuk melihat riwayat lengkap, klik **"Lihat Semua Riwayat"**

---

## 3. Melakukan Verifikasi Lapangan

### Alur Verifikasi:

```
Menerima Penugasan
  ↓
Kunjungi Alamat Penerima
  ↓
Verifikasi Data & Kondisi
  ↓
Dokumentasi (Foto)
  ↓
Input Hasil Verifikasi
  ↓
Kirim Laporan ke Admin
  ↓
Admin Membuat Keputusan
```

### Tahap 1: Menerima Penugasan

#### a. Notifikasi Penugasan:

1. Setelah admin membuat penugasan, Anda akan menerima notifikasi
2. Notifikasi berisi:
   - Nama penerima bantuan
   - Alamat lengkap
   - Jenis bantuan
   - Tanggal target verifikasi
   - Catatan penugasan dari admin

#### b. Memulai Verifikasi:

1. Di dashboard, klik **"Mulai Verifikasi"** pada penugasan yang diterima
2. Atau akses dari menu **"Riwayat"** dan pilih penugasan
3. Status berubah menjadi **"Dalam Proses"**

### Tahap 2: Kunjungan Lapangan

#### Persiapan Sebelum Kunjungan:

1. Baca data penerima dengan cermat:
   - Alamat lengkap
   - Nama dan NIK
   - Jenis bantuan yang dimohon
   - Alasan pengajuan

2. Siapkan dokumentasi yang diperlukan:
   - Smartphone dengan aplikasi SIMPAN terinstall
   - Kamera untuk dokumentasi
   - Formulir verifikasi cetak (jika diperlukan offline)

3. Hubungi penerima:
   - Tunjukkan identitas petugas
   - Jelaskan tujuan kunjungan
   - Pastikan penerima bersedia diverifikasi

#### Proses Verifikasi di Lapangan:

1. **Verifikasi Identitas Penerima:**
   - Periksa KTP atau kartu identitas lainnya
   - Cocokkan dengan data di sistem
   - Catat nomor identitas

2. **Verifikasi Alamat:**
   - Pastikan alamat sesuai dengan data pengajuan
   - Catat lokasi yang tepat (RT/RW, landmark)
   - Jika berbeda, update di sistem

3. **Verifikasi Kondisi:**
   - Amati kondisi rumah/tempat tinggal
   - Tanyakan tentang kondisi keluarga
   - Tanyakan tentang sumber penghasilan
   - Tanyakan tentang pengeluaran bulanan
   - Verifikasi alasan pengajuan (sesuai atau tidak)

4. **Dokumentasi Foto:**
   - Foto rumah/tempat tinggal (depan & samping)
   - Foto ruangan (ruang tamu, kamar tidur)
   - Foto kondisi penerima (dengan izin)
   - Foto bersama penerima (untuk dokumentasi)
   - Dokumentasi keluarga atau kondisi khusus (jika relevan)

### Tahap 3: Input Hasil Verifikasi

#### Cara Penggunaan Halaman Verifikasi:

1. Buka aplikasi SIMPAN di smartphone
2. Navigasi ke menu **"Riwayat"** atau dari dashboard
3. Klik pada pengajuan yang sedang diverifikasi
4. Sistem akan membuka form **"Laporan Verifikasi"** dengan beberapa bagian:

**Bagian 1 - Validasi Data Penerima:**

- Nama Penerima: **\_\_\_**
- NIK: **\_\_\_**
- Alamat Sesuai Data: ☐ Ya ☐ Tidak
- Catatan Perubahan Alamat (jika ada): **\_\_\_**

**Bagian 2 - Verifikasi Kondisi:**

- Kondisi Rumah:
  - ☐ Sangat Baik
  - ☐ Baik
  - ☐ Cukup
  - ☐ Buruk
  - ☐ Sangat Buruk

- Kondisi Ekonomi Keluarga:
  - ☐ Berkecukupan
  - ☐ Menengah
  - ☐ Kurang Mampu
  - ☐ Sangat Kurang Mampu

- Keadaan Keluarga:
  - Jumlah Anggota Keluarga: **\_\_\_**
  - Ada Anak Sekolah: ☐ Ya ☐ Tidak
  - Keadaan Khusus (lansia, cacat, dll): **\_\_\_**

**Bagian 3 - Verifikasi Alasan Pengajuan:**

- Alasan yang Diklaim: [Tampil otomatis dari data pengajuan]
- Alasan Terbukti: ☐ Ya ☐ Sebagian ☐ Tidak
- Penjelasan: **\_\_\_**

**Bagian 4 - Rekomendasi:**

- Rekomendasi Anda:
  - ☐ Sangat Layak (Disetujui)
  - ☐ Layak (Disetujui)
  - ☐ Kurang Layak (Pertimbangkan)
  - ☐ Tidak Layak (Ditolak)

- Alasan Rekomendasi: **\_\_\_**

**Bagian 5 - Dokumentasi Foto:**

- Upload Foto: [Pilih Foto dari Galeri]
- Jumlah Foto: **\_** (upload minimum 3 foto)
- Preview Foto: [Tampilkan thumbnail foto yang diupload]

5. Setelah semua form diisi, klik **"Review Laporan"**
6. Periksa ulang semua data yang sudah diisi
7. Klik **"Kirim Laporan ke Admin"**
8. Sistem akan menampilkan pesan **"Laporan Verifikasi Berhasil Dikirim"**
9. Status berubah menjadi **"Selesai"** (verifikasi lapangan)
10. Admin akan menerima notifikasi untuk membuat keputusan

---

## 4. Scan QR Code Penyaluran (`/petugas/scan`)

### Fungsi Utama:

- Menscan QR Code masyarakat saat penyaluran bantuan
- Mencatat penerimaan bantuan
- Melengkapi dokumentasi penyaluran

### Alur Penyaluran:

```
Admin Menyetujui Pengajuan
  ↓
Petugas Menerima Notifikasi
  ↓
Petugas Kunjungi Penerima
  ↓
Penerima Tunjukkan QR Code
  ↓
Petugas Scan QR Code
  ↓
Input Detail Penyaluran
  ↓
Sistem Catat Penerimaan
  ↓
Notifikasi ke Masyarakat
```

### Cara Penggunaan:

#### a. Navigasi ke Halaman Scan:

1. Dari dashboard, klik tombol **"Scan QR Code"**
2. Atau dari sidebar, klik menu **"Scan QR"**
3. Anda akan masuk ke `/petugas/scan`

#### b. Persiapan Scan:

1. Pastikan smartphone terhubung internet
2. Pastikan kamera smartphone dalam kondisi baik
3. Pastikan pencahayaan cukup (jangan terlalu gelap)
4. Buka halaman scan QR Code

#### c. Proses Scan QR Code:

1. Halaman scan akan menampilkan preview kamera
2. Minta penerima bantuan menampilkan QR Code mereka
3. Arahkan kamera smartphone ke QR Code
4. Sistem akan otomatis membaca QR Code ketika terdeteksi
5. Sistem akan menampilkan data penerima:
   - Nama Lengkap
   - NIK
   - Jenis Bantuan
   - Nomor Pengajuan

#### d. Verifikasi Data:

1. Periksa data yang ditampilkan
2. Pastikan sesuai dengan penerima yang akan menerima bantuan
3. Jika cocok, lanjutkan ke step berikutnya
4. Jika tidak cocok, klik **"Baca Ulang"** dan scan QR Code lagi

#### e. Input Detail Penyaluran:

Setelah QR Code terbaca, form akan muncul dengan field:

**Bagian 1 - Konfirmasi Penerima:**

- Nama Penerima: [Auto-fill]
- NIK: [Auto-fill]
- Hubungi Sesuai NIK: ☐ Ya ☐ Tidak

**Bagian 2 - Detail Penyaluran:**

- Jenis Bantuan: [Auto-fill]
- Jumlah/Nominal Bantuan: **\_\_\_**
- Bentuk Penyaluran:
  - ☐ Tunai
  - ☐ Transfer Bank
  - ☐ Barang Fisik
  - ☐ Lainnya

**Bagian 3 - Tanda Tangan/Konfirmasi:**

- Tanda Tangan Penerima: [Canvas untuk tanda tangan digital]
- Foto Penyaluran: [Upload foto saat penyaluran]
- Catatan Khusus: **\_\_\_**

**Bagian 4 - Bukti Penerimaan:**

- Penerima Menyatakan Sudah Menerima: ☐ Ya
- Waktu Penyaluran: [Auto-fill timestamp]

6. Lengkapi semua field yang wajib diisi
7. Klik **"Konfirmasi Penyaluran"**
8. Sistem akan menampilkan **"Penyaluran Berhasil Dicatat"**
9. Status pengajuan berubah menjadi **"Selesai"**
10. Notifikasi dikirim ke masyarakat tentang penerimaan bantuan

#### f. Riwayat Scan:

1. Setelah scan, di halaman scan terdapat **"Riwayat Scan Hari Ini"**
2. Tabel menampilkan:
   - Waktu Scan
   - Nama Penerima
   - Jenis Bantuan
   - Status (Berhasil/Gagal)
3. Klik baris untuk melihat detail penyaluran

---

## 5. Riwayat Penugasan & Penyaluran (`/petugas/riwayat`)

### Fungsi Utama:

- Melihat daftar lengkap penugasan
- Melacak progress pekerjaan
- Melihat riwayat penyaluran bantuan

### Cara Penggunaan:

#### a. Melihat Daftar Riwayat:

1. Klik menu **"Riwayat"** di sidebar
2. Anda akan melihat tabel dengan kolom:
   - No. Pengajuan
   - Nama Penerima
   - Jenis Bantuan
   - Tanggal Penugasan
   - Status Verifikasi
   - Status Penyaluran
   - Aksi (Lihat Detail)

#### b. Memfilter Riwayat:

1. Gunakan dropdown **"Filter Status"**:
   - **Belum Dimulai**: Penugasan yang belum dikerjakan
   - **Dalam Proses**: Verifikasi sedang berlangsung
   - **Selesai**: Verifikasi selesai, menunggu penyaluran
   - **Disalurkan**: Bantuan sudah disalurkan kepada penerima

2. Gunakan **"Filter Tanggal"** untuk melihat penugasan dalam periode tertentu

3. Gunakan **"Pencarian"** untuk cari berdasarkan:
   - Nama Penerima
   - Nomor Pengajuan

#### c. Melihat Detail Riwayat:

1. Klik tombol **"Lihat Detail"** pada baris yang ingin dilihat
2. Halaman detail akan menampilkan:
   - **Informasi Penerima**: Nama, NIK, Alamat
   - **Informasi Pengajuan**: Jenis bantuan, deskripsi
   - **Timeline Proses**:
     - Tanggal penugasan
     - Tanggal verifikasi dimulai
     - Tanggal verifikasi selesai
     - Tanggal penyaluran
   - **Laporan Verifikasi**: Kondisi rumah, rekomendasi, foto
   - **Bukti Penyaluran**: Foto penyaluran, tanda tangan, catatan

#### d. Download Laporan:

1. Di halaman detail, klik tombol **"Download Laporan PDF"**
2. File PDF akan diunduh dengan format:
   - Header: Logo Sistem, Tanggal Laporan
   - Data Penerima
   - Timeline
   - Hasil Verifikasi
   - Bukti Penyaluran
   - Tanda Tangan Digital

---

## 6. Notifikasi Petugas (`/petugas/notifikasi`)

### Fungsi Utama:

- Menerima notifikasi penugasan baru
- Menerima instruksi dari admin
- Tracking deadline penugasan

### Jenis Notifikasi:

| Jenis                    | Deskripsi                                                    |
| ------------------------ | ------------------------------------------------------------ |
| **Penugasan Baru**       | Ada pengajuan baru untuk diverifikasi                        |
| **Pengingat Deadline**   | Deadline verifikasi sudah mendekati                          |
| **Perubahan Penugasan**  | Admin mengubah informasi penugasan (reassign, deadline baru) |
| **Instruksi dari Admin** | Admin memberikan catatan/instruksi khusus                    |
| **Persetujuan Laporan**  | Admin telah review laporan verifikasi Anda                   |
| **Siap Penyaluran**      | Admin menyetujui pengajuan, waktunya melakukan penyaluran    |

### Cara Penggunaan:

1. Klik menu **"Notifikasi"** atau ikon notifikasi di header
2. Baca daftar notifikasi terbaru
3. Klik notifikasi untuk melihat detail atau navigasi ke penugasan terkait
4. Notifikasi otomatis ditandai **"Sudah Dibaca"** setelah diklik

---

## 7. Panduan Teknis & Tips Penggunaan

### Koneksi Internet:

- Pastikan smartphone selalu terhubung internet (WiFi atau data mobile)
- Jika offline, data form akan tersimpan sementara dan sinkronisasi otomatis saat online
- Untuk scan QR Code, internet wajib aktif

### Penggunaan Kamera:

- Pastikan izin akses kamera sudah diberikan ke aplikasi
- Kamera harus berfungsi dengan baik sebelum scan
- Untuk foto dokumentasi, gunakan pencahayaan yang cukup
- Pastikan QR Code terlihat jelas dan tidak rusak saat scan

### Dokumentasi Foto:

- Foto minimum 3 lembar untuk verifikasi lapangan
- Foto wajib mencakup:
  - Rumah/tempat tinggal
  - Ruangan dalam rumah
  - Kondisi keluarga (dengan persetujuan)
- Untuk penyaluran, dokumentasi foto membantu transparansi
- Simpan data backup foto di smartphone Anda

### Komunikasi dengan Penerima:

- Bersikap profesional dan ramah
- Jelaskan tujuan kunjungan dengan jelas
- Tunjukkan identitas petugas
- Minta izin sebelum mengambil foto
- Jaga kerahasiaan data pribadi penerima
- Hindari membuat janji yang tidak bisa dipenuhi

### Deadline Penugasan:

- Perhatikan tanggal target verifikasi dari admin
- Jika tidak bisa memenuhi deadline, hubungi admin segera
- Prioritaskan penugasan dengan deadline paling dekat
- Update status penugasan secara berkala

---

# FAQ & TROUBLESHOOTING

## Pertanyaan Umum

### Akun & Login

**Q: Lupa password, bagaimana caranya?**
A: Klik link **"Lupa Password?"** di halaman login. Sistem akan mengirim email dengan link reset password. Periksa email masuk (atau folder spam). Klik link dan buat password baru.

**Q: Akun saya terkunci, apa yang harus dilakukan?**
A: Hubungi admin sistem. Admin dapat menonaktifkan dan mengaktifkan kembali akun Anda, atau mereset password Anda.

**Q: Bagaimana cara mengganti password?**
A: Login ke akun Anda, buka menu **"Pengaturan Akun"** atau **"Profil"**, cari opsi **"Ubah Password"**, masukkan password lama dan password baru, lalu simpan.

### Pengajuan Bantuan (Masyarakat)

**Q: Berapa lama waktu yang dibutuhkan untuk diverifikasi?**
A: Biasanya 5-7 hari kerja. Admin akan menugaskan petugas dalam 1-2 hari, kemudian petugas melakukan kunjungan lapangan.

**Q: Apakah boleh membuat lebih dari satu pengajuan sekaligus?**
A: Ya, Anda boleh membuat beberapa pengajuan untuk jenis bantuan berbeda. Namun sebaiknya tunggu keputusan pengajuan pertama sebelum membuat yang baru.

**Q: Data saya tidak lengkap, boleh diedit nanti?**
A: Pengajuan hanya bisa diedit selama status masih **"Menunggu Verifikasi"**. Setelah petugas mulai verifikasi, data tidak bisa diubah (untuk menjaga integritas).

**Q: Bagaimana jika pengajuan ditolak?**
A: Baca alasan penolakan dengan baik. Jika ada kesalahan, Anda bisa membuat pengajuan baru dengan data yang lebih akurat.

### Verifikasi Lapangan (Petugas)

**Q: Bagaimana jika penerima tidak ada di rumah saat kunjungan?**
A: Coba hubungi dahulu sebelum kunjungan (gunakan nomor telepon di sistem). Jika tetap tidak ada, dokumentasikan dan laporkan ke admin. Admin bisa menugaskan ulang dengan jadwal baru.

**Q: Apa jika alamat penerima berbeda dengan data di sistem?**
A: Verifikasi identitas dengan KTP/kartu identitas. Jika address benar-benar berbeda, update di form verifikasi dan berikan penjelasan. Admin akan meninjau dan memutuskan.

**Q: Bagaimana cara scan QR Code jika penerima tidak bisa online?**
A: Penerima dapat menampilkan QR Code dari screenshot atau versi offline yang sudah disimpan. QR Code adalah statis dan tidak memerlukan internet untuk ditampilkan.

### Scan QR Code (Petugas)

**Q: QR Code tidak terbaca, apa yang harus dilakukan?**
A: Pastikan cahaya cukup, jarak yang tepat dari kamera (15-30 cm), dan QR Code tidak rusak. Coba bersihkan lensa kamera. Jika tetap gagal, minta penerima menunjukkan QR Code lagi atau kirim ulang screenshot QR Code.

**Q: Bagaimana jika salah scan QR Code (scan QR milik orang lain)?**
A: Sistem akan menampilkan data penerima sebelum Anda konfirmasi penyaluran. Periksa dengan teliti nama dan NIK. Jika salah, klik **"Baca Ulang"** dan scan QR Code yang benar.

**Q: Apakah perlu internet untuk scan QR Code?**
A: Ya, internet wajib aktif saat scan. Sistem perlu verifikasi data penerima dari server. Jika internet putus, coba lagi saat koneksi pulih.

### Notifikasi

**Q: Tidak menerima notifikasi, bagaimana solusinya?**
A: Pastikan:

1. Notifikasi browser sudah di-enable (izin di browser settings)
2. Email sudah diverifikasi
3. Nomor telepon sudah terdaftar (untuk SMS)
4. Check folder spam/junk email
5. Jika tetap tidak dapat, hubungi admin

**Q: Bagaimana cara disable notifikasi?**
A: Buka **"Pengaturan Akun"** → **"Preferensi Notifikasi"** → uncheck jenis notifikasi yang tidak ingin diterima. Klik **"Simpan"**.

---

## Troubleshooting Teknis

### Website Tidak Bisa Diakses

**Masalah:** Halaman error 404 atau Cannot Connect

**Solusi:**

1. Cek koneksi internet Anda
2. Refresh halaman (tekan Ctrl+F5 atau Cmd+Shift+R)
3. Clear browser cache (Ctrl+Shift+Delete)
4. Coba di browser lain
5. Jika masih error, hubungi admin sistem

### Form Tidak Bisa Disubmit

**Masalah:** Tombol "Simpan" atau "Kirim" tidak merespons

**Solusi:**

1. Periksa apakah semua field yang wajib sudah diisi (ada tanda \*)
2. Pastikan format email, nomor telepon, NIK sudah benar
3. Cek koneksi internet
4. Tunggu beberapa saat (sistem sedang memproses)
5. Refresh halaman dan coba lagi
6. Jika tetap gagal, clear cache browser dan login ulang

### Foto Tidak Bisa Diupload

**Masalah:** Upload foto gagal atau ukuran file terlalu besar

**Solusi:**

1. Pastikan format file: JPG, PNG, PDF
2. Ukuran file maksimal 5 MB per file
3. Jika foto lebih besar, gunakan aplikasi kompresi atau resize foto
4. Coba upload ulang dengan koneksi internet yang stabil
5. Gunakan browser terbaru (update browser Anda)

### Scan QR Code Tidak Berfungsi

**Masalah:** Kamera tidak muncul atau QR Code tidak terbaca

**Solusi:**

1. Pastikan izin akses kamera sudah diberikan (setting browser)
2. Restart browser atau aplikasi
3. Clear browser cache
4. Coba di perangkat lain
5. Pastikan lensa kamera bersih
6. Gunakan browser yang support WebRTC (Chrome, Firefox, Edge)
7. Hubungi admin jika tetap tidak bisa

### Data Tidak Tersimpan

**Masalah:** Data yang sudah diisi hilang setelah refresh

**Solusi:**

1. Pastikan Anda mengklik tombol **"Simpan"** atau **"Kirim"** sebelum pindah halaman
2. Jangan close browser tab tanpa save terlebih dahulu
3. Jika internet putus, data sementara mungkin hilang
4. Gunakan kecepatan internet yang stabil

---

## Panduan Kontak & Support

### Hubungi Admin Sistem:

- **Email:** admin@simpan.local
- **WhatsApp:** [Nomor Admin]
- **Jam Operasional:** Senin-Jumat, 08:00-16:00 WIB

### Laporkan Masalah:

Gunakan fitur **"Lapor Masalah"** di footer website, atau kirim email ke admin dengan menjelaskan:

1. Siapa Anda (nama, role)
2. Masalah apa yang dihadapi
3. Screenshot error (jika ada)
4. Waktu masalah terjadi
5. Perangkat apa yang digunakan

---

## Catatan Keamanan

1. **Jangan bagikan password** dengan siapapun, termasuk admin
2. **Jangan tinggalkan akun login terbuka** di komputer umum
3. **Logout** setelah selesai menggunakan sistem
4. **Update password** secara berkala (minimal 3 bulan sekali)
5. **Verifikasi email** untuk menerima notifikasi penting
6. **Hati-hati dengan link mencurigakan** dari email (phishing)
7. **Gunakan koneksi internet aman** (hindari WiFi publik yang tidak terpercaya untuk transaksi penting)

---

## Versi & Update

**Versi Manual:** 1.0  
**Tanggal:** April 2026  
**Status:** Official  
**Diperbarui:** [Tanggal Update Terbaru]

Untuk update terbaru, selalu kunjungi situs resmi SIMPAN atau hubungi admin sistem.

---

**© 2026 SIMPAN - Sistem Informasi Penyaluran Bantuan Sosial**  
**Dikembangkan oleh Universitas Siliwangi**
