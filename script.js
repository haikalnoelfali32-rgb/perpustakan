// Ganti antara tampilan: landing (publik), login, user, admin
function switchTo(viewName) {
  document.querySelectorAll('.view').forEach(function (v) { v.classList.remove('active'); });
  document.getElementById('view-' + viewName).classList.add('active');
}

// Navigasi sidebar di dalam tampilan User & Admin
document.querySelectorAll('.nav-item').forEach(function (item) {
  item.addEventListener('click', function () {
    var sidebar = item.closest('.app');
    var targetId = 'page-' + item.getAttribute('data-page');

    sidebar.querySelectorAll('.nav-item').forEach(function (el) { el.classList.remove('active'); });
    sidebar.querySelectorAll('.page').forEach(function (el) { el.classList.remove('active'); });

    item.classList.add('active');
    var target = document.getElementById(targetId);
    if (target) target.classList.add('active');
  });
});

// ===== LOGIN: menghubungkan halaman User dan Admin lewat satu form =====
var selectedRole = 'anggota';

var demoUsers = {
  haikal: {
    name: 'Haikal Ramadhan',
    id: 'PST-0231',
    initial: 'H',
    pengajuan: '<tr><td>Filosofi Teras</td><td>12 Jul 2026</td><td><span class="badge pending">Menunggu Verifikasi</span></td></tr>',
    pengajuanNote: { type: 'ok', text: 'Riwayat Anda bersih — pengajuan biasanya disetujui saat Anda datang ke perpustakaan.' },
    totalDenda: 0,
    riwayat: '' +
      '<tr><td>Laut Bercerita</td><td>02 Mei 2026</td><td>14 Mei 2026</td><td><span class="badge ok">Tepat Waktu</span></td><td>—</td></tr>' +
      '<tr><td>Atomic Habits</td><td>20 Mar 2026</td><td>02 Apr 2026</td><td><span class="badge ok">Tepat Waktu</span></td><td>—</td></tr>' +
      '<tr><td>Negeri 5 Menara</td><td>05 Jan 2026</td><td>18 Jan 2026</td><td><span class="badge ok">Tepat Waktu</span></td><td>—</td></tr>'
  },
  dedi: {
    name: 'Dedi Kurniawan',
    id: 'PST-0142',
    initial: 'D',
    pengajuan: '<tr><td>Sapiens</td><td>12 Jul 2026</td><td><span class="badge danger">Ditolak</span></td></tr>',
    pengajuanNote: { type: 'danger', text: 'Ditolak: buku "Homo Deus" tanggal 10 Apr 2026 belum dikembalikan. Selesaikan dulu peminjaman sebelumnya.' },
    totalDenda: 16000,
    riwayat: '' +
      '<tr><td>Cosmos</td><td>03 Jun 2026</td><td>25 Jun 2026</td><td><span class="badge danger">Terlambat 8 Hari</span></td><td class="mono-fine">Rp16.000</td></tr>' +
      '<tr><td>Homo Deus</td><td>10 Apr 2026</td><td>—</td><td><span class="badge danger">Belum Dikembalikan</span></td><td class="mono-fine">Rp2.000/hari (berjalan)</td></tr>' +
      '<tr><td>Rich Dad Poor Dad</td><td>02 Feb 2026</td><td>16 Feb 2026</td><td><span class="badge ok">Tepat Waktu</span></td><td>—</td></tr>'
  },
  maya: {
    name: 'Maya Andini',
    id: 'PST-0189',
    initial: 'M',
    pengajuan: '<tr><td>Cosmos</td><td>12 Jul 2026</td><td><span class="badge danger">Ditolak</span></td></tr>',
    pengajuanNote: { type: 'danger', text: 'Ditolak: denda keterlambatan Rp24.000 belum dibayar. Lunasi denda di perpustakaan untuk mengajukan pinjaman lagi.' },
    totalDenda: 24000,
    riwayat: '' +
      '<tr><td>Ayat-Ayat Cinta</td><td>12 Mei 2026</td><td>30 Mei 2026</td><td><span class="badge danger">Denda Rp24.000</span></td><td class="mono-fine">Rp24.000</td></tr>' +
      '<tr><td>Think and Grow Rich</td><td>01 Mar 2026</td><td>15 Mar 2026</td><td><span class="badge ok">Tepat Waktu</span></td><td>—</td></tr>'
  }
};

function setLoginRole(role) {
  selectedRole = role;

  document.getElementById('tab-anggota').classList.toggle('active', role === 'anggota');
  document.getElementById('tab-admin').classList.toggle('active', role === 'admin');

  var usernameField = document.getElementById('login-username');
  var roleLabel = document.getElementById('login-role-label');

  if (role === 'admin') {
    usernameField.placeholder = 'Username Admin';
    usernameField.value = 'admin';
    roleLabel.textContent = 'Admin';
  } else {
    usernameField.placeholder = 'Username atau ID Anggota (contoh: haikal, dedi, maya)';
    usernameField.value = 'haikal';
    roleLabel.textContent = 'Anggota';
  }
}

function renderUserProfile(userKey) {
  var u = demoUsers[userKey];
  if (!u) return;

  document.getElementById('user-avatar').textContent = u.initial;
  document.getElementById('user-name').textContent = u.name;
  document.getElementById('user-id').textContent = u.id;

  document.getElementById('pengajuan-body').innerHTML = u.pengajuan;
  var note = document.getElementById('pengajuan-note');
  note.textContent = u.pengajuanNote.text;
  note.className = 'verify-note ' + u.pengajuanNote.type;

  document.getElementById('riwayat-body').innerHTML = u.riwayat;

  var dendaBox = document.getElementById('riwayat-denda-summary');
  if (u.totalDenda > 0) {
    var formatted = 'Rp' + u.totalDenda.toLocaleString('id-ID');
    dendaBox.innerHTML = 'Total Denda yang Harus Dibayar: <b>' + formatted + '</b> — silakan lunasi di perpustakaan.';
    dendaBox.style.display = 'block';
  } else {
    dendaBox.style.display = 'none';
  }
}

function doLogin(event) {
  event.preventDefault();
  // Demo: tidak ada pengecekan password sungguhan, kata sandi sama untuk semua akun
  if (selectedRole === 'admin') {
    switchTo('admin');
  } else {
    var typedUsername = document.getElementById('login-username').value.trim().toLowerCase();
    var userKey = demoUsers[typedUsername] ? typedUsername : 'haikal';
    renderUserProfile(userKey);
    switchTo('user');
  }
  return false;
}

// ===== TOAST NOTIFIKASI =====
var toastTimer = null;
function showToast(message, type) {
  var toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast show ' + (type || 'ok');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove('show');
  }, 3200);
}

// ===== USER: klik "Ajukan Pinjam" pada buku =====
document.addEventListener('click', function (e) {
  var btn = e.target.closest('.book-card .btn.primary');
  if (!btn || btn.disabled) return;

  var card = btn.closest('.book-card');
  var title = card.querySelector('.title').textContent;

  btn.textContent = 'Diajukan ✓';
  btn.disabled = true;
  btn.classList.remove('primary');
  btn.classList.add('ghost');

  showToast('Pengajuan "' + title + '" berhasil dikirim. Datang ke perpustakaan untuk verifikasi admin.', 'ok');
});

// ===== ADMIN: klik "Approve — Serahkan Buku" =====
document.addEventListener('click', function (e) {
  var btn = e.target.closest('.verify-actions .btn.approve');
  if (!btn || btn.disabled) return;

  var box = btn.closest('.verify-box');
  var name = box.querySelector('.verify-head .name').textContent;

  btn.textContent = 'Disetujui ✓';
  btn.disabled = true;

  showToast('Peminjaman untuk ' + name + ' disetujui. Buku dapat diserahkan.', 'ok');
});

// ===== SEARCH & FILTER KATALOG BUKU =====
var activeCategory = 'semua';

function applyBookFilter() {
  var keyword = document.getElementById('book-search').value.trim().toLowerCase();
  var cards = document.querySelectorAll('#book-grid .book-card');
  var visibleCount = 0;

  cards.forEach(function (card) {
    var matchCategory = (activeCategory === 'semua') || (card.getAttribute('data-cat') === activeCategory);
    var matchKeyword = card.getAttribute('data-title').indexOf(keyword) !== -1;

    if (matchCategory && matchKeyword) {
      card.style.display = '';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  document.getElementById('book-no-result').style.display = visibleCount === 0 ? 'block' : 'none';
}

var searchInput = document.getElementById('book-search');
if (searchInput) {
  searchInput.addEventListener('input', applyBookFilter);
}

var filterButtons = document.querySelectorAll('#book-filter button');
filterButtons.forEach(function (btn) {
  btn.addEventListener('click', function () {
    filterButtons.forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    activeCategory = btn.getAttribute('data-cat');
    applyBookFilter();
  });
});

// ===== ADMIN: data detail riwayat per anggota (termasuk denda) =====
var memberHistory = {
  haikal: {
    name: 'Haikal Ramadhan', id: 'PST-0231', initial: 'H', totalDenda: 0,
    rows: '' +
      '<tr><td>Laut Bercerita</td><td>02 Mei 2026</td><td>14 Mei 2026</td><td><span class="badge ok">Tepat Waktu</span></td><td>—</td></tr>' +
      '<tr><td>Atomic Habits</td><td>20 Mar 2026</td><td>02 Apr 2026</td><td><span class="badge ok">Tepat Waktu</span></td><td>—</td></tr>' +
      '<tr><td>Negeri 5 Menara</td><td>05 Jan 2026</td><td>18 Jan 2026</td><td><span class="badge ok">Tepat Waktu</span></td><td>—</td></tr>'
  },
  rendi: {
    name: 'Rendi Saputra', id: 'PST-0104', initial: 'R', totalDenda: 0,
    rows: '' +
      '<tr><td>Sang Pemimpi</td><td>01 Jun 2026</td><td>—</td><td><span class="badge danger">Belum Dikembalikan</span></td><td class="mono-fine">Rp2.000/hari (berjalan)</td></tr>' +
      '<tr><td>Cantik Itu Luka</td><td>14 Feb 2026</td><td>28 Feb 2026</td><td><span class="badge ok">Tepat Waktu</span></td><td>—</td></tr>'
  },
  sinta: {
    name: 'Sinta Wulandari', id: 'PST-0076', initial: 'S', totalDenda: 15000,
    rows: '<tr><td>Perahu Kertas</td><td>05 Mei 2026</td><td>25 Mei 2026</td><td><span class="badge danger">Denda Rp15.000</span></td><td class="mono-fine">Rp15.000</td></tr>'
  },
  dedi: {
    name: 'Dedi Kurniawan', id: 'PST-0142', initial: 'D', totalDenda: 16000,
    rows: '' +
      '<tr><td>Cosmos</td><td>03 Jun 2026</td><td>25 Jun 2026</td><td><span class="badge danger">Terlambat 8 Hari</span></td><td class="mono-fine">Rp16.000</td></tr>' +
      '<tr><td>Homo Deus</td><td>10 Apr 2026</td><td>—</td><td><span class="badge danger">Belum Dikembalikan</span></td><td class="mono-fine">Rp2.000/hari (berjalan)</td></tr>' +
      '<tr><td>Rich Dad Poor Dad</td><td>02 Feb 2026</td><td>16 Feb 2026</td><td><span class="badge ok">Tepat Waktu</span></td><td>—</td></tr>'
  },
  maya: {
    name: 'Maya Andini', id: 'PST-0189', initial: 'M', totalDenda: 24000,
    rows: '' +
      '<tr><td>Ayat-Ayat Cinta</td><td>12 Mei 2026</td><td>30 Mei 2026</td><td><span class="badge danger">Denda Rp24.000</span></td><td class="mono-fine">Rp24.000</td></tr>' +
      '<tr><td>Think and Grow Rich</td><td>01 Mar 2026</td><td>15 Mar 2026</td><td><span class="badge ok">Tepat Waktu</span></td><td>—</td></tr>'
  }
};

function showMemberDetail(memberKey) {
  var m = memberHistory[memberKey];
  if (!m) return;

  document.getElementById('member-detail-avatar').textContent = m.initial;
  document.getElementById('member-detail-name').textContent = m.name;
  document.getElementById('member-detail-id').textContent = 'ID Anggota: ' + m.id;
  document.getElementById('member-detail-body').innerHTML = m.rows;

  var dendaBox = document.getElementById('member-detail-denda');
  if (m.totalDenda > 0) {
    dendaBox.innerHTML = 'Total Denda yang Harus Dibayar: <b>Rp' + m.totalDenda.toLocaleString('id-ID') + '</b>';
    dendaBox.style.display = 'block';
  } else {
    dendaBox.style.display = 'none';
  }

  document.getElementById('member-detail-overlay').classList.add('show');
}

function closeMemberDetail(event) {
  // Jika klik berasal dari dalam kotak modal (bukan overlay gelapnya), jangan tutup
  if (event && event.target.closest('.modal-box')) return;
  document.getElementById('member-detail-overlay').classList.remove('show');
}

// Dipanggil dari tombol "Lihat Riwayat" di halaman Anggota — lompat ke halaman
// Riwayat Peminjaman dan langsung tampilkan modal detail anggota yang dipilih
function viewMemberHistory(memberKey) {
  var targetNav = document.querySelector('.nav-item[data-page="a-riwayat"]');
  if (targetNav) targetNav.click();
  showMemberDetail(memberKey);
}

// ===== ADMIN: cari anggota / buku di tabel riwayat =====
var adminRiwayatSearch = document.getElementById('admin-riwayat-search');
if (adminRiwayatSearch) {
  adminRiwayatSearch.addEventListener('input', function () {
    var keyword = adminRiwayatSearch.value.trim().toLowerCase();
    var rows = document.querySelectorAll('#admin-riwayat-body tr');
    rows.forEach(function (row) {
      var match = row.getAttribute('data-title').indexOf(keyword) !== -1;
      row.style.display = match ? '' : 'none';
    });
  });
}
