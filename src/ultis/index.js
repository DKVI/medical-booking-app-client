const ultis = {
  formatDate: (dateString) => {
    const date = new Date(dateString); // Chuyển chuỗi thành đối tượng Date
    const day = String(date.getDate()).padStart(2, "0"); // Lấy ngày (dd)
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Lấy tháng (mm)
    const year = date.getFullYear(); // Lấy năm (yyyy)

    return `${day}-${month}-${year}`; // Trả về chuỗi định dạng dd-mm-yyyy
  },
};

export default ultis;
