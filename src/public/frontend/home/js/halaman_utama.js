async function logout() {
  try {
    const jwt = getJwtFromCookies(); // Mendapatkan JWT dari cookie
    const response = await fetch("http://localhost:3000/users/signout", {
      method: "POST", // Menggunakan metode POST untuk logout
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // Mengirim body kosong jika tidak ada data yang diperlukan
    });
    if (response.ok) {
      // Handle logout success
      console.log("Logout success");
      // Hapus cookie JWT setelah logout
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      // Redirect ke halaman login atau halaman lainnya
      window.location.href = 'login.html'; // Ganti dengan halaman login kamu
    }  else {
      // Handle logout failure
      console.error("Logout failed");
    }
  } catch (error) {
    console.error("Error logging out:", error);
  }
}
function openNav() {
  document.getElementById("mySidebar").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main-content").style.marginLeft= "0";

}

function toggleProfileDropdown() {
  var dropdown = document.getElementById("arrow");
  dropdown.classList.toggle("show");
}

document.addEventListener("DOMContentLoaded", () => {
  const jwt = getJwtFromCookies(); // Fungsi untuk mendapatkan JWT dari cookies

  if (!jwt) {
    console.log("JWT ditemukan, memuat tabel..."); // Logging untuk debug
  }
});

// Fungsi untuk mendapatkan JWT dari cookies
function getJwtFromCookies() {
  const cookieName = "jwt"; // Ganti dengan nama cookie JWT kamu
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === cookieName) {
      return value;
    }
  }
  return null;
}



function getJwtFromCookies() {
  const cookieName = 'jwt'; // Ganti dengan nama cookie JWT kamu
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === cookieName) {
          return value;
      }
  }
  return null;
}

function viewDetails(projectId) {
    // Implement your method to view details of the project
    alert('Viewing details for project ID: ' + projectId);
}

async function viewDetails(project_id) {
  const jwt = getJwtFromCookies(); // Get JWT from cookies

  // Redirect to detail page
  window.location.href = `dashboard_mahasiswa_detailberkas.html?project_id=${project_id}`;

  try {
    // Kirim permintaan ke endpoint dengan project_idd
    const response = await fetch(
      `http://localhost:3000/finalprojects/${project_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch final project details.");
    }

    const projectData = await response.json(); // Ambil data JSON dari respons

    // Lakukan apa pun dengan data proyek yang diterima
    console.log("Detail proyek:", projectData);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
      // Fetch data for Tugas Akhir
      
      const tugasAkhirResponse = await fetch('http://localhost:3000/finalprojects');
      if (!tugasAkhirResponse.ok) {
          throw new Error('Failed to fetch Tugas Akhir data.');
      }
      const tugasAkhirData = await tugasAkhirResponse.json();

      // Populate Tugas Akhir data
      const tugasAkhirContainer = document.getElementById('tugasAkhirContainer');
      tugasAkhirData.data.slice(0, 5).forEach(item => {

          const titleElement = document.createElement('div');
          titleElement.className = 'title tugas-akhir-title';
          titleElement.innerHTML = `<h2>${item.title}</h2>`;

          const contentElement = document.createElement('div');
          contentElement.className = 'content tugas-akhir-content';
          contentElement.innerHTML = `
              <div>${item.submissionDate ? new Date(item.submissionDate).toLocaleDateString('en-US') : '-'}</div>
              <div>${item.nama_prodi}</div>
              <div>${item.penulis} (${item.nim})</div>

                
          `;

          tugasAkhirContainer.appendChild(titleElement);
          tugasAkhirContainer.appendChild(contentElement);
      });

      // Fetch data for Penelitian
      const penelitianResponse = await fetch('http://localhost:3000/researchs');
      if (!penelitianResponse.ok) {
          throw new Error('Failed to fetch Penelitian data.');
      }
      const penelitianData = await penelitianResponse.json();

      // Populate Penelitian data
      const penelitianContainer = document.getElementById('penelitianContainer');
      penelitianData.data.slice(0, 5).forEach(item => {
          const titleElement = document.createElement('div');
          titleElement.className = 'title penelitian-title';
          titleElement.innerHTML = `<h2>${item.title}</h2>`;

          const contentElement = document.createElement('div');
          contentElement.className = 'content penelitian-content';
          contentElement.innerHTML = `
              <div>${item.submissionDate ? new Date(item.submissionDate).toLocaleDateString('en-US') : '-'}</div>
              <div>${item.nama_prodi}</div>
              <div>${item.penulis} (${item.nidn})</div>
          `;

          penelitianContainer.appendChild(titleElement);
          penelitianContainer.appendChild(contentElement);
      });

  } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data. Please try again.');
  }
});

document.addEventListener('DOMContentLoaded', () => {

  function getJwtFromCookies() {
    const cookieName = 'jwt'; // Nama cookie yang menyimpan JWT
  
    // Mendapatkan semua cookies
    const cookies = document.cookie.split(';');
  
    // Mencari cookie yang mengandung JWT
    for (let cookie of cookies) {
      const cookiePair = cookie.split('=');
      const name = cookiePair[0].trim();
      if (name === cookieName) {
        return cookiePair[1]; // Mengembalikan nilai JWT dari cookie
      }
    }
  
    return null; // Mengembalikan null jika cookie tidak ditemukan
  }
  
  
  const jwt = getJwtFromCookies(); // Implement this function to get JWT from cookies
  
  if (jwt) {
      // User is authenticated, render dashboard navbar or halaman utama navbar
      // You can decide which navbar to show based on the current page or application state
      if (window.location.pathname.includes('dashboard') ){
          renderDashboardNavbar();
      } else {
          renderHalamanUtamaNavbar();
      }
  } else {
      // User is not authenticated, render unauthenticated navbar
      renderUnauthenticatedNavbar();
  }
});

function getJwtFromCookies() {
  // Implement logic to retrieve JWT from cookies
  // Example: return document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*=\s*([^;]*).*$)|^.*$/, "$1");
}

function renderDashboardNavbar() {
  // Render the dashboard navbar HTML
}

function renderHalamanUtamaNavbar() {
  const navbarRight = document.querySelector('.navbar-right');
  navbarRight.innerHTML = `
    <span class="username">Nama User</span> <!-- Ganti dengan nama pengguna yang sesuai jika sudah login -->
    <img src="https://cdn.discordapp.com/attachments/731292697964576833/1258472748838031493/image.png?ex=66882b94&is=6686da14&hm=de69a0f40a691f880107bd941b8aa1f798bc8fe428a6ca0d0a090bf723516eac&"
        alt="Profile Photo" class="profile-photo"> <!-- Ganti dengan foto profil yang sesuai jika sudah login -->
    <div class="navbar-profile-dropdown">
        <button onclick="toggleProfileDropdown()">
            <i class="navbar-dropdown-arrow"></i>
        </button>
        <div id="navbar-profile-dropdown" class="navbar-profile-dropdown-content">
            <a href="/src/public/frontend/home/halaman_utama.html">Halaman Utama</a>
            <a href="#" onclick="logout()">Logout</a>
        </div>
    </div>
  `;
}


function renderUnauthenticatedNavbar() {
  // Render the unauthenticated navbar HTML
}



