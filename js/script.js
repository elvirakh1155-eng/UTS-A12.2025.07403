/* =========================================================
   HASNAILART – script.js
   Urutan isi:
   1. Pengaturan & data (yang sering diganti ada di sini)
   2. Fungsi bantu
   3. Tema, menu, warna kuku, marquee
   4. Layanan, galeri, kalkulator
   5. Ulasan, FAQ, booking
   6. Animasi scroll
   ========================================================= */


/* ---------- 1. PENGATURAN & DATA ---------- */

// GANTI dengan nomor WhatsApp Hasnailart. Format 62..., tanpa tanda + dan tanpa spasi.
const NOMOR_WA = "6281234567890";

const ALAMAT = "Jl. Banowati Tengah V No.24, Bulu Lor, Kec. Semarang Utara, Kota Semarang, Jawa Tengah 50179";

// Jam operasional (format 24 jam). Slot booking terakhir = 1 jam sebelum tutup.
const JAM_BUKA = 9;
const JAM_TUTUP = 20;

// Warna cat di "Coba warnamu"
const WARNA_KUKU = ["#f06ab0", "#b266ff", "#ff6b4a", "#2fc4b2", "#e9b44c", "#3b6cff", "#1d1d27", "#f4d6cf"];

// Daftar layanan. "utama: true" artinya muncul di pilihan "Layanan utama" pada kalkulator.
const LAYANAN = [
  { ikon: "💅", nama: "Gel Polish",      harga: 85000,  utama: true,  info: "Warna tahan 3–4 minggu, kilap, dan tidak mudah chip." },
  { ikon: "✨", nama: "Nail Extension",  harga: 150000, utama: true,  info: "Perpanjang kuku dengan bentuk almond, coffin, atau square." },
  { ikon: "🎨", nama: "Nail Art",        harga: 20000,  utama: false, info: "Hand-painted, French tip, glitter, sampai chrome mirror." },
  { ikon: "💎", nama: "3D & Charm",      harga: 30000,  utama: false, info: "Hiasan timbul, permata, dan charm untuk tampilan berani." },
  { ikon: "🌿", nama: "Manicure & Care", harga: 60000,  utama: true,  info: "Rapikan kutikula, scrub, dan pijat ringan sebelum pewarnaan." },
  { ikon: "🧼", nama: "Remove & Repair", harga: 35000,  utama: false, info: "Lepas gel dengan aman dan perbaiki kuku patah." },
];

// Harga nail art per jari (diambil dari data layanan di atas, jadi cukup diubah di satu tempat)
const HARGA_ART_PER_JARI = LAYANAN.find(l => l.nama === "Nail Art").harga;

// Galeri desain: kategori, nama, nama file di folder img/
const DESAIN = [
  { kategori: "French",  nama: "French Tip Klasik", file: "desain-french-klasik.jpg" },
  { kategori: "French",  nama: "French Pastel",     file: "desain-french-pastel.jpg" },
  { kategori: "Glitter", nama: "Galaxy Glitter",    file: "desain-galaxy-glitter.jpg" },
  { kategori: "Glitter", nama: "Rose Sparkle",      file: "desain-rose-sparkle.jpg" },
  { kategori: "Chrome",  nama: "Mirror Chrome",     file: "desain-mirror-chrome.jpg" },
  { kategori: "Chrome",  nama: "Aurora Chrome",     file: "desain-aurora-chrome.jpg" },
  { kategori: "3D",      nama: "Pearl Charm",       file: "desain-pearl-charm.jpg" },
  { kategori: "3D",      nama: "Bunga 3D",          file: "desain-bunga-3d.jpg" },
  { kategori: "Simple",  nama: "Nude Milky",        file: "desain-nude-milky.jpg" },
  { kategori: "Simple",  nama: "Cherry Red",        file: "desain-cherry-red.jpg" },
];

// Tambahan biaya di kalkulator
const TAMBAHAN = [
  { nama: "Chrome",      harga: 25000 },
  { nama: "Charm",       harga: 30000 },
  { nama: "Remove gel",  harga: 35000 },
  { nama: "Nail care",   harga: 40000 },
];

// Ulasan pelanggan: [isi, nama]. Ganti dengan ulasan asli.
const ULASAN = [
  ["Hasilnya rapi banget dan tahan sampai tiga minggu. Tempatnya bersih, ownernya ramah.", "Dinda, Semarang Utara"],
  ["Bawa referensi dari Pinterest, hasilnya mirip sekali. Pasti balik lagi.", "Nisa, Tembalang"],
  ["Pertama kali extension dan tidak sakit sama sekali. Bentuknya cantik.", "Rara, Pedurungan"],
  ["Booking lewat WhatsApp gampang, tidak perlu antre lama.", "Ayu, Gayamsari"],
];

// Pertanyaan umum: [pertanyaan, jawaban]
const FAQ = [
  ["Berapa lama pengerjaannya?", "Gel polish polos sekitar 60–90 menit. Extension atau art detail bisa 2–3 jam."],
  ["Apakah perlu booking?", "Disarankan. Booking minimal H-1 supaya jadwalmu terjamin."],
  ["Boleh bawa referensi desain?", "Boleh. Kirim fotonya lewat WhatsApp atau tunjukkan saat datang."],
  ["Alatnya steril?", "Ya. Alat dibersihkan dan disterilkan setelah dipakai setiap pelanggan."],
];


/* ---------- 2. FUNGSI BANTU ---------- */

// Singkatan untuk document.querySelector
const $ = selector => document.querySelector(selector);

// Ubah angka jadi format rupiah, contoh: 85000 -> "Rp85.000"
const rupiah = angka => "Rp" + angka.toLocaleString("id-ID");

// Ubah "2026-10-27" jadi "Selasa, 27 Oktober 2026".
// Ditambah "T00:00:00" supaya dibaca sebagai waktu lokal, bukan UTC (kalau tidak, tanggalnya bisa mundur sehari).
const formatTanggal = isoDate =>
  new Date(isoDate + "T00:00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

// Tanggal hari ini dalam waktu LOKAL, format YYYY-MM-DD.
// (toISOString() memakai UTC, jadi di Indonesia dini hari tanggalnya bisa masih kemarin.)
function tanggalHariIni() {
  const sekarang = new Date();
  const bulan = String(sekarang.getMonth() + 1).padStart(2, "0");
  const hari = String(sekarang.getDate()).padStart(2, "0");
  return `${sekarang.getFullYear()}-${bulan}-${hari}`;
}

// Notifikasi kecil di bawah layar
function tampilkanToast(pesan) {
  const toast = $("#toast");
  toast.textContent = pesan;
  toast.classList.add("tampil");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => toast.classList.remove("tampil"), 2600);
}

// Buka WhatsApp dengan pesan yang sudah terisi
function kirimWhatsApp(pesan) {
  window.open("https://wa.me/" + NOMOR_WA + "?text=" + encodeURIComponent(pesan), "_blank", "noopener");
}

// Pengguna yang mematikan animasi di perangkatnya
const kurangiGerak = matchMedia("(prefers-reduced-motion: reduce)").matches;


/* ---------- 3. TEMA, MENU, WARNA KUKU, MARQUEE ---------- */

// --- Tema terang/gelap (pilihan disimpan di browser) ---
const html = document.documentElement;

// Tema aktif: pilihan manual pengunjung, atau ikut pengaturan perangkat kalau belum memilih
const apakahGelap = () => html.dataset.theme
  ? html.dataset.theme === "dark"
  : matchMedia("(prefers-color-scheme: dark)").matches;

// Bootstrap membaca atribut data-bs-theme (untuk panah dropdown, dll), jadi disamakan dengan tema kita
const terapkanTema = () => html.setAttribute("data-bs-theme", apakahGelap() ? "dark" : "light");

try {
  const temaTersimpan = localStorage.getItem("hn-tema");
  if (temaTersimpan) html.dataset.theme = temaTersimpan;
} catch (e) { /* localStorage bisa diblokir browser, abaikan saja */ }
terapkanTema();
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", terapkanTema);

$("#tombol-tema").addEventListener("click", () => {
  html.dataset.theme = apakahGelap() ? "light" : "dark";
  terapkanTema();
  try { localStorage.setItem("hn-tema", html.dataset.theme); } catch (e) { /* abaikan */ }
});

// --- Menu di HP ---
const menu = $("#menu");
const burger = $("#burger");

function aturMenu(buka) {
  menu.classList.toggle("terbuka", buka);
  burger.setAttribute("aria-expanded", buka);
  burger.textContent = buka ? "✕" : "☰";
}

burger.addEventListener("click", () => aturMenu(!menu.classList.contains("terbuka")));
menu.addEventListener("click", e => { if (e.target.tagName === "A") aturMenu(false); });   // tutup setelah memilih menu
document.addEventListener("keydown", e => { if (e.key === "Escape") aturMenu(false); });   // tutup dengan tombol Esc

// --- Pilihan warna di "Coba warnamu" ---
const wadahWarna = $("#pilihan-warna");

WARNA_KUKU.forEach((warna, urutan) => {
  const tombol = document.createElement("button");
  tombol.type = "button";
  tombol.style.background = warna;
  tombol.setAttribute("aria-label", "Warna " + (urutan + 1));
  if (urutan === 0) tombol.classList.add("aktif");

  tombol.addEventListener("click", () => {
    html.style.setProperty("--kuku", warna);   // CSS membaca variabel --kuku untuk mewarnai kuku
    wadahWarna.querySelectorAll("button").forEach(b => b.classList.toggle("aktif", b === tombol));
  });
  wadahWarna.append(tombol);
});

// --- Teks berjalan ---
// Daftar diulang 4x supaya cukup panjang. Animasi CSS menggeser sampai -50%, jadi sambungannya mulus.
const kataMarquee = ["Gel Polish", "Nail Extension", "3D Art", "Chrome", "French Tip", "Glitter", "Charm"];
$("#marquee-isi").innerHTML = Array(4).fill(kataMarquee).flat().map(k => `<span>${k} ✦</span>`).join("");


/* ---------- 4. LAYANAN, GALERI, KALKULATOR ---------- */

// --- Kartu layanan ---
$("#daftar-layanan").innerHTML = LAYANAN.map(l => `
  <div class="kartu-layanan muncul">
    <div class="ikon">${l.ikon}</div>
    <h3>${l.nama}</h3>
    <p>${l.info}</p>
    <span class="harga">mulai ${rupiah(l.harga)}</span>
  </div>`).join("");

// --- Galeri + filter kategori ---
const gridGaleri = $("#grid-galeri");
const wadahFilter = $("#filter");
const kategori = ["Semua", ...new Set(DESAIN.map(d => d.kategori))];

function tampilkanGaleri(pilihan) {
  gridGaleri.innerHTML = DESAIN
    .filter(d => pilihan === "Semua" || d.kategori === pilihan)
    .map(d => `
      <button class="kartu-desain" type="button" data-nama="${d.nama}">
        <img src="../img/${d.file}" alt="Desain nail art ${d.nama}" width="300" height="400" loading="lazy">
        <span class="nama">${d.nama}<small>${d.kategori}</small></span>
      </button>`).join("");
}

wadahFilter.innerHTML = kategori
  .map((k, i) => `<button type="button" class="${i === 0 ? "aktif" : ""}" data-kategori="${k}">${k}</button>`).join("");

wadahFilter.addEventListener("click", e => {
  const tombol = e.target.closest("button");
  if (!tombol) return;
  wadahFilter.querySelectorAll("button").forEach(b => b.classList.toggle("aktif", b === tombol));
  tampilkanGaleri(tombol.dataset.kategori);
});

// Klik kartu desain -> isi catatan booking lalu geser ke form
gridGaleri.addEventListener("click", e => {
  const kartu = e.target.closest(".kartu-desain");
  if (!kartu) return;
  $("#catatan").value = "Desain: " + kartu.dataset.nama;
  tampilkanToast("Dipilih: " + kartu.dataset.nama);
  $("#booking").scrollIntoView({ behavior: "smooth", block: "center" });
});

tampilkanGaleri("Semua");

// --- Kalkulator estimasi ---
const pilihLayanan = $("#layanan-utama");
const sliderJari = $("#jumlah-jari");
let pesanEstimasi = "";   // teks yang dikirim ke WhatsApp, diperbarui tiap hitung()

// Isi pilihan layanan utama (hanya layanan yang ditandai utama: true)
LAYANAN.filter(l => l.utama).forEach(l => {
  pilihLayanan.add(new Option(`${l.nama} (${rupiah(l.harga)})`, l.nama));
});

// Isi checkbox tambahan
$("#tambahan").innerHTML = TAMBAHAN.map((t, i) => `
  <label><input type="checkbox" value="${i}">${t.nama} +${rupiah(t.harga)}</label>`).join("");

function hitung() {
  const layanan = LAYANAN.find(l => l.nama === pilihLayanan.value);
  const jumlahJari = Number(sliderJari.value);
  const biayaArt = jumlahJari * HARGA_ART_PER_JARI;

  // "rincian" = daftar baris yang tampil di kartu total
  const rincian = [{ label: layanan.nama, biaya: layanan.harga }];
  if (jumlahJari > 0) rincian.push({ label: `${jumlahJari} jari nail art`, biaya: biayaArt });   // dilewati kalau 0 jari

  document.querySelectorAll("#tambahan input:checked").forEach(cek => {
    const t = TAMBAHAN[Number(cek.value)];
    rincian.push({ label: t.nama, biaya: t.harga });
  });

  const total = rincian.reduce((jumlah, r) => jumlah + r.biaya, 0);

  $("#label-jari").textContent = jumlahJari + " jari";
  $("#total").textContent = rupiah(total);
  $("#rincian").innerHTML = rincian.map(r => `<li>• ${r.label}: ${rupiah(r.biaya)}</li>`).join("");

  pesanEstimasi = "Halo Hasnailart, saya mau tanya estimasi:\n"
    + rincian.map(r => `${r.label}: ${rupiah(r.biaya)}`).join("\n")
    + `\nTotal: ${rupiah(total)}`;
}

document.querySelector(".kalkulator").addEventListener("input", hitung);
$("#kirim-estimasi").addEventListener("click", () => kirimWhatsApp(pesanEstimasi));
hitung();


/* ---------- 5. ULASAN, FAQ, BOOKING ---------- */

// --- Slider ulasan (otomatis ganti tiap 6 detik, berhenti kalau disorot kursor) ---
const kutipan = $("#kutipan");
const titik = $("#titik");
let ulasanKe = 0;
let timerUlasan;

titik.innerHTML = ULASAN.map((_, i) => `<button type="button" aria-label="Ulasan ${i + 1}"></button>`).join("");

function tampilkanUlasan(nomor) {
  ulasanKe = nomor;
  kutipan.style.opacity = 0;                       // pudar dulu, ganti teks, lalu muncul lagi
  setTimeout(() => {
    kutipan.innerHTML = `“${ULASAN[nomor][0]}”<cite>${ULASAN[nomor][1]}</cite>`;
    kutipan.style.opacity = 1;
  }, 250);
  [...titik.children].forEach((t, i) => t.classList.toggle("aktif", i === nomor));
}

function mulaiOtomatis() {
  clearInterval(timerUlasan);
  if (kurangiGerak) return;                        // jangan ganti otomatis kalau pengguna mematikan animasi
  timerUlasan = setInterval(() => tampilkanUlasan((ulasanKe + 1) % ULASAN.length), 6000);
}

titik.addEventListener("click", e => {
  const nomor = [...titik.children].indexOf(e.target);
  if (nomor > -1) { tampilkanUlasan(nomor); mulaiOtomatis(); }
});
$(".testimoni").addEventListener("mouseenter", () => clearInterval(timerUlasan));
$(".testimoni").addEventListener("mouseleave", mulaiOtomatis);

tampilkanUlasan(0);
mulaiOtomatis();

// --- FAQ (memakai tag <details> bawaan HTML, jadi tanpa JS untuk buka/tutup) ---
$("#daftar-faq").innerHTML = FAQ.map(f => `<details><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join("");

// --- Form booking ---
const inputTanggal = $("#tanggal");
const pilihJam = $("#jam");

// Isi pilihan jam. Kalau tanggalnya hari ini, jam yang sudah lewat tidak ditampilkan.
function isiPilihanJam() {
  const hariIni = inputTanggal.value === tanggalHariIni();
  const jamSekarang = new Date().getHours();
  const opsi = [];

  // Slot terakhir = JAM_TUTUP - 1 (tidak masuk akal booking tepat saat tutup)
  for (let jam = JAM_BUKA; jam < JAM_TUTUP; jam++) {
    if (hariIni && jam <= jamSekarang) continue;
    opsi.push(`<option>${String(jam).padStart(2, "0")}.00 WIB</option>`);
  }
  pilihJam.innerHTML = opsi.length ? opsi.join("") : "<option value=''>Hari ini sudah tutup, pilih tanggal lain</option>";
}

inputTanggal.min = tanggalHariIni();
inputTanggal.addEventListener("change", isiPilihanJam);
isiPilihanJam();

// Dipakai event "submit" (bukan "click") supaya tombol Enter di keyboard juga bekerja
// dan validasi bawaan browser (required) ikut jalan.
$("#booking").addEventListener("submit", e => {
  e.preventDefault();

  if (!pilihJam.value) { tampilkanToast("Pilih tanggal dan jam yang masih tersedia ya."); return; }

  // Hobi yang dicentang (bisa lebih dari satu)
  const hobi = [...document.querySelectorAll("input[name='hobi']:checked")].map(c => c.value).join(", ");

  kirimWhatsApp(
    `Halo Hasnailart, saya ${$("#nama").value.trim()} mau booking.\n`
    + `Alamat: ${$("#alamat").value.trim()}, ${$("#kota").value}\n`
    + `Hobi: ${hobi || "-"}\n`
    + `Tanggal: ${formatTanggal(inputTanggal.value)}\n`
    + `Jam: ${pilihJam.value}\n`
    + `Catatan: ${$("#catatan").value.trim() || "-"}`
  );
});

// Peta & tombol Google Maps memakai alamat yang sama (cukup ubah ALAMAT di atas)
$("#link-maps").href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Hasnailart " + ALAMAT);
$("#peta").src = "https://www.google.com/maps?q=" + encodeURIComponent(ALAMAT) + "&output=embed";

$("#tahun").textContent = new Date().getFullYear();


/* ---------- 6. ANIMASI SCROLL ---------- */

// Elemen ber-class "muncul" tampil perlahan saat masuk layar
const pengamatMuncul = new IntersectionObserver(daftar => {
  daftar.forEach(item => {
    if (!item.isIntersecting) return;
    item.target.classList.add("masuk");
    pengamatMuncul.unobserve(item.target);
  });
}, { threshold: .15 });

document.querySelectorAll(".muncul").forEach(el => pengamatMuncul.observe(el));

// Angka statistik berhitung dari 0 saat terlihat
function animasiAngka(el) {
  const target = Number(el.dataset.hitung);
  const tambahPlus = target >= 1000 ? "+" : "";
  const mulai = performance.now();

  function langkah(sekarang) {
    const progres = Math.min((sekarang - mulai) / 1400, 1);
    const halus = 1 - Math.pow(1 - progres, 3);   // gerak melambat di akhir
    el.textContent = Math.round(target * halus).toLocaleString("id-ID") + tambahPlus;
    if (progres < 1) requestAnimationFrame(langkah);
  }
  requestAnimationFrame(langkah);
}

const pengamatAngka = new IntersectionObserver(daftar => {
  daftar.forEach(item => {
    if (!item.isIntersecting) return;
    if (!kurangiGerak) animasiAngka(item.target);   // kalau animasi dimatikan, angka akhir dari HTML dibiarkan
    pengamatAngka.unobserve(item.target);
  });
}, { threshold: .6 });

document.querySelectorAll("[data-hitung]").forEach(el => pengamatAngka.observe(el));

// Sorot menu sesuai bagian yang sedang dilihat + tampilkan tombol "ke atas"
const linkMenu = [...document.querySelectorAll(".menu a")];
const bagian = linkMenu.map(a => document.querySelector(a.hash));
const tombolAtas = $("#tombol-atas");

function saatScroll() {
  tombolAtas.classList.toggle("tampil", scrollY > 600);

  let aktif = -1;
  bagian.forEach((b, i) => { if (b.getBoundingClientRect().top < 160) aktif = i; });
  linkMenu.forEach((a, i) => a.classList.toggle("aktif", i === aktif));
}

addEventListener("scroll", saatScroll, { passive: true });
tombolAtas.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
saatScroll();
