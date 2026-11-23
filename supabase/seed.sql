-- Seed: 1 tryout (10 soal x 3 pernyataan), 5 materi video terverifikasi, 3 kode redeem.
-- ID video diverifikasi lewat oEmbed YouTube dan flag playableInEmbed (23 Nov 2026).

insert into materials (slug, title, description, youtube_id, position, is_published) values
  ('teks-argumentasi', 'Mengenali teks argumentasi', 'Ciri, struktur, dan kaidah bahasa teks argumentasi untuk soal bacaan.', 'Nop5TPNdwBg', 1, true),
  ('membaca-kritis', 'Membaca kritis: menimbang alasan penulis', 'Cara memisahkan klaim, bukti, dan opini saat membaca teks panjang.', 'igqsmkmUfd0', 2, true),
  ('penalaran-induktif-deduktif', 'Penalaran induktif dan deduktif', 'Dasar menarik kesimpulan dari kasus khusus maupun aturan umum.', 'cIWnCKCyg_Q', 3, true),
  ('silogisme', 'Silogisme dan negasi', 'Pola silogisme, modus ponens, modus tollens, beserta contoh soalnya.', 'qzAVCbTWmkY', 4, true),
  ('penalaran-teks', 'Penalaran berbasis teks', 'Latihan menghubungkan pernyataan dengan isi bacaan, bukan dengan ingatan.', 'qQ28QQzgS6A', 5, true)
on conflict (slug) do nothing;

insert into redeem_codes (code, duration_days, max_uses, expires_at, is_active) values
  ('LINIS30HARI1', 30, 100, null, true),
  ('SEKALI1X2026', 30, 1, null, true),
  ('KEDALUWARSA1', 30, 100, now() - interval '7 days', true)
on conflict (code) do nothing;

with t as (
  insert into tryouts (title, duration_minutes, is_published)
  values ('Tryout Literasi dan Penalaran Umum', 30, true)
  returning id
),
q as (
  insert into questions (tryout_id, position, stimulus)
  select t.id, v.position, v.stimulus from t, (values
    (1, 'Setiap pagi, siswa SMK Negeri 2 Muntilan melewati jalan yang sama menuju sekolah. Sejak tahun lalu, trotoar di sisi timur jalan dipakai pedagang untuk menaruh dagangan. Pejalan kaki pun turun ke badan jalan. Kepala sekolah mengusulkan agar pedagang dipindahkan ke halaman belakang pasar yang berjarak 300 meter. Para pedagang menolak karena lokasi baru sepi pembeli. Hingga kini, tidak ada pihak yang menyediakan data berapa banyak pejalan kaki yang melintas setiap pagi, sehingga usulan itu belum pernah diuji.'),
    (2, 'Sebuah koperasi sekolah mencatat penjualan tiga jenis minuman selama satu minggu: teh 240 gelas, jeruk 180 gelas, dan susu 120 gelas. Pengurus berencana menambah stok susu dua kali lipat minggu depan karena beranggapan susu paling diminati. Catatan kasir menunjukkan susu dijual dengan harga dua kali harga teh, sedangkan jumlah gelas terjual dihitung tanpa melihat harga.'),
    (3, 'Kutipan: "Program literasi sekolah sebaiknya tidak diukur dari banyaknya buku yang dibaca. Mengukur jumlah buku mendorong siswa memilih buku tipis dan menghindari teks sulit. Yang lebih berguna adalah menilai apakah siswa mampu menjelaskan alasan penulis dan menanggapi argumennya." Penulis kutipan ini adalah guru bahasa yang menulis untuk majalah sekolah.'),
    (4, 'Rani mengamati bahwa nilai ujian biologi kelasnya turun pada bulan ketika jadwal olahraga pagi ditambah. Ia menyimpulkan bahwa olahraga pagi menurunkan nilai biologi. Temannya mengingatkan bahwa bulan itu juga bertepatan dengan pergantian guru biologi dan tiga minggu praktikum yang ditiadakan.'),
    (5, 'Tabel harga buku di toko sekolah (contoh): Buku A Rp45.000, 120 halaman. Buku B Rp60.000, 200 halaman. Buku C Rp38.000, 96 halaman. Buku D Rp72.000, 260 halaman. Toko memberi diskon 10% untuk pembelian minimal tiga buku dalam satu transaksi.'),
    (6, 'Kepala desa melaporkan bahwa sumur bor baru di dusun utara menurunkan keluhan kekeringan dari 40 keluarga menjadi 9 keluarga dalam satu musim kemarau. Namun, musim kemarau tahun ini berlangsung lebih pendek dan curah hujan tercatat lebih tinggi daripada tahun sebelumnya. Laporan tidak menyebut angka pembanding dari dusun lain yang tidak mendapat sumur bor.'),
    (7, 'Surat pembaca: "Kami mendukung penambahan lampu penerangan di gang sekolah. Gang itu gelap sejak pukul enam sore, dan beberapa siswa pulang dengan sepeda. Menurut kami, keselamatan siswa lebih penting daripada penghematan listrik. Kami berharap pemerintah desa mendahulukan pemasangan lampu sebelum musim hujan."'),
    (8, 'Dalam laporan kegiatan, panitia menulis: "Antusiasme peserta memuaskan. Dari 200 undangan yang dikirim, 187 orang hadir. Sesi tanya jawab berlangsung 25 menit lebih lama dari jadwal karena banyak pertanyaan. Namun, 40 peserta meninggalkan ruangan sebelum sesi terakhir dimulai."'),
    (9, 'Sebuah perpustakaan sekolah menargetkan 1.500 kunjungan per bulan. Pada bulan Januari tercatat 1.260 kunjungan. Bulan Februari 1.050 kunjungan, dengan 3 hari lebih sedikit karena libur. Pengelola menyimpulkan bahwa minat berkunjung turun dan berencana mengurangi jam buka pada bulan Maret.'),
    (10, 'Guru menulis di papan: "Semua siswa yang mengikuti klub debat mampu menyusun argumen tertulis. Sebagian siswa kelas XI mengikuti klub debat. Sebagian siswa kelas XI juga mengikuti klub jurnalistik." Seorang siswa menyimpulkan bahwa semua anggota klub jurnalistik mampu menyusun argumen tertulis.')
  ) as v(position, stimulus)
  returning id, position
)
insert into statements (question_id, position, text, is_true, explanation)
select q.id, v.position, v.text, v.is_true, v.explanation
from q join (values
  -- Soal 1
  (1, 1, 'Kepala sekolah mengusulkan pemindahan pedagang ke lokasi yang berjarak 300 meter dari trotoar.', true, 'Teks menyebut halaman belakang pasar berjarak 300 meter sebagai lokasi usulan.'),
  (1, 2, 'Teks menyatakan bahwa usulan pemindahan sudah terbukti gagal.', false, 'Teks justru menyebut usulan belum pernah diuji karena data pejalan kaki belum ada.'),
  (1, 3, 'Alasan pedagang menolak pindah adalah lokasi baru dinilai sepi pembeli.', true, 'Kalimat penolakan pedagang menyebut alasan itu secara langsung.'),
  -- Soal 2
  (2, 1, 'Susu adalah minuman dengan jumlah gelas terjual terbanyak minggu itu.', false, 'Teh terjual 240 gelas, lebih banyak daripada susu 120 gelas.'),
  (2, 2, 'Alasan pengurus menambah stok susu didasarkan pada jumlah gelas, bukan pada nilai penjualan.', true, 'Catatan kasir menyebut harga susu dua kali teh, tetapi perhitungan hanya memakai jumlah gelas.'),
  (2, 3, 'Data yang ada cukup untuk menyimpulkan bahwa susu paling menguntungkan.', false, 'Pendapatan per jenis minuman tidak dihitung, jadi kesimpulan itu belum didukung data.'),
  -- Soal 3
  (3, 1, 'Penulis menolak pengukuran literasi yang hanya memakai jumlah buku.', true, 'Kalimat pertama kutipan menyatakan hal itu secara eksplisit.'),
  (3, 2, 'Menurut penulis, buku tipis selalu lebih buruk daripada buku tebal.', false, 'Penulis menyoroti perilaku memilih buku tipis demi angka, bukan menilai mutu buku tipis itu sendiri.'),
  (3, 3, 'Penulis menyarankan penilaian kemampuan menjelaskan alasan penulis dan menanggapi argumen.', true, 'Saran itu tertulis pada kalimat terakhir kutipan.'),
  -- Soal 4
  (4, 1, 'Kesimpulan Rani didukung percobaan yang mengendalikan faktor lain.', false, 'Tidak ada pengendalian; justru ada dua faktor lain yang berubah bersamaan.'),
  (4, 2, 'Pergantian guru biologi dan praktikum yang ditiadakan merupakan penjelasan alternatif untuk turunnya nilai.', true, 'Keduanya berubah pada bulan yang sama sehingga bisa ikut memengaruhi nilai.'),
  (4, 3, 'Hubungan antara olahraga pagi dan nilai biologi pada kasus ini bersifat korelasional, belum kausal.', true, 'Dua hal terjadi bersamaan, tetapi sebab-akibatnya belum dipisahkan dari faktor lain.'),
  -- Soal 5
  (5, 1, 'Buku D memiliki harga per halaman tertinggi di antara keempat buku.', false, 'Harga per halaman Buku D sekitar Rp277, lebih rendah daripada Buku A sekitar Rp375.'),
  (5, 2, 'Membeli tiga buku Buku C sekaligus memenuhi syarat diskon 10%.', true, 'Syaratnya minimal tiga buku dalam satu transaksi, tanpa syarat judul berbeda.'),
  (5, 3, 'Buku B paling murah di antara keempat buku.', false, 'Buku C berharga Rp38.000, paling murah; Buku B Rp60.000.'),
  -- Soal 6
  (6, 1, 'Laporan menyertakan pembanding dari dusun lain tanpa sumur bor.', false, 'Teks menyebut laporan tidak memuat pembanding tersebut.'),
  (6, 2, 'Penurunan keluhan bisa saja dipengaruhi musim kemarau yang lebih pendek.', true, 'Teks mencatat musim lebih pendek dan curah hujan lebih tinggi pada periode yang sama.'),
  (6, 3, 'Data yang ada membuktikan sumur bor satu-satunya penyebab turunnya keluhan.', false, 'Tanpa kelompok pembanding dan dengan faktor cuaca yang berubah, sebab tunggal belum bisa dibuktikan.'),
  -- Soal 7
  (7, 1, 'Penulis surat menyatakan keselamatan siswa lebih penting daripada penghematan listrik.', true, 'Pernyataan itu tertulis langsung sebagai pendapat penulis.'),
  (7, 2, 'Klaim bahwa gang gelap sejak pukul enam sore disertai data pengukuran cahaya.', false, 'Tidak ada angka pengukuran; hanya pernyataan pengalaman penulis.'),
  (7, 3, 'Surat meminta pemasangan lampu didahulukan sebelum musim hujan.', true, 'Kalimat terakhir memuat permintaan itu.'),
  -- Soal 8
  (8, 1, 'Tingkat kehadiran peserta mencapai lebih dari 90 persen undangan.', true, '187 dari 200 undangan sekitar 93,5 persen.'),
  (8, 2, 'Panitia menyimpulkan bahwa seluruh peserta bertahan sampai sesi terakhir.', false, 'Teks menyebut 40 peserta keluar sebelum sesi terakhir.'),
  (8, 3, 'Sesi tanya jawab berlangsung lebih lama dari jadwal.', true, 'Teks menyebut 25 menit lebih lama dari jadwal.'),
  -- Soal 9
  (9, 1, 'Penurunan kunjungan Februari sebagian dapat dijelaskan oleh hari buka yang lebih sedikit.', true, 'Februari memiliki tiga hari libur tambahan, sehingga kesempatan berkunjung berkurang.'),
  (9, 2, 'Kesimpulan pengelola bahwa minat turun sudah memisahkan pengaruh jumlah hari buka.', false, 'Kesimpulan diambil tanpa menyesuaikan jumlah hari buka.'),
  (9, 3, 'Mengurangi jam buka akan membantu mencapai target 1.500 kunjungan.', false, 'Mengurangi jam buka justru menurunkan kesempatan kunjungan.'),
  -- Soal 10
  (10, 1, 'Kesimpulan siswa tersebut valid menurut premis yang diberikan.', false, 'Premis hanya menyebut sebagian kelas XI di klub debat; tidak ada hubungan dengan klub jurnalistik.'),
  (10, 2, 'Premis "sebagian siswa kelas XI mengikuti klub debat" tidak menjamin semua anggota klub debat dari kelas XI.', true, 'Kata "sebagian" hanya menyatakan ada anggota, bukan cakupan seluruhnya.'),
  (10, 3, 'Dari premis yang ada, dapat dipastikan ada siswa kelas XI yang mampu menyusun argumen tertulis.', true, 'Sebagian siswa kelas XI ada di klub debat, dan semua anggota klub debat mampu menyusun argumen tertulis.')
) as v(qpos, position, text, is_true, explanation) on v.qpos = q.position;
