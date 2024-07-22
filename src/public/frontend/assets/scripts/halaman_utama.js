

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const tugasAkhirResponse = await fetch(
      "https://api.digilibs.me//finalprojects/public/"
    );
    if (!tugasAkhirResponse.ok) {
      throw new Error("Failed to fetch Tugas Akhir data.");
    }
    const tugasAkhirData = await tugasAkhirResponse.json();

    const tugasAkhirContainer = document.getElementById("tugasAkhirContainer");
    tugasAkhirData.data.slice(0, 5).forEach((item) => {
      const contentTable = document.createElement("div");
      contentTable.className = "table-content";

      const titleElement = document.createElement("div");
      titleElement.className = "title tugas-akhir-title";
      titleElement.innerHTML = `<h2><a href="/home/detail?id=${item.project_id}">${item.title}</a></h2>`;

      const contentElement = document.createElement("div");
      contentElement.className = "content tugas-akhir-content";
      contentElement.innerHTML = `
        <div><i class="fas fa-calendar-alt"></i> ${
          item.createdAt
            ? new Date(item.createdAt).toLocaleDateString("en-US")
            : "-"
        }</div>
        <div><i class="fas fa-book"></i> ${item.prodi.nama_prodi}</div>
        <div><i class="fas fa-user"></i> ${item.mahasiswa.nama_mahasiswa} (${item.mahasiswa.nim})</div>
        <div><i class="fas fa-eye"></i> ${item.total_views}</div>
      `;
      
      contentTable.appendChild(titleElement);
      contentTable.appendChild(contentElement);
      tugasAkhirContainer.appendChild(contentTable);
    });

    const penelitianResponse = await fetch(
      "https://api.digilibs.me//researchs/public"
    );
    if (!penelitianResponse.ok) {
      throw new Error("Failed to fetch Penelitian data.");
    }
    const penelitianData = await penelitianResponse.json();

    const penelitianContainer = document.getElementById("penelitianContainer");
    penelitianData.data.slice(0, 5).forEach((item) => {
      const contentTable = document.createElement("div");
      contentTable.className = "table-content";

      const titleElement = document.createElement("div");
      titleElement.className = "title penelitian-title";
      titleElement.innerHTML = `<h2><a href="/home/detail?id=${item.research_id}">${item.title}</a></h2>`;

      const contentElement = document.createElement("div");
      contentElement.className = "content penelitian-content";
      contentElement.innerHTML = `
        <div><i class="fas fa-calendar-alt"></i> ${
          item.createdAt
            ? new Date(item.createdAt).toLocaleDateString("en-US")
            : "-"
        }</div>
        <div><i class="fas fa-book"></i> ${item.prodi.nama_prodi}</div>
        <div><i class="fas fa-user"></i> ${item.dosen.nama_dosen} (${item.dosen.nidn})</div>
        <div><i class="fas fa-eye"></i> ${item.total_views}</div>
    `;

      contentTable.appendChild(titleElement);
      contentTable.appendChild(contentElement);
      penelitianContainer.appendChild(contentTable);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Failed to fetch data. Please try again.");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      const searchUrl = `/home/search?q=${encodeURIComponent(
        searchTerm
      )}`;

      window.location.href = searchUrl;
    }
  });
  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); 
      searchForm.dispatchEvent(new Event("submit")); 
    }
  });
});



// var myModal = new bootstrap.Modal(document.getElementById("myModal"));

// document.getElementById("btnOpenModal").addEventListener("click", function () {
//   myModal.show();
// });

// document.addEventListener("DOMContentLoaded", function () {
//   var dropdownMenu = document.getElementById("dropdownMenuButton1");
//   var dropdownItems = document.querySelectorAll(".dropdown-item");

//   dropdownItems.forEach(function (item) {
//     item.addEventListener("click", function () {
//       dropdownMenu.textContent = this.dataset.value;
//     });
//   });
// });
