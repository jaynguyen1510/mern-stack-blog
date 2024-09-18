import { TextInput } from 'flowbite-react';
import PropTypes from 'prop-types';

const InputComponent = ({ id, type, placeholder }) => {
    // const { id, type, placeholder } = props;
    return <TextInput id={id} type={type} placeholder={placeholder} />;
};

InputComponent.propTypes = {
    id: PropTypes.string,
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
};

export default InputComponent;
