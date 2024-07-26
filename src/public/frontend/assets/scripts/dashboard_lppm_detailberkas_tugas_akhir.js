const BASE_URL = 'https://api.digilibs.me';

document.addEventListener('DOMContentLoaded', async () => {
  const jwt = getJwtFromCookies();
  if (!jwt) {
    window.location.href = 'login.html';
    return;
  }

  try {
    // Fetch user details
    const userResponse = await fetch(`${BASE_URL}/users/detail/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user details.');
    }

    // URL params
    const urlParams = new URLSearchParams(window.location.search);
    const project_id = urlParams.get('project_id');

    if (!project_id) {
      throw new Error('Project ID not found in URL.');
    }

    // Fetch project data
    async function fetchData(project_id, jwt) {
      try {
        const response = await fetch(
          `${BASE_URL}/finalprojects/private/detail/${project_id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${jwt}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch final project data.');
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('Failed to fetch final project data.');
      }
    }

    // Populate form fields
    const projectData = await fetchData(project_id, jwt);
    const projectData1 = projectData.data;

    document.getElementById('penulis').value = projectData1.mahasiswa.nama_mahasiswa || '';
    document.getElementById('catatan').value = projectData1.catatan || '';
    document.getElementById('nim').value = projectData1.mahasiswa.nim || '';
    document.getElementById('namaKontributor').value = projectData1.kontributor || '';
    document.getElementById('judulPenelitian').value = projectData1.title || '';
    document.getElementById('judulPenelitianEng').value = projectData1.title_eng || '';
    document.getElementById('abstrak').value = projectData1.abstract || '';
    document.getElementById('abstrakEng').value = projectData1.abstract_eng || '';
    document.getElementById('urlJurnal').value = projectData1.url_finalprojects || '';
    document.getElementById('status').value = projectData1.status || '';

  } catch (error) {
    console.error('Error:', error);
  }
});

document
.getElementById('submitForm')
.addEventListener('submit', async event => {
  event.preventDefault()

  const submitBtn = event.submitter
  if (submitBtn && submitBtn.name === 'cancelBtn') {
    window.location.href = '/dashboard/lppm/daftar/tugasakhir' 
    return
  }

})

document.addEventListener('DOMContentLoaded', function() {
  const jwt = getJwtFromCookies();

  const statusSelect = document.getElementById('status');
  const catatanTextarea = document.getElementById('catatan');
  const modalStatus = document.getElementById('modalStatus');
  const modalCatatan = document.getElementById('modalCatatan');
  const confirmButton = document.getElementById('confirmButton');
  const confirmCheckbox = document.getElementById('confirmCheckbox');
  const submitForm = document.getElementById('submitForm');
  const submitSuccessMessage = document.getElementById('submitSuccessMessage');

  // Show modal and populate data when clicking "Verifikasi" button
  document.querySelector('[data-bs-target="#staticBackdrop"]').addEventListener('click', function() {
      modalStatus.value = statusSelect.value;
      modalCatatan.value = catatanTextarea.value;
      confirmButton.disabled = !confirmCheckbox.checked;
  });

  // Enable/disable confirm button based on checkbox status
  confirmCheckbox.addEventListener('change', function() {
      confirmButton.disabled = !this.checked;
  });

  // Handle modal confirmation
  document.getElementById('confirmButton').addEventListener('click', async function() {
      if (confirmCheckbox.checked) {
          try {
              // Get project_id from query parameter
              const urlParams = new URLSearchParams(window.location.search);
              const project_id = urlParams.get("project_id");

              // Prepare data from form for submission
              const data = {
                  status: statusSelect.value,
                  catatan: catatanTextarea.value,
              };

              // Submit data to backend
              const submitResponse = await fetch(
                  `${BASE_URL}/finalprojects/private/update/status/${project_id}`,
                  {
                      method: "PUT",
                      headers: {
                          Authorization: `Bearer ${jwt}`,
                          "Content-Type": "application/json",
                      },
                      body: JSON.stringify(data),
                  }
              );

              if (!submitResponse.ok) {
                  throw new Error("Failed to submit data.");
              }

              submitSuccessMessage.style.display = "block";
              const responseData = await submitResponse.json();
              localStorage.setItem('toastMessage', 'Data berhasil diperbarui!');

              console.log("Data successfully submitted:", responseData);
              window.location.href = "/dashboard/lppm/daftar/tugasakhir"; // Redirect to success page or as needed
          } catch (error) {
              console.error("Error submitting data:", error);
              alert("Failed to submit data. Please try again.");
          }
      }
  });

  // Handle form submission to ensure it is not processed when modal is open
  submitForm.addEventListener('submit', function(event) {
      event.preventDefault();
  });
});