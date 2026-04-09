

//alert

import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { TRANSLATION, NAVIGATION, VARIANTS, COLORS } from "../../utils/Constants";
import { getGearCategoryNameByID } from '../../utils/ListUtils';
import Alert from '../Alert';
import DeleteButton from '../Buttons/DeleteButton';
import NavButton from '../Buttons/NavButton';
import { useAlert } from '../Hooks/useAlert';
import RightWrapper from '../Site/RightWrapper';
import StarRating from '../StarRating/StarRating';

import { getIconNameByCategory } from './Categories';

export default function Gear({ gear, onDelete }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.BACKPACKING });
const {
        message, setMessage,
        showMessage, setShowMessage,
        error, setError,
        showError, setShowError,
        clearMessages
    } = useAlert();

    return (
        <div className='listContainer'>

            <Alert
                message={message}
                showMessage={showMessage}
                error={error}
                showError={showError}
                variant={VARIANTS.SUCCESS}
                onClose={clearMessages}
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


