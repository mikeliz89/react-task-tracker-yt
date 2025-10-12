import Icon from '../Icon';
import * as Constants from '../../utils/Constants';
import PropTypes from 'prop-types';

export default function EditButton({
    editable,
    setEditable,
    className = Constants.CLASSNAME_EDITBTN,
    icon = Constants.ICON_EDIT,
    color = Constants.COLOR_LIGHT_GRAY,
    style = {},
    fontSize = '1.2em',
    ...props
}) {
    const handleClick = () => {
        setEditable && setEditable(!editable);
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

EditButton.propTypes = {
    editable: PropTypes.bool.isRequired,
    setEditable: PropTypes.func.isRequired,
    className: PropTypes.string,
    icon: PropTypes.string,
    color: PropTypes.string,
    style: PropTypes.object,
    fontSize: PropTypes.string,
};