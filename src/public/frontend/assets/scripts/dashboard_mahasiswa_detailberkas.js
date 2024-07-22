document.addEventListener('DOMContentLoaded', async () => {
  const jwt = getJwtFromCookies()
  if (!jwt) {
    return
  }

  let isFormModified = false 

  try {
    const userResponse = await fetch('http://localhost:3000/users/detail/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user details.')
    }

    const urlParams = new URLSearchParams(window.location.search)
    const project_id = urlParams.get('project_id')

    if (!project_id) {
      throw new Error('Project ID not found in URL.')
    }

    async function fetchData (project_id, jwt) {
      try {
        const response = await fetch(
          `http://localhost:3000/finalprojects/private/detail/id/${project_id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${jwt}`
            }
          }
        )
        if (!response.ok) {
          throw new Error('Failed to fetch final project data.')
        }
        const data = await response.json()
        return data
      } catch (error) {
        console.error('Error fetching data:', error)
        throw new Error('Failed to fetch final project data.')
      }
    }

    const projectData = await fetchData(project_id, jwt)
    const projectData1 = projectData.data

    document.getElementById('penulis').value =
      projectData1.mahasiswa.nama_mahasiswa
    document.getElementById('nim').value = projectData1.mahasiswa.nim
    document.getElementById('namaKontributor').value = projectData1.kontributor
    document.getElementById('judulPenelitian').value = projectData1.title
    document.getElementById('judulPenelitianEng').value = projectData1.title_eng
    document.getElementById('abstrak').value = projectData1.abstract
    document.getElementById('abstrakEng').value = projectData1.abstract_eng
    document.getElementById('urlJurnal').value = projectData1.url_finalprojects
    document.getElementById('status').value = projectData1.status

    function checkFormModifications () {
      const formData = {
        kontributor: document.getElementById('namaKontributor').value,
        title: document.getElementById('judulPenelitian').value,
        title_eng: document.getElementById('judulPenelitianEng').value,
        abstract: document.getElementById('abstrak').value,
        abstract_eng: document.getElementById('abstrakEng').value,
        url_finalprojects: document.getElementById('urlJurnal').value,
        status: document.getElementById('status').value
      }

      if (
        formData.kontributor !== projectData1.kontributor ||
        formData.title !== projectData1.title ||
        formData.title_eng !== projectData1.title_eng ||
        formData.abstract !== projectData1.abstract ||
        formData.abstract_eng !== projectData1.abstract_eng ||
        formData.url_finalprojects !== projectData1.url_finalprojects ||
        formData.status !== projectData1.status
      ) {
        isFormModified = true
      } else {
        isFormModified = false
      }
    }

    checkFormModifications()

    const formInputs = document.querySelectorAll(
      '#submitForm input, #submitForm textarea, #submitForm select'
    )
    formInputs.forEach(input => {
      input.addEventListener('input', () => {
        checkFormModifications()
      })
    })

    document
      .getElementById('submitForm')
      .addEventListener('submit', async event => {
        event.preventDefault()

        const submitBtn = event.submitter
        if (submitBtn && submitBtn.name === 'cancelBtn') {
          window.location.href = '/dashboard' 
          return
        }
        const confirmed = confirm('Are you sure you want to update this data?')
        if (!confirmed) {
          return 
        }
        const updatedData = {
          kontributor: document.getElementById('namaKontributor').value,
          title: document.getElementById('judulPenelitian').value,
          title_eng: document.getElementById('judulPenelitianEng').value,
          abstract: document.getElementById('abstrak').value,
          abstract_eng: document.getElementById('abstrakEng').value,
          url_finalprojects: document.getElementById('urlJurnal').value,
          status: document.getElementById('status').value
        }

        try {
          const updateResponse = await fetch(
            `http://localhost:3000/finalprojects/private/update/${project_id}`,
            {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(updatedData)
            }
          )

          if (!updateResponse.ok) {
            throw new Error('Failed to update data.')
          }

          alert('Data updated successfully!')
          window.location.href = '/dashboard' 

          isFormModified = false

          window.removeEventListener('beforeunload', handleBeforeUnload)
        } catch (error) {
          console.error('Error updating data:', error)
        }
      })

    function disableUpdateButton () {
      const updateButton = document.querySelector('input[name="updateBtn"]')
      if (updateButton) {
        updateButton.disabled = !isFormModified //
        updateButton.style.backgroundColor = isFormModified ? '#A00' : '#CCCCCC' 
      }
    }

    disableUpdateButton()
    document.getElementById('submitForm').addEventListener('input', () => {
      disableUpdateButton()
    })
  } catch (error) {
    console.error('Error fetching data:', error)
    alert('Failed to fetch data. Please try again.')
  }
})

document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('berkas')
  const fileList = document.getElementById('file-list')
  const filesArray = []
  const updateButton = document.getElementById('updateBtn')

  fileInput.addEventListener('change', () => {
    Array.from(fileInput.files).forEach(file => {
      filesArray.push(file)
      renderFileList()
    })
    fileInput.value = '' 
  })

  function renderFileList () {
    fileList.innerHTML = ''

    filesArray.forEach((file, index) => {
      const fileItem = document.createElement('div')
      fileItem.classList.add('file-item')

      let fileIcon = ''
      if (file.name.endsWith('.pdf')) {
        fileIcon = '<i class="fa fa-file-pdf" style="color: red;"></i>'
      } else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
        fileIcon = '<i class="fa fa-file-word" style="color: blue;"></i>'
      } else if (file.name.endsWith('.zip') || file.name.endsWith('.rar')) {
        fileIcon = '<i class="fa fa-file-archive" style="color: orange;"></i>'
      } else {
        fileIcon = '<i class="fa fa-file"></i>'
      }

      fileItem.innerHTML = `${fileIcon} ${file.name} 
                <div class="actions">
                    <i class="fa fa-eye preview-file" data-index="${index}"></i>
                    <i class="fa fa-times remove-file" data-index="${index}"></i>
                </div>`
      fileList.appendChild(fileItem)
    })

    updateButton.disabled = filesArray.length === 0
  }

  fileList.addEventListener('click', event => {
    const index = event.target.getAttribute('data-index')
    if (event.target.classList.contains('remove-file')) {
      filesArray.splice(index, 1)
      renderFileList()
    } else if (event.target.classList.contains('preview-file')) {
      const file = filesArray[index]
      const fileURL = URL.createObjectURL(file)
      window.open(fileURL, '_blank')
    }
  })

  // Disable the update button initially
  updateButton.disabled = true
})


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

