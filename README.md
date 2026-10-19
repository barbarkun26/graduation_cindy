# 🎓 Cindy's Farewell & S2 Journey at UPH ✨

Website perpisahan magang dan perayaan langkah baru untuk **Cindy (Miss PPG Bertiarap)** yang melanjutkan studi **S2 (Magister) di Universitas Pelita Harapan (UPH)**. Dibuat dengan tema yang lucu, hangat, berunsur kampus graduation, serta responsif dan interaktif!

---

## 🌟 Fitur Utama Website

1. **Header Banner S2 di UPH** 🏛️
   - Menampilkan poster ucapan *Selamat Fokus di S2 nya di UPH* lengkap dengan ornamen buku ("Ilmu, Proses, Progres, S2") dan gedung kampus UPH.
2. **Spotlight "Miss PPG Bertiarap"** 👑
   - Dual Photo Mode: Berpindah antara **Mode Miss PPG (Bertiarap & Selempang)** dan **Mode Briefing Santai**.
   - Dilengkapi identitas profil alumni magang, rekor prestasi, dan kutipan manis.
3. **Laporan Audit Magang Lucu (KPI)** 📊
   - Hitungan konsumsi kopi, level energi ceria 100%, penghargaan Miss PPG, dan kesiapan menuju S2.
4. **Cindy's S2 Survival Kit** 🎒
   - Checklist bekal menghadapi perkuliahan S2 di UPH (jurnal Scopus, mantra anti-overthinking, dan hotline curhat teman magang).
5. **Interactive Wall of Wishes (Papan Doa Sticky Notes)** 💌
   - Setiap rekan kerja bisa mengetik pesan, memilih warna sticky note (kuning, pink, biru, hijau), memilih emoji, dan menempelkannya langsung ke papan doa!
   - Pesan tersimpan otomatis di browser (`localStorage`).
6. **Hujan Konfeti & Toga Interaktif (Canvas Confetti)** 🎊
   - Partikel konfeti warna-warni bercampur emoji toga (🎓), mahkota (👑), bintang (✨), dan hati (💛).
7. **Sound Effect Fanfare (Web Audio API)** 🔊
   - Dilengkapi synthesizer melodi perayaan tanpa perlu download file mp3 eksternal, plus tombol mute/unmute.

---

## 🚀 Panduan Publish ke GitHub Pages (URL Online)

Website ini dibuat dengan **HTML, CSS, dan JavaScript murni** (tanpa backend/database rumit), sehingga **100% siap di-hosting gratis di GitHub Pages**.

Berikut panduan langkah demi langkah:

### Langkah 1: Buat Repository Baru di GitHub
1. Buka [github.com](https://github.com) dan login ke akun GitHub kamu.
2. Klik tombol **New** (atau tanda `+` di kanan atas lalu pilih **New repository**).
3. Beri nama repository, misalnya: `graduate-cindy` atau `perpisahan-cindy`.
4. Pilih opsi **Public**.
5. Centang **kosongkan** (jangan centang "Add a README file" karena kita sudah punya file ini).
6. Klik **Create repository**.

### Langkah 2: Upload File ke GitHub Menggunakan Git
Buka Terminal / PowerShell di folder ini (`c:\graduate_cindy`), lalu jalankan perintah berikut:

```bash
# 1. Inisialisasi Git
git init

# 2. Tambahkan semua file (index.html, style.css, script.js, folder assets)
git add .

# 3. Buat commit pertama
git commit -m "feat: website perpisahan magang cindy s2 uph"

# 4. Ganti nama branch utama menjadi main
git branch -M main

# 5. Hubungkan ke repository GitHub kamu (ganti USERNAME dan REPO_NAME dengan milikmu)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# 6. Push kode ke GitHub
git push -u origin main
```

*(Catatan: Jika diminta login GitHub di terminal, cukup ikuti instruksi browser atau gunakan Personal Access Token).*

---

### Langkah 3: Aktifkan GitHub Pages
1. Di halaman repository GitHub kamu, klik tab **Settings** (di sebelah kanan atas tab Code/Pull requests).
2. Di menu sebelah kiri, cari dan klik **Pages**.
3. Pada bagian **Build and deployment**:
   - **Source**: Pilih **Deploy from a branch**.
   - **Branch**: Pilih **main** dan folder **/ (root)**.
4. Klik tombol **Save**.
5. Tunggu sekitar 1–2 menit. Refresh halaman Settings Pages tersebut.
6. Kamu akan melihat kotak hijau bertuliskan:
   > **"Your site is live at https://USERNAME.github.io/REPO_NAME/"**

🎉 **Selesai!** URL tersebut sekarang bisa langsung kamu bagikan ke Cindy dan rekan-rekan magang lainnya!

---

## 💻 Cara Menjalankan Secara Lokal (Preview di Komputer)

Cukup **klik 2x file `index.html`** di Windows Explorer, maka web akan langsung terbuka di browser favoritmu (Chrome, Edge, Firefox, dll).
