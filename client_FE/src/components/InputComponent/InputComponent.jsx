import { TextInput } from 'flowbite-react';
import PropTypes from 'prop-types';

const InputComponent = ({ id, type, placeholder, onChange, defaultValue }) => {
    return <TextInput id={id} type={type} placeholder={placeholder} onChange={onChange} defaultValue={defaultValue} />;
};

InputComponent.propTypes = {
    id: PropTypes.string,
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    defaultValue: PropTypes.string, // Sửa lại thành defaultValue
};

export default InputComponent;
