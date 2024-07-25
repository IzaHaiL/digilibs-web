document.addEventListener("DOMContentLoaded", () => {
  const jwt = getJwtFromCookies(); // Fungsi untuk mendapatkan JWT dari cookies

  if (!jwt) {
    // JWT tidak ditemukan, mungkin lakukan sesuatu seperti redirect ke halaman login
  } else {
    console.log("JWT ditemukan, memuat tabel..."); // Logging untuk debug
  }
});

function getJwtFromCookies() {
  const cookieName = "jwt"; // Ganti dengan nama cookie JWT kamu
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === cookieName) {
      return value;
    }
  }
  return null;
}

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    return null;
  }
}

async function logout() {
  try {
    const jwt = getJwtFromCookies(); // Mendapatkan JWT dari cookie

    // Lakukan logout dengan mengirim request ke backend
    const response = await fetch(`https://api.digilibs.me/users/signout`, {
      method: "POST", // Menggunakan metode POST untuk logout
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // Mengirim body kosong jika tidak ada data yang diperlukan
    });

    if (response.ok) {
      // Handle logout success
      console.log("Logout success");

      // Hapus cookie JWT setelah logout
      await deleteJwtCookie();

      // Tunggu 2 detik sebelum redirect
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Redirect ke halaman login atau halaman lainnya
      window.location.href = '/'; // Ganti dengan halaman login kamu
    } else {
      // Handle logout failure
      console.error("Logout failed");
    }
  } catch (error) {
    console.error("Error logging out:", error);
  }
}

async function deleteJwtCookie() {
  // Set cookie expiration date to past with additional attributes
  document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=www.digilibs.me; SameSite=None; Secure";
  document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=digilibs.me; SameSite=None; Secure";
  document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure";
  document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

  // Optionally, add a log to confirm the deletion
  console.log("JWT cookie deleted");
  // Optionally, log all cookies to check if the jwt cookie is still present
  console.log("All cookies after deletion: ", document.cookie);
  
  // Tunggu 2 detik untuk memastikan cookie benar-benar terhapus
  await new Promise(resolve => setTimeout(resolve, 200));
}