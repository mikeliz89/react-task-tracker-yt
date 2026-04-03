import { useState } from 'react';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebaseChild, updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB } from '../../utils/Constants';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { getMovementCategoryNameByID } from '../../utils/ListUtils';

import Alert from '../Alert';
import CommentComponent from '../Comments/CommentComponent';
import useFetch from '../Hooks/useFetch';
import ImageComponent from '../ImageUpload/ImageComponent';
import LinkComponent from '../Links/LinkComponent';
import DetailsPage from '../Site/DetailsPage';
import { useAlert } from '../Hooks/useAlert';
import StarRatingWrapper from '../StarRating/StarRatingWrapper';

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

    //auth
    const { currentUser } = useAuth();

    //fetch data
    const { data: movement, loading } = useFetch(DB.EXERCISE_MOVEMENTS, "", params.id);

    const saveStars = async (stars) => {
        const movementID = params.id;
        movement["modified"] = getCurrentDateAsJson();
        movement["stars"] = Number(stars);
        updateToFirebaseById(DB.EXERCISE_MOVEMENTS, movementID, movement);
    }

    const addCommentToMovement = (comment) => {
        const movementID = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        pushToFirebaseChild(DB.EXERCISE_MOVEMENT_COMMENTS, movementID, comment);
    }

    const addLinkToMovement = (link) => {
        const movementID = params.id;
        link["created"] = getCurrentDateAsJson();
        pushToFirebaseChild(DB.EXERCISE_MOVEMENT_LINKS, movementID, link);
    }

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
            ratingSection={<StarRatingWrapper stars={movement?.stars} onSaveStars={saveStars} />}
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
            alertSection={
                <Alert
                    message={message}
                    showMessage={showMessage}
                    error={error}
                    showError={showError}
                    onClose={clearMessages}
                />
            }
            imageSection={<ImageComponent url={DB.EXERCISE_MOVEMENT_IMAGES} objID={params.id} />}
            commentSection={<CommentComponent objID={params.id} url={DB.EXERCISE_MOVEMENT_COMMENTS} onSave={addCommentToMovement} />}
            linkSection={<LinkComponent objID={params.id} url={DB.EXERCISE_MOVEMENT_LINKS} onSaveLink={addLinkToMovement} />}
        />
    )
}
