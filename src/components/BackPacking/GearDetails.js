


//alert

import i18n from 'i18next';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebaseChild, updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB } from '../../utils/Constants';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { getGearCategoryNameByID } from '../../utils/ListUtils';
import Alert from '../Alert';
import CommentComponent from '../Comments/CommentComponent';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import ImageComponent from '../ImageUpload/ImageComponent';
import LinkComponent from '../Links/LinkComponent';
import DetailsPage from '../Site/DetailsPage';
import PageTitle from '../Site/PageTitle';
import StarRatingWrapper from '../StarRating/StarRatingWrapper';

import AddGear from './AddGear';

export default function GearDetails() {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.BACKPACKING });
const {
        message,
        showMessage,
        error,
        showError,
        clearMessages,
        showFailure
    } = useAlert();

    //states
    const [showEdit, setShowEdit] = useState(false);

    //params
    const params = useParams();

    //auth
    const { currentUser } = useAuth();

    //fetch data
    const { data: gear, loading } = useFetch(DB.BACKPACKING_GEAR, "", params.id);

    const saveStars = async (stars) => {
        const id = params.id;
        gear["modified"] = getCurrentDateAsJson()
        gear["stars"] = Number(stars);
        updateToFirebaseById(DB.BACKPACKING_GEAR, id, gear);
    }

    const updateGear = async (gear) => {
        try {
            const gearID = params.id;
            gear["modified"] = getCurrentDateAsJson();
            updateToFirebaseById(DB.BACKPACKING_GEAR, gearID, gear);
        } catch (error) {
            showFailure(t('failed_to_save_gear'));
            console.warn(error);
        }
    }

    const addCommentToGear = (comment) => {
        const id = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        pushToFirebaseChild(DB.BACKPACKING_GEAR_COMMENTS, id, comment);
    }

    const addLinkToGear = (link) => {
        const id = params.id;
        link["created"] = getCurrentDateAsJson();
        pushToFirebaseChild(DB.BACKPACKING_GEAR_LINKS, id, link);
    }

    return (
        <DetailsPage
            loading={loading}
            showEditButton={true}
            isEditOpen={showEdit}
            onToggleEdit={() => setShowEdit(!showEdit)}
            title={<PageTitle title={gear?.name} />}
            preSummaryContent={
                <>
                    <div className="detailspage-field">
                        <span className="detailspage-meta-label">{t('category')}:</span>{' '}
                        <span className="detailspage-meta-value">{t(`gear_category_${getGearCategoryNameByID(gear?.category)}`)}</span>
                    </div>
                    <div className="detailspage-field">
                        <span className="detailspage-meta-label">{t('gear_weight_in_grams')}:</span>{' '}
                        <span className="detailspage-meta-value">{gear?.weightInGrams ?? '-'}</span>
                    </div>
                </>
            }
            summary={`${t('description')}: ${gear?.description || '-'}`}
            ratingSection={<StarRatingWrapper stars={gear?.stars} onSaveStars={saveStars} />}
            metaItems={[
                {
                    id: 1,
                    content: <><span className="detailspage-meta-label">{t('created')}:</span> <span className="detailspage-meta-value">{getJsonAsDateTimeString(gear?.created, i18n.language)}</span></>
                },
                {
                    id: 2,
                    content: <><span className="detailspage-meta-label">{t('created_by')}:</span> <span className="detailspage-meta-value">{gear?.createdBy || '-'}</span></>
                },
                {
                    id: 3,
                    content: <><span className="detailspage-meta-label">{t('modified')}:</span> <span className="detailspage-meta-value">{getJsonAsDateTimeString(gear?.modified, i18n.language)}</span></>
                }
            ]}
            editSection={<AddGear onSave={updateGear} gearID={params.id} onClose={() => setShowEdit(false)} />}
            alertSection={
                <Alert
                    message={message}
                    showMessage={showMessage}
                    error={error}
                    showError={showError}
                    onClose={clearMessages}
                />
            }
            imageSection={<ImageComponent url={DB.BACKPACKING_GEAR_IMAGES} objID={params.id} />}
            commentSection={<CommentComponent objID={params.id} url={DB.BACKPACKING_GEAR_COMMENTS} onSave={addCommentToGear} />}
            linkSection={<LinkComponent objID={params.id} url={DB.BACKPACKING_GEAR_LINKS} onSaveLink={addLinkToGear} />}
        />
    )
}


