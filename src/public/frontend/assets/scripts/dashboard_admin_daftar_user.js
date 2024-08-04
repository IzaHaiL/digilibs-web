const BASE_URL = 'https://digilibs-api-pzhmw.ondigitalocean.app'; // Change this as needed for different environments

$(document).ready(function () {
  const prevBtn = $('#prevBtn');
  const nextBtn = $('#nextBtn');
  const pageInput = $('#pageInput');
  const tableBody = $('tbody');

  let current_page = 1;
  const itemsPerPage = 5;
  let total_pages = 55; // This will be updated based on the data fetched

  async function fetchData(jwt, page, pageSize, searchQuery = '') {
    try {
      const response = await fetch(
        `${BASE_URL}/users/users-with-roles?page=${page}&pageSize=${pageSize}&search=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  $('#myInput').on('keypress', function (e) {
    if (e.which === 13 && $(this).val().trim() !== '') {
      const searchQuery = $(this).val().trim();
      buildTable(getJwtFromCookies(), searchQuery);
    }
  });

  // Tambahkan event listener untuk tombol submit
  $('.main-search-container button[type="submit"]').on('click', function (e) {
    e.preventDefault();
    const searchQuery = $('#myInput').val().trim();
    if (searchQuery !== '') {
      buildTable(getJwtFromCookies(), searchQuery);
    }
  });

  async function buildTable(jwt, searchQuery = '') {
    tableBody.empty(); // Clear table content before loading new data

    try {
      const response = await fetchData(jwt, current_page, itemsPerPage, searchQuery);

      // Check if data property exists and is an array
      if (!response || !Array.isArray(response.data)) {
        console.error('Data fetched is not in the expected format:', response);
        return;
      }
      const data = response.data;
      totalPages = response.totalPages;

      data.forEach((item, index) => {
        const row = `
          <tr>
            <td>${(current_page - 1) * itemsPerPage + index + 1}</td>
            <td>${item.id || '-'}</td>
            <td>${item.username || '-'}</td>
            <td>${item.email || '-'}</td>
            <td>${item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US') : '-'}</td>
            <td>${item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('en-US') : '-'}</td>
            <td>${item.UsersUserRoles[0]?.RolesUserRoles?.name || '-'}</td>
            <td>
              <span class="badge text-bg-info" onclick="viewDetails('${item.id}')" style="cursor: pointer; display: inline-flex; align-items: center;">
                <img src="/assets/image/eye.svg" alt="Info" style="width: 16px; height: 16px;"></span>
              <span class="badge text-bg-danger" data-id="${item.id}" onclick="deleteProject('${item.id}')" style="cursor: pointer; display: inline-flex; align-items: center;">
                <img src="/assets/image/trash.svg" alt="Delete" style="width: 16px; height: 16px;"></span>
            </td>
          </tr>
        `;
        tableBody.append(row);
      });

      $('.view-btn').on('mouseover', function () {
        const id = $(this).data('id');
        $(this).attr('title', `Project ID: ${id}`);
      });

      updateButtons();
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error as needed, such as displaying a message to the user
    }
  }
  function updateButtons() {
    prevBtn.prop('disabled', current_page === 1);
    nextBtn.prop('disabled', current_page === total_pages || !hasNextPageData);
    pageInput.val(current_page);
  }

  prevBtn.on('click', function () {
    if (current_page > 1) {
      current_page--;
      buildTable(getJwtFromCookies());
    }
  });

  nextBtn.on('click', async function () {
    if (current_page < total_pages) {
      current_page++;
      const response = await fetchData(getJwtFromCookies(), current_page, itemsPerPage);
      if (response && Array.isArray(response.data) && response.data.length > 0) {
        buildTable(getJwtFromCookies());
      } else {
        current_page--;
        nextBtn.prop('disabled', true);
        console.warn('Tidak ada data di halaman selanjutnya.');
      }
    }
  });

  pageInput.on('change', async function (e) {
    let inputPage = parseInt(e.target.value);
    if (inputPage > 0 && inputPage <= total_pages) {
      const response = await fetchData(getJwtFromCookies(), inputPage, itemsPerPage);
      if (response && Array.isArray(response.data) && response.data.length > 0) {
        current_page = inputPage;
        buildTable(getJwtFromCookies());
      } else {
        console.warn('Tidak ada data di halaman yang diminta.');
        pageInput.val(current_page);
      }
    } else {
      // Reset the input to the current page if the value is invalid
      pageInput.val(current_page);
    }
  });

  // Initialize the content
  buildTable(getJwtFromCookies());
});




function viewDetails (id) {
  // Implement your method to view details of the project
  alert('Viewing details for project ID: ' + id)
}

async function viewDetails (id) {
  const jwt = getJwtFromCookies() // Get JWT from cookies

  // Redirect to detail page
  window.location.href = `/dashboard/detailberkas?id=${id}`

  try {
    // Kirim permintaan ke endpoint dengan 
    const response = await fetch(
      `${BASE_URL}/document/tugas-akhir/id/${id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch final project details.')
    }

    const projectData = await response.json() // Ambil data JSON dari respons

    // Lakukan apa pun dengan data proyek yang diterima
    console.log('Detail proyek:', projectData)
  } catch (error) {
    console.error('Error:', error.message)
  }
}

async function deleteProject (id) {
  try {
    const confirmed = await new Promise((resolve) => {
      const modalHtml = `
        <div class="modal fade" id="confirmDeleteModal" tabindex="-1" aria-labelledby="confirmDeleteModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="confirmDeleteModalLabel">Konfirmasi Penghapusan</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                Apakah Anda yakin ingin menghapus berkas ini?
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                <button type="button" class="btn btn-danger" id="confirmDeleteButton">Hapus</button>
              </div>
            </div>
          </div>
        </div>
      `;

      $('body').append(modalHtml);
      const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
      modal.show();

      $('#confirmDeleteButton').on('click', function() {
        resolve(true);
        modal.hide();
        $('#confirmDeleteModal').remove();
      });

      $('.btn-close, .btn-secondary').on('click', function() {
        resolve(false);
        modal.hide();
        $('#confirmDeleteModal').remove();
      });
    });
    if (!confirmed) {
      return
    }

    const jwt = getJwtFromCookies() // Dapatkan JWT dari cookies
    const response = await fetch(
      `${BASE_URL}/document/tugas-akhir/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      const errorMessage = await response.text()
      throw new Error(`Failed to delete project: ${errorMessage}`)
    }
    localStorage.setItem('toastMessage', 'Berhasil Hapus Berkas');


    // Refresh tabel setelah penghapusan
    await buildTable(jwt)
    window.location.reload()
  } catch (error) {
    console.error('Error deleting project:', error)
    alert('Project successfully deleted.')
    window.location.reload()
  }
}

$(document).ready(function() {
  // Periksa local storage untuk pesan toast
  const toastMessage = localStorage.getItem('toastMessage');
  
  if (toastMessage) {
    // Buat dan tampilkan toast
    const toastContainer = $('.position-fixed');
    if (toastContainer.length === 0) {
      console.error('Toast container not found.');
      return;
    }

    const toastEl = $(`
      <div role="alert" aria-live="assertive" aria-atomic="true" class="toast" data-bs-autohide="false">
        <div class="toast-header">
          <strong class="me-auto">Notifikasi</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          ${toastMessage}
        </div>
      </div>
    `);

    toastContainer.append(toastEl);

    const toast = new bootstrap.Toast(toastEl);
    toast.show();
    

    // Hapus pesan toast dari local storage
    localStorage.removeItem('toastMessage');
  }
});

