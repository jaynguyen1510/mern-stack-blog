import { Button } from 'flowbite-react';
import PropTypes from 'prop-types';

const ButtonComponent = ({ gradientDuoTone, type, children }) => {
    return (
        <Button gradientDuoTone={gradientDuoTone} type={type}>
            {children}
        </Button>
    );
};

ButtonComponent.propTypes = {
    gradientDuoTone: PropTypes.string, // hoặc PropTypes.oneOfType([PropTypes.string, PropTypes.bool]) nếu nó có thể là cả chuỗi hoặc boolean
    type: PropTypes.string,
    children: PropTypes.node,
};

export default ButtonComponent;
