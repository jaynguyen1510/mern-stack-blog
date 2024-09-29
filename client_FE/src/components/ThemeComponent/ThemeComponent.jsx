import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
const ThemeProvider = ({ children }) => {
    const { theme } = useSelector((state) => state.theme);

    return (
        <div className={theme}>
            <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen">
                {children}
            </div>
        </div>
    );
};
// Sử dụng propTypes thay vì prototype
ThemeProvider.propTypes = {
    children: PropTypes.any, // `children` có thể là bất kỳ kiểu dữ liệu nào
};
export default ThemeProvider;
