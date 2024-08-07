const BASE_URL = 'https://digilibs-api-pzhmw.ondigitalocean.app'; // Ubah ini sesuai kebutuhan untuk lingkungan yang berbeda

$(document).ready(function () {
  const ctx = $('#myChart')[0].getContext('2d');
  let myChart; // Variabel untuk menyimpan instance chart

  async function fetchData(year) {
      try {
          const jwt = getJwtFromCookies(); // Ambil JWT dari cookies
          const response = await fetch(`${BASE_URL}/document/summary/prodiname/${year}`, {
              headers: {
                  Authorization: `Bearer ${jwt}`
              }
          });

          // Periksa apakah respons berhasil
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }

          const textData = await response.text();
          console.log('Raw response data:', textData); // Tambahkan log ini

          // Coba parsing JSON hanya jika respons tidak kosong
          const jsonData = textData ? JSON.parse(textData) : {};
          console.log('Data for year', year, ':', jsonData); // Tambahkan log ini

          // Ambil data Tugas_Akhir dan Penelitian dari jsonData
          const labels = ['Tugas Akhir'];
          const tugasAkhirData = [Number(jsonData['Tugas_Akhir']) || 0];
          const penelitianData = [Number(jsonData['Penelitian']) || 0];

          // Hitung total data
          const totalTugasAkhir = tugasAkhirData.reduce((acc, val) => acc + val, 0);
          const totalPenelitian = penelitianData.reduce((acc, val) => acc + val, 0);
          const totalData = totalTugasAkhir + totalPenelitian;

          // Perbarui elemen total data
          $('#totalData').text(`Berkas: ${totalData}`);

          const data = {
              labels: labels,
              datasets: [{
                label: 'Tugas Akhir',
                data: tugasAkhirData,
                backgroundColor: 'rgba(217, 47, 47, 1)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }, {
                label: 'Penelitian',
                data: penelitianData,
                backgroundColor: 'rgba(217, 47, 47, 1)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
              }]
          };

          const config = {
              type: 'bar',
              data: data,
              options: {
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                              size: 14,
                            }
                        }
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
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                      x: {
                          stacked: false,
                      },
                      y: {
                          stacked: false    
                      }
                  }
              },
              plugins: [ChartDataLabels],
          };

          // Hancurkan chart yang ada sebelum membuat yang baru
          if (myChart) {
              myChart.destroy();
          }

          myChart = new Chart(ctx, config);
          $('#myChart').css({ width: '300px', height: '200px' });

      } catch (error) {
          console.error('Error fetching data:', error);
      }
  }

  $('#searchButton').click(function() {
      const selectedYear = $('#yearSelect').val();
      console.log('Selected Year:', selectedYear); // Tambahkan log ini
      $('#selectedYear').text(selectedYear);
      fetchData(selectedYear);
  });

  // Fetch initial data for the default year
  fetchData('2024');
});
$(document).ready(async function() {
    const jwt = getJwtFromCookies();
    function checkUserRoleFromJwt(jwt) {
      try {
        const jwtPayload = JSON.parse(atob(jwt.split('.')[1]));
        const roles = jwtPayload && jwtPayload.roles ? jwtPayload.roles : [];
        return roles.includes('Prodi');
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