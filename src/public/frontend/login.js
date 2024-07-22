
document.addEventListener("DOMContentLoaded", () => {
  const jwt = getJwtFromCookies();
  if (jwt) {
    window.location.href = '/home'; // Redirect to home if JWT exists
  }
});

function redirectToLogin() {
  event.preventDefault();
  const BACKEND_BASE_URL = "http://localhost:3000";
  const loginType = document.getElementById("login-type").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const redirectMap = {
    mahasiswa: `/dashboard`,
    dosen: `/dashboard/dosen`,
    prodi: `/dashboard/prodi`,
    fakultas: `/dashboard/fakultas`,
    lppm: `/dashboard/lppm`,
    admin: `/dashboard/fakultas.html`,
  };

  const data = {
    username: username,
    password: password,
  };

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
      const accessToken = data.accessToken;
      setJwtToCookie(accessToken);

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
  const expirationDays = 1;
  const date = new Date();
  date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = `jwt=${token}; ${expires}; path=/`;
}

function getJwtFromCookies() {
  const cookieName = "jwt";
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === cookieName) {
      return value;
    }
  }
  return null;
}
