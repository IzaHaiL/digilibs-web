const BASE_URL = 'https://digilibs-api-pzhmw.ondigitalocean.app'; // Change this as needed for different environments


$(document).ready(function() {
  // Fetch and populate kontributor options
  $.get(`${BASE_URL}/users/dosen`, function(response) {
    response.data.forEach(function(dosen) {
      const fullName = dosen.DosenUsers.UsersDetails.fullName  + ' (' + dosen.nip + ')';
      $('#namaKontributor').append(new Option(fullName, dosen.user_id));
      $('.dynamic-select').append(new Option(fullName, dosen.user_id));
    });
  });
  // Fungsi untuk menambahkan select field baru secara dinamis
  function addSelectField() {
    const container = $('#additionalContributors');

    // Buat elemen select baru
    const newSelect = $('<select></select>').addClass('dynamic-select').prop('required', true);
    
    // Buat opsi default
    const defaultOption = $('<option></option>').val('').prop('disabled', true).prop('selected', true).text('Pilih nama kontributor / anggota...');
    
    newSelect.append(defaultOption);

    const selectedValues = new Set();

    // Kumpulkan nilai yang dipilih dari semua select
    $('select').each(function() {
      const selectedOption = $(this).find('option:selected');
      if (selectedOption.val()) {
        selectedValues.add(selectedOption.val());
      }
    });

    // Tambahkan opsi ke select baru, kecuali yang sudah dipilih
    $('#namaKontributor option').each(function() {
      const value = $(this).val();
      const text = $(this).text();
      if (!selectedValues.has(value)) {
        newSelect.append(new Option(text, value));
      }
    });

    // Buat container untuk select dan tombol hapus
    const selectContainer = $('<div></div>').addClass('select-container').append(newSelect);

    // Buat tombol hapus
    const deleteButton = $('<button></button>').text('X').addClass('delete-button').on('click', function() {
      selectContainer.remove();
    });

    selectContainer.append(deleteButton);

    container.append(selectContainer);

  }
  // Pasang event listener ke tombol
  $('#tambahKontributor').on('click', function(event) {
    event.preventDefault();
    addSelectField();
  });



  // Fetch and populate kategori options
  $.get(`${BASE_URL}/admin/document-config/kategori`, function(data) {
    data.forEach(function(kategori) {
      $('#kategori').append(new Option(kategori.nama_kategori, kategori.id));
    });
  });

  // Populate user data
  const jwt = getJwtFromCookies();
  $.ajax({
    url: `${BASE_URL}/users/mahasiswa/detail`,
    type: 'GET',
    headers: {
      Authorization: `Bearer ${jwt}`
    },
    success: function(item) {
      console.log("item",item)
      $('#penulis').val(`${item.MahasiswaUsers.UsersDetails.fullName}`);
      $('#nim').val(item.nim);
    },
    error: function(xhr) {
      console.error('Error fetching user details:', xhr);
      alert('Failed to fetch user details. Please try again.');
    }
  });

  // Handle form submission
  $('#submitForm').on('submit', async function(event) { // Tambahkan async di sini
    event.preventDefault();

    const formData = new FormData(this);
    const kontributor = [];
    const kategori = [];

    // Collect kontributor data
    $('#namaKontributor option:selected').each(function(index) {
      kontributor.push({ [`kontributor[${index}][id]`]: $(this).val() });
    });
    $('.dynamic-select option:selected').each(function(index) {
      kontributor.push({ [`kontributor[${index}][id]`]: $(this).val() });
    });
    // Collect kategori data
    $('#kategori option:selected').each(function(index) {
      kategori.push({ [`kategori[${index}][id]`]: $(this).val() });
    });

    // Append each field to FormData object
    formData.set('judul', formData.get('judul'));
    formData.set('judul_inggris', formData.get('judul_inggris'));
    formData.set('jenis_id', formData.get('jenis_id') || ''); // Optional
    formData.set('status_id', formData.get('status_id') || ''); // Optional
    formData.set('url', formData.get('url'));
    
    // Append kontributor data
    kontributor.forEach(function(item, index) {
      Object.keys(item).forEach(function(key) {
        formData.append(`kontributor[${index}][id]`, item[key]);
      });
    });

    // Append kategori data
    kategori.forEach(function(item, index) {
      Object.keys(item).forEach(function(key) {
        formData.append(`kategori[${index}][id]`, item[key]);
      });
    });

    // Append abstrak data
    formData.append('abstrak[konten]', formData.get('konten'));
    formData.append('abstrak[konten_inggris]', formData.get('konten_inggris'));

    // Log data yang akan dikirim
    console.log('Data kontributor yang akan dikirim:', kontributor);
    console.log('Data kategori yang akan dikirim:', kategori);
    console.log('Data form yang akan dikirim:', formData);

    // Tampilkan konfirmasi sebelum mengirim data
    const confirmed = await new Promise((resolve) => { // Sekarang await bisa digunakan
      const modalHtml = `
        <div class="modal fade" id="confirmSubmitModal" tabindex="-1" aria-labelledby="confirmSubmitModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="confirmSubmitModalLabel">Konfirmasi Pengiriman</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                Apakah Anda yakin ingin mengirim data ini?
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                <button type="button" class="btn btn-danger"  id="confirmSubmitButton">Kirim</button>
              </div>
            </div>
          </div>
        </div>
      `;

      $('body').append(modalHtml);
      const modal = new bootstrap.Modal(document.getElementById('confirmSubmitModal'));
      modal.show();

      $('#confirmSubmitButton').on('click', function() {
        resolve(true);
        modal.hide();
        $('#confirmSubmitModal').remove();
      });

      $('.btn-close, .btn-secondary').on('click', function() {
        resolve(false);
        modal.hide();
        $('#confirmSubmitModal').remove();
      });
    });

    if (!confirmed) {
      return; // Batalkan pengiriman jika pengguna tidak mengonfirmasi
    }

    $.ajax({
      url: `${BASE_URL}/document/tugas-akhir`,
      type: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`
      },
      data: formData,
      processData: false,
      contentType: false,
      success: function(response) {
        localStorage.setItem('toastMessage', 'Berhasil Input Berkas');
        window.location.href = '/dashboard';

        console.log('Data berhasil dikirim:', response);
      },
      error: function(error) {
        console.error('Error submitting form:', error);
        alert('Failed to submit form. Please try again.');
        console.log('Data yang gagal dikirim:', formData);
      }
    });
  });
});


let filesArray = [];

filesArray.forEach(file => formDataToSend.append('files', file));

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

$('input[name="cancelBtn"]').on('click', function(event) {
  event.preventDefault(); 
  window.location.href = '/dashboard'; 
});
$(document).ready(async function() {
  const jwt = getJwtFromCookies();
  function checkUserRoleFromJwt(jwt) {
    try {
      const jwtPayload = JSON.parse(atob(jwt.split('.')[1]));
      const roles = jwtPayload && jwtPayload.roles ? jwtPayload.roles : [];
      return roles.includes('Mahasiswa');
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
    buildTable(jwt);
  } catch (error) {
  }
});
