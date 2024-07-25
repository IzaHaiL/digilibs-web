const BASE_URL = 'https://api.digilibs.me'; // Change this as needed for different environments

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  if (!projectId) {
    alert('Project ID not found in URL.');
    return;
  }

  let project = null;

  try {
    // Fetch data from finalprojects
    let response = await fetch(`${BASE_URL}/finalprojects/public/detail/${projectId}`);
    if (response.ok) {
      const result = await response.json();
      project = result.data;
    } else {
      // If not found, try fetching from researchs
      response = await fetch(`${BASE_URL}/researchs/public/detail/${projectId}`);
      if (response.ok) {
        const result = await response.json();
        project = result.data;
      }
    }

    if (!project) {
      throw new Error('Failed to fetch project data.');
    }

    // Determine jenis berkas based on project_id or research_id
    let jenisBerkas = '-';
    if (project.project_id) {
      jenisBerkas = 'Tugas Akhir';
    } else if (project.research_id) {
      jenisBerkas = 'Penelitian';
    }

    // Populate the fields with the project data
    document.getElementById('judul').textContent = project.title || '-';
    document.getElementById('penulis').textContent = project.mahasiswa
      ? `${project.mahasiswa.nama_mahasiswa} (${project.mahasiswa.nim})`
      : project.dosen
      ? `${project.dosen.nama_dosen} (${project.dosen.nidn})`
      : '-';

    // Mengubah kontributor menjadi array
    if (Array.isArray(project.kontributor) && project.kontributor.length > 0) {
      document.getElementById('kontributor').textContent = project.kontributor
        .map(kontributor => `${kontributor.nama_dosen} (${kontributor.nidn})`)
        .join(', ');
    } else {
      document.getElementById('kontributor').textContent = '-';
    }

    document.getElementById('jenis-berkas').textContent = jenisBerkas;

    // Mengubah kategori menjadi array
    if (Array.isArray(project.kategori) && project.kategori.length > 0) {
      document.getElementById('kategori').textContent = project.kategori
        .map(kategori => kategori.nama_kategori)
        .join(', ');
    } else {
      document.getElementById('kategori').textContent = '-';
    }

    document.getElementById('fakultas').textContent = project.fakulta
      ? project.fakulta.nama_fakultas
      : '-';
    document.getElementById('program-studi').textContent = project.prodi
      ? project.prodi.nama_prodi
      : '-';
    document.getElementById('tanggal-deposit').textContent = project.createdAt
      ? new Date(project.createdAt).toLocaleDateString('en-US')
      : '-';
    document.getElementById('link-jurnal').textContent =
      project.url_finalprojects || project.url_research || '-';
    document.getElementById('abstrak').textContent = project.abstract || '-';
  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Failed to fetch data. Please try again.');
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  const currentProjectTitle = document
    .getElementById('judul')
    .textContent.trim();

  try {
    const response = await fetch(`${BASE_URL}/finalprojects/public/search?q=${encodeURIComponent(currentProjectTitle)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch projects with similar titles.');
    }

    const result = await response.json();
    let projects = result.data.slice(0, 7); 
    console.log('Projects with similar titles:', projects);

    projects = shuffleArray(projects);

    const projectListElement = document.getElementById('projectlist');
    projectListElement.innerHTML = ''; 

    projects.forEach(project => {
      const linkItem = document.createElement('a');
      linkItem.href = `/home/detail?id=${project.research_id || project.project_id}`;
      linkItem.textContent = project.title;

      const listItem = document.createElement('li');
      listItem.appendChild(linkItem);
      projectListElement.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    alert('Failed to fetch projects. Please try again.');
  }
});

// Function to shuffle array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
