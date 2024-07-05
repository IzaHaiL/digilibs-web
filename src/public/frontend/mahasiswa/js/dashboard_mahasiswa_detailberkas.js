function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
}

function toggleProfileDropdown() {
    var dropdown = document.getElementById("arrow");
    dropdown.classList.toggle("show");
}

async function logout() {
    try {
        const jwt = getJwtFromCookies(); // Mendapatkan JWT dari cookie
        const response = await fetch('http://localhost:3000/users/signout', {
            method: 'POST', // Menggunakan metode POST untuk logout
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({}) // Mengirim body kosong jika tidak ada data yang diperlukan
        });
        if (response.ok) {
            // Handle logout success
            console.log('Logout success');
            // Hapus cookie JWT setelah logout
            document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            // Redirect ke halaman login atau halaman lainnya
            window.location.href = 'login.html'; // Ganti dengan halaman login kamu
        } else {
            // Handle logout failure
            console.error('Logout failed');
        }
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const jwt = getJwtFromCookies();
    if (!jwt) {
        // Redirect to login page if JWT is not available
        window.location.href = 'login.html';
        return;
    }

    try {
        // Fetch user details
        const userResponse = await fetch('http://localhost:3000/users/detail/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        });

        if (!userResponse.ok) {
            throw new Error('Failed to fetch user details.');
        }

        const userData = await userResponse.json();

        // Get project_id from query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const project_id = urlParams.get('project_id');

        if (!project_id) {
            throw new Error('Project ID not found in URL.');
        }

        const projectData = await fetchData2(project_id, jwt);

        console.log('Data proyek:', projectData);
        console.log('Data pengguna:', userData);

        // Example of accessing projectData and userData
        const projectData1 = projectData.data;
        const mahasiswaData = userData.data.data;

        // Update your HTML elements with fetched data
        document.getElementById('penulis').value = projectData1.penulis;
        document.getElementById('nim').value = projectData1.nim;
        document.getElementById('namaKontributor').value = projectData1.kontributor;
        document.getElementById('judulPenelitian').value = projectData1.title;
        document.getElementById('judulPenelitianEng').value = projectData1.title_eng;
        document.getElementById('abstrak').value = projectData1.abstract;
        document.getElementById('abstrakEng').value = projectData1.abstract_eng;
        document.getElementById('urlJurnal').value = projectData1.url_finalprojects;
        document.getElementById('status').value = projectData1.status;

    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch data. Please try again.');
    }

    // Handle form submission
    document.getElementById('submitForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        // Prepare data from form for submission
        const data = {
            kontributor: document.getElementById('namaKontributor').value,
            title: document.getElementById('judulPenelitian').value,
            title_eng: document.getElementById('judulPenelitianEng').value,
            abstract: document.getElementById('abstrak').value,
            abstract_eng: document.getElementById('abstrakEng').value,
            url_jurnal: document.getElementById('urlJurnal').value
        };

        try {
            // Submit data to backend
            const submitResponse = await fetch('http://localhost:3000/finalprojects/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!submitResponse.ok) {
                throw new Error('Failed to submit data.');
            }

            document.getElementById('submitSuccessMessage').style.display = 'block';
            const responseData = await submitResponse.json();
            console.log('Data successfully submitted:', responseData);
            window.location.href = 'dashboard_mahasiswa.html'; // Redirect to success page or as needed
        } catch (error) {
            console.error('Error submitting data:', error);
            alert('Failed to submit data. Please try again.');
        }
    });

});

async function fetchData2(project_id, jwt) {
    try {
        const response = await fetch(`http://localhost:3000/finalprojects/${project_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch final project data.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('Failed to fetch final project data.');
    }
}

// Function to retrieve JWT from cookies
function getJwtFromCookies() {
    const cookieName = 'jwt';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === cookieName) {
            return value;
        }
    }
    return null;
}

var kontributors = ["Kontributor 1", "Kontributor 2", "Kontributor 3"]; // Daftar nama kontributor / anggota

function autocomplete(input, dropdown, items) {
    input.addEventListener("input", function(e) {
        var value = this.value;
        closeAllDropdowns(); // Tutup semua dropdown terbuka sebelumnya
        dropdown.innerHTML = "";
        items.forEach(function(item) {
            if (item.toUpperCase().includes(value.toUpperCase())) {
                var option = document.createElement("div");
                option.textContent = item;
                option.addEventListener("click", function() {
                    input.value = item;
                    closeAllDropdowns(); // Tutup dropdown setelah memilih
                });
                dropdown.appendChild(option);
            }
        });
        dropdown.classList.add("active"); // Tampilkan dropdown
    });

    input.addEventListener("mouseleave", function() {
        closeAllDropdowns(); // Tutup dropdown jika kursor tidak di dalam dropdown atau input
    });

    dropdown.addEventListener("mouseleave", function() {
        closeAllDropdowns(); // Tutup dropdown jika kursor tidak di dalam dropdown atau input
    });
}

function closeAllDropdowns() {
    var allDropdowns = document.querySelectorAll(".autocomplete-items");
    allDropdowns.forEach(function(dropdown) {
        dropdown.classList.remove("active"); // Sembunyikan semua dropdown
    });
}

autocomplete(document.getElementById("namaKontributor"), document.getElementById("kontributorDropdown"), kontributors);