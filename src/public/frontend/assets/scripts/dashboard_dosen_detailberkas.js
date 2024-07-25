const BASE_URL = 'https://api.digilibs.me'; // Change this as needed for different environments


document.addEventListener('DOMContentLoaded', async () => {
  const jwt = getJwtFromCookies()
  if (!jwt) {
    console.error('JWT not found in cookies.')
    return
  }

  let isFormModified = false
  let researchData1 = {}
  let originalFiles = []

  try {
    const userResponse = await fetch(`${BASE_URL}/users/detail/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user details.')
    }

    const urlParams = new URLSearchParams(window.location.search)
    const research_id = urlParams.get('research_id')

    if (!research_id) {
      throw new Error('research ID not found in URL.')
    }

    const researchData = await fetchData(research_id, jwt)
    researchData1 = researchData.data
    originalFiles = researchData1.berkas
      ? researchData1.berkas.map(file => file.name)
      : []

    populateFormFields(researchData1)
    checkFormModifications()

    const formInputs = document.querySelectorAll(
      '#submitForm input, #submitForm textarea, #submitForm select'
    )
    formInputs.forEach(input => {
      input.addEventListener('input', () => {
        checkFormModifications()
        disableUpdateButton()
      })
    })

    let deletedFileIds = []

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

        const formData = new FormData()
        formData.append('kontributor', getSelectedKontributors())
        formData.append(
          'title',
          document.getElementById('judulPenelitian').value
        )
        formData.append(
          'title_eng',
          document.getElementById('judulPenelitianEng').value
        )
        formData.append('abstract', document.getElementById('abstrak').value)
        formData.append(
          'abstract_eng',
          document.getElementById('abstrakEng').value
        )
        formData.append(
          'url_research',
          document.getElementById('urlJurnal').value
        )
        formData.append('status', document.getElementById('status').value)

        // Append files to formData
        researchData1.berkas.forEach((file, index) => {
          if (file instanceof File) {
            formData.append('files', file, file.name)
          } else {
            formData.append('existingFiles', JSON.stringify(file))
          }
        })

        // Append deleted file IDs to formData
        formData.append('deletedFileIds', deletedFileIds.join(','))

        try {
          const updateResponse = await fetch(
            `${BASE_URL}/researchs/private/update/${research_id}`,
            {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${jwt}`
              },
              body: formData
            }
          )

          if (!updateResponse.ok) {
            throw new Error('Failed to update data.')
          }

          alert('Data updated successfully!')
          isFormModified = false
          window.removeEventListener('beforeunload', handleBeforeUnload)
        } catch (error) {
          console.error('Error updating data:', error)
        }
      })

    disableUpdateButton()
    document.getElementById('submitForm').addEventListener('input', () => {
      disableUpdateButton()
    })

    const fileList = document.getElementById('fileList')
    if (researchData1.berkas) {
      renderFileList(researchData1.berkas)
    }

    if (fileList) {
      fileList.addEventListener('click', event => {
        const index = event.target.getAttribute('data-index')
        const fileId = event.target.getAttribute('data-id')
        const url = event.target.getAttribute('data-url')
        if (event.target.classList.contains('remove-file')) {
          researchData1.berkas.splice(index, 1)
          researchData1.berkas = researchData1.berkas.filter(file => file) // Remove undefined elements
          renderFileList(researchData1.berkas)
          checkFormModifications()
          disableUpdateButton()
          if (fileId) {
            deletedFileIds.push(fileId) // Add file ID to deletedFileIds array
          }
        } else if (event.target.classList.contains('preview-file')) {
          event.preventDefault()
          if (url.endsWith('.pdf')) {
            showPDFInModal(url)
          } else {
            window.open(url, '_blank')
          }
        }
      })
    }

    function addFile (event) {
      const fileInput = event.target
      const newFiles = Array.from(fileInput.files)

      // Add new files to researchData1.berkas without modifying existing files
      newFiles.forEach(newFile => {
        researchData1.berkas.push(newFile)
      })

      renderFileList(researchData1.berkas) // Re-render the file list
      checkFormModifications()
      disableUpdateButton()
    }
    document.getElementById('fileInput').addEventListener('change', addFile)

    function renderFileList (files) {
      updatedFilesArray = files
      const fileList = document.getElementById('fileList')
      if (!fileList) return
 
      fileList.innerHTML = ''
 
      files.forEach((file, index) => {
        if (!file) return // Skip undefined files
 
        const fileItem = document.createElement('div')
        fileItem.classList.add('file-item')
 
        let fileIcon = ''
        const fileName = file.name || file.url_berkas // Use file.name for new files, file.url_berkas for existing files
        if (fileName.endsWith('.pdf')) {
          fileIcon = '<i class="fa fa-file-pdf" style="color: red;"></i>'
        } else if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
          fileIcon = '<i class="fa fa-file-word" style="color: blue;"></i>'
        } else if (fileName.endsWith('.zip') || fileName.endsWith('.rar')) {
          fileIcon = '<i class="fa fa-file-archive" style="color: orange;"></i>'
        } else {
          fileIcon = '<i class="fa fa-file"></i>'
        }
 
        fileItem.innerHTML = `${fileIcon} <a href="${
          file.url_berkas || '#'
        }" target="_blank">Berkas ${index + 1}</a>
      <div class="actions">
        <i class="fa fa-eye preview-file" data-url="${
          file.url_berkas || ''
        }" data-toggle="modal" data-target="#pdfModal"></i>
        <i class="fa fa-times remove-file" data-index="${index}" data-id="${
          file.berkas_id || ''
        }"></i>
      </div>`
        fileList.appendChild(fileItem)
      })
 
      // Add event listener for preview-file
      document.querySelectorAll('.preview-file').forEach(element => {
        element.addEventListener('click', event => {
          const url = event.target.getAttribute('data-url')
          if (url && url.endsWith('.pdf')) {
            showPDFInModal(url)
          }
        })
      })
    }
 
    function showPDFInModal(url) {
      const modal = document.getElementById('pdfModal')
      const modalBody = modal.querySelector('.modal-body')
      const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
      modalBody.innerHTML = `<iframe src="${googleDocsViewerUrl}" width="100%" height="700px" frameborder="0"></iframe>`
      $('#pdfModal').modal('show')
    }

    // Event listener for refresh button in modal
    document.querySelector('.modal .bi-arrow-clockwise').addEventListener('click', () => {
      const modalBody = document.querySelector('#pdfModal .modal-body')
      modalBody.innerHTML = '' // Clear the modal content
      const icon = document.querySelector('.modal .bi-arrow-clockwise')
      icon.classList.add('rotate') // Add rotate class to icon
      setTimeout(() => {
        icon.classList.remove('rotate') // Remove rotate class after 1 second
      }, 1000)
    })

    // Event listener for file list actions
    document.getElementById('fileList').addEventListener('click', event => {
      const index = event.target.getAttribute('data-index')
      if (event.target.classList.contains('remove-file')) {
        researchData1.berkas.splice(index, 1) // Remove file from researchData1.berkas
        researchData1.berkas = researchData1.berkas.filter(file => file) // Remove undefined elements
        renderFileList(researchData1.berkas) // Re-render file list
        checkFormModifications()
        disableUpdateButton()
      } else if (event.target.classList.contains('preview-file')) {
        const file = researchData1.berkas[index]
        if (file) {
          if (file instanceof File) {
            const fileURL = URL.createObjectURL(file)
            showPDFInModal(fileURL)
          } else if (file.url_berkas) {
            showPDFInModal(file.url_berkas)
          }
        }
      }
    })
  } catch (error) {
    console.error('Error fetching data:', error)
    alert('Failed to fetch data. Please try again.')
  }

  function checkFormModifications () {
    const judulPenelitianInput = document.getElementById('judulPenelitian')
    const judulPenelitianEngInput =
      document.getElementById('judulPenelitianEng')
    const abstrakInput = document.getElementById('abstrak')
    const abstrakEngInput = document.getElementById('abstrakEng')
    const urlJurnalInput = document.getElementById('urlJurnal')
    const statusInput = document.getElementById('status')

    const formData = {
      title: judulPenelitianInput ? judulPenelitianInput.value : '',
      title_eng: judulPenelitianEngInput ? judulPenelitianEngInput.value : '',
      abstract: abstrakInput ? abstrakInput.value : '',
      abstract_eng: abstrakEngInput ? abstrakEngInput.value : '',
      url_research: urlJurnalInput ? urlJurnalInput.value : '',
      status: statusInput ? statusInput.value : '',
      files: researchData1.berkas
        ? researchData1.berkas.filter(file => file).map(file => file.name)
        : []
    }

    if (formData.title !== researchData1.title) {
      console.log('Title has been modified')
      isFormModified = true
    } else if (formData.title_eng !== researchData1.title_eng) {
      console.log('Title (English) has been modified')
      isFormModified = true
    } else if (formData.abstract !== researchData1.abstract) {
      console.log('Abstract has been modified')
      isFormModified = true
    } else if (formData.abstract_eng !== researchData1.abstract_eng) {
      console.log('Abstract (English) has been modified')
      isFormModified = true
    } else if (formData.url_research !== researchData1.url_research) {
      console.log('URL Final researchs has been modified')
      isFormModified = true
    } else if (formData.status !== researchData1.status) {
      console.log('Status has been modified')
      isFormModified = true
    } else if (
      JSON.stringify(formData.files) !== JSON.stringify(originalFiles)
    ) {
      console.log('Files have been modified')
      isFormModified = true
    } else {
      console.log('Form has not been modified')
      isFormModified = false
    }

    disableUpdateButton()
  }

  function disableUpdateButton () {
    const updateButton = document.querySelector('input[name="submitBtn"]')
    if (updateButton) {
      updateButton.disabled = !isFormModified
      updateButton.style.backgroundColor = isFormModified ? '#A00' : '#CCCCCC'
    }
  }
})

async function fetchData (research_id, jwt) {
  try {
    console.log(`Fetching data for research ID: ${research_id}`)
    const response = await fetch(
      `${BASE_URL}/researchs/private/detail/${research_id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    )
    if (!response.ok) {
      console.error('Response status:', response.status)
      throw new Error('Failed to fetch final research data.')
    }
    const data = await response.json()
    console.log('Fetched data:', data)
    return data
  } catch (error) {
    console.error('Error fetching data:', error)
    throw new Error('Failed to fetch final research data.')
  }
}

function populateFormFields (researchData1) {
  const penulisInput = document.getElementById('penulis')
  const nidnInput = document.getElementById('nidn')
  const namaKontributorInput = document.getElementById('namaKontributor')
  const judulPenelitianInput = document.getElementById('judulPenelitian')
  const judulPenelitianEngInput = document.getElementById('judulPenelitianEng')
  const abstrakInput = document.getElementById('abstrak')
  const abstrakEngInput = document.getElementById('abstrakEng')
  const urlJurnalInput = document.getElementById('urlJurnal')
  const statusInput = document.getElementById('status')
  const fileInput = document.getElementById('berkas')
  const kontributorSelect = document.getElementById('namaKontributor')
  const kategoriSelect = document.getElementById('kategori')
  const additionalContributorsContainer = document.getElementById(
    'additionalContributors'
  )

  if (penulisInput) penulisInput.value = researchData1.dosen.nama_dosen
  if (nidnInput) nidnInput.value = researchData1.dosen.nidn
  if (judulPenelitianInput) judulPenelitianInput.value = researchData1.title
  if (judulPenelitianEngInput)
    judulPenelitianEngInput.value = researchData1.title_eng
  if (abstrakInput) abstrakInput.value = researchData1.abstract
  if (abstrakEngInput) abstrakEngInput.value = researchData1.abstract_eng
  if (urlJurnalInput) urlJurnalInput.value = researchData1.url_research
  if (statusInput) {
    statusInput.value = researchData1.status
    statusInput.disabled = true
  }

  if (kontributorSelect) {
    kontributorSelect.innerHTML =
      '<option value="" disabled selected>Pilih nama kontributor / anggota...</option>'
    researchData1.kontributor.forEach((kontributor, index) => {
      const option = document.createElement('option')
      option.value = kontributor.dosen_id
      option.text = kontributor.nama_dosen
      kontributorSelect.appendChild(option)

      if (index > 0) {
        addSelectField(kontributor.dosen_id, kontributor.nama_dosen)
      }
    })
    kontributorSelect.value = researchData1.kontributor[0].dosen_id
  }

  if (kategoriSelect) {
    const kategoriOptions = researchData1.kategori.map(k => k.nama_kategori)
    kategoriOptions.forEach(kategori => {
      const option = document.createElement('option')
      option.value = kategori
      option.text = kategori
      kategoriSelect.appendChild(option)
    })
    kategoriSelect.value = kategoriOptions.join(', ')
  }

  const filesArray = fileInput ? Array.from(fileInput.files) : []
  const fileData = filesArray.map(file => ({
    name: file.name,
    type: file.type,
    size: file.size
  }))
}

async function populateCategories () {
  try {
    const response = await fetch(`${BASE_URL}/admins`)
    const result = await response.json()

    if (response.ok) {
      const selectElement = document.getElementById('kategori')
      selectElement.innerHTML =
        '<option value="" disabled selected>Pilih nama Kategori Keahlian</option>'

      result.data.forEach(category => {
        const option = document.createElement('option')
        option.value = category.kategori_id
        option.textContent = category.nama_kategori
        selectElement.appendChild(option)
      })
    } else {
      console.error('Failed to fetch categories:', result.message)
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

async function populateContributors () {
  try {
    const jwt = getJwtFromCookies()
    if (!jwt) {
      throw new Error('No JWT token found')
    }

    const response = await fetch(
      `${BASE_URL}/users/AllDosen?page=1&pageSize=10`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const result = await response.json()
    if (result.message === 'Success fetch lecturers' && result.data) {
      window.contributors = result.data

      const select1 = document.getElementById('namaKontributor')
      const select2 = document.getElementById('namaKontributor2')

      select1.innerHTML =
        '<option value="" disabled selected>Pilih nama kontributor / anggota...</option>'

      result.data.forEach(contributor => {
        const option = document.createElement('option')
        option.value = contributor.dosen_id
        option.textContent = contributor.nama_dosen
        select1.appendChild(option)

        const option2 = option.cloneNode(true)
        select2.appendChild(option2)
      })
    } else {
      console.error('Unexpected response format:', result)
    }
  } catch (error) {
    console.error('Error fetching contributors:', error)
  }
}

function addSelectField (dosen_id = '', nama_dosen = '') {
  const container = document.getElementById('additionalContributors')

  const newSelect = document.createElement('select')
  newSelect.classList.add('dynamic-select')
  newSelect.required = true

  const defaultOption = document.createElement('option')
  defaultOption.value = ''
  defaultOption.disabled = true
  defaultOption.selected = true
  defaultOption.textContent = 'Pilih nama kontributor / anggota...'

  newSelect.appendChild(defaultOption)

  const selectedValues = new Set()

  const allSelects = document.querySelectorAll('select')
  allSelects.forEach(select => {
    const selectedOption = select.querySelector('option:checked')
    if (selectedOption && selectedOption.value) {
      selectedValues.add(selectedOption.value)
    }
  })

  window.contributors.forEach(contributor => {
    if (!selectedValues.has(contributor.dosen_id)) {
      const option = document.createElement('option')
      option.value = contributor.dosen_id
      option.textContent = contributor.nama_dosen
      newSelect.appendChild(option)
    }
  })

  if (dosen_id && nama_dosen) {
    const option = document.createElement('option')
    option.value = dosen_id
    option.textContent = nama_dosen
    option.selected = true
    newSelect.appendChild(option)
  }

  const selectContainer = document.createElement('div')
  selectContainer.classList.add('select-container')
  selectContainer.appendChild(newSelect)

  const deleteButton = document.createElement('button')
  deleteButton.textContent = 'X'
  deleteButton.classList.add('delete-button')
  deleteButton.addEventListener('click', () => {
    container.removeChild(selectContainer)
  })

  selectContainer.appendChild(deleteButton)
  container.appendChild(selectContainer)
}

function getSelectedKontributors () {
  const selects = document.querySelectorAll('select')
  const selectedKontributors = Array.from(selects).flatMap(select =>
    Array.from(select.querySelectorAll('option:checked')).map(
      option => option.value
    )
  )

  return selectedKontributors.join(',')
}

document.addEventListener('DOMContentLoaded', () => {
  populateCategories()
  populateContributors()
})

document
  .getElementById('tambahKontributor')
  .addEventListener('click', addSelectField)

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
  } catch (error) {
    console.error('Error checking user role:', error)
  }
})


