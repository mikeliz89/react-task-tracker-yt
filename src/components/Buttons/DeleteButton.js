import Icon from '../Icon';
import * as Constants from '../../utils/Constants';
import PropTypes from 'prop-types';

export default function DeleteButton({
    confirmMessage,
    onDelete,
    id,
    subId,
    className = Constants.CLASSNAME_DELETEBTN,
    icon = Constants.ICON_DELETE,
    color = Constants.COLOR_DELETEBUTTON,
    style = {},
    fontSize = '1.2em',
    ...props
}) {
    const handleClick = () => {
        if (!confirmMessage || window.confirm(confirmMessage)) {
            if (subId !== undefined) {
                onDelete(id, subId);
            } else {
                onDelete(id);
            }
        }
    };

    return (
        <Icon
            name={icon}
            className={className}
            style={{ color, cursor: 'pointer', fontSize, ...style }}
            onClick={handleClick}
            {...props}
        />
    );
}

DeleteButton.propTypes = {
    confirmMessage: PropTypes.string,
    onDelete: PropTypes.func.isRequired,
    id: PropTypes.any,
    className: PropTypes.string,
    icon: PropTypes.string,
    color: PropTypes.string,
    style: PropTypes.object,
    fontSize: PropTypes.string,
};
