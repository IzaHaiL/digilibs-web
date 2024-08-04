document.addEventListener("DOMContentLoaded", () => {
  const jwt = getJwtFromCookies();
  if (jwt) {
    redirectBasedOnRole(jwt);
  }
});

function redirectToLogin(event) {
  event.preventDefault(); // Mencegah form submit

  const BACKEND_BASE_URL = "https://digilibs-api-pzhmw.ondigitalocean.app";
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const data = {
    username: username,
    password: password,
  };

  fetch(`${BACKEND_BASE_URL}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorData) => {
          alert("Login gagal: " + errorData.error);
          throw new Error(errorData.error);
        });
      }
      return response.json();
    })
    .then((data) => {
      const accessToken = data.token; // Ubah ke data.token jika sesuai
      console.log("Access token diterima:", accessToken);
      setJwtToCookie(accessToken);
      redirectBasedOnRole(accessToken);
    })
    .catch((error) => {
      console.error("Kesalahan login:", error);
      showErrorLog("Kesalahan login: " + error.message);
      alert("Login gagal. Silakan coba lagi.");
    });

  return false; // Mencegah form submit
}

function setJwtToCookie(token) {
  const expirationDays = 1;
  const date = new Date();
  date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = `jwt=${token}; ${expires}; path=/`;
  console.log("JWT disetel di cookie:", token);
}

function getJwtFromCookies() {
  const cookieName = "jwt";
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === cookieName) {
      console.log("JWT ditemukan di cookie:", value);
      return value;
    }
  }
  console.log("JWT tidak ditemukan di cookie");
  return null;
}

function redirectBasedOnRole(jwt) {
  try {
    if (!jwt) {
      throw new Error("JWT tidak ditemukan.");
    }
    const payloadPart = jwt.split('.')[1];
    if (!payloadPart) {
      throw new Error("Payload JWT tidak valid.");
    }
    const payload = JSON.parse(atob(payloadPart));
    console.log("Payload JWT:", payload);

    const roles = payload && payload.roles ? payload.roles : [];
    const role = roles.length > 0 ? roles[0].toLowerCase() : null;
    console.log("Role:", role);

    if (!role) {
      throw new Error("Role tidak ditemukan dalam JWT.");
    }

    const redirectMap = {
      mahasiswa: `/dashboard`,
      dosen: `/dashboard/dosen`,
      prodi: `/dashboard/prodi`,
      fakultas: `/dashboard/fakultas`,
      lppm: `/dashboard/lppm`,
      admin: `/dashboard/admin`,
    };

    if (redirectMap.hasOwnProperty(role)) {
      console.log("Mengalihkan ke:", redirectMap[role]);
      window.location.href = redirectMap[role];
    } else {
      throw new Error("Tipe login tidak valid.");
    }
  } catch (error) {
    console.error("Kesalahan saat mengarahkan berdasarkan peran:", error);
    alert("Terjadi kesalahan saat mengarahkan berdasarkan peran.");
  }
}


