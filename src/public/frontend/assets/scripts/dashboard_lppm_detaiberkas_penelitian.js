document.addEventListener("DOMContentLoaded", async () => {
    const jwt = getJwtFromCookies();
    if (!jwt) {
        // Redirect to login page if JWT is not available
        window.location.href = "login.html";
        return;
    }

    try {
        // Fetch user details
        const userResponse = await fetch("http://localhost:3000/users/detail/", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });

        if (!userResponse.ok) {
            throw new Error("Failed to fetch user details.");
        }

        // Get research_id from query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const research_id = urlParams.get("research_id");

        if (!research_id) {
            throw new Error("Project ID not found in URL.");
        }

        async function fetchData2(research_id, jwt) {
            try {
                const response = await fetch(
                    `http://localhost:3000/researchs/private/detail/${research_id}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${jwt}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch final project data.");
                }

                const data = await response.json();
                return data;
            } catch (error) {
                console.error("Error fetching data:", error);
                throw new Error("Failed to fetch final project data.");
            }
        }

        const projectData = await fetchData2(research_id, jwt);
        console.log("Data proyek:", projectData);

        // Example of accessing projectData and userData
        const projectData1 = projectData.data;

        // Update your HTML elements with fetched data
        document.getElementById("penulis").value = projectData1.dosen.nama_dosen;
        document.getElementById("nidn").value = projectData1.dosen.nidn;
        document.getElementById("namaKontributor").value = projectData1.kontributor;
        document.getElementById("judulPenelitian").value = projectData1.title;
        document.getElementById("judulPenelitianEng").value = projectData1.title_eng;
        document.getElementById("abstrak").value = projectData1.abstract;
        document.getElementById("abstrakEng").value = projectData1.abstract_eng;
        document.getElementById("urlJurnal").value = projectData1.url_research;
        document.getElementById("status").value = projectData1.status;
        document.getElementById("catatan").value = projectData1.catatan;
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data. Please try again.");
    }

    document.getElementById("submitForm").addEventListener("submit", async (event) => {
        event.preventDefault();

        // Prepare data from form for submission
        const data = {
            status: document.getElementById("status").value,
            catatan: document.getElementById("catatan").value,
        };

        try {
            // Get research_id from query parameter
            const urlParams = new URLSearchParams(window.location.search);
            const research_id = urlParams.get("research_id");

            // Submit data to backend
            const submitResponse = await fetch(
                `http://localhost:3000/researchs/private/update/status/${research_id}`,
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

            document.getElementById("submitSuccessMessage").style.display = "block";
            const responseData = await submitResponse.json();
            console.log("Data successfully submitted:", responseData);
            window.location.href = "dashboard_lppm_daftar_penelitian.html"; // Redirect to success page or as needed
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("Failed to submit data. Please try again.");
        }
    });
});
