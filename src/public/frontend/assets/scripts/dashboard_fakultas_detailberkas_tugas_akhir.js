$(document).ready(function() {
  const BASE_URL = 'https://digilibs-api-pzhmw.ondigitalocean.app'; // Update as necessary
  let filesArray = [];
  let deleteIdArray = []; // Array of file IDs to be deleted
  console.log('filesArray:', filesArray);
  console.log('deleteIdArray:', deleteIdArray);


  let originalFilesArray = [];
  let originalContributors = [];
  let originalCategories = [];
  let originalData = {}; // Store the original data
  let jwt = getJwtFromCookies();
  let urlParams = new URLSearchParams(window.location.search);
  let id = urlParams.get('id');
  let kontributor = []; // Inisialisasi sebagai array kosong
  let kategori = [];    // Inisialisasi sebagai array kosong


  fetchProjectDetails(id);


  function fetchProjectDetails(projectId) {
    $.ajax({
      url: `${BASE_URL}/document/tugas-akhir/id/${projectId}`,
      type: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`
      },
      success: function(response) {
        originalData = response; // Store the original data
        console.log(response);
        populateFormFields(response);
      },
      error: function(xhr) {
        console.error('Error fetching project details:', xhr);
        alert('Gagal mengambil detail project. Silakan coba lagi.');
      }
    });
  }

  function populateFormFields(data) {
      $('#status').val(data.BelongsToDokumenStatusDokumen.nama_status);
    $('#judul').val(data.judul);
    $('#judul_inggris').val(data.judul_inggris);
    $('#konten').val(data.DokumenAbstrak.konten);
    $('#konten_inggris').val(data.DokumenAbstrak.konten_inggris);
    $('#url').val(data.url);
    populateContributors(data.DokumenKontributor);
    populateCategories(data.BelongsToManyDokumenKategori);
    populateStatus(data.BelongsToDokumenStatusDokumen);

    // Render file list
    // Render file list
    if (data.BelongsToManyDokumenBerkas && Array.isArray(data.BelongsToManyDokumenBerkas)) {
      originalFilesArray = data.BelongsToManyDokumenBerkas.map(BelongsToManyDokumenBerkas => ({
        id: BelongsToManyDokumenBerkas.id,
        name: BelongsToManyDokumenBerkas.nama_berkas,
        url: BelongsToManyDokumenBerkas.url
      }));
      filesArray = [...originalFilesArray];
      renderFileList(); // Render file list
    }
  }

  function populateContributors(contributors) {
    console.log(contributors)
    kontributor = contributors.map(item => ({ id: item.DokumenKontributorDosen.user_id })); // Inisialisasi kontributor
  
    const $field = $('#namaKontributor');
    if (contributors && $.isArray(contributors)) {
      $.each(contributors, function(index, item) {
        console.log()
        const text = `${item.DokumenKontributorDosen.DosenUsers.UsersDetails.fullName} (${item.DokumenKontributorDosen.nip})`;
        const option = $('<option></option>').val(item.DokumenKontributorDosen.user_id).text(text);
        $field.append(option);
  
        if (index > 0) {
          addSelectField(item.DokumenKontributorDosen.user_id, text);
        }
      });
  
      if (contributors.length > 0) {
        $field.val(contributors[0].DokumenKontributorDosen.user_id);
      }
    } else {
      console.warn('Data kontributor tidak berupa array atau hilang:', contributors);
    }
  
    // Ambil kontributor tambahan
    $.get(`${BASE_URL}/users/dosen`, function(response) {
      const existingOptions = new Set();
      $('#namaKontributor option').each(function() {
        existingOptions.add($(this).val());
      });
  
      response.data.forEach(function(dosen) {
        console.log(dosen)
        const fullName = `${dosen.DosenUsers.UsersDetails.fullName} (${dosen.nip})`;
        if (!existingOptions.has(dosen.user_id)) {
          $('#namaKontributor').append(new Option(fullName, dosen.user_id));
          $('.dynamic-select').append(new Option(fullName, dosen.user_id));
        }
      });
    });
  
    function addSelectField(selectedValue = '', selectedText = '') {
      const container = $('#additionalContributors');
      const newSelect = $('<select></select>').addClass('dynamic-select').prop('required', true);
      const defaultOption = $('<option></option>').val('').prop('disabled', true).prop('selected', true).text('Pilih nama kontributor / anggota...');
  
      newSelect.append(defaultOption);
  
      const selectedValues = new Set();
      $('select').each(function() {
        const selectedOption = $(this).find('option:selected');
        if (selectedOption.val()) {
          selectedValues.add(selectedOption.val());
        }
      });
  
      $('#namaKontributor option').each(function() {
        const value = $(this).val();
        const text = $(this).text();
        if (!selectedValues.has(value)) {
          newSelect.append(new Option(text, value));
        }
      });
  
      if (selectedValue && selectedText) {
        newSelect.val(selectedValue);
        newSelect.find(`option[value="${selectedValue}"]`).text(selectedText);
      }
  
      const selectContainer = $('<div></div>').addClass('select-container').append(newSelect);
      const deleteButton = $('<button></button>').text('X').addClass('delete-button').on('click', function() {
        selectContainer.remove();
      });
  
      selectContainer.append(deleteButton);
      container.append(selectContainer);
    }
  
    $('#tambahKontributor').on('click', function(event) {
      event.preventDefault();
        addSelectField();
      });
    }
  
  function populateCategories(dokumenKategoris) {
    kategori = dokumenKategoris.map(item => ({ id: item.id })); // Initialize kategori
  
    const $field = $('#kategorifield');
    $field.html('<option value="" disabled selected></option>');
  
    if (dokumenKategoris && $.isArray(dokumenKategoris)) {
      $.each(dokumenKategoris, function(index, item) {
        const option = $('<option></option>').val(item.id).text(item.nama_kategori);
        $field.append(option);
      });
  
      if (dokumenKategoris.length > 0) {
        $field.val(dokumenKategoris[0].id);
      }
    } else {
      console.warn('DokumenKategoris data is not an array or is missing:', dokumenKategoris);
    }
  
    $.get(`${BASE_URL}/admin/document-config/kategori`, function(data) {
      console.log(data)
      const selectedValues = new Set();
      $field.find('option').each(function() {
        selectedValues.add($(this).val());
      });
  
      data.forEach(function(kategori) {
        if (!selectedValues.has(kategori.id)) {
          const option = $('<option></option>').val(kategori.id).text(kategori.nama_kategori);
          $field.append(option);
        }
      });
    });
  }

  function populateStatus(dokumenStatus) {
  
    const $field = $('#status');
    $field.html('<option value="" disabled selected></option>');
  
    if (dokumenStatus && typeof dokumenStatus === 'object') {
      const option = $('<option></option>').val(dokumenStatus.id).text(dokumenStatus.nama_status);
      $field.append(option);
      $field.val(dokumenStatus.id);
    } else {
      console.warn('DokumenStatus data is not an object or is missing:', dokumenStatus);
    }
  
    $.get(`${BASE_URL}/admin/document-config/status`, function(data) {
      console.log("Data status yang diterima:", data)
      const selectedValues = new Set();
      $field.find('option').each(function() {
        selectedValues.add($(this).val());
      });
  
      data.forEach(function(status) {
        if (!selectedValues.has(status.id)) {
          const option = $('<option></option>').val(status.id).text(status.nama_status);
          $field.append(option);
        }
      });
    });
  }
  

  function handleFileInputChange(event) {
    const fileInput = event.target;
    const newFiles = Array.from(fileInput.files);

    newFiles.forEach(newFile => {
      const existingFileIndex = filesArray.findIndex(file => file.name === newFile.name);
      if (existingFileIndex !== -1) {
        filesArray[existingFileIndex] = newFile; // Replace existing file
      } else {
        filesArray.push(newFile); // Add new file
      }
    });

    renderFileList(); // Render file list
  }

function renderFileList() {
  const fileList = $('#fileList');
  fileList.empty(); // Clear previous file list

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

    const fileItem = $(`
      <div class="file-item">
        ${fileIcon} ${file.name}
        <div class="actions">
          <i class="fa fa-eye preview-file" data-url="${file.url}"></i>
        </div>
      </div>
    `);
    fileList.append(fileItem);
  });

  $('.preview-file').off('click').on('click', function() {
    const url = $(this).data('url');
    if (url && url.endsWith('.pdf')) {
      showPDFInModal(url);
    }
  });

  $('.remove-file').off('click').on('click', function() {
    const index = $(this).data('index');
    const fileId = $(this).data('id');
    console.log('Index:', index); // Debugging: Cek nilai index
    console.log('File ID:', fileId);
    if (fileId) {
      deleteIdArray.push(fileId); // Add file ID to deleteIdArray
      console.log('deleteIdArray:', deleteIdArray); // Debugging: Cek isi deleteIdArra

    filesArray.splice(index, 1); // Remove the file from filesArray
    renderFileList(); // Render the updated file list
    }
  });
}

  $('#fileInput').on('change', handleFileInputChange);

  function showPDFInModal(url) {
    const modal = $('#pdfModal');
    const modalBody = modal.find('.modal-body');
    const canvas = $('#pdf-canvas')[0];
    const context = canvas.getContext('2d');
    let pdfDoc = null;
    let pageNum = 1;
    let pageRendering = false;
    let pageNumPending = null;
    let scale = 1.5;
  
    function renderPage(num) {
      pageRendering = true;
      pdfDoc.getPage(num).then(page => {
        const viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
  
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        const renderTask = page.render(renderContext);
  
        renderTask.promise.then(() => {
          pageRendering = false;
          if (pageNumPending !== null) {
            renderPage(pageNumPending);
            pageNumPending = null;
          }
        });
      });
  
      $('#pageInfo').text(`Page ${num} of ${pdfDoc.numPages}`);
    }
  
    function queueRenderPage(num) {
      if (pageRendering) {
        pageNumPending = num;
      } else {
        renderPage(num);
      }
    }
  
    function onPrevPage() {
      if (pageNum <= 1) {
        return;
      }
      pageNum--;
      queueRenderPage(pageNum);
    }
  
    function onNextPage() {
      if (pageNum >= pdfDoc.numPages) {
        return;
      }
      pageNum++;
      queueRenderPage(pageNum);
    }
  
    function onZoomIn() {
      scale += 0.25;
      queueRenderPage(pageNum);
    }
  
    function onZoomOut() {
      if (scale > 0.5) {
        scale -= 0.25;
        queueRenderPage(pageNum);
      }
    }
  
    $('#prevPage').on('click', onPrevPage);
    $('#nextPage').on('click', onNextPage);
    $('#zoomIn').on('click', onZoomIn);
    $('#zoomOut').on('click', onZoomOut);
  
    const loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then(pdf => {
      pdfDoc = pdf;
      renderPage(pageNum);
    }).catch(error => {
      console.error('Error loading PDF:', error);
      modalBody.html('<p>Failed to load PDF.</p>');
    });
  
    modal.modal('show');
  }

  
  function getFormData() {
    const formData = new URLSearchParams();
    const selectedStatusId = $('#status option:selected').val();
    if (selectedStatusId) {
      formData.append('status_id', selectedStatusId);
      console.log(selectedStatusId);
    } else {
      console.warn('Status ID tidak dipilih.');
    }
    return formData;
  }
  
  async function updateProjectDetails() {
    const formData = getFormData();
  
    if (!formData.has('status_id')) {
      alert('Status ID tidak boleh kosong.');
      return;
    }

    const confirmed = await new Promise((resolve) => {
      const modalHtml = `
        <div class="modal fade" id="confirmUpdateModal" tabindex="-1" aria-labelledby="confirmUpdateModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="confirmUpdateModalLabel">Konfirmasi Pembaruan</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                Apakah Anda yakin ingin memperbarui data ini?
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                <button type="button" class="btn btn-danger"  id="confirmUpdateButton">Perbarui</button>
              </div>
            </div>
          </div>
        </div>
      `;

      $('body').append(modalHtml);
      const modal = new bootstrap.Modal(document.getElementById('confirmUpdateModal'));
      modal.show();

      $('#confirmUpdateButton').on('click', function() {
        modal.hide();
        resolve(true);
      });

      $('#confirmUpdateModal').on('hidden.bs.modal', function() {
        $(this).remove();
        resolve(false);
      });
    });

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/document/status/${id}`, {
        method: 'PUT',
        headers: {  
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString(),
      }).then(response => {
        console.log('Response:', response);
        return response;
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Gagal memperbarui detail project: ${errorMessage}`);
      }

      localStorage.setItem('toastMessage', 'Berhasil Update Berkas');
      window.location.href = '/dashboard/lppm/daftar/tugasakhir';
    } catch (error) {
      console.error('Error updating project details:', error);
      alert('Gagal memperbarui detail project. Silakan coba lagi.');
    }
  }

  function checkForChanges() {
    const currentContributors = $('#namaKontributor').find('option:selected').map(function() {
      return $(this).val();
    }).get();
  
    const addedContributors = currentContributors.filter(c => !originalContributors.includes(c));
    const removedContributors = originalContributors.filter(c => !currentContributors.includes(c));
  
    // Ensure that currentCategories is always an array
    const currentCategories = $('#kategorifield').val() || [];
    const addedCategories = (Array.isArray(currentCategories) ? currentCategories : []).filter(c => !originalCategories.includes(c));
    const removedCategories = originalCategories.filter(c => !(Array.isArray(currentCategories) ? currentCategories : []).includes(c));
  
    const currentFiles = filesArray.map(file => file.name);
    const originalFiles = originalFilesArray.map(file => file.name);
    const addedFiles = currentFiles.filter(file => !originalFiles.includes(file));
    const removedFiles = originalFiles.filter(file => !currentFiles.includes(file));
  
    return (addedContributors.length > 0 || removedContributors.length > 0 ||
            addedCategories.length > 0 || removedCategories.length > 0 ||
            addedFiles.length > 0 || removedFiles.length > 0);
  }
  
  function toggleSubmitButton() {
    if (checkForChanges()) {
      $('#submitButton').prop('disabled', false);
    } else {
      $('#submitButton').prop('disabled', true);
    }
  }

  // Call toggleSubmitButton on relevant events
  $('#namaKontributor, #kategorifield, #fileInput').on('change', toggleSubmitButton);
  $('form input, form textarea').on('input', toggleSubmitButton);

  $('form').on('submit', function(event) {
    event.preventDefault();
  
    // Define kontributor and kategori before calling getFormData
    kontributor = $('#namaKontributor option:selected').map(function() {
      return { id: $(this).val() };
    }).get();
  
    kategori = $('#kategorifield option:selected').map(function() {
      return { id: $(this).val() };
    }).get();
  
    if (checkForChanges()) {
      updateProjectDetails();
    } else {
      const modalHtml = `
        <div class="modal fade" id="noChangesModal" tabindex="-1" aria-labelledby="noChangesModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="noChangesModalLabel">Tidak Ada Perubahan</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                Tidak ada perubahan yang terdeteksi.
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
              </div>
            </div>
          </div>
        </div>
      `;

      $('body').append(modalHtml);
      const modal = new bootstrap.Modal(document.getElementById('noChangesModal'));
      modal.show();
    }
  });
  
  // Initial call to disable submit button if no changes
  toggleSubmitButton();
});
