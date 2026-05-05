import i18n from 'i18next';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB } from '../../utils/Constants';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import DetailsPage from '../Site/DetailsPage';
import PageTitle from '../Site/PageTitle';

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

    return (
        <DetailsPage
            item={band}
            id={params.id}
            dbKey={DB.MUSIC_BANDS}
            loading={loading}
            showEditButton={true}
            isEditOpen={showEdit}
            onToggleEdit={() => setShowEdit(!showEdit)}
            title={band?.name}
            summary={`${t('description')}: ${band?.description || '-'}`}
            metaItems={[
                { id: 1, content: <>{t('created')}: {getJsonAsDateTimeString(band?.created, i18n.language)}</> },
                { id: 2, content: <>{t('created_by')}: {band?.createdBy}</> },
                { id: 3, content: <>{t('modified')}: {getJsonAsDateTimeString(band?.modified, i18n.language)}</> }
            ]}
            editModalTitle={t('modal_header_edit_band')}
            editSection={<AddBand onSave={updateBand} bandID={params.id} onClose={() => setShowEdit(false)} />}
            alertProps={{
                message,
                showMessage,
                error,
                showError,
                onClose: clearMessages
            }}
            imageProps={{
                showImage: true,
                imageUrl: DB.MUSIC_BAND_IMAGES
            }}
            commentProps={{
                showComment: true,
                commentUrl: DB.MUSIC_BAND_COMMENTS
            }}
            linkProps={{
                showLink: true,
                linkUrl: DB.MUSIC_BAND_LINKS
            }}
        />
    )
}


