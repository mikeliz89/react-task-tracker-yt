import Icon from '../Icon';
import * as Constants from '../../utils/Constants';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export default function DeleteButton({
    confirmMessage,
    onDelete,
    id,
    subId,
    skipConfirm,
    className = Constants.CLASSNAME_DELETEBTN,
    icon = Constants.ICON_DELETE,
    color = Constants.COLOR_DELETEBUTTON,
    style = {},
    fontSize = '1.2em',
    ...props
}) {

    const { t: tCommon } = useTranslation(Constants.TRANSLATION_COMMON, { keyPrefix: Constants.TRANSLATION_COMMON });

    const handleClick = () => {
        const message = confirmMessage || tCommon('confirm.areyousure');
        if (skipConfirm || window.confirm(message)) {
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

DeleteButton.defaultProps = {
    skipConfirm: false,
    confirmMessage: '',
};

DeleteButton.propTypes = {
    confirmMessage: PropTypes.string,
    onDelete: PropTypes.func.isRequired,
    id: PropTypes.any,
    className: PropTypes.string,
    icon: PropTypes.string,
    color: PropTypes.string,
    style: PropTypes.object,
    fontSize: PropTypes.string,
    skipConfirm: PropTypes.bool,
};
