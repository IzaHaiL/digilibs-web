function redirectToLogin() {
  event.preventDefault();
  const BACKEND_BASE_URL = "http://localhost:3000";
  const FRONTEND_BASE_URL = "http://127.0.0.1:5501";
  // Get form data
  const loginType = document.getElementById("login-type").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Define redirection URLs based on login type
  const redirectMap = {
    mahasiswa: `${FRONTEND_BASE_URL}/src/public/frontend/mahasiswa/dashboard_mahasiswa.html`,
    dosen: `${FRONTEND_BASE_URL}/dosen/dashboard_dosen.html`,
    prodi: `${FRONTEND_BASE_URL}/prodi/dashboard_prodi.html`,
    fakultas: `${FRONTEND_BASE_URL}/fakultas/dashboard_fakultas.html`,
    lppm: `${FRONTEND_BASE_URL}/lppm/dashboard_fakultas.html`,
    admin: `${FRONTEND_BASE_URL}/admin/dashboard_fakultas.html`,
  };

  // Prepare data for POST request
  const data = {
    username: username,
    password: password,
  };

  // Send POST request to server
  fetch(`${BACKEND_BASE_URL}/users/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Login failed");
      }
      return response.json();
    })
    .then((data) => {
      // Handle successful login
      const accessToken = data.accessToken;
      setJwtToCookie(accessToken); // Set JWT token to cookie

      // Redirect based on login type
      if (redirectMap.hasOwnProperty(loginType)) {
        window.location.href = redirectMap[loginType];
      } else {
        alert("Invalid login type selected.");
      }
    })
    .catch((error) => {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    });

  return false;
}

function setJwtToCookie(token) {
  const expirationDays = 1; // Set cookie to expire in 1 day
  const date = new Date();
  date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = `jwt=${token}; ${expires}; path=/`; // Adjust the cookie settings as needed
}
