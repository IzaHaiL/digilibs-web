const BASE_URL = 'http://127.0.0.1:8000'; 

$(document).ready(function() {
  const $searchButton = $("#searchButton");
  const $searchInput = $("#searchInput");
  const $projectContainer = $("#projectContainer");
  const $mainContentTitle = $("#mainContentTitle");

  async function fetchData(query) {
    try {
      const requestData = { input_text: query }; // Mengubah inputText menjadi input_text
      console.log("Data yang dikirim:", requestData);

      const response = await fetch(`${BASE_URL}/check_similarity/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData), 
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response data:", errorData);
        throw new Error("Failed to fetch data.");
      }

      const data = await response.json();
      // Log data yang diterima
      console.log("Data diterima:", data);

      $mainContentTitle.text(`Keyword: ${data.keywords}`);

      function updateTable(data) {
        $projectContainer.empty(); 

        if (!data.similarities || data.similarities.length === 0) {
          const noResultsMessage = $("<div>").text("Tidak ada kesamaan.");
          $projectContainer.append(noResultsMessage);
        } else {
          data.similarities.forEach((item, index) => {
            const $contentTable = $("<div>").addClass("table-content");

            const $titleElement = $("<div>").addClass("title project-title").css({
              display: "flex",
              flexDirection: "column-reverse"
            });
            const $titleLink = $("<a>").attr("href", `/home/detail?id=${item.dokumen.id}`).html(`<h2>${index + 1}. ${item.dokumen.judul}</h2>`);
            $titleElement.append($titleLink);

            const $abstractElement = $("<div>").addClass("abstract project-abstract").html(`<p style="font-size: small; color: black; text-align: justify;">${item.text || '-'}</p>`);
            $titleElement.append($abstractElement);
            $titleElement.append($titleLink);
            const $contentElement = $("<div>").addClass("content project-content").html(`
              <div><i class="fas fa-calendar-alt"></i> ${item.dokumen.tanggal_upload ? new Date(item.dokumen.tanggal_upload).toLocaleDateString("en-US") : "-"}</div>
              <div><i class="fas fa-signal"></i> Similarity: ${item.similarity || "-"}</div>
            `);

            $contentTable.append($titleElement);
            $contentTable.append($contentElement);

            // Append contentTable to projectContainer
            $projectContainer.append($contentTable);
          });
        }
      }

      // Update table with data
      updateTable(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // alert("Failed to fetch data. Please try again.");
    }
  }

  $searchButton.on("click", function() {
    const query = $searchInput.val().trim();
    if (query) {
      fetchData(query);
    }
  });

  // Ensure the search input is focused when the page loads
  $searchInput.focus();
});