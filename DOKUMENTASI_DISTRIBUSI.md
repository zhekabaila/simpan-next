# 📸 Dokumentasi Upload Fitur Distribusi Bansos

Dokumentasi lengkap untuk fitur upload dokumentasi distribusi bansos oleh petugas di lapangan.

---

## 📋 Daftar Isi

1. [Gambaran Umum](#gambaran-umum)
2. [Database Schema](#database-schema)
3. [Endpoints](#endpoints)
4. [Contoh Penggunaan (cURL)](#contoh-penggunaan-curl)
5. [Response Format](#response-format)
6. [Error Handling](#error-handling)

---

## 🎯 Gambaran Umum

Fitur ini memungkinkan petugas untuk mengupload dokumentasi (foto atau catatan) selama proses pembagian bansos di lapangan. Dokumentasi dapat berupa:

- **Foto**: Bukti visual pembagian bansos (JPEG, PNG, JPG, GIF - max 5MB)
- **Catatan**: Catatan tertulis tentang proses distribusi

### Fitur Utama

✅ **Optional Upload** - Upload dokumentasi tidak wajib  
✅ **Fleksibel** - Support jenis dokumentasi: foto atau catatan  
✅ **Aman** - Validasi file dan akses control  
✅ **Terstruktur** - File terorganisir per periode  
✅ **Relasional** - Terhubung ke periode bansos dan petugas  
✅ **Pagination** - Support pagination untuk list dokumentasi  
✅ **Delete Safe** - Auto cleanup file dari storage saat delete

---

## 🗄️ Database Schema

### Tabel: `dokumentasi_distribusi`

```sql
CREATE TABLE dokumentasi_distribusi (
    id UUID PRIMARY KEY,
    periode_bansos_id UUID NOT NULL,
    petugas_id UUID NOT NULL,
    jenis_dokumentasi ENUM('foto', 'catatan'),
    path_dokumentasi VARCHAR(255),  -- URL foto (nullable jika catatan)
    keterangan TEXT,                -- Optional description
    diunggah_pada TIMESTAMP,        -- Auto timestamp

    FOREIGN KEY (periode_bansos_id) REFERENCES periode_bansos(id) ON DELETE CASCADE,
    FOREIGN KEY (petugas_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX (periode_bansos_id),
    INDEX (petugas_id)
);
```

### Struktur File Storage

```
storage/app/public/dokumentasi-distribusi/
├── {periode_id}/
│   ├── dokumentasi_1713897000.jpg
│   ├── dokumentasi_1713897100.png
│   └── dokumentasi_1713897200.jpg
```

---

## 🔌 Endpoints

### 1. Upload Dokumentasi (POST)

**URL:** `POST /api/petugas/dokumentasi`

**Authentication:** Bearer JWT Token (role: petugas)

**Content-Type:** `multipart/form-data`

**Request Parameters:**

| Parameter         | Type   | Required           | Deskripsi                        |
| ----------------- | ------ | ------------------ | -------------------------------- |
| periode_bansos_id | UUID   | ✅ Ya              | ID periode bansos                |
| jenis_dokumentasi | string | ✅ Ya              | Enum: `foto` atau `catatan`      |
| foto              | file   | ⚠️ Jika jenis=foto | Image file (max 5MB)             |
| keterangan        | string | ❌ Tidak           | Catatan/deskripsi (max 500 char) |

**Validasi:**

- `periode_bansos_id`: harus ada di database
- `jenis_dokumentasi`: hanya `foto` atau `catatan`
- `foto`: required jika jenis_dokumentasi=`foto`, harus image format
- `keterangan`: max 500 karakter

---

### 2. Get Single Dokumentasi (GET)

**URL:** `GET /api/petugas/dokumentasi/{id}`

**Authentication:** Bearer JWT Token (role: petugas)

**URL Parameters:**

| Parameter | Type | Deskripsi                         |
| --------- | ---- | --------------------------------- |
| id        | UUID | ID dokumentasi yang ingin diambil |

**Notes:**

- Hanya bisa mengakses dokumentasi milik sendiri
- Akan return 404 jika dokumentasi tidak ditemukan atau milik petugas lain

---

### 3. Get Dokumentasi by Periode (GET)

**URL:** `GET /api/petugas/dokumentasi-periode/{periode_id}`

**Authentication:** Bearer JWT Token (role: petugas)

**URL Parameters:**

| Parameter  | Type | Deskripsi         |
| ---------- | ---- | ----------------- |
| periode_id | UUID | ID periode bansos |

**Query Parameters:**

| Parameter | Type    | Default | Deskripsi                         |
| --------- | ------- | ------- | --------------------------------- |
| page      | integer | 1       | Nomor halaman                     |
| limit     | integer | 15      | Jumlah data per halaman (max 100) |

**Notes:**

- Hanya menampilkan dokumentasi milik sendiri
- Support pagination

---

### 4. Delete Dokumentasi (DELETE)

**URL:** `DELETE /api/petugas/dokumentasi/{id}`

**Authentication:** Bearer JWT Token (role: petugas)

**URL Parameters:**

| Parameter | Type | Deskripsi                         |
| --------- | ---- | --------------------------------- |
| id        | UUID | ID dokumentasi yang ingin dihapus |

**Notes:**

- Hanya bisa menghapus dokumentasi milik sendiri
- File di storage otomatis terhapus
- Akan return 404 jika dokumentasi tidak ditemukan

---

## 📝 Contoh Penggunaan (cURL)

### Setup Environment Variables

```bash
# Simpan token JWT ke variable
export JWT_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Simpan base URL
export BASE_URL="http://localhost:8000"

# Simpan periode ID
export PERIODE_ID="12345678-1234-5678-1234-567812345678"

# Simpan dokumentasi ID
export DOK_ID="550e8400-e29b-41d4-a716-446655440000"
```

---

### 1. Upload Dokumentasi dengan Foto

```bash
curl -X POST $BASE_URL/api/petugas/dokumentasi \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -F "periode_bansos_id=$PERIODE_ID" \
  -F "jenis_dokumentasi=foto" \
  -F "foto=@/path/to/photo.jpg" \
  -F "keterangan=Dokumentasi pembagian bansos di kelurahan X pada tanggal 23 April 2025"
```

**Contoh dengan Path Absolute:**

```bash
curl -X POST http://localhost:8000/api/petugas/dokumentasi \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "periode_bansos_id=12345678-1234-5678-1234-567812345678" \
  -F "jenis_dokumentasi=foto" \
  -F "foto=@/Users/username/Downloads/dokumentasi.jpg" \
  -F "keterangan=Pembagian bansos selesai dengan lancar"
```

---

### 2. Upload Dokumentasi dengan Catatan Saja (Tanpa Foto)

```bash
curl -X POST $BASE_URL/api/petugas/dokumentasi \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -F "periode_bansos_id=$PERIODE_ID" \
  -F "jenis_dokumentasi=catatan" \
  -F "keterangan=Pembagian bansos selesai tepat waktu, penerima puas dengan pemberian. Total penerima: 150 orang"
```

---

### 3. Upload Foto Tanpa Keterangan

```bash
curl -X POST $BASE_URL/api/petugas/dokumentasi \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -F "periode_bansos_id=$PERIODE_ID" \
  -F "jenis_dokumentasi=foto" \
  -F "foto=@/path/to/documentation.png"
```

---

### 4. Get Single Dokumentasi

```bash
curl -X GET $BASE_URL/api/petugas/dokumentasi/$DOK_ID \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Contoh Lengkap:**

```bash
curl -X GET http://localhost:8000/api/petugas/dokumentasi/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 5. Get Dokumentasi by Periode (dengan Pagination)

```bash
# Halaman 1 dengan 15 data per halaman
curl -X GET "$BASE_URL/api/petugas/dokumentasi-periode/$PERIODE_ID?page=1&limit=15" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Variasi Pagination:**

```bash
# Halaman 1 dengan 10 data per halaman
curl -X GET "http://localhost:8000/api/petugas/dokumentasi-periode/12345678-1234-5678-1234-567812345678?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Halaman 2 dengan 20 data per halaman
curl -X GET "http://localhost:8000/api/petugas/dokumentasi-periode/12345678-1234-5678-1234-567812345678?page=2&limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Halaman 3 dengan 25 data per halaman
curl -X GET "http://localhost:8000/api/petugas/dokumentasi-periode/12345678-1234-5678-1234-567812345678?page=3&limit=25" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 6. Delete Dokumentasi

```bash
curl -X DELETE $BASE_URL/api/petugas/dokumentasi/$DOK_ID \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Contoh Lengkap:**

```bash
curl -X DELETE http://localhost:8000/api/petugas/dokumentasi/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📤 Response Format

### Success Response - Upload Dokumentasi (201)

```json
{
    "success": true,
    "message": "Dokumentasi berhasil diunggah",
    "data": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "periode_bansos_id": "12345678-1234-5678-1234-567812345678",
        "petugas_id": "87654321-4321-8765-4321-876543218765",
        "jenis_dokumentasi": "foto",
        "path_dokumentasi": "http://localhost:8000/storage/dokumentasi-distribusi/12345678-1234-5678-1234-567812345678/dokumentasi_1713897000.jpg",
        "keterangan": "Dokumentasi pembagian bansos di kelurahan X",
        "diunggah_pada": "2025-04-23T10:30:00",
        "periode_bansos": {
            "id": "12345678-1234-5678-1234-567812345678",
            "nama_periode": "Periode Bansos April 2025",
            "jenis_bantuan": "sembako"
        },
        "petugas": {
            "id": "87654321-4321-8765-4321-876543218765",
            "nama": "Budi Santoso"
        }
    }
}
```

---

### Success Response - Get Single Dokumentasi (200)

```json
{
    "success": true,
    "message": "Dokumentasi berhasil diambil",
    "data": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "periode_bansos_id": "12345678-1234-5678-1234-567812345678",
        "petugas_id": "87654321-4321-8765-4321-876543218765",
        "jenis_dokumentasi": "foto",
        "path_dokumentasi": "http://localhost:8000/storage/dokumentasi-distribusi/12345678-1234-5678-1234-567812345678/dokumentasi_1713897000.jpg",
        "keterangan": "Dokumentasi pembagian bansos di kelurahan X",
        "diunggah_pada": "2025-04-23T10:30:00",
        "periode_bansos": {
            "id": "12345678-1234-5678-1234-567812345678",
            "nama_periode": "Periode Bansos April 2025",
            "jenis_bantuan": "sembako"
        },
        "petugas": {
            "id": "87654321-4321-8765-4321-876543218765",
            "nama": "Budi Santoso"
        }
    }
}
```

---

### Success Response - Get by Periode dengan Pagination (200)

```json
{
    "success": true,
    "message": "Success",
    "data": [
        {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "periode_bansos_id": "12345678-1234-5678-1234-567812345678",
            "petugas_id": "87654321-4321-8765-4321-876543218765",
            "jenis_dokumentasi": "foto",
            "path_dokumentasi": "http://localhost:8000/storage/dokumentasi-distribusi/12345678-1234-5678-1234-567812345678/dokumentasi_1713897000.jpg",
            "keterangan": "Dokumentasi pembagian bansos",
            "diunggah_pada": "2025-04-23T10:30:00",
            "periode_bansos": {
                "id": "12345678-1234-5678-1234-567812345678",
                "nama_periode": "Periode Bansos April 2025",
                "jenis_bantuan": "sembako"
            },
            "petugas": {
                "id": "87654321-4321-8765-4321-876543218765",
                "nama": "Budi Santoso"
            }
        },
        {
            "id": "660e8400-e29b-41d4-a716-446655440000",
            "periode_bansos_id": "12345678-1234-5678-1234-567812345678",
            "petugas_id": "87654321-4321-8765-4321-876543218765",
            "jenis_dokumentasi": "catatan",
            "path_dokumentasi": null,
            "keterangan": "Pembagian bansos selesai tepat waktu",
            "diunggah_pada": "2025-04-23T11:00:00",
            "periode_bansos": {
                "id": "12345678-1234-5678-1234-567812345678",
                "nama_periode": "Periode Bansos April 2025",
                "jenis_bantuan": "sembako"
            },
            "petugas": {
                "id": "87654321-4321-8765-4321-876543218765",
                "nama": "Budi Santoso"
            }
        }
    ],
    "pagination": {
        "total": 5,
        "per_page": 15,
        "current_page": 1,
        "last_page": 1
    }
}
```

---

### Success Response - Delete Dokumentasi (200)

```json
{
    "success": true,
    "message": "Dokumentasi berhasil dihapus"
}
```

---

## ❌ Error Handling

### Error - Periode Tidak Ditemukan (404)

```json
{
    "success": false,
    "message": "Periode bansos tidak ditemukan"
}
```

---

### Error - Dokumentasi Tidak Ditemukan (404)

```json
{
    "success": false,
    "message": "Dokumentasi tidak ditemukan"
}
```

---

### Error - Validasi File (422)

**Case 1: Foto tidak diupload padahal jenis_dokumentasi=foto**

```json
{
    "message": "The foto field is required when jenis dokumentasi is foto.",
    "errors": {
        "foto": ["Foto harus diupload jika jenis dokumentasi adalah foto"]
    }
}
```

---

**Case 2: Format file tidak valid**

```json
{
    "message": "The foto field must be an image.",
    "errors": {
        "foto": ["Format gambar harus jpeg, png, jpg, atau gif"]
    }
}
```

---

**Case 3: Ukuran file terlalu besar**

```json
{
    "message": "The foto field must not be greater than 5120 kilobytes.",
    "errors": {
        "foto": ["Ukuran gambar tidak boleh lebih dari 5MB"]
    }
}
```

---

### Error - Parameter Tidak Valid (422)

```json
{
    "message": "The given data was invalid.",
    "errors": {
        "jenis_dokumentasi": ["Jenis dokumentasi harus foto atau catatan"],
        "periode_bansos_id": ["Periode bansos tidak ditemukan"]
    }
}
```

---

### Error - Unauthorized (401)

```json
{
    "message": "Unauthenticated."
}
```

---

### Error - Forbidden (403)

```json
{
    "message": "User tidak memiliki akses ke resource ini"
}
```

---

### Error - Server Error (500)

```json
{
    "success": false,
    "message": "Terjadi kesalahan pada server"
}
```

---

## 🔐 Security & Validation

### Input Validation

✅ **periode_bansos_id**

- UUID format
- Harus ada di tabel periode_bansos
- Foreign key constraint

✅ **jenis_dokumentasi**

- Enum: hanya `foto` atau `catatan`
- Case-sensitive

✅ **foto (jika jenis_dokumentasi=foto)**

- Required jika jenis_dokumentasi=foto
- Format: JPEG, PNG, JPG, GIF
- Max size: 5MB
- Mime types: image/jpeg, image/png, image/gif

✅ **keterangan**

- Optional
- Max length: 500 karakter
- String type

### Access Control

- Hanya petugas yang authenticated yang bisa upload
- Hanya bisa upload untuk periode yang ada
- Hanya bisa akses/delete dokumentasi milik sendiri
- Role-based middleware: `role:petugas`

### File Security

- Auto-create directory jika belum ada
- Unique filename dengan timestamp: `dokumentasi_{timestamp}.{ext}`
- Stored di public disk untuk accessible via URL
- Auto-delete file dari storage saat delete record

---

## 📚 Contoh Skenario Penggunaan

### Skenario 1: Petugas Upload Foto Pembagian Bansos

```bash
#!/bin/bash

# 1. Login terlebih dahulu
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "petugas@example.com",
    "password": "password123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.access_token')

# 2. Upload dokumentasi foto
curl -X POST http://localhost:8000/api/petugas/dokumentasi \
  -H "Authorization: Bearer $TOKEN" \
  -F "periode_bansos_id=12345678-1234-5678-1234-567812345678" \
  -F "jenis_dokumentasi=foto" \
  -F "foto=@./dokumentasi_pembagian.jpg" \
  -F "keterangan=Pembagian bansos di Kelurahan Muka, 23 April 2025"
```

---

### Skenario 2: Petugas Ambil Semua Dokumentasi Periode

```bash
#!/bin/bash

# Ambil semua dokumentasi untuk periode tertentu
curl -X GET "http://localhost:8000/api/petugas/dokumentasi-periode/12345678-1234-5678-1234-567812345678?page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

---

### Skenario 3: Petugas Hapus Dokumentasi yang Salah

```bash
#!/bin/bash

# Hapus dokumentasi tertentu
curl -X DELETE http://localhost:8000/api/petugas/dokumentasi/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔄 Integration dengan Fitur Lain

### Relationship dengan Model Lain

```
DokumentasiDistribusi
├── PeriodeBansos (HasOne)
│   ├── nama_periode
│   ├── jenis_bantuan
│   └── status
└── User/Petugas (HasOne)
    ├── nama
    ├── email
    └── role
```

---

### Workflow Pembagian Bansos

```
1. Admin membuat Periode Bansos
2. Admin membuat Penugasan Petugas untuk Periode
3. Petugas scan QR code masyarakat → Distribusi tercatat
4. Petugas upload dokumentasi (optional) → Dokumentasi tersimpan
5. Admin lihat monitoring dengan data distribusi + dokumentasi
```

---

## 📞 Support & Troubleshooting

### Issue: "Periode bansos tidak ditemukan"

**Solusi:**

- Pastikan periode_id dalam format UUID yang valid
- Pastikan periode sudah dibuat dan ada di database
- Periksa apakah Anda menggunakan periode_id yang benar

### Issue: "Foto harus diupload jika jenis dokumentasi adalah foto"

**Solusi:**

- Jika jenis_dokumentasi=`foto`, file foto WAJIB diupload
- Jika hanya ingin catatan, gunakan jenis_dokumentasi=`catatan`
- Pastikan menggunakan parameter `-F "foto=@/path/to/file"`

### Issue: "Ukuran gambar tidak boleh lebih dari 5MB"

**Solusi:**

- Kompres gambar terlebih dahulu
- Gunakan tool online seperti TinyPNG atau ImageOptim
- Pastikan file jpg/png berukuran di bawah 5MB

### Issue: "Dokumentasi tidak ditemukan"

**Solusi:**

- Pastikan ID dokumentasi dalam format UUID yang valid
- Pastikan dokumentasi milik sendiri (tidak bisa akses milik petugas lain)
- Pastikan dokumentasi masih ada (tidak sudah dihapus)

---

## 📌 Best Practices

1. **Always validate input** sebelum upload
2. **Compress images** sebelum upload untuk menghemat storage
3. **Add keterangan** yang meaningful untuk setiap dokumentasi
4. **Backup important files** sebelum delete
5. **Monitor storage usage** secara berkala
6. **Use pagination** saat retrieve banyak dokumentasi
7. **Log all actions** untuk audit trail
8. **Test endpoints** sebelum production deployment

---

## 🎯 Roadmap Fitur

- [ ] Download dokumentasi (ZIP)
- [ ] Share dokumentasi dengan admin
- [ ] Preview thumbnail untuk foto
- [ ] Filter dokumentasi by jenis_dokumentasi
- [ ] Export laporan dokumentasi
- [ ] Real-time notification saat upload
- [ ] Batch upload multiple files
- [ ] Advanced search dengan metadata

---

## 📄 File yang Terkait

- **Migration:** `database/migrations/2025_04_23_000700_create_dokumentasi_distribusi_table.php`
- **Model:** `app/Models/DokumentasiDistribusi.php`
- **Request:** `app/Http/Requests/DokumentasiDistribusiRequest.php`
- **Resource:** `app/Http/Resources/DokumentasiDistribusiResource.php`
- **Controller:** `app/Http/Controllers/Petugas/PetugasController.php`
- **Routes:** `routes/api.php` (Petugas group)

---

**Last Updated:** April 23, 2025  
**API Version:** v1.0  
**Status:** Production Ready ✅
