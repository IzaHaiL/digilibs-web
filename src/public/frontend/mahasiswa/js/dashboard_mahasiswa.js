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
    } else {
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
    // Redirect ke halaman login jika tidak ada JWT
    window.location.href = "login.html"; // Ganti dengan halaman login kamu
  } else {
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

// Fungsi untuk mengambil data dari API
document.addEventListener('DOMContentLoaded', () => {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageInput = document.getElementById('pageInput');
    const tableBody = document.querySelector('tbody');

    let current_page = 1;
    const itemsPerPage = 5;
    let total_pages = 55; // This will be updated based on the data fetched

    async function fetchData(jwt, page, pageSize) {
        try {
            const response = await fetch(`http://localhost:3000/finalprojects/user/detail?page=${page}&pageSize=${pageSize}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
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

    async function buildTable(jwt) {
        tableBody.innerHTML = ""; // Clear table content before loading new data

        try {
            const response = await fetchData(jwt, current_page, itemsPerPage); // Fetch data from API with pagination parameters

            // Check if data property exists and is an array
            if (!response || !Array.isArray(response.data)) {
                console.error("Data fetched is not in the expected format:", response);
                return;
            }

            const data = response.data;
            totalPages = response.totalPages;

            // Loop through data and add rows to the table
            data.forEach((item, index) => {
                const row = `
                    <tr>
                        <td>${(current_page - 1) * itemsPerPage + index + 1}</td>
                        <td>${item.nim}</td>
                        <td>${item.penulis}</td>
                        <td>${item.title}</td>
                        <td>${item.kontributor}</td>
                        <td>${item.nama_prodi}</td>
                        <td>${item.nama_fakultas}</td>
                        <td>${item.submissionDate ? new Date(item.submissionDate).toLocaleDateString('en-US') : '-'}</td>
                        <td>${item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('en-US') : '-'}</td>   
                        <td>${item.status}</td>
                        <td><button class="view-btn" data-project-id="${item.project_id}" onclick="viewDetails('${item.project_id}')">View</button></td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });

            const viewButtons = document.querySelectorAll(".view-btn");
            viewButtons.forEach((button) => {
                button.addEventListener("mouseover", () => {
                    const projectId = button.getAttribute("data-project-id");
                    button.setAttribute("title", `Project ID: ${projectId}`);
                });
            });

            updateButtons();
        } catch (error) {
            console.error("Error fetching data:", error);
            // Handle error as needed, such as displaying a message to the user
        }
    }

    function updateButtons() {
        prevBtn.disabled = current_page === 1;
        nextBtn.disabled = current_page === total_pages;
        pageInput.value = current_page;
    }

    prevBtn.addEventListener('click', () => {
        if (current_page > 1) {
          current_page--;
            buildTable(getJwtFromCookies());
        }
    });

    nextBtn.addEventListener('click', () => {
        if (current_page < total_pages) {
          current_page++;
            buildTable(getJwtFromCookies());
        }
    });

    pageInput.addEventListener('change', (e) => {
        let inputPage = parseInt(e.target.value);
        if (inputPage > 0 && inputPage <= total_pages) {
          current_page = inputPage;
            buildTable(getJwtFromCookies());
        } else {
            // Reset the input to the current page if the value is invalid
            pageInput.value = current_page;
        }
    });

    // Initialize the content
    buildTable(getJwtFromCookies());
});

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




