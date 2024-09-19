import { TextInput } from 'flowbite-react';
import PropTypes from 'prop-types';

const InputComponent = ({ id, type, placeholder, onChange }) => {
    return <TextInput id={id} type={type} placeholder={placeholder} onChange={onChange} />;
};

InputComponent.propTypes = {
    id: PropTypes.string,
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
};

export default InputComponent;
