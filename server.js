const express = require('express');
const app = express();
const PORT = 3000;

// Middleware untuk parsing body berformat JSON
app.use(express.json());

// In-Memory Data Store (Array) dengan beberapa data awal
let biodataList = [
  {
    id: 1,
    nama: "Andi Pratama",
    umur: 21,
    alamat: "Jl. Merdeka No. 10, Jakarta",
    pekerjaan: "Mahasiswa"
  },
  {
    id: 2,
    nama: "Siti Rahma",
    umur: 23,
    alamat: "Jl. Melati No. 5, Bandung",
    pekerjaan: "Software Engineer"
  }
];

// 1. GET /api/biodata - Menampilkan seluruh daftar biodata
app.get('/api/biodata', (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Berhasil menampilkan seluruh data biodata",
    data: biodataList
  });
});

// 2. GET /api/biodata/:id - Menampilkan detail 1 biodata berdasarkan ID
app.get('/api/biodata/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const biodata = biodataList.find(item => item.id === id);

  if (!biodata) {
    return res.status(404).json({
      status: "fail",
      message: `Biodata dengan ID ${id} tidak ditemukan`,
      data: {}
    });
  }

  res.status(200).json({
    status: "success",
    message: `Berhasil menampilkan biodata dengan ID ${id}`,
    data: biodata
  });
});

// 3. POST /api/biodata - Menambahkan biodata baru ke dalam array
app.post('/api/biodata', (req, res) => {
  const { nama, umur, alamat, pekerjaan } = req.body;

  // Validasi: Semua field wajib diisi
  if (!nama || !umur || !alamat || !pekerjaan) {
    return res.status(400).json({
      status: "fail",
      message: "Input tidak lengkap. Field nama, umur, alamat, dan pekerjaan wajib diisi.",
      data: {}
    });
  }

  // Membuat ID unik secara auto-increment
  const newId = biodataList.length > 0 ? biodataList[biodataList.length - 1].id + 1 : 1;

  const newBiodata = {
    id: newId,
    nama,
    umur: Number(umur),
    alamat,
    pekerjaan
  };

  biodataList.push(newBiodata);

  res.status(201).json({
    status: "success",
    message: "Biodata baru berhasil ditambahkan",
    data: newBiodata
  });
});

// 4. PUT /api/biodata/:id - Mengubah/memperbarui data biodata berdasarkan ID
app.put('/api/biodata/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = biodataList.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: "fail",
      message: `Gagal memperbarui. Biodata dengan ID ${id} tidak ditemukan`,
      data: {}
    });
  }

  const { nama, umur, alamat, pekerjaan } = req.body;

  // Validasi sederhana jika ingin memastikan body tidak kosong
  if (!nama && !umur && !alamat && !pekerjaan) {
    return res.status(400).json({
      status: "fail",
      message: "Setidaknya satu field harus diisi untuk pembaruan data",
      data: {}
    });
  }

  // Update data secara parsial atau menyeluruh
  biodataList[index] = {
    id: id,
    nama: nama || biodataList[index].nama,
    umur: umur ? Number(umur) : biodataList[index].umur,
    alamat: alamat || biodataList[index].alamat,
    pekerjaan: pekerjaan || biodataList[index].pekerjaan
  };

  res.status(200).json({
    status: "success",
    message: `Biodata dengan ID ${id} berhasil diperbarui`,
    data: biodataList[index]
  });
});

// 5. DELETE /api/biodata/:id - Menghapus data biodata dari array berdasarkan ID
app.delete('/api/biodata/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = biodataList.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: "fail",
      message: `Gagal menghapus. Biodata dengan ID ${id} tidak ditemukan`,
      data: {}
    });
  }

  const deletedData = biodataList.splice(index, 1)[0];

  res.status(200).json({
    status: "success",
    message: `Biodata dengan ID ${id} berhasil dihapus`,
    data: deletedData
  });
});

// Menjalankan server pada port 3000
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
