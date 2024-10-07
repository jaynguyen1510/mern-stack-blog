import { forwardRef } from 'react';
import { TextInput } from 'flowbite-react';
import PropTypes from 'prop-types';

const InputComponent = forwardRef(function InputComponent({ id, hidden, ...rests }, ref) {
    return (
        <TextInput
            id={id}
            maxLength={rests.maxLength}
            accept={rests.accept}
            className={rests.className}
            type={rests.type}
            placeholder={rests.placeholder}
            onChange={rests.onChange}
            defaultValue={rests.defaultValue}
            autoComplete={rests.autocomplete}
            required={rests.required}
            value={rests.value}
            ref={ref}
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
    maxLength: PropTypes.number,
};

export default InputComponent;
