import i18n from 'i18next';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebaseChild, updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB } from '../../utils/Constants';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import Alert from '../Alert';
import CommentComponent from '../Comments/CommentComponent';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import ImageComponent from '../ImageUpload/ImageComponent';
import LinkComponent from '../Links/LinkComponent';
import DetailsPage from '../Site/DetailsPage';
import PageTitle from '../Site/PageTitle';
import StarRatingWrapper from '../StarRating/StarRatingWrapper';

import AddBand from './AddBand';

export default function BandDetails() {

    //params
    const params = useParams();

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MUSIC });

    //alert
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

    //auth
    const { currentUser } = useAuth();

    //fetch data
    const { data: band, loading } = useFetch(DB.MUSIC_BANDS, "", params.id);

    const updateBand = async (updateBandID, band) => {
        try {
            const bandID = params.id;
            band["modified"] = getCurrentDateAsJson();
            updateToFirebaseById(DB.MUSIC_BANDS, bandID, band);
        } catch (error) {
            showFailure(t('failed_to_save_music_band'));
            console.warn(error);
        }
    }

    const addCommentToBand = (comment) => {
        const id = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        pushToFirebaseChild(DB.MUSIC_BAND_COMMENTS, id, comment);
    }

    const addLinkToBand = (link) => {
        const id = params.id;
        link["created"] = getCurrentDateAsJson();
        pushToFirebaseChild(DB.MUSIC_BAND_LINKS, id, link);
    }

    const saveStars = async (stars) => {
        const bandID = params.id;
        band["modified"] = getCurrentDateAsJson()
        band["stars"] = Number(stars);
        updateToFirebaseById(DB.MUSIC_BANDS, bandID, band);
    }

    return (
        <DetailsPage
            loading={loading}
            showEditButton={true}
            isEditOpen={showEdit}
            onToggleEdit={() => setShowEdit(!showEdit)}
            title={<PageTitle title={band?.name} />}
            summary={`${t('description')}: ${band?.description || '-'}`}
            ratingSection={<StarRatingWrapper stars={band?.stars} onSaveStars={saveStars} />}
            metaItems={[
                { id: 1, content: <>{t('created')}: {getJsonAsDateTimeString(band?.created, i18n.language)}</> },
                { id: 2, content: <>{t('created_by')}: {band?.createdBy}</> },
                { id: 3, content: <>{t('modified')}: {getJsonAsDateTimeString(band?.modified, i18n.language)}</> }
            ]}
            editModalTitle={t('modal_header_edit_band')}
            editSection={<AddBand onSave={updateBand} bandID={params.id} onClose={() => setShowEdit(false)} />}
            alertSection={
                <Alert
                    message={message}
                    showMessage={showMessage}
                    error={error}
                    showError={showError}
                    onClose={clearMessages}
                />
            }
            imageSection={<ImageComponent url={DB.MUSIC_BAND_IMAGES} objID={params.id} />}
            commentSection={<CommentComponent objID={params.id} url={DB.MUSIC_BAND_COMMENTS} onSave={addCommentToBand} />}
            linkSection={<LinkComponent objID={params.id} url={DB.MUSIC_BAND_LINKS} onSaveLink={addLinkToBand} />}
        />
    )
}


