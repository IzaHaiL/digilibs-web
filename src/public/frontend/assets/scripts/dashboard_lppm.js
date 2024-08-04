const BASE_URL = 'https://digilibs-api-pzhmw.ondigitalocean.app'; // Ubah ini sesuai kebutuhan untuk lingkungan yang berbeda

$(document).ready(function () {
    const ctx = $('#myChart')[0].getContext('2d');
    let myChart; // Variabel untuk menyimpan instance chart

    async function fetchData(year) {
        try {
            const response = await fetch(`${BASE_URL}/document/summary/fakultas/${year}`);
            const jsonData = await response.json();

            const labels = Object.keys(jsonData);
            const tugasAkhirData = labels.map(label => Number(jsonData[label]['Tugas Akhir']) || 0);
            const penelitianData = labels.map(label => Number(jsonData[label]['Penelitian']) || 0);

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
                    backgroundColor: 'rgba(47, 115, 217, 1)',
                    borderColor: 'rgba(54, 162, 235, 1)',
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
                        title: {
                            display: true,
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
                            stacked: true,
                        },
                        y: {
                            stacked: true
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
        $('#selectedYear').text(selectedYear);
        fetchData(selectedYear);
    });

    // Fetch initial data for the default year
    fetchData('2024');
});