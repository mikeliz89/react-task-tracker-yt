import PropTypes from 'prop-types';

import { BUTTON_CLASSNAMES, ICONS, COLORS } from '../../utils/Constants';

import Icon from '../Icon';

export default function EditButton({
    editable,
    setEditable,
    className = BUTTON_CLASSNAMES.EDITBTN,
    icon = ICONS.EDIT,
    color = COLORS.GRAY,
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


