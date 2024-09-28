import { forwardRef } from 'react';
import { TextInput } from 'flowbite-react';
import PropTypes from 'prop-types';

const InputComponent = forwardRef(function InputComponent(
    { id, type, placeholder, onChange, defaultValue, className, autocomplete, accept, hidden, required },
    ref,
) {
    return (
        <TextInput
            id={id}
            accept={accept}
            className={className}
            type={type}
            placeholder={placeholder}
            onChange={onChange}
            defaultValue={defaultValue}
            autoComplete={autocomplete}
            ref={ref}
            required={required}
            style={{ display: hidden ? 'none' : 'block' }} // Ẩn bằng style
        />
    );
});

InputComponent.propTypes = {
    id: PropTypes.string,
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    defaultValue: PropTypes.string,
    className: PropTypes.string,
    autocomplete: PropTypes.string,
    accept: PropTypes.string,
    hidden: PropTypes.bool, // Thêm hidden vào PropTypes
    required: PropTypes.bool,
};

export default InputComponent;
