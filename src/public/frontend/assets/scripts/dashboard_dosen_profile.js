document.addEventListener('DOMContentLoaded', async () => {
  const jwt = getJwtFromCookies() // Mendapatkan JWT dari cookies

  if (!jwt) {
    window.location.href = 'login.html' // Redirect ke halaman login jika tidak ada JWT
  } else {
    try {
      const userData = await fetchData(jwt) // Memanggil fungsi untuk mengambil data dari API
      const dosenData = userData.data.data // Mengakses data dosen di dalam respons
      const fakultasData = userData.data.fakultas // Mengakses data fakultas di dalam respons
      const prodiData = userData.data.prodi // Mengakses data prodi di dalam respons

      // Mengisi nilai formulir berdasarkan data yang diterima
      document.getElementById('fullname').value = dosenData.nama_dosen
      document.getElementById('nik').value = dosenData.nik
      document.getElementById('nidn').value = dosenData.nidn
      document.getElementById('placeOfBirth').value = dosenData.tempat_lahir
      document.getElementById('dateOfBirth').value = dosenData.tanggal_lahir
      document.getElementById('gender').value =
        dosenData.jenis_kelamin === 'Laki-laki' ? 'male' : 'female'
      document.getElementById('facultySearch').value =
        fakultasData.nama_fakultas // Mengisi nama fakultas
      document.getElementById('studyProgramSearch').value = prodiData.nama_prodi 
      document.getElementById('address').value = dosenData.alamat
      document.getElementById('email').value = userData.data.email 
      document.getElementById('phone').value = dosenData.nomor_hp
      document.getElementById('pp-profile').value = dosenData.url_foto
      const imgProfile = document.getElementById('pp-profile')
      imgProfile.src = dosenData.url_foto
    } catch (error) {
      console.error('Error saat memuat data dari API:', error)
    }
  }

  // Event listener untuk form submit
  document
    .getElementById('updateForm')
    .addEventListener('submit', async event => {
      event.preventDefault() // Mencegah form submit default

      if (!confirm('Apakah Anda yakin ingin mengupdate data?')) {
        return // Jika pengguna membatalkan konfirmasi, batalkan pengiriman
      }

      const updatedData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        nama_dosen: document.getElementById('fullname').value,
        nidn: document.getElementById('nidn').value,
        nik: document.getElementById('nik').value,
        alamat: document.getElementById('address').value,
        tempat_lahir: document.getElementById('placeOfBirth').value,
        tanggal_lahir: document.getElementById('dateOfBirth').value,
        jenis_kelamin:
          document.getElementById('gender').value === 'male'
            ? 'Laki-laki'
            : 'Perempuan',
        url_foto: document.getElementById('pp-profile').src,
        fakultas_id: document.getElementById('facultySearch').dataset.id, // Pastikan id fakultas disimpan di data atribut
        prodi_id: document.getElementById('studyProgramSearch').dataset.id, // Pastikan id prodi disimpan di data atribut
        nomor_hp: document.getElementById('phone').value
      }

      try {
        const response = await fetch(
          `http://localhost:3000/users/update/dosen/${userData.data.user_id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify(updatedData)
          }
        )

        const result = await response.json()
        if (response.ok) {
          alert('Data dosen berhasil diperbarui')
          console.log('Update success:', result)
        } else {
          alert(`Gagal memperbarui data: ${result.error}`)
          console.log('Update error:', result)
        }
      } catch (error) {
        console.error('Error saat memperbarui data:', error)
      }
    })
})

// Fungsi untuk mengambil data dari API
async function fetchData (jwt) {
  try {
    const response = await fetch('http://localhost:3000/users/detail/', {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching data:', error)
    throw Error('Gagal mengambil data dari API')
  }
}

var faculties = ['Fakultas 1', 'Fakultas 2', 'Fakultas 3'] // Daftar fakultas
var studyPrograms = ['Program Studi 1', 'Program Studi 2', 'Program Studi 3'] // Daftar program studi

function autocomplete (input, dropdown, items) {
  input.addEventListener('input', function (e) {
    var value = this.value
    closeAllDropdowns() // Tutup semua dropdown terbuka sebelumnya
    dropdown.innerHTML = ''
    items.forEach(function (item) {
      if (item.toUpperCase().includes(value.toUpperCase())) {
        var option = document.createElement('div')
        option.textContent = item
        option.addEventListener('click', function () {
          input.value = item
          closeAllDropdowns() // Tutup dropdown setelah memilih
        })
        dropdown.appendChild(option)
      }
    })
    dropdown.classList.add('active') // Tampilkan dropdown
  })

  input.addEventListener('mouseleave', function () {
    closeAllDropdowns() // Tutup dropdown jika kursor tidak di dalam dropdown atau input
  })

  dropdown.addEventListener('mouseleave', function () {
    closeAllDropdowns() // Tutup dropdown jika kursor tidak di dalam dropdown atau input
  })
}

function closeAllDropdowns () {
  var allDropdowns = document.querySelectorAll('.autocomplete-items')
  allDropdowns.forEach(function (dropdown) {
    dropdown.classList.remove('active') // Sembunyikan semua dropdown
  })
}

autocomplete(
  document.getElementById('facultySearch'),
  document.getElementById('facultyDropdown'),
  faculties
)
autocomplete(
  document.getElementById('studyProgramSearch'),
  document.getElementById('studyProgramDropdown'),
  studyPrograms
)

document.addEventListener('DOMContentLoaded', async () => {
  const jwt = getJwtFromCookies() 
  function checkUserRoleFromJwt (jwt) {
    try {
      const jwtPayload = JSON.parse(atob(jwt.split('.')[1]))
      return jwtPayload.role === 'dosen'
    } catch (error) {
      return false 
    }
  }
  try {
    const isValid = checkUserRoleFromJwt(jwt)
    if (!isValid) { 
      window.location.href = '/403' 
      return
    }
    buildTable(jwt)
  } catch (error) {
  }
})
