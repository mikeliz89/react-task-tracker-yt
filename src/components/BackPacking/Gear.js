import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { getGearCategoryNameByID } from '../../utils/ListUtils';
import { TRANSLATION, NAVIGATION, VARIANTS, COLORS } from "../../utils/Constants";
import DeleteButton from '../Buttons/DeleteButton';
import NavButton from '../Buttons/NavButton';
import Alert from '../Alert';
import { getIconNameByCategory } from './Categories';
import StarRating from '../StarRating/StarRating';
import RightWrapper from '../Site/RightWrapper';

export default function Gear({ gear, onDelete }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.BACKPACKING });

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message] = useState('')
    const [showError, setShowError] = useState(false);
    const [error] = useState('');

    return (
        <div className='listContainer'>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant={VARIANTS.SUCCESS} onClose={() => { setShowMessage(false); setShowError(false); }}
            />

            <h5>
                <span>
                    <NavButton to={`${NAVIGATION.GEAR}/${gear.id}`} className=""
                        icon={getIconNameByCategory(gear.category)} iconColor={COLORS.LIGHT_GRAY}>
                        {gear.name}
                    </NavButton>
                </span>
                <RightWrapper>
                    <DeleteButton
                        onDelete={onDelete}
                        id={gear.id}
                    />
                </RightWrapper>
            </h5>
            {
                gear.category !== "" ? (
                    <p> {'#' + t('gear_category_' + getGearCategoryNameByID(gear.category))}</p>
                ) : ('')
            }
            <p>{t('gear_weight')}: {gear.weightInGrams} g</p>

            <StarRating starCount={gear.stars} />
        </div >
    )
}