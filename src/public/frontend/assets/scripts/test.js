function myFunction() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        if (td.length > 0) { // Check if the row has table cells
            let rowContainsFilter = false;
            for (let j = 0; j < td.length; j++) {
                txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    rowContainsFilter = true;
                    break;
                }
            }
            if (rowContainsFilter) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const pageInput = document.getElementById("pageInput");
    const tableBody = document.querySelector("tbody");

    let current_page = 1;
    const itemsPerPage = 5;
    let total_pages = 55; // This will be updated based on the data fetched

    async function fetchData(jwt, page, pageSize) {
        try {
            const response = await fetch(
                `http://localhost:3000/finalprojects/private/user/all?page=${page}&pageSize=${pageSize}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    async function buildTable(jwt) {
        tableBody.innerHTML = ""; // Clear table content before loading new data

        try {
            const response = await fetchData(jwt, current_page, itemsPerPage);

            // Check if data property exists and is an array
            if (!response || !Array.isArray(response.data)) {
                console.error("Data fetched is not in the expected format:", response);
                return;
            }
            const data = response.data;
            total_pages = response.totalPages;
            data.forEach((item, index) => {
                const row = `
                    <tr>
                        <td>${(current_page - 1) * itemsPerPage + index + 1}</td>
                        <td>${item.mahasiswa.nim}</td>
                        <td>${item.mahasiswa.nama_mahasiswa}</td>
                        <td>${item.title}</td>
                        <td>${item.kontributor}</td>
                        <td>${item.prodi.nama_prodi}</td>
                        <td>${item.fakulta.nama_fakultas}</td>
                        <td>${item.submissionDate ? new Date(item.submissionDate).toLocaleDateString("en-US") : "-"}</td>
                        <td>${item.updatedAt ? new Date(item.updatedAt).toLocaleDateString("en-US") : "-"}</td>   
                        <td>${item.status}</td>
                        <td>
                            <button class="view-btn" data-project-id="${item.project_id}" onclick="viewDetails('${item.project_id}')">
							<img src="/src/public/frontend/assets/image/eye.png" alt="Delete"></button>
                           <button class="delete-btn" data-project-id="${item.project_id}" onclick="deleteProject('${item.project_id}')">
                		<img src="/src/public/frontend/assets/image/trash.png" alt="Delete"></button>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });

            const viewButtons = document.querySelectorAll(".view-btn");
            viewButtons.forEach((button) => {
                button.addEventListener("mouseover", () => {
                    const projectId = button.getAttribute("data-project-id");
                    button.setAttribute("title", `Project ID: ${projectId}`);
                });
            });

            updateButtons();
        } catch (error) {
            console.error("Error fetching data:", error);
            // Handle error as needed, such as displaying a message to the user
        }
    }

    function updateButtons() {
        prevBtn.disabled = current_page === 1;
        nextBtn.disabled = current_page === total_pages;
        pageInput.value = current_page;
    }

    prevBtn.addEventListener("click", () => {
        if (current_page > 1) {
            current_page--;
            buildTable(getJwtFromCookies());
        }
    });

    nextBtn.addEventListener("click", () => {
        if (current_page < total_pages) {
            current_page++;
            buildTable(getJwtFromCookies());
        }
    });

    pageInput.addEventListener("change", (e) => {
        let inputPage = parseInt(e.target.value);
        if (inputPage > 0 && inputPage <= total_pages) {
            current_page = inputPage;
            buildTable(getJwtFromCookies());
        } else {
            // Reset the input to the current page if the value is invalid
            pageInput.value = current_page;
        }
    });



    // Function to handle delete button click
    async function deleteProject(projectId) {
        try {
            const confirmed = confirm("Are you sure you want to delete this project?");
            if (!confirmed) {
                return;
            }

            const jwt = getJwtFromCookies(); // Assuming you have a function to get JWT from cookies
            const response = await fetch(`http://localhost:3000/finalprojects/private/delete/${projectId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to delete project: ${errorMessage}`);
            }

            // Refresh the table after deletion
            await buildTable(jwt);

        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project. Please try again.');
        }
    }

    // Initialize the content
    buildTable(getJwtFromCookies());
});


	
	
	