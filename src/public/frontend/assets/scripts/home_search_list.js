// Define your base URL
const BASE_URL = 'https://digilibs-api-pzhmw.ondigitalocean.app'; // Change this as needed for different environments

// document.addEventListener('DOMContentLoaded', async () => {
//   const currentUrl = window.location.href;
//   const urlParams = new URLSearchParams(currentUrl.split('?')[1]);
//   const searchQuery = urlParams.get('q');

//   try {
//     // Fetch data for Final Projects and Research
//     const response = await fetch(`${BASE_URL}/document/search?query=${searchQuery}&page=1&pageSize=10`);
//     if (!response.ok) {
//       throw new Error('Failed to fetch data.');
//     }
//     const data = await response.json();

//     const total_pages = data.totalPages; // Total pages from API response
//     let current_page = data.currentPage; // Current page from API response

//     // Update main content title with search query
//     const mainContentTitle = document.getElementById('mainContentTitle');
//     mainContentTitle.textContent = `Results: ${searchQuery}`;

//     // Update main content results with total count
//     const mainContentTitleResults = document.getElementById('mainContentTitleResults');
//     mainContentTitleResults.textContent = `Results: ${data.totalItems}`;

//     function updateTable(data) {
//       const projectContainer = document.getElementById('projectContainer');
//       projectContainer.innerHTML = ''; // Clear previous content

//       if (data.totalItems === 0) {
//         // No results found message
//         const noResultsMessage = document.createElement('div');
//         noResultsMessage.textContent = 'No results found.';
//         projectContainer.appendChild(noResultsMessage);
//       } else {
//         const itemsPerPage = 10; // Default to 10 items per page
//         const currentPage = data.currentPage || 1;
//         let startNumber = (currentPage - 1) * itemsPerPage + 1;

//         data.data.forEach((item, index) => {
//           const contentTable = document.createElement('div');
//           contentTable.className = 'table-content';

//           const titleElement = document.createElement('div');
//           titleElement.className = 'title project-title';
//           const titleLink = document.createElement('a');
//           titleLink.href = `/home/detail?id=${item.id}`;
//           titleLink.innerHTML = `<h2>${startNumber}. ${item.judul}</h2>`;

//           // Append anchor to title element
//           titleElement.appendChild(titleLink);

//           const contentElement = document.createElement('div');
//           contentElement.className = 'content project-content';
//           contentElement.innerHTML = `
//                 <div><i class="fas fa-calendar-alt"></i> ${
//                   item.tanggal_upload
//                     ? new Date(item.tanggal_upload).toLocaleDateString('en-US')
//                     : '-'
//                 }</div>
//                 <div><i class="fas fa-book"></i> ${
//                   item.DokumenDosen.Dosen.Prodi.nama
//                 }</div>
//                 <div><i class="fas fa-user"></i> ${
//                   item.DokumenDosen.Dosen.User.UserDetail.firstName
//                 } ${
//                   item.DokumenDosen.Dosen.User.UserDetail.lastName
//                 } (${item.DokumenDosen.Dosen.nip})</div>
//                 <div><i class="fas fa-eye"></i> ${item.total_views || '-'}</div>
//                 `;

//           contentTable.appendChild(titleElement);
//           contentTable.appendChild(contentElement);

//           // Append contentTable to projectContainer
//           projectContainer.appendChild(contentTable);
//           startNumber++; // Increment startNumber for the next item
//         });
//       }
//     }

//     // Initial data load
//     updateTable(data);

//     // Pagination controls
//     const prevBtn = document.getElementById('prevBtn');
//     const nextBtn = document.getElementById('nextBtn');
//     const pageInput = document.getElementById('pageInput');

//     // Function to fetch data based on page number
//     async function fetchPage(page) {
//       try {
//         const response = await fetch(`${BASE_URL}/document/search?query=${searchQuery}&page=${page}&pageSize=10`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch data.');
//         }
//         const newData = await response.json();
//         updateTable(newData);
//         current_page = newData.currentPage;
//         pageInput.value = current_page; // Update pageInput value

//         // Update button states
//         prevBtn.disabled = current_page === 1;
//         nextBtn.disabled = current_page === total_pages;
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         // alert('Failed to fetch data. Please try again.');
//       }
//     }

//     // Previous page button click handler
//     prevBtn.addEventListener('click', () => {
//       if (current_page > 1) {
//         current_page--;
//         pageInput.value = current_page; // Update pageInput value
//         fetchPage(current_page);
//       }
//     });

//     // Next page button click handler
//     nextBtn.addEventListener('click', () => {
//       if (current_page < total_pages) {
//         current_page++;
//         pageInput.value = current_page; // Update pageInput value
//         fetchPage(current_page);
//       }
//     });

//     // Page input change handler
//     pageInput.addEventListener('change', () => {
//       let inputPage = parseInt(pageInput.value);
//       if (inputPage >= 1 && inputPage <= total_pages) {
//         current_page = inputPage; // Update current_page
//         fetchPage(current_page);
//       } else {
//         pageInput.value = current_page;
//       }
//     });

//     // Initial button state
//     prevBtn.disabled = current_page === 1;
//     nextBtn.disabled = current_page === total_pages;
//     pageInput.value = current_page;
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     // alert('Failed to fetch data. Please try again.');
//   }
// });

$(document).ready(function () {
  const currentUrl = window.location.href;
  const urlParams = new URLSearchParams(currentUrl.split('?')[1]);
  const searchQuery = urlParams.get('q');

  $.ajax({
    url: `${BASE_URL}/document/search?query=${searchQuery}&page=1&pageSize=2`,
    method: 'GET',
    success: function (data) {
      console.log(data);
      const total_pages = data.totalPages;
      let current_page = data.currentPage;
      const highlightedQuery = `<span style=" inline-block;">${searchQuery}</span>`;
      $('#mainContentTitle').html(`Hasil: ${highlightedQuery}`);
      $('#mainContentTitleResults').text(`Jumlah Hasil: ${data.totalItems}`);

      function updateTable(data) {
        const projectContainer = $('#projectContainer');
        projectContainer.empty();
        if (data.totalItems === 0) {
          const noResultsMessage = $('<div>').text('No results found.');
          projectContainer.append(noResultsMessage);
        } else {
          const itemsPerPage = 10;
          const currentPage = data.currentPage || 1;
          let startNumber = (currentPage - 1) * itemsPerPage + 1;

          data.data.forEach((item, index) => {
            const contentWrapper = $('<div>').addClass('content-wrapper').css({ display: 'flex', alignItems: 'baseline', gap: '20px' });
            const contentTable = $('<div>').addClass('table-content');
            const contentTable2 = $('<div>').addClass('table-content2').html(`<h2>${startNumber}</h2>`).css({
        
            });
            contentWrapper.append(contentTable2, contentTable);

            const titleElement = $('<div>').addClass('title project-title');
            const titleLink = $('<a>').attr('href', `/home/detail?id=${item.id}`).css('text-decoration', 'none');
            
            // Highlight the search query in the title
            const titleText = item.judul.replace(new RegExp(searchQuery, 'gi'), (match) => `<span style="background-color: yellow;">${match}</span>`);
            titleLink.html(`<h2>${titleText}</h2>`);
            
            titleElement.append(titleLink);

            const contentElement = $('<div>').addClass('content project-content');
            
            contentElement.append(`
              <div><i class="fas fa-calendar-alt"></i> ${item.tanggal_upload ? new Date(item.tanggal_upload).toLocaleDateString('en-US') : '-'}</div>
            `);

            if (item.DokumenDosen && item.DokumenDosen.DokumenDosenDosen && item.DokumenDosen.DokumenDosenDosen.DosenProdi) {
              contentElement.append(`
                <div><i class="fas fa-book"></i> ${item.DokumenDosen.DokumenDosenDosen.DosenProdi.nama}</div>
              `);
            }

            if (item.DokumenMahasiswa && item.DokumenMahasiswa.DokumenMahasiswaMahasiswa && item.DokumenMahasiswa.DokumenMahasiswaMahasiswa.MahasiswaProdi) {
              contentElement.append(`
                <div><i class="fas fa-book"></i> ${item.DokumenMahasiswa.DokumenMahasiswaMahasiswa.MahasiswaProdi.nama}</div>
              `);
            }

            if (item.DokumenDosen && item.DokumenDosen.DokumenDosenDosen && item.DokumenDosen.DokumenDosenDosen.DosenUsers && item.DokumenDosen.DokumenDosenDosen.DosenUsers.UsersDetails) {
              contentElement.append(`
                <div><i class="fas fa-user"></i> ${item.DokumenDosen.DokumenDosenDosen.DosenUsers.UsersDetails.fullName} (${item.DokumenDosen.DokumenDosenDosen.nip})</div>
              `);
            }

            if (item.DokumenMahasiswa && item.DokumenMahasiswa.DokumenMahasiswaMahasiswa && item.DokumenMahasiswa.DokumenMahasiswaMahasiswa.MahasiswaUsers && item.DokumenMahasiswa.DokumenMahasiswaMahasiswa.MahasiswaUsers.UsersDetails) {
              contentElement.append(`
                <div><i class="fas fa-user"></i> ${item.DokumenMahasiswa.DokumenMahasiswaMahasiswa.MahasiswaUsers.UsersDetails.fullName} (${item.DokumenMahasiswa.DokumenMahasiswaMahasiswa.nim})</div>
              `);
            }

            contentElement.append(`
              <div><i class="fas fa-eye"></i> ${item.total_views || '-'}</div>
            `);

            contentTable.append(titleElement);
            contentTable.append(contentElement);
            contentWrapper.append(contentTable2, contentTable);
            projectContainer.append(contentWrapper);
            startNumber++;
          });
        }
      }

      updateTable(data);

      $('#prevBtn').click(function () {
        if (current_page > 1) {
          current_page--;
          $('#pageInput').val(current_page);
          fetchPage(current_page);
        }
      });

      $('#nextBtn').click(function () {
        if (current_page < total_pages) {
          current_page++;
          $('#pageInput').val(current_page);
          fetchPage(current_page);
        }
      });

      $('#pageInput').change(function () {
        let inputPage = parseInt($(this).val());
        if (inputPage >= 1 && inputPage <= total_pages) {
          current_page = inputPage;
          fetchPage(current_page);
        } else {
          $(this).val(current_page);
        }
      });

      function fetchPage(page) {
        $.ajax({
          url: `${BASE_URL}/document/search?query=${searchQuery}&page=${page}&pageSize=10`,
          method: 'GET',
          success: function (newData) {
            updateTable(newData);
            current_page = newData.currentPage;
            $('#pageInput').val(current_page);
            $('#prevBtn').prop('disabled', current_page === 1);
            $('#nextBtn').prop('disabled', current_page === total_pages);
          },
          error: function (error) {
            console.error('Error fetching data:', error);
          }
        });
      }

      $('#prevBtn').prop('disabled', current_page === 1);
      $('#nextBtn').prop('disabled', current_page === total_pages);
      $('#pageInput').val(current_page);
    },
    error: function (error) {
      console.error('Error fetching data:', error);
    }
  });
});


document.addEventListener('DOMContentLoaded', function () {
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');

  searchForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form from default submit

    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      // Redirect to search page with query parameter 'q'
      const searchUrl = `/home/search?q=${encodeURIComponent(searchTerm)}`;

      // Redirect or navigate to the search page
      window.location.href = searchUrl;
    }
  });

  // Optional: Handle 'Enter' key input on search field
  searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default 'Enter' form behavior
      searchForm.dispatchEvent(new Event('submit')); // Manually trigger form submit
    }
  });
});


