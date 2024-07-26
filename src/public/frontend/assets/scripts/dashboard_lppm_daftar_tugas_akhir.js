const BASE_URL = 'https://api.digilibs.me'; // Change this as needed for different environments


function myFunction () {
  var input, filter, table, tr, td, i, txtValue
  input = document.getElementById('myInput')
  filter = input.value.toUpperCase()
  table = document.getElementById('myTable')
  tr = table.getElementsByTagName('tr')

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName('td')
    if (td.length > 0) {
      // Check if the row has table cells
      let rowContainsFilter = false
      for (let j = 0; j < td.length; j++) {
        txtValue = td[j].textContent || td[j].innerText
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          rowContainsFilter = true
          break
        }
      }
      if (rowContainsFilter) {
        tr[i].style.display = ''
      } else {
        tr[i].style.display = 'none'
      }
    }
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const prevBtn = document.getElementById('prevBtn')
  const nextBtn = document.getElementById('nextBtn')
  const pageInput = document.getElementById('pageInput')
  const tableBody = document.querySelector('tbody')

  let current_page = 1
  const itemsPerPage = 5
  let total_pages = 55 // This will be updated based on the data fetched

  async function fetchData (jwt, page, pageSize) {
    try {
      const response = await fetch(
        `${BASE_URL}/finalprojects/private?page=${page}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        }
      )
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  async function buildTable (jwt) {
    tableBody.innerHTML = '' // Clear table content before loading new data

    try {
      const response = await fetchData(jwt, current_page, itemsPerPage)

      // Check if data property exists and is an array
      if (!response || !Array.isArray(response.data)) {
        console.error('Data fetched is not in the expected format:', response)
        return
      }
      const data = response.data
      totalPages = response.totalPages
      data.forEach((item, index) => {
        const row = `
			<tr>
				<td>${(current_page - 1) * itemsPerPage + index + 1}</td>
				<td>${item.mahasiswa.nim}</td>
				<td>${item.mahasiswa.nama_mahasiswa}</td>
				<td>${item.title}</td>
				<td>${item.kontributor}</td>
				<td>${item.prodi.nama_prodi}</td>
				<td>${item.fakulta.nama_fakultas}</td>
				<td>${
          item.submissionDate
            ? new Date(item.submissionDate).toLocaleDateString('en-US')
            : '-'
        }</td>
				<td>${
          item.updatedAt
            ? new Date(item.updatedAt).toLocaleDateString('en-US')
            : '-'
        }</td>   
				<td>${item.status}</td>
				<td>
					<button class="view-btn" data-project-id="${
            item.project_id
          }" onclick="viewDetails('${item.project_id}')">
					<img src="/assets/image/eye.png" alt="Delete"></button>
				</td>
			</tr>
		`
        tableBody.innerHTML += row
      })

      const viewButtons = document.querySelectorAll('.view-btn')
      viewButtons.forEach(button => {
        button.addEventListener('mouseover', () => {
          const projectId = button.getAttribute('data-project-id')
          button.setAttribute('title', `project ID: ${projectId}`)
        })
      })

      updateButtons()
    } catch (error) {
      console.error('Error fetching data:', error)
      // Handle error as needed, such as displaying a message to the user
    }
  }

  function updateButtons () {
    prevBtn.disabled = current_page === 1
    nextBtn.disabled = current_page === total_pages
    pageInput.value = current_page
  }

  prevBtn.addEventListener('click', () => {
    if (current_page > 1) {
      current_page--
      buildTable(getJwtFromCookies())
    }
  })

  nextBtn.addEventListener('click', () => {
    if (current_page < total_pages) {
      current_page++
      buildTable(getJwtFromCookies())
    }
  })

  pageInput.addEventListener('change', e => {
    let inputPage = parseInt(e.target.value)
    if (inputPage > 0 && inputPage <= total_pages) {
      current_page = inputPage
      buildTable(getJwtFromCookies())
    } else {
      // Reset the input to the current page if the value is invalid
      pageInput.value = current_page
    }
  })

  // Initialize the content
  buildTable(getJwtFromCookies())
})

function viewDetails (projectId) {
  // Implement your method to view details of the project
  alert('Viewing details for project ID: ' + projectId)
}

async function viewDetails (project_id) {
  const jwt = getJwtFromCookies() // Get JWT from cookies

  // Redirect to detail page
  window.location.href = `/dashboard/lppm/detail/tugasakhir?project_id=${project_id}`

  try {
    // Kirim permintaan ke endpoint dengan project_idd
    const response = await fetch(
      `${BASE_URL}/finalprojects/private/fakultas/${project_id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch  project details.')
    }

    const projectData = await response.json() // Ambil data JSON dari respons

    // Lakukan apa pun dengan data proyek yang diterima
    console.log('Detail proyek:', projectData)
  } catch (error) {
    console.error('Error:', error.message)
  }
}


document.addEventListener('DOMContentLoaded', async () => {
  const jwt = getJwtFromCookies() // Mendapatkan JWT dari cookies
  console.log('JWT:', jwt) // Logging JWT untuk melihat nilainya

  // Fungsi untuk memeriksa apakah pengguna adalah dosen dari JWT
  function checkUserRoleFromJwt (jwt) {
    try {
      // Decode JWT payload
      const jwtPayload = JSON.parse(atob(jwt.split('.')[1]))
      console.log('Decoded JWT Payload:', jwtPayload)

      // Periksa apakah peran pengguna adalah "dosen"
      return jwtPayload.role === 'lppm'
    } catch (error) {
      console.error('Error decoding JWT or checking user role:', error)
      return false // Secara default, asumsikan bukan dosen jika terjadi kesalahan
    }
  }

  try {
    // Memeriksa peran pengguna dari JWT
    const isLppm = checkUserRoleFromJwt(jwt)
    console.log('Is isLppm:', isLppm) // Logging status apakah pengguna adalah dosen atau bukan

    if (!isLppm) { 
      console.log(
        'User bukan dosen, redirect atau tampilkan pesan kesalahan.'
      )
      // Contoh: Redirect ke halaman utama
      window.location.href = '/home' // Ganti dengan halaman yang sesuai
      return
    }

    // Lanjutkan membangun tabel jika pengguna adalah dosen
    buildTable(jwt)
  } catch (error) {

  }
})


document.addEventListener('DOMContentLoaded', function () {
  fetch(`${BASE_URL}/finalprojects/private/status/count`)
    .then(response => response.json())
    .then(data => {
      const statusData = data.data[0]

      document.getElementById('approved-count').textContent =
        statusData.approved
      document.getElementById('pending-count').textContent = statusData.pending
      document.getElementById('rejected-count').textContent =
        statusData.rejected
    })
    .catch(error => {
      console.error('Error fetching data:', error)
    })
})


document.addEventListener('DOMContentLoaded', function() {
  // Check local storage for toast message
  const toastMessage = localStorage.getItem('toastMessage');
  
  if (toastMessage) {
    // Create and show toast
    const toastContainer = document.querySelector('.position-fixed');
    if (!toastContainer) {
      console.error('Toast container not found.');
      return;
    }

    const toastEl = document.createElement('div');
    toastEl.className = 'toast align-items-center text-white bg-success border-0';
    toastEl.role = 'alert';
    toastEl.ariaLive = 'assertive';
    toastEl.ariaAtomic = 'true';

    toastEl.innerHTML = `
      <div class="toast-header">
        <strong class="me-auto">Notifikasi</strong>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        ${toastMessage}
      </div>
    `;

    toastContainer.appendChild(toastEl);

    const toast = new bootstrap.Toast(toastEl);
    toast.show();

    // Clear the toast message from local storage
    localStorage.removeItem('toastMessage');
  }
});
