const BASE_URL = 'https://digilibs-api-pzhmw.ondigitalocean.app'; 


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
      searchForm.dispatchEvent(new Event('submit')); 
    }
  });
});


