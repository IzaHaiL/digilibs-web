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
    const jwt = getJwtFromCookies(); // Mendapatkan JWT dari cookies
    
    if (!jwt) {
        // Redirect ke halaman login jika tidak ada JWT
        window.location.href = 'login.html'; // Ganti dengan halaman login kamu
    } else {
        console.log('JWT ditemukan, memuat data dari API...'); // Logging untuk debug

        try {
            const userData = await fetchData(jwt); // Memanggil fungsi untuk mengambil data dari API
            console.log('Data yang diterima:', userData); // Logging data yang diterima untuk debug

            // Mengisi nilai formulir berdasarkan data yang diterima
            const mahasiswaData = userData.data.data; // Mengakses data mahasiswa di dalam respons
            const mahasiswaData1 = userData.data; // Mengakses data mahasiswa di dalam respons  

            document.getElementById('fullname').value = mahasiswaData.nama_mahasiswa;
            document.getElementById('nik').value = mahasiswaData.nik;
            document.getElementById('nim').value = mahasiswaData.nim;
            document.getElementById('placeOfBirth').value = mahasiswaData.tempat_lahir;
            document.getElementById('dateOfBirth').value = mahasiswaData.tanggal_lahir;
            document.getElementById('gender').value = mahasiswaData.jenis_kelamin === 'Laki-laki' ? 'male' : 'female'; // Sesuaikan dengan nilai yang benar dalam opsi dropdown
            document.getElementById('facultySearch').value = mahasiswaData.nama_fakultas;
            document.getElementById('studyProgramSearch').value = mahasiswaData.nama_prodi;
            document.getElementById('address').value = mahasiswaData.alamat;
            document.getElementById('email').value = mahasiswaData1.email; // Akses email langsung dari respons utama
            document.getElementById('phone').value = mahasiswaData.nomor_hp;
            document.getElementById('pp-profile').value = mahasiswaData.url_foto;
            const imgProfile = document.getElementById('pp-profile');
            imgProfile.src = mahasiswaData.url_foto;


        } catch (error) {
            console.error('Error saat memuat data dari API:', error);
            // Handle error loading data from API
        }
    }
});

// Fungsi untuk mendapatkan JWT dari cookies
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

// Fungsi untuk mengambil data dari API
async function fetchData(jwt) {
    try {
        const response = await fetch('http://localhost:3000/users/detail/', {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw Error('Gagal mengambil data dari API');
    }
}

var faculties = ["Fakultas 1", "Fakultas 2", "Fakultas 3"]; // Daftar fakultas
var studyPrograms = ["Program Studi 1", "Program Studi 2", "Program Studi 3"]; // Daftar program studi

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

autocomplete(document.getElementById("facultySearch"), document.getElementById("facultyDropdown"), faculties);
autocomplete(document.getElementById("studyProgramSearch"), document.getElementById("studyProgramDropdown"), studyPrograms);
