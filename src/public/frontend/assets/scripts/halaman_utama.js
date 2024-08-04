// Define your base URL
const BASE_URL = 'https://digilibs-api-pzhmw.ondigitalocean.app'; // Change this as needed for different environments

$(document).ready(async function () {
  try {
    const tugasAkhirResponse = await fetch(`${BASE_URL}/document/tugas-akhir/public`);
    if (!tugasAkhirResponse.ok) {
      throw new Error("Failed to fetch Tugas Akhir data.");
    }
    const tugasAkhirData = await tugasAkhirResponse.json();
    console.log(tugasAkhirData);

    const tugasAkhirContainer = $("#tugasAkhirContainer");
    tugasAkhirData.data.slice(0, 5).forEach((item) => {
      const contentTable = $("<div>").addClass("table-content");

      const titleElement = $("<div>").addClass("title tugas-akhir-title");
      titleElement.html(`<h2><a href="/home/detail?id=${item.id}">${item.judul}</a></h2>`);

      const contentElement = $("<div>").addClass("content tugas-akhir-content");
      contentElement.html(`
        <div><i class="fas fa-calendar-alt"></i> ${item.tanggal_upload ? new Date(item.tanggal_upload).toLocaleDateString("en-US") : "-"}</div>
        <div><i class="fas fa-book"></i> ${item.DokumenMahasiswa.DokumenMahasiswaMahasiswa.MahasiswaProdi.nama}</div>
        <div><i class="fas fa-user"></i> ${item.DokumenMahasiswa.DokumenMahasiswaMahasiswa.MahasiswaUsers.UsersDetails.fullName} (${item.DokumenMahasiswa.DokumenMahasiswaMahasiswa.nim})</div>
        <div><i class="fas fa-eye"></i> ${item.total_views || 0}</div>
      `);

      contentTable.append(titleElement);
      contentTable.append(contentElement);
      tugasAkhirContainer.append(contentTable);
    });
  } catch (error) {
    console.error("Error fetching Tugas Akhir data:", error);
    // alert("Failed to fetch data. Please try again.");
  }
});

$(document).ready(async function () {
  try {
    const penelitianResponse = await fetch(`${BASE_URL}/document/penelitian/public`);
    if (!penelitianResponse.ok) {
      throw new Error("Failed to fetch Penelitian data.");
    }
    const penelitianData = await penelitianResponse.json();
    console.log(penelitianData);

    const penelitianContainer = $("#penelitianContainer");
    penelitianData.data.slice(0, 5).forEach((item) => {
      const contentTable = $("<div>").addClass("table-content");

      const titleElement = $("<div>").addClass("title penelitian-title");
      titleElement.html(`<h2><a href="/home/detail?id=${item.id}">${item.judul}</a></h2>`);

      const contentElement = $("<div>").addClass("content penelitian-content");
      contentElement.html(`
        <div><i class="fas fa-calendar-alt"></i> ${item.tanggal_upload ? new Date(item.tanggal_upload).toLocaleDateString("en-US") : "-"}</div>
        <div><i class="fas fa-book"></i> ${item.DokumenDosen.DokumenDosenDosen.DosenProdi.nama}</div>
        <div><i class="fas fa-user"></i> ${item.DokumenDosen.DokumenDosenDosen.DosenUsers.UsersDetails.fullName} (${item.DokumenDosen.DokumenDosenDosen.nip})</div>
        <div><i class="fas fa-eye"></i> ${item.total_views || 0}</div>
      `);

      contentTable.append(titleElement);
      contentTable.append(contentElement);
      penelitianContainer.append(contentTable);
    });
  } catch (error) {
    console.error("Error fetching Penelitian data:", error);
    // alert("Failed to fetch data. Please try again.");
  }
});

$(document).ready(function () {
  const searchForm = $("#searchForm");
  const searchInput = $("#searchInput");
  const searchButton = $("#searchButton");

  searchForm.on("submit", function (event) {
    event.preventDefault();

    const searchTerm = searchInput.val().trim();
    if (searchTerm) {
      const searchUrl = `/home/search?q=${encodeURIComponent(searchTerm)}`;

      window.location.href = searchUrl;
    }
  });

  searchInput.on("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      searchForm.trigger("submit");
    }
  });

  searchButton.on("click", function () {
    searchForm.trigger("submit");
  });
});


