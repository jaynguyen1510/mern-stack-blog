import CallToAction from '../components/CallToAction/CallToAction';

const ProjectPage = () => {
    return (
        <div className="container mx-auto p-6">
            {/* Tiêu đề */}
            <h1 className="text-4xl font-bold mb-4 text-center">Lịch Tập</h1>

            {/* Mô tả giới thiệu */}
            <p className="text-lg text-gray-700 mb-8 text-center">
                Trang Lịch Tập của chúng tôi cung cấp kế hoạch tập luyện chi tiết, giúp bạn theo dõi và cải thiện sức
                khỏe hàng ngày. Tại đây, bạn có thể xem lịch biểu tập hàng tuần, cập nhật tiến độ và nhận những lời
                khuyên bổ ích từ các chuyên gia.
            </p>
            <CallToAction />
        </div>
    );
};

export default ProjectPage;
