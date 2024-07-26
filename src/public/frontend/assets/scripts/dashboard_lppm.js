const BASE_URL = 'https://api.digilibs.me'; // Change this as needed for different environments

document.addEventListener('DOMContentLoaded', async function () {
    const jwt = getJwtFromCookies(); // Mendapatkan JWT dari cookies
  
    if (!jwt) {
      window.location.href = '/login';
      return;
    }
  
    const yearSelect = document.getElementById('yearSelect');
    const searchButton = document.getElementById('searchButton');
    const selectedYearSpan = document.getElementById('selectedYear');
    const fakultasNameSpan = document.getElementById('fakultasName');
    let myChart; // Variabel global untuk menyimpan objek Chart.js
  
    // Set default year to the latest year (2023 in this case)
    const defaultYear = '2024';
    yearSelect.value = defaultYear;
    selectedYearSpan.textContent = defaultYear;
  
    // Function untuk mengambil data Final Projects
    async function fetchFinalProjects(selectedYear) {
      const finalProjectsResponse = await fetch(`${BASE_URL}/finalprojects/private/?page=1&pageSize=99999&year=${selectedYear}`, {
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      });
      const finalProjectsData = await finalProjectsResponse.json();
      return finalProjectsData.data || [];
    }
  
    // Function untuk mengambil data Research
    async function fetchResearch(selectedYear) {
      const researchResponse = await fetch(`${BASE_URL}/researchs/private/?page=1&pageSize=99999&year=${selectedYear}`, {
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      });
      const researchData = await researchResponse.json();
      return researchData.data || [];
    }
  
    // Function untuk membuat chart
    function createChart(finalProjects, research, uniqueLabels) {
      const data = {
        labels: uniqueLabels,
        datasets: [
          {
            label: 'Tugas Akhir',
            data: uniqueLabels.map(label => finalProjects.filter(item => item.fakulta.nama_fakultas === label).length),
            backgroundColor: 'rgba(217, 47, 47, 0.9)', // Sesuaikan opacity sesuai kebutuhan visualisasi
          },
          {
            label: 'Penelitian',
            data: uniqueLabels.map(label => research.filter(item => item.fakulta.nama_fakultas === label).length),
            backgroundColor: 'rgba(47, 115, 217, 0.9)', // Sesuaikan opacity sesuai kebutuhan visualisasi
          }
        ]
      };
  
      const config = {
        type: 'bar', 
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false, // Mempertahankan rasio aspek
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: {
                  size: 14, // Sesuaikan ukuran font legend
                }
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false,
            },
            datalabels: {
              display: true,
              color: 'white',
              anchor: 'center',
              align: 'center',
              formatter: function(value, context) {
                  // Mengembalikan string kosong jika nilai 0
                  return value === 0 ? '' : value;
              },
              font: {
                  size: 14 // Sesuaikan ukuran font datalabel
              }
          }
          },
          scales: {
            x: {
              stacked: true,
              ticks: {
                font: {
                  size: 14, // Sesuaikan ukuran font sumbu x
                }
              }
            },
            y: {
              stacked: true,
              ticks: {
                font: {
                  size: 14, // Sesuaikan ukuran font sumbu y
                }
              }
            },
          },
          layout: {
            padding: {
              top: 10, // Sesuaikan padding sesuai kebutuhan
              bottom: 10,
              left: 10,
              right: 10
            }
          }
        },
        plugins: [ChartDataLabels],
      };
  
      const ctx = document.getElementById('myChart').getContext('2d');
      // Hancurkan chart sebelumnya jika sudah ada
      if (myChart) {
        myChart.destroy();
      }
      myChart = new Chart(ctx, config); // Simpan objek chart di variabel global
    }
  
    // Function untuk memuat data dan membuat chart
    async function loadDataAndCreateChart(selectedYear) {
      try {
        // Ambil data Final Projects dan Research
        const finalProjects = await fetchFinalProjects(selectedYear);
        const research = await fetchResearch(selectedYear);
  
        // Mengambil label unik dari nama_fakultas untuk chart labels
        const uniqueLabels = [
          ...new Set([
            ...finalProjects.map(item => item.fakulta.nama_fakultas),
            ...research.map(item => item.fakulta.nama_fakultas)
          ])
        ];
  
        // Memanggil fungsi untuk membuat chart baru
        createChart(finalProjects, research, uniqueLabels);
  
        // Hitung total dokumen dari semua data
        const totalFinalProjects = finalProjects.length;
        const totalResearch = research.length;
        const totalDocuments = totalFinalProjects + totalResearch;
  
        // Masukkan total dokumen ke elemen HTML
        const totalDocumentsElement = document.querySelector('.main-dashboard-title-sub');
        totalDocumentsElement.textContent = `${totalDocuments} Berkas`;
  
      } catch (error) {
        console.error('Error saat memuat data dari API:', error);
      }
    }
  
    // Panggil loadDataAndCreateChart saat halaman dimuat
    await loadDataAndCreateChart(defaultYear);
  
    // Event listener untuk tombol "Cari"
    searchButton.addEventListener('click', async () => {
      const selectedYear = yearSelect.value;
      await loadDataAndCreateChart(selectedYear);
    });
  
    try {
      // Ambil data user menggunakan fungsi fetchData
      const userData = await fetchData(jwt);
      const data = userData.data.data;
  
      // Update elemen HTML dengan data fakultas

  
    } catch (error) {
      console.error('Error saat memuat data dari API:', error);
    }
  });
  
  
  
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
      throw Error('Gagal mengambil data dari API');
    }
  }
  
  