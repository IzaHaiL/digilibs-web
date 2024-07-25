const BASE_URL = 'https://api.digilibs.me'; // Change this as needed for different environments

document.addEventListener('DOMContentLoaded', async () => {
  const jwt = getJwtFromCookies();

  if (!jwt) {
    return;
  }

  try {
    await populateUserData(jwt);
  } catch (error) {
    console.error('Error fetching user details:', error);
    alert('Failed to fetch user details. Please try again.');
  }

  setupFormSubmission(jwt);
  checkUserRoleAndBuildTable(jwt);
});

async function populateUserData(jwt) {
  const userData = await fetchData(jwt);
  const dosenData = userData.data.data;

  document.getElementById('penulis').value = dosenData.nama_dosen;
  document.getElementById('nidn').value = dosenData.nidn;
}
async function populateCategories() {
  try {
    // Fetch categories from the API
    const response = await fetch(`${BASE_URL}/admins`);
    const result = await response.json();

    if (response.ok) {
      // Get the select element
      const selectElement = document.getElementById('kategori');

      // Clear existing options
      selectElement.innerHTML = '<option value="" disabled selected>Pilih nama Kategori Keahlian</option>';

      // Create and append new options for each category
      result.data.forEach(category => {
        const option = document.createElement('option');
        option.value = category.kategori_id;
        option.textContent = category.nama_kategori;
        selectElement.appendChild(option);
      });
    } else {
      console.error('Failed to fetch categories:', result.message);
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}
// Call the function to populate categories on page load
document.addEventListener('DOMContentLoaded', populateCategories);

// Function to populate contributor selects from the API
async function populateContributors() {
  try {
    // Retrieve JWT from cookies
    const jwt = getJwtFromCookies();

    // Check if token exists
    if (!jwt) {
      throw new Error('No JWT token found');
    }

    // Fetch contributors from the API
    const response = await fetch(`${BASE_URL}/users/AllDosen?page=1&pageSize=10`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Response Status:', response.status);

    // Check if response is ok
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('API Response:', result);

    // Check if the response contains the expected data
    if (result.message === "Success fetch lecturers" && result.data) {
      // Store the contributors in a variable
      window.contributors = result.data;

      // Get the select elements
      const select1 = document.getElementById('namaKontributor');
      const select2 = document.getElementById('namaKontributor2');
      
      console.log('Select Elements:', { select1, select2 });

      // Clear existing options
      select1.innerHTML = '<option value="" disabled selected>Pilih nama kontributor / anggota...</option>';
      
      // Create and append new options for each contributor
      result.data.forEach(contributor => {
        // console.log('Adding Contributor:', contributor);

        const option = document.createElement('option');
        option.value = contributor.dosen_id; // Use correct field
        option.textContent = contributor.nama_dosen; // Use correct field
        select1.appendChild(option);

        // Add options to the second select as well
        const option2 = option.cloneNode(true);
        select2.appendChild(option2);
      });
    } else {
      console.error('Unexpected response format:', result);
    }
  } catch (error) {
    console.error('Error fetching contributors:', error);
  }
}

// Function to add new select fields dynamically
function addSelectField() {
  const container = document.getElementById('additionalContributors');

  // Create new select element
  const newSelect = document.createElement('select');
  newSelect.classList.add('dynamic-select');
  newSelect.required = true; // Add required attribute
  
  // Create default option
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.textContent = 'Pilih nama kontributor / anggota...';
  
  newSelect.appendChild(defaultOption);

  const selectedValues = new Set();

  // Collect selected values from all selects
  const allSelects = document.querySelectorAll('select');
  allSelects.forEach(select => {
    const selectedOption = select.querySelector('option:checked');
    if (selectedOption && selectedOption.value) {
      selectedValues.add(selectedOption.value);
    }
  });

  // Add options to the new select, excluding selected ones
  window.contributors.forEach(contributor => {
    if (!selectedValues.has(contributor.dosen_id)) {
      const option = document.createElement('option');
      option.value = contributor.dosen_id;
      option.textContent = contributor.nama_dosen;
      newSelect.appendChild(option);
    }
  });

  // Create container for select and delete button
  const selectContainer = document.createElement('div');
  selectContainer.classList.add('select-container');
  selectContainer.appendChild(newSelect);

  // Create delete button
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'X';
  deleteButton.classList.add('delete-button');
  deleteButton.addEventListener('click', () => {
    container.removeChild(selectContainer);
  });

  // Append delete button to container
  selectContainer.appendChild(deleteButton);

  // Append new select to the container
  container.appendChild(selectContainer);

  // Log the new select
  console.log('New Select:', newSelect);
}

// Function to gather selected contributor IDs and format them
function getSelectedKontributors() {
  const selects = document.querySelectorAll('select');
  const selectedKontributors = Array.from(selects).flatMap(select => 
    Array.from(select.querySelectorAll('option:checked')).map(option => option.value)
  );

  // Log the selected contributors
  // console.log('Selected Kontributors:', selectedKontributors);

  // Return as comma-separated string
  return selectedKontributors.join(',');
}

// Call populateContributors when the page loads or at the appropriate time
document.addEventListener('DOMContentLoaded', populateContributors);

// Attach event listener to the button
document.getElementById('tambahKontributor').addEventListener('click', addSelectField);




async function fetchData(jwt) {
  try {
    const response = await fetch(`${BASE_URL}/users/detail/`, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Gagal mengambil data dari API');
  }
}

// function gatherSelectedKontributors() {
//   // Map to an array of strings without nesting
//   const kontributorsArray = Array.from(document.querySelectorAll('#namaKontributor option:checked, #namaKontributor2 option:checked'))
//     .map(option => option.value);

//   // Log the result
//   console.log('Kontributors Array:', kontributorsArray);
  
//   return kontributorsArray;
// }




let filesArray = []; // Array untuk melacak file yang dipilih

async function setupFormSubmission(jwt) {
  document.getElementById('submitForm').addEventListener('submit', async event => {
    event.preventDefault();

    // Kumpulkan data form
    const formData = new FormData(document.getElementById('submitForm'));

    // Kumpulkan kontributor yang dipilih sebagai array
    const kontributorsArray = Array.from(document.querySelectorAll('#namaKontributor option:checked, .dynamic-select option:checked'))
      .map(option => option.value);

    // Buat objek data dengan nilai form
    const data = {
      title: formData.get('title'),
      title_eng: formData.get('title_eng'),
      abstract: formData.get('abstract'),
      abstract_eng: formData.get('abstract_eng'),
      url_research: formData.get('url_research'),
      kategori: Array.from(document.querySelectorAll('#kategori option:checked')).map(option => option.value).join(',')
    };

    // Siapkan FormData untuk dikirim
    const formDataToSend = new FormData();

    // Tambahkan kontributor sebagai entri multiple dengan kunci yang sama
    kontributorsArray.forEach(kontributor => formDataToSend.append('kontributor[]', kontributor));

    // Tambahkan field data lainnya
    for (const [key, value] of Object.entries(data)) {
      formDataToSend.append(key, value);
    }

    // Tambahkan file dari filesArray
    filesArray.forEach(file => formDataToSend.append('files', file));

    // Log FormData final untuk debugging
    console.log('Final FormData:');
    for (const [key, value] of formDataToSend.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      // Kirim data ke server
      const response = await fetch(`${BASE_URL}/researchs/private/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwt}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server returned error:', errorData);
        throw new Error('Failed to submit data.');
      }

      // Tangani pengiriman yang berhasil
      document.getElementById('submitSuccessMessage').style.display = 'block';
      const responseData = await response.json();
      console.log('Data successfully submitted:', responseData);
      console.log('Files successfully submitted:', filesArray); // Log berhasil untuk files
      window.location.href = '/dashboard/dosen'; // Redirect ke dashboard

    } catch (error) {
      // Tangani error
      console.error('Error:', error.message);
      alert('Failed to submit data. Please try again.');
    }
  });
}

// Fungsi untuk menangani perubahan input file dan menampilkan ikon file
function handleFileInputChange(event) {
  const fileInput = event.target;
  const newFiles = Array.from(fileInput.files);

  // Perbarui filesArray: Ganti file yang ada atau tambahkan yang baru
  newFiles.forEach(newFile => {
    const existingFileIndex = filesArray.findIndex(file => file.name === newFile.name);
    if (existingFileIndex !== -1) {
      filesArray[existingFileIndex] = newFile; // Ganti file yang ada
    } else {
      filesArray.push(newFile); // Tambahkan file baru
    }
  });

  renderFileList(); // Render ulang daftar file
}

// Fungsi untuk merender daftar file dengan ikon dan tindakan
function renderFileList() {
  const fileList = document.getElementById('fileList');
  fileList.innerHTML = ''; // Hapus daftar file yang ada

  filesArray.forEach((file, index) => {
    let fileIcon = '';
    if (file.name.endsWith('.pdf')) {
      fileIcon = '<i class="fa fa-file-pdf" style="color: red;"></i>';
    } else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
      fileIcon = '<i class="fa fa-file-word" style="color: blue;"></i>';
    } else if (file.name.endsWith('.zip') || file.name.endsWith('.rar')) {
      fileIcon = '<i class="fa fa-file-archive" style="color: orange;"></i>';
    } else {
      fileIcon = '<i class="fa fa-file"></i>';
    }

    const fileItem = document.createElement('div');
    fileItem.classList.add('file-item');
    fileItem.innerHTML = `${fileIcon} ${file.name}
      <div class="actions">
        <i class="fa fa-eye preview-file" data-index="${index}"></i>
        <i class="fa fa-times remove-file" data-index="${index}"></i>
      </div>`;
    fileList.appendChild(fileItem);
  });
  console.log('Files successfully rendered:', filesArray); // Log berhasil untuk render file
}

// Pasang event listeners
document.getElementById('fileInput').addEventListener('change', handleFileInputChange);
document.getElementById('fileList').addEventListener('click', event => {
  const index = event.target.getAttribute('data-index');
  if (event.target.classList.contains('remove-file')) {
    filesArray.splice(index, 1); // Hapus file dari filesArray
    renderFileList(); // Render ulang daftar file
  } else if (event.target.classList.contains('preview-file')) {
    const file = filesArray[index];
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, '_blank');
  }
});






function checkUserRoleAndBuildTable(jwt) {
  function checkUserRoleFromJwt(jwt) {
    try {
      const jwtPayload = JSON.parse(atob(jwt.split('.')[1]));
      return jwtPayload.role === 'dosen';
    } catch (error) {
      return false;
    }
  }

  try {
    const isValid = checkUserRoleFromJwt(jwt);
    if (!isValid) {
      window.location.href = '/403';
      return;
    }
  } catch (error) {
  }
}


