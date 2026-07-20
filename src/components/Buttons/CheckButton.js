import PropTypes from 'prop-types';

import { COLORS, ICONS } from '../../utils/Constants';
import Icon from '../Icon';

export default function CheckButton({
    checked,
    checkedText = '',
    uncheckedText,
    onCheck,
    onUncheck,
    checkedClassName = 'btn btn-success',
    uncheckedClassName = 'btn btn-danger',
    className,
    iconName = ICONS.CHECK_SQUARE,
    iconColor = COLORS.WHITE,
    iconStyle,
}) {
    const isChecked = !!checked;
    const labelText = isChecked ? checkedText : uncheckedText;

    const handleClick = () => {
        if (isChecked) {
            onUncheck && onUncheck();
            return;
        }
        onCheck && onCheck();
    };

    return (
        <p>
            <span
                onClick={handleClick}
                className={`checkButton-toggle ${className || (isChecked ? checkedClassName : uncheckedClassName)}`.trim()}
                style={{ margin: '0' }}
            >
                {labelText ? <span className='checkButton-label'>{labelText}</span> : null}
                <Icon
                    name={iconName}
                    className='checkButton-icon'
                    color={iconColor}
                    style={{ cursor: 'pointer', fontSize: '1rem', ...iconStyle }}
                />
            </span>
        </p>
    );
}

CheckButton.propTypes = {
    checked: PropTypes.bool,
    checkedText: PropTypes.string,
    uncheckedText: PropTypes.string,
    onCheck: PropTypes.func,
    onUncheck: PropTypes.func,
    checkedClassName: PropTypes.string,
    uncheckedClassName: PropTypes.string,
    className: PropTypes.string,
    iconName: PropTypes.string,
    iconColor: PropTypes.string,
    iconStyle: PropTypes.object,
};
