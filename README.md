# Admin Panel - Manajemen Pembelian & Produk

Aplikasi web sederhana admin panel untuk mengelola data pembelian dan kelola produk. Dibuat untuk memenuhi pre-test yang diberikan. fokus utama dari aplikasi ini adalah fungsionaltias backend, integrasi database, dan antar muka yang mudah di pahami.

## Fitur Utama

- **Manajemen Pembelian**:
    - Input data pembelian dengan form.
    - Pembatalan atau cancel pembelian transaksi yang sudah di-input.
    - Daftar transaksi pembelian yang otomatis update secara langsung.

- **Manajemen Produk (CRUD Lengkap)**:
  - Halaman terpisah untuk melihat daftar semua produk beserta stoknya.
  - Tambah produk baru (Create).
  - Lihat detail produk (Read).
  - Perbarui informasi produk seperti nama, harga, dan stok (Update).
  - Hapus produk dari database (Delete).

- **Antarmuka Pengguna (UI) Dinamis**:
  - **Navigasi Mudah**: Navbar untuk berpindah antara halaman Pembelian dan Daftar Produk.
  - **Form Cerdas**: Field nama produk pada form pembelian berupa dropdown yang datanya diambil langsung dari database.
  - **Harga Otomatis**: Field harga satuan terisi otomatis sesuai produk yang dipilih, mengurangi kesalahan input manual.
  - **Visualisasi Stok**: Warna latar belakang pada jumlah stok untuk menandakan level stok (aman, sedikit, atau habis).

## Teknologi yang Digunakan

- **Backend**: Node.js, Express.js
- **Frontend**: EJS (Embedded JavaScript templates), JavaScript (Vanilla), CSS3
- **Database**: MySQL (dengan `mysql2` driver)

## Panduan Instalasi & Penggunaan

### 1. Prasyarat

- Node.js & NPM (Node Package Manager) terinstal.
- Server MySQL sedang berjalan.

### 2. Langkah-langkah Instalasi

1.  **Clone atau Unduh Proyek**
    - Jika menggunakan Git:
      ```bash
      git clone <URL_REPOSITORY_ANDA>
      cd xionco-test
      ```

2.  **Install Dependensi**
    - Buka terminal di direktori proyek dan jalankan:
      ```bash
      npm install
      ```

3.  **Setup Database**
    - Buat sebuah database baru di MySQL dengan nama `adminToko_db`.
    - Impor file `sql/schema.sql` ke dalam database tersebut. File ini akan membuat tabel `products`, `stock`, dan `purchases`, sekaligus mengisi 10 data produk awal.
    - **Penting**: Jika kredensial database Anda berbeda, sesuaikan konfigurasi koneksi di file `src/db.js`.

4.  **Jalankan Aplikasi**
    - Setelah semua dependensi terinstal dan database siap, jalankan server dengan perintah:
      ```bash
      npm start
      ```

5.  **Akses Aplikasi**
    - Buka browser dan kunjungi `http://localhost:3000`.

### 3. Cara Menggunakan Aplikasi

- **Halaman Pembelian (`/`)**
  - Gunakan form di bagian atas untuk menambahkan transaksi pembelian baru.
  - Pilih produk dari dropdown, isi kuantitas, dan harga akan terisi otomatis.
  - Klik "Simpan Pembelian" untuk merekam transaksi.
  - Tabel di bawahnya menampilkan riwayat pembelian. Klik tombol "Cancel" untuk membatalkan transaksi.

- **Halaman Daftar Produk (`/products`)**
  - Halaman ini menampilkan semua produk yang ada di database beserta stoknya.
  - Gunakan form "Kelola Produk" untuk menambah produk baru atau mengedit yang sudah ada.
  - Untuk **mengedit**, klik tombol "Edit" pada salah satu baris produk. Datanya akan dimuat ke dalam form. Setelah mengubah, klik "Simpan Perubahan".
  - Untuk **menghapus**, klik tombol "Hapus" pada baris produk yang diinginkan.
