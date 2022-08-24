//i18n
import i18n from "i18next";
//utils
import { getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
//react
import { useTranslation } from 'react-i18next';
//icon
import Icon from "../Icon";

function DrinkHistory({ drinkHistory, onDelete }) {

    //translation
    const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

    return (
        <div>
            {getJsonAsDateTimeString(drinkHistory.currentDateTime, i18n.language)}
            <Icon name='times' className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                onClick={() => { if (window.confirm(t('delete_drink_history_confirm_message'))) { onDelete(drinkHistory.id); } }} />
        </div>
    )
}

export default DrinkHistory