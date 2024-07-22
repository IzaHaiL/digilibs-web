const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

// Middleware to serve static files from 'public/frontend'
app.use(express.static(path.join(__dirname, 'src/public/frontend')));

app.get('/', (req, res) => {
    res.redirect('/home');
});
// Route for the home page
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/pages/home/home.html'));
});
app.get('/home/detail', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/pages/home/home_project_detail.html'));
});
app.get('/home/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/pages/home/home_search_list.html'));
});

app.get('/home/abstract', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/pages/home/home_abstract.html'));
});



app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/pages/mahasiswa/dashboard_mahasiswa.html'));
});
app.get('/dashboard/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/pages/mahasiswa/dashboard_mahasiswa_profile.html'));
});
app.get('/dashboard/inputberkas', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/pages/mahasiswa/dashboard_mahasiswa_inputberkas.html'));
});
app.get('/dashboard/detailberkas', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/pages/mahasiswa/dashboard_mahasiswa_detailberkas.html'));
});

app.get('/dashboard/dosen', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/pages/dosen/dashboard_dosen.html'));
});
app.get('/dashboard/dosen/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/pages/dosen/dashboard_dosen_profile.html'));
});
app.get('/dashboard/dosen/inputberkas', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/pages/dosen/dashboard_dosen_inputberkas.html'));
});
app.get('/dashboard/dosen/detailberkas', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/pages/dosen/dashboard_dosen_detailberkas.html'));
});

app.get('/dashboard/lppm', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/pages/lppm/dashboard_lppm.html'));
});
app.get('/dashboard/lppm/daftar/tugasakhir', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/pages/lppm/dashboard_lppm_daftar_tugas_akhir.html'));
});
app.get('/dashboard/lppm/daftar/penelitian', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/pages/lppm/dashboard_lppm_daftar_penelitian.html'));
});
app.get('/dashboard/lppm/detail/tugasakhir', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/pages/lppm/dashboard_lppm_detailberkas_tugas_akhir.html'));
});
app.get('/dashboard/lppm/detail/penelitian', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/pages/lppm/dashboard_lppm_detailberkas_penelitian.html'));
});

app.get('/dashboard/fakultas', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/pages/fakultas/dashboard_fakultas.html'));
});
app.get('/dashboard/fakultas/daftar/penelitian', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/pages/fakultas/dashboard_fakultas_daftar_penelitian.html'));
});
app.get('/dashboard/fakultas/detail/penelitian', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/pages/fakultas/dashboard_fakultas_detailberkas_penelitian.html'));
});

app.get('/dashboard/fakultas/daftar/tugasakhir', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/pages/fakultas/dashboard_fakultas_daftar_tugas_akhir.html'));
});
app.get('/dashboard/fakultas/detail/tugasakhir', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/pages/fakultas/dashboard_fakultas_detailberkas_tugas_akhir.html'));
});
app.get('/dashboard/prodi', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/pages/prodi/dashboard_prodi.html'));
});
app.get('/dashboard/prodi/daftar/tugasakhir', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/pages/prodi/dashboard_prodi_daftar_tugas_akhir.html'));
});
app.get('/dashboard/prodi/detail/tugasakhir', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/pages/prodi/dashboard_prodi_detailberkas_tugas_akhir.html'));
});

app.get('/dashboard/prodi/daftar/penelitian', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/pages/prodi/dashboard_prodi_daftar_penelitian.html'));
});
app.get('/dashboard/prodi/detail/penelitian', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/pages/prodi/dashboard_prodi_detailberkas_penelitian.html'));
});

app.get('/403', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/pages/commons/403.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/login.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public/frontend/login.html'));
});

app.get('/config', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/app/config.js'));
  });

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'src/public/frontend/pages/commons/404.html'));
});




// Start the server
app.listen(port, () => {
});
