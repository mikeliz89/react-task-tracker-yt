import i18n from "i18next";
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TRANSLATION, DB } from '../../utils/Constants';
import { getFoodItemCategoryNameByID } from '../../utils/ListUtils';
import useFetch from '../Hooks/useFetch';
import DetailsPage from '../Site/DetailsPage';
import AddFoodItem from './AddFoodItem';
import { getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { useAlert } from '../Hooks/useAlert';
import { updateToFirebaseById } from '../../datatier/datatier';

export default function FoodItemDetails() {
    const params = useParams();
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.RECIPE });
    const [showEdit, setShowEdit] = useState(false);
    const { data: foodItem, loading } = useFetch(DB.FOODITEMS, "", params.id);
    const {
        message, showMessage,
        error, showError,
        clearMessages,
        showFailure
    } = useAlert();

    const updateFoodItem = async (foodItemID, updatedFoodItem) => {
        try {
            const id = typeof foodItemID === 'object' && foodItemID !== null ? foodItemID.id : foodItemID;
            await updateToFirebaseById(DB.FOODITEMS, id, {
                ...updatedFoodItem,
                modified: new Date().toISOString(),
            });
            clearMessages();
            setShowEdit(false);
            return true;
        } catch (error) {
            showFailure(t('save_exception', { ns: TRANSLATION.COMMON }));
            console.warn('updateFoodItem error', error);
            return false;
        }
    };

    return (
        <DetailsPage
            item={foodItem}
            id={params.id}
            dbKey={DB.FOODITEMS}
            loading={loading}
            showEditButton={true}
            isEditOpen={showEdit}
            onToggleEdit={() => setShowEdit(!showEdit)}
            title={foodItem?.name}
            titleSuffix={
                <span className={`details-pill ${foodItem?.haveAtHome === true ? 'details-pill-ready' : 'details-pill-not-ready'}`}>
                    {t('have')}: {foodItem?.haveAtHome === true ? t('yes') : t('no')}
                </span>
            }
            preSummaryContent={<span>{t('fooditem_category')}: {t('fooditem_category_' + getFoodItemCategoryNameByID(foodItem?.category))}</span>}
            summary={foodItem?.description ? `${t('description')}: ${foodItem.description}` : ''}
            metaItems={[
                { id: 1, content: <>{t('created')}: {getJsonAsDateTimeString(foodItem?.created, i18n.language)}</> },
                { id: 2, content: <>{t('created_by')}: {foodItem?.createdBy}</> },
                { id: 3, content: <>{t('modified')}: {getJsonAsDateTimeString(foodItem?.modified, i18n.language)}</> },
                { id: 4, content: <>{t('fooditem_calories')}: {foodItem?.calories}</> }
            ]}
            editSection={<AddFoodItem foodItemID={params.id} onSave={updateFoodItem} onClose={() => setShowEdit(false)} />}
            alertProps={{
                message,
                showMessage,
                error,
                showError,
                onClose: clearMessages
            }}
            imageProps={{
                showImage: true,
                imageUrl: DB.FOODITEM_IMAGES
            }}
            commentProps={{
                showComment: true,
                commentUrl: DB.FOODITEM_COMMENTS
            }}
            linkProps={{
                showLink: true,
                linkUrl: DB.FOODITEM_LINKS
            }}
        />
    );
}
