// Hàm chuyển đổi thời gian sang múi giờ Đông Dương (ICT)
export const formatDateToICT = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
};

export const categoryChange = (dataCategory) => {
    const categoryMap = {
        workout: 'Tập luyện',
        healthy: 'Sức khỏe',
        worry: 'Lo lắng',
    };

    return categoryMap[dataCategory] || 'Không có chủ đề'; // Trả về giá trị tương ứng hoặc chuỗi rỗng nếu không tìm thấy
};

export const cleanTitle = (title) => {
    return title?.replace(/\s+/g, ' ').trim(); // Thêm return ở đây
};
