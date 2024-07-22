// Function to load HTML components dynamically
async function loadComponent (componentPath, elementId) {
  try {
    const response = await fetch(componentPath)
    const component = await response.text()
    document.getElementById(elementId).innerHTML = component

    // Set the username dynamically after loading navbar
    const token = getJwtFromCookies() // Function to get JWT token from cookies
    const decodedToken = decodeJwt(token) // Function to decode JWT token
    const username = decodedToken.username // Assuming username is in the decoded token

    const navbarUsername = document.querySelector('.navbar-username')
    if (navbarUsername && username) {
      navbarUsername.textContent = `Hallo, ${username}`
    }
  } catch (error) {
    // console.error('Error loading component:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = checkLoginStatus()
  const currentPage = getCurrentPage()

  if (currentPage === 'home') {
    if (isLoggedIn) {
      loadComponent('/components/navbarlogin.html', 'navbarlogin')

      const jwt = getJwtFromCookies()
      try {
        const decodedJwt = decodeJwt(jwt)
        const userRole = decodedJwt.role
        const dashboardLink = document.getElementById('dashboard-link')

        switch (userRole) {
          case 'mahasiswa':
            dashboardLink.href = '/src/public/frontend/dashboard/mahasiswa.html'
            break
          case 'dosen':
            dashboardLink.href = '/src/public/frontend/dashboard/dosen.html'
            break
          case 'prodi':
            dashboardLink.href = '/src/public/frontend/dashboard/prodi.html'
            break
          case 'fakultas':
            dashboardLink.href = '/src/public/frontend/dashboard/fakultas.html'
            break
          case 'lppm':
            dashboardLink.href = '/src/public/frontend/dashboard/lppm.html'
            break
          default:
            dashboardLink.href = '/src/public/frontend/dashboard/default.html'
            break
        }
      } catch (error) {
        //   console.error('Error decoding or processing JWT:', error);
      }
    } else {
      loadComponent('/components/navbarhome.html', 'navbarhome')
    }
  } else if (currentPage === 'dashboard') {
    loadComponent('/components/navbar.html', 'navbar')
  }

  loadComponent('/components/sidebar.html', 'sidebar')
  loadComponent('/components/sidebarlppm.html', 'sidebarlppm')
  loadComponent('/components/sidebarfakultas.html', 'sidebarfakultas')
  loadComponent('/components/sidebarprodi.html', 'sidebarprodi')
  loadComponent('/components/sidebardosen.html', 'sidebardosen')
  loadComponent('/components/footer.html', 'footer')
  loadComponent('/components/advancesearch.html', 'searchlanjutan')
})

function loadComponent (url, elementId) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      document.getElementById(elementId).innerHTML = data
    })
}

function checkLoginStatus () {
  // Implementasi logika untuk memeriksa apakah pengguna sudah login atau belum
  return !!document.cookie.match(/^(.*;)?\s*jwt\s*=\s*[^;]+(.*)?$/)
}

function getCurrentPage () {
  // Implementasi logika untuk mendapatkan halaman yang sedang diakses
  const path = window.location.pathname
  if (path.includes('dashboard')) {
    return 'dashboard'
  } else if (path.includes('home')) {
    return 'home'
  }
  return 'other'
}
// Function to open the sidebar and change the button to 'X'
function toggleNav () {
  const sidebar = document.getElementById('mySidebar')
  const hamburger = document.getElementById('hamburger')

  if (sidebar.style.width === '250px') {
    sidebar.style.width = '0'
    hamburger.classList.remove('open')
  } else {
    sidebar.style.width = '250px'
    hamburger.classList.add('open')
  }
}

function closeNav () {
  document.getElementById('mySidebar').style.width = '0'
  document.getElementById('hamburger').classList.remove('open')
}

// Function to toggle the profile dropdown
function toggleProfileDropdown () {
  document.getElementById('navbar-dropdown-content').classList.toggle('show')
}

// Close the dropdown if the user clicks outside of it
window.addEventListener('click', function (event) {
  const dropdownButton = document.querySelector('.navbar-dropdown button')
  const dropdownContent = document.getElementById('navbar-dropdown-content')
  if (
    !dropdownButton.contains(event.target) &&
    !dropdownContent.contains(event.target)
  ) {
    dropdownContent.classList.remove('show')
  }
})

// var btnOpenModal = document.getElementById('btnOpenModal');
// var myModal = new bootstrap.Modal(document.getElementById('myModal'));

// // Tambahkan event listener untuk membuka modal saat tombol diklik
// btnOpenModal.addEventListener('click', function() {
//     myModal.show();
// });

async function loadComponent (componentPath, elementId) {
  try {
    const response = await fetch(componentPath)
    const component = await response.text()
    document.getElementById(elementId).innerHTML = component

    const token = getJwtFromCookies() 
    const decodedToken = decodeJwt(token) 
    const username = decodedToken.username

    const navbarUsername = document.querySelector('.navbar-username')
    if (navbarUsername && username) {
      navbarUsername.textContent = `Hello, ${username}`
    }
    if (elementId === 'navbarlogin') {
      const userRole = decodedToken.role
      const dashboardLink = document.getElementById('dashboard-link')
      switch (userRole) {
        case 'mahasiswa':
          dashboardLink.href =
            '/dashboard'
          break
        case 'dosen':
          dashboardLink.href = '/dashboard/dosen'
          break
        case 'prodi':
          dashboardLink.href = '/dashboard/prodi'
          break
        case 'fakultas':
          dashboardLink.href = '/dashboard/fakultas'
          break
        case 'lppm': 
          dashboardLink.href = '/dashboard/lppm'
          break
        default:
          dashboardLink.href = '/dashboard/dosen' 
          break
      }
    }
  } catch (error) {
  }
}


loadComponent('/components/navbar.html', 'navbar')