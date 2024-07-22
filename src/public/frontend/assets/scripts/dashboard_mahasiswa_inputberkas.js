document.addEventListener('DOMContentLoaded', async () => {
  const jwt = getJwtFromCookies()
  if (!jwt) {
    return
  }
  try {
    const response = await fetch('http://localhost:3000/users/detail/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user details.')
    }

    const userData = await fetchData(jwt) 
    const mahasiswaData = userData.data.data

    document.getElementById('penulis').value = mahasiswaData.nama_mahasiswa 
    document.getElementById('nim').value = mahasiswaData.nim 
  } catch (error) {
    console.error('Error fetching user details:', error)
    alert('Failed to fetch user details. Please try again.')
  }


  document
    .getElementById('submitForm')
    .addEventListener('submit', async event => {
      event.preventDefault() 

      const data = {
        kontributor: document.getElementById('namaKontributor').value,
        title: document.getElementById('judulPenelitian').value,
        title_eng: document.getElementById('judulPenelitianEng').value,
        abstract: document.getElementById('abstrak').value,
        abstract_eng: document.getElementById('abstrak').value,
        url_jurnal: document.getElementById('urlJurnal').value
      }

      try {
        const jwt = getJwtFromCookies() 
        const response = await fetch(
          'http://localhost:3000/finalprojects/private/create',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${jwt}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) 
          }
        )
        if (!response.ok) {
          const errorData = await response.json()
          console.error('Server returned error:', errorData)
          throw new Error('Failed to submit data.')
        }
        document.getElementById('submitSuccessMessage').style.display = 'block'
        const responseData = await response.json()
        console.log('Data successfully submitted:', responseData)
        window.location.href = '/dashboard/mahasiswa' 
      } catch (error) {
        console.error('Error:', error.message)
        alert('Failed to submit data. Please try again.')
      }
    })
})

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
