import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { getGearCategoryNameByID } from '../../utils/ListUtils';
import * as Constants from "../../utils/Constants";
import Icon from '../Icon';
import Alert from '../Alert';
import { getIconNameByCategory } from './Categories';
import StarRating from '../StarRating/StarRating';

export default function Gear({ gear, onDelete }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_BACKPACKING });
    const { t: tCommon } = useTranslation(Constants.TRANSLATION_COMMON, {keyPrefix: Constants.TRANSLATION_COMMON});

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message] = useState('')
    const [showError, setShowError] = useState(false);
    const [error] = useState('');

    return (
        <div className='listContainer'>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant={Constants.VARIANT_SUCCESS} onClose={() => { setShowMessage(false); setShowError(false); }}
            />

            <h5>
                <span>
                    <Icon name={getIconNameByCategory(gear.category)} />
                    {gear.name}
                </span>
                <Icon name={Constants.ICON_DELETE} className={Constants.CLASSNAME_DELETEBTN}
                    style={{ color: Constants.COLOR_DELETEBUTTON, cursor: 'pointer', fontSize: '1.2em' }}
                    onClick={() => {
                        if (window.confirm(t('delete_gear_confirm_message'))) {
                            onDelete(gear.id);
                        }
                    }} />
            </h5>
            {gear.category !== "" ? (
                <p> {'#' + t('gear_category_' + getGearCategoryNameByID(gear.category))}</p>
            ) : ('')}
            <p>{t('gear_weight')}: {gear.weightInGrams} g</p>
            <p>
                <Link className='btn btn-primary' to={`${Constants.NAVIGATION_GEAR}/${gear.id}`}>{t('view_details')}</Link>
            </p>
            <StarRating starCount={gear.stars} />
        </div>
    )
}