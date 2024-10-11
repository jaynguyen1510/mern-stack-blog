import ButtonComponent from '../ButtonComponent/ButtonComponent';

const CallToAction = () => {
    return (
        <div className="flex flex-col sm:flex-row p-6 sm:p-10 border-2 border-teal-500 justify-between items-center rounded-tl-3xl rounded-br-3xl text-center bg-white dark:bg-gray-800 dark:text-gray-100 shadow-lg">
            {/* Text section */}
            <div className="flex-1 sm:mr-8 text-left">
                <h2 className="text-3xl font-semibold text-teal-700 dark:text-teal-400 mb-4">
                    Bạn muốn tìm hiểu thêm về thực phẩm bổ sung?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Combo tăng cơ giảm mỡ cùng những loại Whey chuyên dùng
                </p>
                <ButtonComponent
                    gradientDuoTone="purpleToPink"
                    className="rounded-tl-xl rounded-br-none px-6 py-3 text-white"
                >
                    Tìm hiểu thêm
                </ButtonComponent>
            </div>

            {/* Image section */}
            <div className="flex-1 mt-6 sm:mt-0">
                <img
                    className="w-full h-auto object-cover rounded-lg shadow-md"
                    src="https://www.wheystore.vn/images/news/2024/03/25/large/whey-tang-co-giam-mo_1711339064.jpg"
                    alt="Whey tăng cơ giảm mỡ"
                />
            </div>
        </div>
    );
};

export default CallToAction;
