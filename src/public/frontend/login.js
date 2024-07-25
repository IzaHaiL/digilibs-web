
document.addEventListener("DOMContentLoaded", () => {
  const jwt = getJwtFromCookies();
  if (jwt) {
    redirectBasedOnRole(jwt);
  }
});

function redirectToLogin() {
  event.preventDefault();
  const BACKEND_BASE_URL = "https://api.digilibs.me";
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

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
        throw new Error("Login gagal");
      }
      return response.json();
    })
    .then((data) => {
      const accessToken = data.accessToken;
      setJwtToCookie(accessToken);
      redirectBasedOnRole(accessToken);
    })
    .catch((error) => {
      console.error("Kesalahan login:", error);
      alert("Login gagal. Silakan coba lagi.");
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

function redirectBasedOnRole(jwt) {
  const payload = JSON.parse(atob(jwt.split('.')[1]));
  const role = payload.role;

  const redirectMap = {
    mahasiswa: `/dashboard`,
    dosen: `/dashboard/dosen`,
    prodi: `/dashboard/prodi`,
    fakultas: `/dashboard/fakultas`,
    lppm: `/dashboard/lppm`,
    admin: `/dashboard/fakultas.html`,
  };

  if (redirectMap.hasOwnProperty(role)) {
    window.location.href = redirectMap[role];
  } else {
    alert("Tipe login tidak valid.");
  }
}
