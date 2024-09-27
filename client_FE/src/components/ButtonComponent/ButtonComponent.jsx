import { Button } from 'flowbite-react';
import PropTypes from 'prop-types';

const ButtonComponent = ({ className, gradientDuoTone, type, disabled, onClick, children, outline, color }) => {
    return (
        <Button
            className={className}
            gradientDuoTone={gradientDuoTone}
            type={type}
            color={color}
            disabled={disabled}
            onClick={onClick} // Xử lý sự kiện nhấn nút
            outline={outline}
        >
            {children}
        </Button>
    );
};

ButtonComponent.propTypes = {
    gradientDuoTone: PropTypes.string, // Chuỗi hoặc boolean nếu cần
    type: PropTypes.string,
    disabled: PropTypes.bool, // Kiểu cho disabled
    onClick: PropTypes.func, // Hàm xử lý nhấn nút
    children: PropTypes.node,
    outline: PropTypes.bool,
    color: PropTypes.string,
    className: PropTypes.string,
};

export default ButtonComponent;
