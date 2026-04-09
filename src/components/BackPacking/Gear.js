
import { useTranslation } from 'react-i18next';

import { TRANSLATION, NAVIGATION, VARIANTS, COLORS } from "../../utils/Constants";
import { getGearCategoryNameByID } from '../../utils/ListUtils';
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
            headerTitle={gear.name}
            headerTitleTo={`${NAVIGATION.GEAR}/${gear.id}`}
            headerTitleIcon={getIconNameByCategory(gear.category)}
            headerTitleIconColor={COLORS.LIGHT_GRAY}
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



