 
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
            // Jika tidak ada JWT, arahkan pengguna ke halaman login
            window.location.href = 'login.html'; // Ganti dengan halaman login kamu
            return;
        } try {
            const response = await fetch('http://localhost:3000/users/detail/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwt}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user details.');
            }

            const userData = await fetchData(jwt); // Memanggil fungsi untuk mengambil data dari API
            console.log('Data yang diterima:', userData); // Logging data yang diterima untuk debug

            const mahasiswaData = userData.data.data; 

            document.getElementById('penulis').value = mahasiswaData.nama_mahasiswa; // Assume the API returns user name as 'name'
            document.getElementById('nim').value = mahasiswaData.nim; // Assume the API returns NIM as 'nim'
        } catch (error) {
            console.error('Error fetching user details:', error);
            alert('Failed to fetch user details. Please try again.');
        }

        // Menangani submit form
        document.getElementById('submitForm').addEventListener('submit', async (event) => {
            event.preventDefault(); // Menghentikan pengiriman form default
            

            const data = {
                kontributor: document.getElementById('namaKontributor').value,
                title: document.getElementById('judulPenelitian').value,
                title_eng: document.getElementById('judulPenelitianEng').value,
                abstract: document.getElementById('abstrak').value,
                abstract_eng: document.getElementById('abstrak').value,
                url_jurnal: document.getElementById('urlJurnal').value
            };

            try {
                const jwt = getJwtFromCookies(); // Mendapatkan JWT dari cookies
                const response = await fetch('http://localhost:3000/finalprojects/create', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${jwt}`, // Menggunakan JWT dari cookies untuk otorisasi
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data) // Mengirim data form sebagai JSON
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Server returned error:', errorData);
                    // Handle error here, e.g., show error message to the user
                    throw new Error('Failed to submit data.');
                }
                document.getElementById('submitSuccessMessage').style.display = 'block';

                const responseData = await response.json();
                console.log('Data successfully submitted:', responseData);
                // Redirect or handle success scenario here
                window.location.href = 'dashboard_mahasiswa.html'; // Ganti dengan halaman sukses atau sesuai kebutuhan
            } catch (error) {
                console.error('Error:', error.message);
                alert('Failed to submit data. Please try again.');
            }
            
        });
        
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