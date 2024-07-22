document.addEventListener('DOMContentLoaded', async () => {
  const jwt = getJwtFromCookies()
  if (!jwt) {
    return
  }

  let isFormModified = false // Variable to track form modifications

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
    const research_id = urlParams.get('research_id')

    if (!research_id) {
      throw new Error('research ID not found in URL.')
    }

    async function fetchData (research_id, jwt) {
      try {
        const response = await fetch(
          `http://localhost:3000/researchs/private/detail/${research_id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${jwt}`
            }
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch final research data.')
        }

        const data = await response.json()
        return data
      } catch (error) {
        console.error('Error fetching data:', error)
        throw new Error('Failed to fetch final research data.')
      }
    }

    const researchData = await fetchData(research_id, jwt)
    const researchData1 = researchData.data

    // Populate form fields
    document.getElementById('penulis').value =
      researchData1.dosen.nama_dosen
    document.getElementById('nidn').value = researchData1.dosen.nidn
    document.getElementById('namaKontributor').value = researchData1.kontributor
    document.getElementById('judulPenelitian').value = researchData1.title
    document.getElementById('judulPenelitianEng').value = researchData1.title_eng
    document.getElementById('abstrak').value = researchData1.abstract
    document.getElementById('abstrakEng').value = researchData1.abstract_eng
    document.getElementById('urlJurnal').value = researchData1.url_research
    document.getElementById('status').value = researchData1.status

    // Function to check form modifications
    function checkFormModifications () {
      const formData = {
        kontributor: document.getElementById('namaKontributor').value,
        title: document.getElementById('judulPenelitian').value,
        title_eng: document.getElementById('judulPenelitianEng').value,
        abstract: document.getElementById('abstrak').value,
        abstract_eng: document.getElementById('abstrakEng').value,
        url_research: document.getElementById('urlJurnal').value,
        status: document.getElementById('status').value
      }

      // Compare form data with original research data
      if (
        formData.kontributor !== researchData1.kontributor ||
        formData.title !== researchData1.title ||
        formData.title_eng !== researchData1.title_eng ||
        formData.abstract !== researchData1.abstract ||
        formData.abstract_eng !== researchData1.abstract_eng ||
        formData.url_research !== researchData1.url_research ||
        formData.status !== researchData1.status
      ) {
        isFormModified = true
      } else {
        isFormModified = false
      }
    }

    // Call checkFormModifications initially
    checkFormModifications()

    // Add event listeners to form inputs to track modifications
    const formInputs = document.querySelectorAll(
      '#submitForm input, #submitForm textarea, #submitForm select'
    )
    formInputs.forEach(input => {
      input.addEventListener('input', () => {
        checkFormModifications()
      })
    })

    // Handle form submission
    document
      .getElementById('submitForm')
      .addEventListener('submit', async event => {
        event.preventDefault()

        // Check which button was clicked
        const submitBtn = event.submitter
        if (submitBtn && submitBtn.name === 'cancelBtn') {
          // Handle Cancel action here
          window.location.href = '/dashboard/dosen' // Redirect to dashboard or appropriate page
          return
        }

        // Ask for confirmation before update
        const confirmed = confirm('Are you sure you want to update this data?')
        if (!confirmed) {
          return // If not confirmed, do nothing
        }

        // Prepare data from form for submission
        const updatedData = {
          kontributor: document.getElementById('namaKontributor').value,
          title: document.getElementById('judulPenelitian').value,
          title_eng: document.getElementById('judulPenelitianEng').value,
          abstract: document.getElementById('abstrak').value,
          abstract_eng: document.getElementById('abstrakEng').value,
          url_finalresearchs: document.getElementById('urlJurnal').value,
          status: document.getElementById('status').value
        }

        try {
          // Submit updated data to backend
          const updateResponse = await fetch(
            `http://localhost:3000/researchs/private/update/${research_id}`,
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
          window.location.href = '/dashboard/dosen' // Redirect to dashboard or as needed

          // Reset form modification flag
          isFormModified = false

          // Remove beforeunload event listener
          window.removeEventListener('beforeunload', handleBeforeUnload)
        } catch (error) {
          console.error('Error updating data:', error)
        }
      })

    // Function to disable update button if no modifications
    function disableUpdateButton () {
      const updateButton = document.querySelector('input[name="updateBtn"]')
      if (updateButton) {
        updateButton.disabled = !isFormModified // Disable if no modifications
        updateButton.style.backgroundColor = isFormModified ? '#A00' : '#CCCCCC' // Green if modified, grey if not
      }
    }

    // Call disableUpdateButton initially
    disableUpdateButton()

    // Add event listener to check for modifications on input change
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
    fileInput.value = '' // Clear the input value to allow uploading the same file again
  })

  function renderFileList () {
    fileList.innerHTML = '' // Clear the list first

    filesArray.forEach((file, index) => {
      const fileItem = document.createElement('div')
      fileItem.classList.add('file-item')

      // Determine the icon based on the file type
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
