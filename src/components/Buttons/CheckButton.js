import PropTypes from 'prop-types';

import { COLORS, ICONS } from '../../utils/Constants';
import Icon from '../Icon';

export default function CheckButton({
    checked,
    checkedText,
    uncheckedText,
    onCheck,
    onUncheck,
    checkedClassName = 'btn btn-success',
    uncheckedClassName = 'btn btn-danger',
    className,
    style,
    iconName = ICONS.CHECK_SQUARE,
    iconColor = COLORS.WHITE,
    iconStyle,
}) {
    const isChecked = !!checked;

    const handleClick = () => {
        if (isChecked) {
            onUncheck && onUncheck();
            return;
        }
        onCheck && onCheck();
    };

    return (
        <span
            onClick={handleClick}
            className={className || (isChecked ? checkedClassName : uncheckedClassName)}
            style={style}
        >
            {isChecked ? checkedText : uncheckedText}&nbsp;
            <Icon
                name={iconName}
                color={iconColor}
                style={{ cursor: 'pointer', fontSize: '1.2em', ...iconStyle }}
            />
        </span>
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
    style: PropTypes.object,
    iconName: PropTypes.string,
    iconColor: PropTypes.string,
    iconStyle: PropTypes.object,
};
