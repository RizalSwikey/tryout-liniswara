# Design Brief — Website Tryout Liniswara

Technical test Full Stack Developer, PT Lini Suara Nusantara. Dokumen ini acuan agent coding.
Penanda: **[FAKTA]** = terverifikasi di URL pada bagian Sumber. **[REKOM]** = keputusan desain saya.

---

## 0. Batasan riset (baca dulu)

- **[FAKTA]** Tidak ada brand guideline / press kit publik Liniswara. Warna di bawah diambil dari CSS live `store.liniswara.com` dan sampling piksel aset logo resmi — bukan dari dokumen resmi. Bisa berubah tanpa pemberitahuan.
- **[FAKTA]** Tanggal berdiri tidak konsisten di situs sendiri: homepage menulis "berdiri sejak 2020", halaman Tentang Kami menulis "Sejak 2021". **Jangan tampilkan tahun berdiri** di landing page sampai dikonfirmasi ke klien.
- **[FAKTA]** Khan Academy tidak bisa diakses (bot challenge), jadi tidak saya nilai. Zenius/Pahamify/Duolingo/Brilliant dinilai dari halaman publik saja, bukan dari dalam aplikasi berbayar.
- Semua angka klaim (900+ judul, 25+ MGMP, penghargaan) berasal dari materi Liniswara sendiri. Pakai hanya setelah klien setuju.

---

## 1. Identitas visual

**Aset resmi [FAKTA].** Logo: tiga kapsul miring + titik oranye, bentuk "V"/centang; wordmark `LINISWARA`. Warna logo: kuning `#FFF000` (25,3% piksel), putih, oranye `#FF9D33`. UI toko: primary `#006BB2`, secondary `#F8C630`, teks `#172636`, latar `#F9FAFB`, font Poppins. Sampul buku: bidang putih, judul magenta `#E63C70`, ilustrasi vektor flat di blob krem `#F2DDBE`, badge bulat `KELAS n`, pola judul "akronim raksasa + garis tipis + kepanjangan". Nada bahasa formal-institusional ("solusi bahan ajar berkualitas"), tanpa slang. Produk: buku teks SMK/MAK, SMA/MA, SMP/MTs + nonteks, sudah punya lini TKA ("SMART STEPS") — nyambung ke tryout.

**Palet [REKOM]** — diturunkan dari aset, bukan selera:

```
--ink        #172636   teks utama            (kontras 14,7:1 di atas paper)
--paper      #F9FAFB   latar halaman
--surface    #FFFFFF   kartu, input
--primary    #006BB2   tombol utama, tautan  (5,61:1 di atas putih — lolos AA)
--primary-dk #00538A   hover/active
--accent     #F8C630   HANYA sebagai isian + teks ink di atasnya (9,59:1)
--line       #E2E8F0   border 1px
--ok         #157F4B   jawaban benar
--warn       #B45309   ragu-ragu
--muted      #5A6B7B   teks sekunder
```

Aturan pakai: `#F8C630` **tidak boleh** jadi warna teks di atas putih (3,49:1 — gagal AA). Kuning selalu bidang isian dengan teks `#172636`. Magenta `#E63C70` hanya boleh muncul sebagai penanda seri/badge (meniru sampul buku), bukan warna teks di atas putih (3,83:1).

**Tipografi [REKOM].**

- **Literata** (400/600/700) — judul, angka besar, kutipan stimulus. Serif yang memang dirancang untuk bacaan panjang; memberi rasa "penerbit buku" yang tidak bisa dipalsukan font SaaS.
- **Plus Jakarta Sans** (400/500/700) — seluruh UI, tombol, label, isi soal.
- Skala: 12 / 14 / 16 / 20 / 26 / 34 / 48. Body 16px minimum, `line-height` 1.6 untuk stimulus soal (dibaca di HP sambil menghitung).
- Angka timer & skor: Plus Jakarta Sans `font-variant-numeric: tabular-nums` supaya tidak bergoyang tiap detik.

**Nuansa [REKOM].**

Halaman ujian yang tenang dan terbaca — bukan arcade. Rujukan mentalnya: lembar soal cetak yang dirapikan, bukan dashboard startup. Radius: `6px` kartu, `4px` input/tombol, `999px` hanya untuk chip status dan badge kelas. Shadow maksimum satu level (`0 1px 2px rgba(23,38,54,.06)`); kedalaman dari border 1px dan perbedaan latar, bukan bayangan bertumpuk.

Ilustrasi: ikuti bahasa sampul buku — vektor flat, outline seragam, blob organik, karakter pelajar (bukan maskot hewan). **Jangan** pakai ilustrasi 3D atau foto stok "siswa tersenyum memegang laptop".

---

## 2. Struktur landing page (satu halaman)

Target: pelajar SMA/SMK + orang tua, HP, koneksi lambat. Urutan ini juga urutan prioritas kalau harus dipotong.

1. **Hero** — "ini apa" dalam 3 detik. H1 faktual + `Mulai tryout` + `Punya kode akses?`. **Demo soal hidup**: 1 stimulus + 3 pernyataan Benar/Salah bisa diklik tanpa login. Satu-satunya elemen yang boleh berani.
2. **Bukti** — keraguan orang tua. 3 angka resmi (900+ judul, 25+ MGMP, Perpusnas 2023), setelah dikonfirmasi. Tanpa logo klien fiktif.
3. **Cara kerja** — alur redeem. 3 langkah bernomor (sah, memang berurutan): daftar, masukkan kode, kerjakan.
4. **Isi produk** — 10 soal x 3 pernyataan, timer, pembahasan per pernyataan, video. Screenshot UI asli, bukan kartu mockup.
5. **Untuk orang tua** — yang dilaporkan, masa akses, tanpa iklan, tanpa auto-perpanjang. Nada tenang.
6. **Harga + kode** — satu kartu harga. Satu paket = jangan bikin tabel perbandingan.
7. **FAQ** — kode salah, akses hangus, bisa diulang, HP kentang, sama/tidak dengan TKA.
8. **Footer** — alamat Magelang, email, WhatsApp, Instagram/TikTok/YouTube sesuai situs resmi.

Mobile: satu kolom, CTA utama sticky di bawah (tinggi ≤ 56px), bukan floating bubble WhatsApp yang menutupi konten.

---

## 3. Wireframe teks

**Login `/masuk`** — satu kolom, maks 400px, tanpa panel ilustrasi samping.
```
[logo]  Masuk
Email      [              ]     Kata sandi  [           ] o
[       Masuk       ]           Lupa kata sandi?
---- atau ----  [  Masuk dengan Google  ]  Belum punya akun? Daftar
```
Error di atas field, konkret: "Email belum terdaftar. Cek ejaan atau daftar baru." Daftar: email + sandi + konfirmasi; tanpa No. HP/NISN/jenjang di langkah pertama.

**Dashboard `/dashboard`**
```
[logo]  Halo, Rizal  [avatar]     Status: Aktif s.d. 12 Des | Belum aktif
+-------------------------------------------------------------+
| Paket Tryout TKA 1 - 10 soal - 30 pernyataan - belum dikerjakan
| [ Mulai ]
+-------------------------------------------------------------+
Materi video ->   Riwayat hasil ->   [ Masukkan kode akses ]
```
Belum aktif: kartu jadi form kode; tombol mulai disabled **dengan alasan tertulis** ("Aktifkan kode untuk mulai").

**Materi video `/materi/[slug]`**
```
<- Materi
[ thumbnail + play ]   <- iframe belum dimuat
Judul - 8 menit - Bab 2
Poin dibahas: ...        [ Kerjakan tryout terkait ]
Video lain: ...
```
Thumbnail dulu: satu iframe YouTube bisa lebih berat dari seluruh halaman di 3G. Selalu ada jalan keluar ke tryout.

**Soal tryout `/tryout/[id]`**
```
Soal 3/10      timer 12:45      menu      <- sticky, tabular-nums
####------  progress
Stimulus (teks / tabel / gambar)
Tentukan Benar atau Salah untuk setiap pernyataan.
+-------------------------------------------------+
| A. Pernyataan pertama...
| [    Benar    ][    Salah    ]     <- segmented, full width
+-------------------------------------------------+
   (B, C idem)
[Tandai ragu]   [<- Sebelumnya]   [Berikutnya ->]
```
- **Jangan tabel `Pernyataan|Benar|Salah`**: di 360px kolom pernyataan tinggal ~180px. Pakai kartu + segmented di bawah teks.
- Target sentuh >=44x44px. State terpilih = isian solid + ikon centang, bukan hanya warna.
- Laci menu: grid 10 nomor + legenda (kosong / terjawab / ragu / aktif). Nomor kosong **tidak boleh** mirip dengan terjawab.
- Timer tidak berhenti saat tab tidur; hitung dari `deadline` server. Peringatan sekali di 5 menit tersisa.

**Hasil `/tryout/[id]/hasil`**
```
Hasil Tryout      24 / 30  (80%)   18 benar - 6 salah - 12:03
+-------------------------------------------------+
| Soal 1                          3/3 benar
| A. Benar (jawab B)  B. Salah (jawab B)  C. Benar
| Pembahasan: ...
+-------------------------------------------------+
[ Ulangi tryout ]   [ Ke dashboard ]
```
Skor utama per pernyataan (30); tampilkan keduanya agar tidak ambigu. Pembahasan menempel per pernyataan, jawaban user & kunci berdampingan. Tanpa confetti: ini latihan ujian, bukan game.

---

## 4. Pola UX tryout yang terbukti

**[FAKTA]** Format soal yang dipakai Kemendikdasmen di TKA: "PGK Kategori" — satu stimulus, tiga pernyataan, tiap pernyataan direspon Benar/Salah. Contoh resmi memakai tabel `# | Pernyataan | Benar | Salah`. Persis format produk ini.

**[REKOM]** (1) Grid nomor di laci, bukan sidebar — 10 nomor muat tanpa scroll. (2) Empat state beda secara visual **dan** ikon: kosong (outline abu), terjawab (isi biru + centang), ragu (outline kuning + tanda tanya), aktif (cincin fokus). (3) Ragu-ragu per **soal**, bukan per pernyataan. (4) Konfirmasi submit menyebut jumlah: "2 soal belum dijawab sama sekali. Kirim sekarang?" → `Kembali mengerjakan` (utama) / `Kirim` (sekunder). (5) Autosave tiap klik ke DB — koneksi putus di HP itu normal. (6) Satu soal per layar. (7) Pembahasan hanya setelah submit, supaya tidak jadi kuis. (8) Kunci attempt ke satu sesi: "Sesi ini sedang dibuka di perangkat lain."

---

## 5. Referensi (yang konkret saja)

- [ruangguru.com/ruanguji](https://www.ruangguru.com/ruanguji) — **bagus:** kartu tryout dengan rentang tanggal jelas + label Premium/Reguler, tabel akses jujur. **jelek:** landing berupa daftar event bukan penjelasan produk; gerbang nomor WhatsApp sebelum lihat apa pun; emoji di judul.
- [tryout.pahamify.com](https://tryout.pahamify.com/) — **bagus:** halaman terpisah khusus tryout, FAQ menjawab "di mana dikerjakan". **jelek:** nyaris hanya FAQ + ajakan unduh app; format soal tidak dijelaskan.
- [zenius.net](https://www.zenius.net/) — **bagus:** nada konsisten, testimoni spesifik (nama, kampus, tahun). **jelek:** halaman sangat panjang, klaim superlatif tanpa rujukan, info produk tenggelam di antara kutipan.
- [pahamify.com](https://pahamify.com/) — **bagus:** fitur dijelaskan per fungsi dengan manfaat konkret. **jelek:** placeholder "XXXXX pengguna" masih terbit di produksi; banner promo menutupi hero.
- [duolingo.com](https://www.duolingo.com/) — **bagus:** framing kebiasaan, pelajaran pendek, progres terlihat. **jelek:** gamifikasi/maskot berat, tidak cocok untuk ujian serius.
- [brilliant.org](https://brilliant.org/) — **bagus:** kredensial sebagai fakta pendek (kidSAFE, WASC). **jelek:** hero langsung ke fitur AI, produk dasar tidak dijelaskan.

**Pelajaran lintas situs:** yang membedakan halaman bagus dari generik bukan visual, tapi apakah halaman itu menjawab "soalnya seperti apa" dan "berapa lama". Tidak satu pun dari mereka menampilkan contoh soal di landing page. Itu celah yang bisa diambil.

---

## 6. Stack & tooling (versi dicek 23 Nov 2026)

- `next` **16.4.6** — App Router. **`middleware.ts` jadi `proxy.ts`** di Next 16; Supabase menyebut `proxy.ts` tidak pernah dipanggil di <=15.
- `tailwindcss` **4.3.5** — konfigurasi via `@theme` di CSS, bukan `tailwind.config.js`; `@tailwindcss/turbopack` sejak 4.3.4.
- `shadcn` CLI **4.23.0** — default primitive kini **Base UI** (Radix berhenti dirawat); `pnpm dlx shadcn@latest init -t next`.
- `@supabase/supabase-js` **2.119.2** dan `@supabase/ssr` **0.12.7** — sesi cookie, butuh client browser + server terpisah.
- `lite-youtube-embed` **0.4.0** — +/-224x lebih cepat dari iframe biasa.

**YouTube.**
- Privasi-lebih-baik: ganti host ke `https://www.youtube-nocookie.com/embed/VIDEO_ID` — domain ini merespons 200 dan tidak memasang cookie pelacak sebelum diputar.
- Kombinasi terbaik: `lite-youtube-embed` (thumbnail dulu) dengan `params="rel=0"` dan host nocookie. Catatan: `modestbranding`, `showinfo`, `autohide`, `theme` sudah **deprecated** di parameter player YouTube — jangan dipakai.
- Video harus bisa diakses tanpa scroll horizontal di 360px: wrapper `aspect-ratio: 16/9`.

**Kode redeem — jangan salah.**
- Tabel `redeem_codes` **tidak boleh** punya policy `select` untuk `authenticated`. Kalau user bisa `select`, dia bisa membaca semua kode yang belum terpakai.
- Penukaran kode lewat satu fungsi Postgres `security definer` (`redeem_code(text)`) yang memvalidasi kode, menandai terpakai, dan membuat baris langganan dalam satu transaksi. Klien hanya `execute`, tanpa `select` tabel.
- RLS tiap operasi terpisah (`select`/`insert`/`update`/`delete`), pola `using ((select auth.uid()) = user_id)`. Ingat `auth.uid()` = `null` saat anon, jadi tulis `auth.uid() is not null and auth.uid() = user_id`.
- Uji policy dengan `supabase test db`, bukan dengan asumsi.

**Skill/tool**

| Nama | Link | Fungsi | Pasang |
|---|---|---|---|
| `frontend-design` (Anthropic) | [github.com/anthropics/skills/tree/main/skills/frontend-design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) | Arahkan agent menentukan palet/type/layout sadar-konteks sebelum menulis kode; memuat daftar "tells" desain generik | Di Claude Code: `/plugin marketplace add anthropics/skills` → install `example-skills`. Manual: salin folder ke `.claude/skills/` |
| `hallmark` (Together AI) | [github.com/nutlope/hallmark](https://github.com/nutlope/hallmark) | 50 tema material, menyusun halaman dari tujuan pengunjung, lint `sloplint` di browser sungguhan terhadap 57 gerbang anti-slop | `npx skills add nutlope/hallmark -g` (butuh Node ≥18; cek render butuh Chrome + `puppeteer-core`) |
| `unslop-ui` | [github.com/iamneilroberts/claude-skills](https://github.com/iamneilroberts/claude-skills/blob/main/skills/unslop-ui/SKILL.md) | Daftar pola yang orang sungguhan sebut "AI slop", disusun dari analisis ~3,2 juta post Reddit | Salin folder skill ke `.claude/skills/` |
| `anti-slop-design` | [github.com/Ferousco-dev/anti-slop-design](https://github.com/Ferousco-dev/anti-slop-design) | Protokol "tentukan arah visual dulu, baru kode" + daftar tolak keras | Salin ke `.claude/skills/` |
| `shadcn` MCP/registry | [ui.shadcn.com/docs/installation/next](https://ui.shadcn.com/docs/installation/next) | Komponen dasar, jangan ditulis manual | `pnpm dlx shadcn@latest init -t next` |

Saran pemakaian: **satu** skill desain saja (pilih `frontend-design`), lalu `hallmark` hanya untuk audit akhir. Menumpuk tiga skill anti-slop menghasilkan aturan yang saling bertabrakan.

---

## 7. Jangan dilakukan (anti-slop)

Setiap butir punya alasan dari pengamatan nyata di atas.

**Visual.** (1) Gradient ungu/indigo (`#6366F1`, `#8B5CF6`) dan gradient pada teks judul — warna default Tailwind, tanda belum disentuh → `#006BB2` solid. (2) Blob blur, glow, grid overlay, glassmorphism → border 1px + beda latar. (3) Semua kartu radius 16px + shadow `rgba(0,0,0,.1)` seragam → radius mengikuti hierarki, satu level shadow. (4) Emoji sebagai ikon (dipakai Ruangguru, terbaca seperti caption kartu WA) → SVG 1,5px stroke, satu set. (5) Ilustrasi 3D / foto stok "siswa memegang laptop" → vektor flat gaya sampul. (6) Hero tengah + 3 kartu fitur sama besar + CTA → hero demo soal, asimetris. (7) Bintang rating & logo klien yang tidak ada. (8) "Angka besar + label kecil + aksen gradient" sebagai pembuka — hanya sah kalau angkanya memang inti.

**Copy.** (9) Superlatif tanpa sumber: "#1", "terbaik", "terpercaya" → fakta: "10 soal, 30 pernyataan, pembahasan tiap pernyataan". (10) Slang paksa ("lo/gue", "gas", "auto jago") dari brand institusional → baku tapi tidak kaku. (11) Urgensi palsu ("kuota terbatas!") → tanggal berakhir akses yang sebenarnya. (12) Kata pengisi "solusi inovatif", "ekosistem pembelajaran", "revolusi belajar". (13) Label ALL-CAPS di atas setiap judul. (14) Penomoran 01/02/03 pada hal yang bukan urutan. (15) Tombol "Submit"/"Kirim" tanpa objek → "Kirim jawaban". (16) Error kabur "Terjadi kesalahan" → "Kode tidak dikenali. Periksa 12 karakter, tanpa spasi."

**Teknis.** (17) Iframe YouTube dimuat di atas lipatan. (18) `fade-in-up` per section saat scroll → satu momen: transisi antar soal. (19) Timer `setInterval` yang melenceng saat tab tidur → selisih terhadap `deadline` server.

---

## 8. Sumber

**Liniswara** — [liniswara.com](https://liniswara.com/) · [tentang-kami](https://liniswara.com/tentang-kami/) · [store.liniswara.com](https://store.liniswara.com/) (CSS live; logo `assets/logo-BLLumdce.png`) · [preorders](https://store.liniswara.com/preorders?page=4) · [marketplace](https://liniswara.com/marketplace/) · [linktr.ee/liniswara](https://linktr.ee/liniswara) · [instagram.com/liniswara](https://www.instagram.com/liniswara) · [LinkedIn](https://linkedin.com/company/liniswara) · [brandwiki Lazada](https://brandwiki.lazada.co.id/liniswara) (pihak ketiga) · sampul IPA IX: `admin-liniswara.nginx.biz.id/storage/files/20260220/12.-ilmu-pengetahuan-alam-kelas-ix-1771554626.png`

**Referensi UI** — [ruangguru/ruanguji](https://www.ruangguru.com/ruanguji) · [tryout.pahamify.com](https://tryout.pahamify.com/) · [pahamify.com](https://pahamify.com/) · [zenius.net](https://www.zenius.net/) · [duolingo.com](https://www.duolingo.com/) · [brilliant.org](https://brilliant.org/) · [khanacademy.org](https://www.khanacademy.org/) (gagal diakses)

**Format soal** — [pusmendik file-178](https://pusmendik.kemendikdasmen.go.id/pdf/file-178) · [contoh butir PGK Kategori](https://pusmendik.kemendikdasmen.go.id/tka/tka/view/mata-pelajaran-wajib/smp/Matematika) · [Panduan Penilaian Tertulis 2019](https://repositori.kemendikdasmen.go.id/18344/1/PANDUAN%20PENILAIAN%20TERTULIS%202019.pdf)

**Stack** — [next](https://registry.npmjs.org/next/latest) · [tailwindcss](https://registry.npmjs.org/tailwindcss/latest) · [shadcn](https://registry.npmjs.org/shadcn/latest) · [supabase-js](https://registry.npmjs.org/@supabase/supabase-js/latest) · [supabase/ssr](https://registry.npmjs.org/@supabase/ssr/latest) · [lite-youtube-embed](https://registry.npmjs.org/lite-youtube-embed/latest) · [shadcn changelog](https://ui.shadcn.com/docs/changelog) · [shadcn Next install](https://ui.shadcn.com/docs/installation/next) · [Tailwind releases](https://github.com/tailwindlabs/tailwindcss/releases) · [Supabase SSR client](https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs) · [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) · [Securing your API](https://supabase.com/docs/guides/api/securing-your-api) · [YouTube player parameters](https://developers.google.com/youtube/player_parameters) · [lite-youtube-embed repo](https://github.com/paulirish/lite-youtube-embed)

**Skill** — [frontend-design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) · [hallmark](https://github.com/nutlope/hallmark) · [unslop-ui](https://github.com/iamneilroberts/claude-skills/blob/main/skills/unslop-ui/SKILL.md) · [anti-slop-design](https://github.com/Ferousco-dev/anti-slop-design) · [9 tells from Slopstrap](https://dev.to/alanwest/how-to-make-your-website-not-look-ai-generated-9-tells-from-slopstraps-css-3a73)
