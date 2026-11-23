# Tryout Liniswara

Website tryout online untuk penerbit Liniswara (PT Lini Suara Nusantara). Pengguna mendaftar, memasukkan kode akses, menonton materi video, lalu mengerjakan tryout 10 soal berisi 3 pernyataan Benar/Salah per soal. Skor dihitung di server.

- **Demo:** https://tryout-liniswara.vercel.app
- **Repo:** https://github.com/RizalSwikey/tryout-liniswara
- **Kode redeem untuk penilai:** `LINIS30HARI1` (aktif 30 hari, 100 pemakaian)

Kode contoh lain (lihat `supabase/seed.sql`):

| Kode | Kegunaan | Hasil yang diharapkan |
| --- | --- | --- |
| `LINIS30HARI1` | aktif, 30 hari, 100 pemakaian | akses terbuka 30 hari; kode yang sama ditolak bila dipakai ulang akun itu |
| `SEKALI1X2026` | aktif, 30 hari, `max_uses = 1` | pemakai pertama berhasil, pemakai berikutnya dapat "batas pemakaian" |
| `KEDALUWARSA1` | `expires_at` 7 hari lalu | ditolak dengan pesan kedaluwarsa |

## 1. Fitur

### Selesai

- Pendaftaran dan login email + kata sandi, logout, route terproteksi (`/dashboard`, `/materi`, `/tryout`, `/riwayat`).
- Redeem kode lewat RPC Postgres atomik: validasi (aktif, belum kedaluwarsa, kuota, belum dipakai akun itu), catat redemption, naikkan `used_count`, buat/perpanjang langganan dalam satu transaksi.
- Materi video: daftar dan halaman putar dengan `lite-youtube-embed` (thumbnail dulu, host `youtube-nocookie.com`, `rel=0`), terkunci bila tidak ada langganan aktif — dicek di server lewat RLS, bukan hanya menyembunyikan tombol.
- Tryout: satu soal per layar, 3 pernyataan Benar/Salah per soal, timer dari `deadline_at` server, jawaban tersimpan tiap klik, laci grid 10 nomor dengan 4 state (kosong/terjawab/ragu/aktif) yang dibedakan ikon + warna, tombol "Tandai ragu" per soal, konfirmasi kirim menyebut jumlah soal belum dijawab.
- Skor dihitung di server (1 poin per pernyataan benar, maks 30), plus jumlah soal yang ketiga pernyataannya benar. Pembahasan per pernyataan muncul setelah submit.
- Riwayat percobaan dan skor.
- Seed: 1 tryout (10 soal × 3 pernyataan, kunci + pembahasan), 5 materi video terverifikasi, 3 kode redeem.
- Landing page satu halaman dengan demo soal interaktif tanpa login.

### Sebagian

- Penanda progres materi: semua materi terbit tampil sebagai daftar; status "sudah ditonton" belum disimpan. Tidak ada tabelnya.
- Halaman admin pembuat kode redeem: belum ada. Kode dibuat lewat SQL (`insert into redeem_codes ...`).

### Sengaja tidak dikerjakan

- Login Google, kunci sesi tunggal per perangkat, kartu harga berisi angka rupiah. Ketiganya diminta untuk dilewati.
- Angka "900+ judul", "25+ MGMP", penghargaan, dan tahun berdiri tidak ditampilkan karena belum dikonfirmasi klien.
- Dark mode, rate limiting, dan test Playwright (P2) belum dikerjakan.
- Fitur AI, forum diskusi, sertifikat, pembayaran online: di luar alur inti.

## 2. Prioritas dan alasannya

Urutannya P0 → P1 → P2, dan P0 diselesaikan dulu sampai utuh.

P0 adalah alur yang diminta langsung oleh tugas: daftar → masukkan kode → belajar → tryout → lihat hasil. Semua bagian itu saling bergantung; menyelesaikan satu tanpa yang lain tidak menghasilkan produk yang bisa dinilai. Karena itu auth, redeem, materi, tryout, landing, dan deploy dikerjakan lebih dulu.

P1 menambah ketahanan pada alur yang sudah jalan: timer berbasis deadline server (tanpa itu, refresh halaman akan mengulang waktu), autosave (tanpa itu, koneksi putus menghapus jawaban), pembahasan, riwayat, dan seed. Fitur-fitur ini tidak menambah permukaan produk baru, hanya membuat alur P0 benar-benar dipakai.

P2 ditunda karena tidak mengubah penilaian inti: halaman admin bisa digantikan SQL, dark mode bukan kebutuhan ujian, dan rate limiting baru relevan setelah ada trafik nyata. Test E2E idealnya ditulis bersama CI, bukan dikejar di sisa waktu.

## 3. Asumsi dan keputusan teknis

### Asumsi

- **Format soal.** "10 soal, tiap soal 3 pertanyaan Benar/Salah" saya baca sebagai **PGK Kategori**: satu stimulus per soal (teks bacaan/kasus/data) dan tiga pernyataan yang masing-masing dijawab Benar atau Salah. Total 30 butir jawaban, skor maksimum 30. Ini format yang dipakai TKA Kemendikdasmen untuk butir PGK Kategori.
- **Palet warna.** Nilai warna (`#172636`, `#006BB2`, `#F8C630`, `#E63C70`, dan lainnya) diturunkan dari CSS live `store.liniswara.com` dan sampling piksel logo publik. Ini **bukan** brand guideline resmi — Liniswara tidak menerbitkan brand guideline publik. Aturan pakai yang saya terapkan: `#F8C630` hanya sebagai bidang isian dengan teks `#172636` di atasnya, tidak pernah sebagai warna teks; `#E63C70` hanya untuk badge/penanda kecil; border input dan tombol Benar/Salah memakai `#7F8D9C` (3,25:1 terhadap `#F9FAFB` dan 3,39:1 terhadap putih, jadi lolos 3:1 di kedua latar; `#8896A5` di brief hanya 2,89:1 terhadap latar halaman sehingga digelapkan sedikit), sedangkan `#E2E8F0` hanya untuk pemisah dekoratif.
- **Konten.** Tidak ada testimoni, jumlah pengguna, rating, logo mitra, atau klaim superlatif. Demo soal di landing page diberi label "contoh" dan dinyatakan bukan soal resmi.
- **Kontak footer.** Diambil dari aset publik Liniswara: WhatsApp admin pemesanan (`wa.me/6285162949440` dari linktr.ee/liniswara), Instagram `@liniswara`, dan lokasi Gunungpring, Muntilan, Magelang (Google Maps "Gudang Penerbit Liniswara"). Email resmi tidak dicantumkan karena tidak ditemukan di sumber publik.

### Kenapa Next.js + Supabase

Satu bahasa (TypeScript) untuk seluruh aplikasi, rendering server untuk halaman yang butuh sesi, dan Server Actions sehingga tidak perlu menulis API layer terpisah. Supabase memberi tiga hal yang sulit dibangun sendiri dalam waktu terbatas: autentikasi email/sandi yang sudah teruji, Postgres dengan Row Level Security, dan REST otomatis. RLS memindahkan aturan akses ke database, jadi bug di UI tidak otomatis membuka data. Biaya: aplikasi terikat pada Supabase, dan RLS harus ditulis dan diuji dengan benar.

### Bagaimana kunci jawaban diamankan

`statements` menyimpan `is_true` dan `explanation`, dan **tabel ini tidak punya policy RLS apa pun** serta hak aksesnya dicabut dari role `authenticated`. Artinya PostgREST tidak akan pernah mengirim kolom itu ke browser. Teks pernyataan diambil lewat fungsi `security definer`:

- `attempt_payload()` menyusun JSON soal. Saat attempt masih aktif, objek pernyataan hanya berisi `id`, `position`, `text`, dan `answer` — tidak ada `is_true` maupun `explanation`.
- Setelah `submitted_at` terisi, barulah `is_true` dan `explanation` ikut dikirim.

Klien memanggil `start_attempt`, `get_attempt`, `save_answer`, dan `submit_attempt`. Tidak ada jalur lain untuk membaca `statements`. Saat mengerjakan, cek jaringan hanya menemukan teks pernyataan.

### Bagaimana redeem dibuat atomik

Fungsi `public.redeem_code(text)` (`security definer`) berjalan dalam satu transaksi:

1. Mengunci baris kode dengan `select ... for update`, sehingga dua permintaan bersamaan diproses berurutan.
2. Memeriksa: kode ada, `is_active`, `expires_at`, `used_count < max_uses`, dan belum pernah di-redeem akun itu (`unique(user_id, code_id)` jadi pengaman terakhir).
3. Menyisipkan baris `redemptions`, menaikkan `used_count` dengan update bersyarat.
4. Menghitung `ends_at` baru: bila akun masih punya langganan aktif, masa aktif ditambahkan ke `ends_at` terbesar; bila tidak, dihitung dari `now()`.

Tabel `redeem_codes` tidak punya policy `select` untuk `authenticated` dan hak akses tabelnya dicabut, jadi daftar kode tidak bisa dibaca dari browser.

### Penilaian dan deadline

- Skor dihitung di `submit_attempt()`, bukan di browser. Hanya jawaban pada pernyataan milik tryout itu yang dihitung.
- Submit setelah `deadline_at` (toleransi 5 detik untuk latensi jaringan) ditolak dengan `DEADLINE_PASSED`. Attempt lalu ditutup oleh `finalize_attempt()` dengan `submitted_at = deadline_at`, dan hanya jawaban yang tersimpan sebelum deadline yang dinilai.
- Submit ganda ditolak (`ATTEMPT_SUBMITTED`); `attempt_answers` punya `unique(attempt_id, statement_id)`.
- Timer di klien hanya tampilan: nilainya selalu `deadline_at - sekarang`, dihitung ulang tiap detik, jadi tab yang tidur tidak menggeser waktu.

### Catatan versi dan konvensi

Versi paket dicek dengan `npm view` pada 23 Nov 2026: `next` 16.4.6, `tailwindcss` 4.3.5 (terpasang 4.3.3 dari template `create-next-app`), `shadcn` 4.23.0, `@supabase/supabase-js` 2.119.2, `@supabase/ssr` 0.12.7, `lite-youtube-embed` 0.4.0, `zod` 4.6.7.

Next.js 16 mengganti konvensi `middleware.ts` menjadi `proxy.ts`; berkas di repo ini bernama `src/proxy.ts` dan dipakai untuk menyegarkan cookie sesi Supabase sekaligus menolak akses ke route terproteksi tanpa login. shadcn 4.x memakai Base UI (bukan Radix). Tailwind 4 dikonfigurasi lewat `@theme` di `src/app/globals.css`, tanpa `tailwind.config.js`.

## 4. Menjalankan lokal

Prasyarat: Node.js ≥ 20, pnpm, dan sebuah project Supabase (gratis cukup).

```bash
pnpm install
cp .env.example .env.local     # isi URL + anon key dari Supabase
```

Isi `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
```

Migrasi dan seed ke project Supabase. Cara paling singkat, lewat SQL Editor Supabase: jalankan berurutan isi `supabase/migrations/*.sql`, lalu `supabase/seed.sql`. Dengan Supabase CLI:

```bash
supabase link --project-ref <ref>
supabase db push
psql "$SUPABASE_DB_URL" -f supabase/seed.sql
```

Di dashboard Supabase, matikan "Confirm email" bila ingin mendaftar lalu langsung masuk tanpa membuka email (Authentication → Providers → Email). Bila dibiarkan aktif, aplikasi menampilkan pesan agar pengguna mengonfirmasi email lebih dulu.

```bash
pnpm dev          # http://localhost:3000
```

### Uji database (tanpa Docker)

`scripts/db-test.sh` menjalankan seluruh migrasi ke Postgres biasa lalu menguji RLS, redeem, penyembunyian kunci, dan penolakan submit lewat deadline. Skrip ini memakai `supabase/tests/000_auth_shim.sql` untuk meniru `auth.uid()`.

```bash
createdb linis_local            # sekali saja
PGHOST=localhost PGPORT=5432 PGUSER=postgres pnpm db:test
```

Skrip akan menghapus lalu membuat ulang database `linis_test` di server yang sama.

## 5. Struktur folder

```
src/
  app/
    page.tsx                     landing satu halaman + demo soal
    actions/                     Server Actions (auth, redeem, tryout)
    masuk/ daftar/               autentikasi
    dashboard/                   status langganan, tryout, materi terbaru
    materi/                      daftar + halaman putar video
    tryout/[id]/                 halaman pengantar, kerjakan, hasil/[attemptId]
    riwayat/                     semua percobaan
  components/                    UI: form auth, redeem, runner tryout, demo soal, lite-youtube
  components/ui/                 komponen shadcn (Base UI)
  lib/                           env, auth, validasi zod, format, tipe DB, klien Supabase
  proxy.ts                       refresh sesi + proteksi route (konvensi Next 16)
supabase/
  migrations/                    skema, RLS, redeem_code, RPC attempt
  tests/                         auth shim + uji RLS/RPC
  seed.sql                       soal, materi, kode redeem
scripts/db-test.sh               harness uji database
docs/design-brief.md             brief desain (acuan visual)
```

## 6. Keterbatasan yang diketahui

- **Belum diuji dengan kredensial Supabase asli.** Alur HTTP penuh (daftar → redeem → kerjakan → submit) belum dijalankan terhadap project Supabase sungguhan; yang sudah dijalankan adalah uji database terhadap Postgres lokal (RLS, RPC, deadline) dan `pnpm build`. Lihat bagian 7.
- `supabase test db` (pgTAP) tidak dipakai karena Docker tidak tersedia di mesin pengembangan; pengujian memakai skrip SQL biasa lewat `psql`.
- Tidak ada rate limiting pada percobaan login dan redeem. Supabase punya rate limit bawaan untuk auth, tetapi redeem hanya dibatasi oleh aturan kode.
- Attempt aktif tidak dikunci ke satu perangkat. Membuka tryout di dua tab memungkinkan dua tab menulis jawaban ke attempt yang sama (yang terakhir menang), meski submit kedua akan ditolak.
- Satu tryout saja yang di-seed. Skema mendukung banyak tryout, tetapi UI dashboard mengasumsikan daftar (bukan satu kartu).
- Video materi memakai video YouTube publik milik kanal lain dan diverifikasi ada serta dapat di-embed pada 23 Nov 2026. Untuk produksi, ganti dengan video milik Liniswara.
- Tidak ada halaman admin; kode redeem dibuat lewat SQL.
- Palet mengikuti aset publik, bukan brand guideline resmi, dan belum dikonfirmasi ke klien.

### Rencana lanjutan

1. Halaman admin untuk membuat kode redeem (dengan audit trail pemakaian).
2. Penanda progres materi (tabel `material_progress`).
3. Kunci attempt ke satu sesi perangkat.
4. Rate limiting pada redeem dan login.
5. Test E2E Playwright untuk alur redeem dan tryout, dijalankan di CI.
6. Beberapa paket tryout sekaligus dengan halaman daftar tryout terpisah.

## 7. Hasil verifikasi

| Pemeriksaan | Hasil |
| --- | --- |
| `pnpm lint` | lulus, tanpa error/warning |
| `pnpm typecheck` | lulus, tanpa error |
| `pnpm build` | lulus, 13 route terbentuk |
| `pnpm db:test` (Postgres 18, migrasi + seed) | lulus: anon ditolak di semua tabel; user tanpa langganan tidak melihat materi/tryout; redeem sukses memperpanjang 30 → 37 hari; kode kedaluwarsa/nonaktif/tidak dikenal/dipakai ulang/kuota habis ditolak dengan kode error yang benar; payload attempt aktif tidak memuat `is_true`/`explanation`; skor dihitung server = 1 dari 3 pada data uji; submit ganda ditolak; attempt lewat deadline auto-finalisasi dengan skor 0 |
| Kunci tidak bocor | diperiksa di dua tempat: (a) uji SQL memastikan payload aktif tanpa `is_true`/`explanation`, (b) `statements` tanpa policy dan tanpa grant untuk `authenticated` |
| Alur penuh di dev server + URL produksi | **belum dijalankan** (butuh kredensial Supabase asli); yang sudah dicek: route terproteksi tanpa sesi mengembalikan 307 ke `/masuk?next=…`, landing/masuk/daftar 200 |
| Tampilan 375px | dicek dengan Chrome headless: landing, masuk, daftar, dan halaman soal (payload contoh) tanpa scroll horizontal (`scrollWidth == clientWidth == 375`); target sentuh tombol Benar/Salah 44px |
| Demo soal di landing | diklik di browser: 3 jawaban → penghitung `3/3 dijawab`, pembahasan per pernyataan muncul |

## 8. Penggunaan AI assistant

Proyek ini dibangun dengan bantuan AI (Claude) sebagai pair programmer. Pembagian kerjanya:

- **Dibantu AI:** scaffold Next.js/Tailwind/shadcn, penulisan migrasi SQL dan RPC, komponen UI, skrip uji database, penyusunan soal seed, README.
- **Keputusan dan verifikasi:** arsitektur keamanan (RLS per operasi, `statements` tanpa policy, `security definer` dengan `for update`), interpretasi format soal, penyesuaian palet terhadap batasan kontras, serta eksekusi dan pemeriksaan hasil uji database dan build.
- **Belum diverifikasi AI:** alur penuh di browser terhadap Supabase asli dan tampilan visual di perangkat nyata, seperti dicatat di bagian 6 dan 7.
