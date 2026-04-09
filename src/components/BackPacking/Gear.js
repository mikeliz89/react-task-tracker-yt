
import { useTranslation } from 'react-i18next';

import { TRANSLATION, NAVIGATION, VARIANTS, COLORS } from "../../utils/Constants";
import { getGearCategoryNameByID } from '../../utils/ListUtils';
import NavButton from '../Buttons/NavButton';
import { useAlert } from '../Hooks/useAlert';
import ListRow from '../Site/ListRow';

import { getIconNameByCategory } from './Categories';

export default function Gear({ gear, onDelete }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.BACKPACKING });
const {
        message,
        showMessage,
        error,
        showError,
        clearMessages
    } = useAlert();

    return (
        <ListRow
            headerLeft={
                <span>
                    <NavButton to={`${NAVIGATION.GEAR}/${gear.id}`} className=""
                        icon={getIconNameByCategory(gear.category)} iconColor={COLORS.LIGHT_GRAY}>
                        {gear.name}
                    </NavButton>
                </span>
            }
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={gear.id}
            alert={{
                message,
                showMessage,
                error,
                showError,
                variant: VARIANTS.SUCCESS,
                onClose: clearMessages,
            }}
            starCount={gear.stars}
        >
            {
                gear.category !== "" ? (
                    <p> {'#' + t('gear_category_' + getGearCategoryNameByID(gear.category))}</p>
                ) : ('')
            }
            <p>{t('gear_weight')}: {gear.weightInGrams} g</p>
        </ListRow>
    )
}



