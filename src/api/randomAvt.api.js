// Base URL
const baseURL = "https://avatar.iran.liara.run/public/";

// Tạo object chứa các URL từ 1 đến 100
const avatarCache = {};

for (let i = 1; i <= 100; i++) {
  avatarCache[i] = `${baseURL}${i}`;
}

// Xuất object để sử dụng trong các file khác
export default avatarCache;
