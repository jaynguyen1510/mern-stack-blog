import { Button } from 'flowbite-react';
import PropTypes from 'prop-types';

const ButtonComponent = ({ gradientDuoTone, type, disabled, onClick, children, outline }) => {
    return (
        <Button
            gradientDuoTone={gradientDuoTone}
            type={type}
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
};

export default ButtonComponent;
