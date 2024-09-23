import PropTypes from 'prop-types';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CircularProgressbarComponent = ({ value, strokeWidth, text, styles }) => {
    return (
        <div>
            <CircularProgressbar
                strokeWidth={strokeWidth}
                value={value}
                text={`${text}%`}
                styles={styles} // Apply styles from buildStyles
            />
        </div>
    );
};

CircularProgressbarComponent.propTypes = {
    value: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    styles: PropTypes.object,
    strokeWidth: PropTypes.number,
};

export default CircularProgressbarComponent;
