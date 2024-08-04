const BASE_URL = 'http://localhost:3000'; 


document.addEventListener('DOMContentLoaded', async () => {
  const currentProjectTitleElement = document.getElementById('judul');
  if (!currentProjectTitleElement) {
    console.error('Element with id "judul" not found');
    return;
  }

  const currentProjectTitle = currentProjectTitleElement.textContent.trim();

  try {
    if (!currentProjectTitle) {
      throw new Error('Query parameter is required');
    }
    const param = encodeURIComponent(currentProjectTitle);
    const response = await fetch(`${BASE_URL}/document/search?query=${param}&page=1&pageSize=2`);
    if (!response.ok) {
      throw new Error('Failed to fetch projects with similar titles.');
    }

    const result = await response.json();
    let projects = result.data.slice(0, 7); 
    console.log('Projects with similar titles:', projects);

    projects = shuffleArray(projects);

    const projectListElement = document.getElementById('projectlist');
    projectListElement.innerHTML = ''; 

    projects.forEach(project => {
      const linkItem = document.createElement('a');
      linkItem.href = `/home/detail?id=${project.research_id || project.project_id}`;
      linkItem.textContent = project.title;

      const listItem = document.createElement('li');
      listItem.appendChild(linkItem);
      projectListElement.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    // alert('Failed to fetch projects. Please try again.');
  }
});

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

$(document).ready(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const apiUrl = `${BASE_URL}/document/tugas-akhir/public/${id}`;

  $.getJSON(apiUrl, function(data) {
    console.log(data);
    $('#judul').text(data.judul);
    $('#penulis').text(data.DokumenMahasiswa?.DokumenMahasiswaMahasiswa?.MahasiswaUsers?.UsersDetails?.fullName || '');
    $('#table-info').append(`<tr><th>Pembimbing 1</th><td>${data.DokumenKontributor[0]?.DokumenKontributorDosen?.DosenUsers?.UsersDetails?.fullName || ''}</td></tr>`);
    $('#table-info').append(`<tr><th>Pembimbing 2</th><td>${data.DokumenKontributor[1]?.DokumenKontributorDosen?.DosenUsers?.UsersDetails?.fullName || ''}</td></tr>`);
    $('#table-info').append(`<tr><th>Jenis Berkas</th><td>${data.DokumenJenisDokumen?.nama_jenis || ''}</td></tr>`);
    $('#table-info').append(`<tr><th>Kategori</th><td>${data.BelongsToManyDokumenKategori[0]?.nama_kategori || ''}</td></tr>`);
    $('#table-info').append(`<tr><th>Fakultas</th><td>${data.DokumenMahasiswa?.DokumenMahasiswaMahasiswa?.MahasiswaProdi?.ProdiFakultas?.nama || ''}</td></tr>`);
    $('#table-info').append(`<tr><th>Program Studi</th><td>${data.DokumenMahasiswa?.DokumenMahasiswaMahasiswa?.MahasiswaProdi?.nama || ''}</td></tr>`);
    $('#table-info').append(`<tr><th>Tanggal Deposit</th><td>${data.tanggal_upload ? new Date(data.tanggal_upload).toLocaleDateString() : ''}</td></tr>`);
    $('#table-info').append(`<tr><th>Link Jurnal</th><td> <a href="${data.url || '#'}" target="_blank">${data.url || ''}</a></td></tr>`);
    $('#abstrak').text(data.DokumenAbstrak?.konten || '');
  }).fail(function() {
    console.error('Error fetching data from API');
  });
});

$(document).ready(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const apiUrl = `${BASE_URL}/document/penelitian/public/${id}`;

  $.getJSON(apiUrl, function(data) {
    console.log(data);
    $('#judul').text(data.judul);
    $('#penulis').text(`${data.DokumenDosen?.DokumenDosenDosen?.DosenUsers?.UsersDetails?.fullName || ''}`);
    $('#table-info').append(`<tr><th>Kontributor</th><td>${data.DokumenKontributor[0]?.DokumenKontributorDosen?.DosenUsers?.UsersDetails?.fullName || ''}</td></tr>`);
    $('#table-info').append(`<tr><th>Jenis Berkas</th><td>${data.DokumenJenisDokumen?.nama_jenis || ''}</td></tr>`);
    $('#table-info').append(`<tr><th>Kategori</th><td>${data.BelongsToManyDokumenKategori[0]?.nama_kategori || ''}</td></tr>`);
    $('#table-info').append(`<tr><th>Fakultas</th><td>${data.DokumenDosen?.DokumenDosenDosen?.DosenProdi?.ProdiFakultas?.nama || ''}</td></tr>`);
    $('#table-info').append(`<tr><th>Program Studi</th><td>${data.DokumenDosen?.DokumenDosenDosen?.DosenProdi?.nama || ''}</td></tr>`);
    $('#table-info').append(`<tr><th>Tanggal Deposit</th><td>${data.tanggal_upload ? new Date(data.tanggal_upload).toLocaleDateString() : ''}</td></tr>`);
    $('#table-info').append(`<tr><th>Link Jurnal</th><td><a href="${data.url || '#'}" target="_blank">${data.url || ''}</a></td></tr>`);
    $('#table-info').append(`<tr><th>Penerbit</th><td>${data.BelongsToManyDokumenPenerbit[0]?.nama_penerbit || ''}</td></tr>`);
    $('#table-info').append(`<tr><th>Indeks</th><td>${data.BelongsToManyDokumenIndeks[0]?.nama_indeks || ''}</td></tr>`);
    $('#abstrak').text(data.DokumenAbstrak?.konten || '');

  }).fail(function() {
    console.error('Error fetching data from API');
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const searchContainer = document.querySelector('.side-search-container');
  const searchInput = searchContainer.querySelector('input[type="text"]');
  const searchButton = searchContainer.querySelector('button[type="submit"]');

  searchButton.addEventListener('click', function (event) {
    event.preventDefault();

    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      const searchUrl = `/home/search?q=${encodeURIComponent(searchTerm)}`;

      window.location.href = searchUrl;
    }
  });

  searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault(); 
    }
  });
});



