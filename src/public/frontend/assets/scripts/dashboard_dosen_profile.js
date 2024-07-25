const BASE_URL = 'https://api.digilibs.me'; // Change this as needed for different environments

document.addEventListener('DOMContentLoaded', async () => {
  const jwt = getJwtFromCookies() // Mendapatkan JWT dari cookies

  if (!jwt) {
    
  } else {
    try {
      const userData = await fetchData(jwt) 
      const dosenData = userData.data.data 
      const fakultasData = userData.data.fakultas 
      const prodiData = userData.data.prodi 

      // Mengisi nilai formulir berdasarkan data yang diterima
      document.getElementById('fullname').value = dosenData.nama_dosen
      document.getElementById('nik').value = dosenData.nik
      document.getElementById('nim').value = dosenData.nidn
      document.getElementById('placeOfBirth').value = dosenData.tempat_lahir
      document.getElementById('dateOfBirth').value = dosenData.tanggal_lahir
      document.getElementById('gender').value =
        dosenData.jenis_kelamin === 'Laki-laki' ? 'male' : 'female'
      document.getElementById('facultySearch').value =
        fakultasData.nama_fakultas 
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
        fakultas_id: document.getElementById('facultySearch').dataset.id, 
        prodi_id: document.getElementById('studyProgramSearch').dataset.id, 
        nomor_hp: document.getElementById('phone').value
      }

      try {
        const response = await fetch(
          `${BASE_URL}/users/update/dosen/${userData.data.user_id}`, // Gunakan BASE_URL
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