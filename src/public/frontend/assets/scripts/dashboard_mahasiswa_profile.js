const BASE_URL = 'https://api.digilibs.me'; // Change this as needed for different environments


document.addEventListener('DOMContentLoaded', async () => {
  const jwt = getJwtFromCookies() // Mendapatkan JWT dari cookies

  if (!jwt) {
    
  } else {
    try {
      const userData = await fetchData(jwt) 
      const mahasiswaData = userData.data.data 
      const fakultasData = userData.data.fakultas 
      const prodiData = userData.data.prodi 

      // Mengisi nilai formulir berdasarkan data yang diterima
      document.getElementById('fullname').value = mahasiswaData.nama_mahasiswa
      document.getElementById('nik').value = mahasiswaData.nik
      document.getElementById('nim').value = mahasiswaData.nim
      document.getElementById('placeOfBirth').value = mahasiswaData.tempat_lahir
      document.getElementById('dateOfBirth').value = mahasiswaData.tanggal_lahir
      document.getElementById('gender').value =
        mahasiswaData.jenis_kelamin === 'Laki-laki' ? 'male' : 'female'
      document.getElementById('facultySearch').value =
        fakultasData.nama_fakultas 
      document.getElementById('studyProgramSearch').value = prodiData.nama_prodi 
      document.getElementById('address').value = mahasiswaData.alamat
      document.getElementById('email').value = userData.data.email 
      document.getElementById('phone').value = mahasiswaData.nomor_hp
      document.getElementById('pp-profile').value = mahasiswaData.url_foto
      const imgProfile = document.getElementById('pp-profile')
      imgProfile.src = mahasiswaData.url_foto
    } catch (error) {
      console.error('Error saat memuat data dari API:', error)
    }
  }


  document
    .getElementById('updateForm')
    .addEventListener('submit', async event => {
      event.preventDefault() //

      if (!confirm('Apakah Anda yakin ingin mengupdate data?')) {
        return 
      }

      const updatedData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        nama_mahasiswa: document.getElementById('fullname').value,
        nim: document.getElementById('nim').value,
        nik: document.getElementById('nik').value,
        alamat: document.getElementById('address').value,
        tempat_lahir: document.getElementById('placeOfBirth').value,
        tanggal_lahir: document.getElementById('dateOfBirth').value,
        jenis_kelamin:
          document.getElementById('gender').value === 'male'
            ? 'Laki-laki'
            : 'Perempuan',
        url_foto: document.getElementById('pp-profile').src,
        fakultas_id: document.getElementById('facultySearch').dataset.id, 
        prodi_id: document.getElementById('studyProgramSearch').dataset.id, 
        nomor_hp: document.getElementById('phone').value
      }

      try {
        const response = await fetch(
          `${BASE_URL}/users/update/mahasiswa/${userData.data.user_id}`, // Gunakan BASE_URL
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
          alert('Data mahasiswa berhasil diperbarui')
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
    const response = await fetch(`${BASE_URL}/users/detail/`, { // Gunakan BASE_URL
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })
    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.error('Error fetching data:', error)
    throw Error('Gagal mengambil data dari API')
  }
}



// Fungsi untuk mendapatkan JWT dari cookies
document.addEventListener('DOMContentLoaded', async () => {
  const jwt = getJwtFromCookies() 
  function checkUserRoleFromJwt (jwt) {
    try {
      const jwtPayload = JSON.parse(atob(jwt.split('.')[1]))
      return jwtPayload.role === 'mahasiswa'
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

