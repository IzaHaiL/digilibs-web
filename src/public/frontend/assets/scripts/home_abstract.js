const BASE_URL = 'https://api.digilibs.me'; // Change this as needed for different environments

document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("searchButton");
  const searchInput = document.getElementById("searchInput");
  const projectContainer = document.getElementById("projectContainer");
  const mainContentTitle = document.getElementById("mainContentTitle");

  async function fetchData(query) {
    try {
      const response = await fetch(`${BASE_URL}/consine/similarity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputText: query }), // Updated to match the required format
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data.");
      }

      const data = await response.json();

      // Update main content title with keyword from the API response
      mainContentTitle.textContent = `Keyword: ${data.keywords}`;

      function updateTable(data) {
        projectContainer.innerHTML = ""; // Clear previous content

        if (data.projectSimilarities.length === 0) {
          // No results found message
          const noResultsMessage = document.createElement("div");
          noResultsMessage.textContent = "No results found.";
          projectContainer.appendChild(noResultsMessage);
        } else {
          data.projectSimilarities.forEach((item, index) => {
            const contentTable = document.createElement("div");
            contentTable.className = "table-content";

            const titleElement = document.createElement("div");
            titleElement.className = "title project-title";
            titleElement.style.display = "flex";
            titleElement.style.flexDirection = "column-reverse";
            const titleLink = document.createElement("a");
            titleLink.href = `/home/detail?id=${item.id}`;
            titleLink.innerHTML = `<h2>${index + 1}. ${
              item.title.split("\n")[0]
            }</h2>`;
            titleElement.appendChild(titleLink);

            const abstractElement = document.createElement("div");
            abstractElement.className = "abstract project-abstract";
            abstractElement.innerHTML = `<p style="font-size: small; color: black; text-align: justify;">${item.abstract || '-'}</p>`;
            titleElement.appendChild(abstractElement);

            // Append anchor to title element
            titleElement.appendChild(titleLink);

            const contentElement = document.createElement("div");
            contentElement.className = "content project-content";
            contentElement.innerHTML = `
              <div><i class="fas fa-calendar-alt"></i> ${
                item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("en-US")
                  : "-"
              }</div>
              <div><i class="fas fa-book"></i> ${
                item.prodi ? item.prodi.nama_prodi : "-"
              }</div>
              <div><i class="fas fa-user"></i> ${
                item.dosen
                  ? `(${item.dosen.nama_dosen} - ${item.dosen.nidn})`
                  : "-"
              }</div>
              <div><i class="fas fa-eye"></i> ${item.total_views || "-"}</div>
              <div><i class="fas fa-signal"></i> Similarity: ${
                item.similarity || "-"
              }</div>
            `;

            contentTable.appendChild(titleElement);
            contentTable.appendChild(contentElement);

            // Append contentTable to projectContainer
            projectContainer.appendChild(contentTable);
          });
        }
      }

      // Update table with data
      updateTable(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data. Please try again.");
    }
  }

  searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
      fetchData(query);
    }
  });

  // Ensure the search input is focused when the page loads
  searchInput.focus();
});
