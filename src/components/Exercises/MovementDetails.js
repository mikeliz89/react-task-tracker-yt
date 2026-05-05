import i18n from 'i18next';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB } from '../../utils/Constants';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { getMovementCategoryNameByID } from '../../utils/ListUtils';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import DetailsPage from '../Site/DetailsPage';

import AddMovement from './AddMovement';

export default function MovementDetails() {

    //states
    const [showEditMovement, setShowEditMovement] = useState(false);

    //alert
    const {
        message,
        showMessage,
        error,
        showError,
        clearMessages,
        showFailure
    } = useAlert();

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.EXERCISES });

    //params
    const params = useParams();

    //fetch data
    const { data: movement, loading } = useFetch(DB.EXERCISE_MOVEMENTS, "", params.id);

    const updateMovement = async (updateMovementID, movement) => {
        try {
            const movementID = params.id;
            movement["modified"] = getCurrentDateAsJson();
            updateToFirebaseById(DB.EXERCISE_MOVEMENTS, movementID, movement);
        } catch (error) {
            showFailure(t('movement_save_exception'));
            console.warn(error);
        }
    }

    return (
        <DetailsPage
            item={movement}
            id={params.id}
            dbKey={DB.EXERCISE_MOVEMENTS}
            loading={loading}
            showEditButton={true}
            isEditOpen={showEditMovement}
            onToggleEdit={() => setShowEditMovement(!showEditMovement)}
            title={movement?.name}
            preSummaryContent={
                <div className="detailspage-field">
                    <span className="detailspage-meta-label">{t('category')}:</span>{' '}
                    <span className="detailspage-meta-value">{t(`movementcategory_${getMovementCategoryNameByID(movement?.category)}`)}</span>
                </div>
            }
            summary={`${t('description')}: ${movement?.description || '-'}`}
            metaItems={[
                {
                    id: 1,
                    content: <><span className="detailspage-meta-label">{t('created')}:</span> <span className="detailspage-meta-value">{getJsonAsDateTimeString(movement?.created, i18n.language)}</span></>
                },
                {
                    id: 2,
                    content: <><span className="detailspage-meta-label">{t('created_by')}:</span> <span className="detailspage-meta-value">{movement?.createdBy || '-'}</span></>
                },
                {
                    id: 3,
                    content: <><span className="detailspage-meta-label">{t('modified')}:</span> <span className="detailspage-meta-value">{getJsonAsDateTimeString(movement?.modified, i18n.language)}</span></>
                }
            ]}
            editSection={<AddMovement movementID={params.id} onClose={() => setShowEditMovement(false)} onSave={updateMovement} />}
            alertProps={{
                message,
                showMessage,
                error,
                showError,
                onClose: clearMessages
            }}
            imageProps={{
                showImage: true,
                imageUrl: DB.EXERCISE_MOVEMENT_IMAGES
            }}
            commentProps={{
                showComment: true,
                commentUrl: DB.EXERCISE_MOVEMENT_COMMENTS
            }}
            linkProps={{
                showLink: true,
                linkUrl: DB.EXERCISE_MOVEMENT_LINKS
            }}
        />
    )
}



