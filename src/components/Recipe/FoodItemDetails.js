import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TRANSLATION, DB } from '../../utils/Constants';
import { getFoodItemCategoryNameByID } from '../../utils/ListUtils';
import useFetchById from '../Hooks/useFetchById';
import DetailsPage from '../Site/DetailsPage';
import AddFoodItem from './AddFoodItem';
import { getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { useAlert } from '../Hooks/useAlert';
import { updateToFirebaseById } from '../../datatier/datatier';

export default function FoodItemDetails(id) {

    const params = useParams();
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.RECIPE });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });
    const foodItem = useFetchById(DB.FOODITEMS, id);
    const [showEdit, setShowEdit] = useState(false);
    const {
        message, showMessage,
        error, showError,
        clearMessages,
        showFailure
    } = useAlert();

    // Päivitä foodItem (toteuta tallennuslogiikka tarvittaessa)

    const updateFoodItem = async (foodItemID, updatedFoodItem) => {
        try {
            await updateToFirebaseById(DB.FOODITEMS, foodItemID, {
                ...updatedFoodItem,
                modified: new Date().toISOString(),
            });
            clearMessages();
            // Voit näyttää onnistumisviestin, jos haluat:
            // showSuccess(tCommon('save_success'));
            setShowEdit(false);
        } catch (error) {
            showFailure(tCommon('save_exception'));
            console.warn(error);
        }
    };

    if (!foodItem) {
        return null;
    }

    return (
        <DetailsPage
            item={foodItem}
            id={params.id}
            dbKey={DB.FOODITEMS}
            title={foodItem.name}
            showEditButton={true}
            isEditOpen={showEdit}
            onToggleEdit={() => setShowEdit(!showEdit)}
            preSummaryContent={<span>{t('fooditem_category')}: {t('fooditem_category_' + getFoodItemCategoryNameByID(foodItem.category))}</span>}
            summary={foodItem.description ? `${t('description')}: ${foodItem.description}` : ''}
            metaItems={[
                { id: 1, content: <>{t('created')}: {getJsonAsDateTimeString(foodItem.created)}</> },
                { id: 2, content: <>{t('created_by')}: {foodItem.createdBy}</> },
                { id: 3, content: <>{t('modified')}: {getJsonAsDateTimeString(foodItem.modified)}</> }
            ]}
            editSection={<AddFoodItem foodItemID={id} onSave={updateFoodItem} onClose={() => setShowEdit(false)} />}
            alertProps={{
                message,
                showMessage,
                error,
                showError,
                onClose: clearMessages
            }}
        >
            <div style={{ marginTop: 16 }}>
                <p>{t('fooditem_calories')}: {foodItem.calories}</p>
                {foodItem.haveAtHome !== undefined && (
                    <p>
                        {foodItem.haveAtHome
                            ? t('fooditem_have_at_home')
                            : t('fooditem_not_have_at_home')}
                    </p>
                )}
            </div>
        </DetailsPage>
    );
}
