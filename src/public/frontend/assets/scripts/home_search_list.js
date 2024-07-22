document.addEventListener('DOMContentLoaded', async () => {
  const currentUrl = window.location.href
  const urlParams = new URLSearchParams(currentUrl.split('?')[1])
  const searchQuery = urlParams.get('q')

  try {
    // Fetch data for Final Projects and Research
    const response = await fetch(
      `http://localhost:3000/finalprojects/public/search?q=${searchQuery}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch data.')
    }
    const data = await response.json()

    const total_pages = data.total_pages // Total pages from API response
    let current_page = data.current_page // Current page from API response

    // Update main content title with search query
    const mainContentTitle = document.getElementById('mainContentTitle')
    mainContentTitle.textContent = `Results: ${searchQuery}`

    // Update main content results with total count
    const mainContentTitleResults = document.getElementById(
      'mainContentTitleResults'
    )
    mainContentTitleResults.textContent = `Results: ${data.total_count}`

    function updateTable (data) {
      const projectContainer = document.getElementById('projectContainer')
      projectContainer.innerHTML = '' // Clear previous content

      if (data.total_count === 0) {
        // No results found message
        const noResultsMessage = document.createElement('div')
        noResultsMessage.textContent = 'No results found.'
        projectContainer.appendChild(noResultsMessage)
      } else {
        const itemsPerPage = data.per_page || 5 // Default to 10 items per page if per_page is not provided
        const currentPage = data.current_page || 1
        let startNumber = (currentPage - 1) * itemsPerPage + 1

        data.data.forEach((item, index) => {
          const contentTable = document.createElement('div')
          contentTable.className = 'table-content'

          const titleElement = document.createElement('div')
          titleElement.className = 'title project-title'
          const titleLink = document.createElement('a')
          titleLink.href = `/home/detail?id=${
            item.research_id || item.project_id
          }`
          titleLink.innerHTML = `<h2>${startNumber}. ${item.title}</h2>`

          // Append anchor to title element
          titleElement.appendChild(titleLink)

          const contentElement = document.createElement('div')
          contentElement.className = 'content project-content'
          contentElement.innerHTML = `
                <div><i class="fas fa-calendar-alt"></i> ${
                  item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString('en-US')
                    : '-'
                }</div>
                <div><i class="fas fa-book"></i> ${
                  item.prodi ? item.prodi.nama_prodi : '-'
                }</div>
                <div><i class="fas fa-user"></i> ${
                  item.mahasiswa
                    ? `(${item.mahasiswa.nama_mahasiswa} - ${item.mahasiswa.nim})`
                    : `(${item.dosen.nama_dosen} - ${item.dosen.nidn})`
                }</div>
                <div><i class="fas fa-eye"></i> ${item.total_views || '-'}</div>
                `

          contentTable.appendChild(titleElement)
          contentTable.appendChild(contentElement)

          // Append contentTable to penelitianContainer
          projectContainer.appendChild(contentTable)
          startNumber++ // Increment startNumber for the next item
        })
      }
    }

    // Initial data load
    updateTable(data)

    // Pagination controls
    const prevBtn = document.getElementById('prevBtn')
    const nextBtn = document.getElementById('nextBtn')
    const pageInput = document.getElementById('pageInput')

    // Function to fetch data based on page number
    async function fetchPage (page) {
      try {
        const response = await fetch(
          `http://localhost:3000/finalprojects/public/search?q=${searchQuery}&page=${page}`
        )
        if (!response.ok) {
          throw new Error('Failed to fetch data.')
        }
        const newData = await response.json()
        updateTable(newData)
        current_page = newData.current_page
        pageInput.value = current_page // Update pageInput value

        // Update button states
        prevBtn.disabled = current_page === 1
        nextBtn.disabled = current_page === total_pages
      } catch (error) {
        console.error('Error fetching data:', error)
        alert('Failed to fetch data. Please try again.')
      }
    }

    // Previous page button click handler
    prevBtn.addEventListener('click', () => {
      if (current_page > 1) {
        current_page--
        pageInput.value = current_page // Update pageInput value
        fetchPage(current_page)
      }
    })

    // Next page button click handler
    nextBtn.addEventListener('click', () => {
      if (current_page < total_pages) {
        current_page++
        pageInput.value = current_page // Update pageInput value
        fetchPage(current_page)
      }
    })

    // Page input change handler
    pageInput.addEventListener('change', () => {
      let inputPage = parseInt(pageInput.value)
      if (inputPage >= 1 && inputPage <= total_pages) {
        current_page = inputPage // Update current_page
        fetchPage(current_page)
      } else {
        pageInput.value = current_page
      }
    })

    // Initial button state
    prevBtn.disabled = current_page === 1
    nextBtn.disabled = current_page === total_pages
    pageInput.value = current_page
  } catch (error) {
    console.error('Error fetching data:', error)
    alert('Failed to fetch data. Please try again.')
  }
})

document.addEventListener('DOMContentLoaded', function () {
  const searchForm = document.getElementById('searchForm')
  const searchInput = document.getElementById('searchInput')

  searchForm.addEventListener('submit', function (event) {
    event.preventDefault() // Mencegah form untuk melakukan submit default

    const searchTerm = searchInput.value.trim()
    if (searchTerm) {
      // Mengarahkan ke halaman pencarian dengan query parameter 'q'
      const searchUrl = `/home/search?q=${encodeURIComponent(searchTerm)}`

      // Redirect atau navigasi ke halaman pencarian
      window.location.href = searchUrl
    }
  })

  // Alternatif: Menangani input 'Enter' pada field pencarian
  searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault() // Mencegah perilaku default 'Enter' pada form
      searchForm.dispatchEvent(new Event('submit')) // Mengirim event 'submit' secara manual
    }
  })
})
