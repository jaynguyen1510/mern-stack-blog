import { Spinner } from 'flowbite-react';
import PropTypes from 'prop-types';

const LoadingComponent = ({ isLoading, children }) => {
    return (
        isLoading && (
            <div className="flex items-center justify-center">
                <Spinner aria-label="Loading..." />
                {children && <span className="pl-3">{children}</span>}
            </div>
        )
    );
};

// Thêm PropTypes để xác định kiểu của props
LoadingComponent.propTypes = {
    isLoading: PropTypes.bool.isRequired, // isLoading là một prop bắt buộc kiểu boolean
    children: PropTypes.node, // children có thể là bất kỳ nội dung nào
};

export default LoadingComponent;
