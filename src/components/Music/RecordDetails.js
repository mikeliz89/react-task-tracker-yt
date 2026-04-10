import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebaseChild, updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB } from '../../utils/Constants';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { getMusicFormatNameByID } from '../../utils/ListUtils';
import Alert from '../Alert';
import CommentComponent from '../Comments/CommentComponent';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import { useToggle } from '../Hooks/useToggle';
import ImageComponent from '../ImageUpload/ImageComponent';
import LinkComponent from '../Links/LinkComponent';
import DetailsPage from '../Site/DetailsPage';
import StarRatingWrapper from '../StarRating/StarRatingWrapper';

import AddRecord from './AddRecord';

export default function RecordDetails() {

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

    //auth
    const { currentUser } = useAuth();

    //modal
    const { status: showEdit, toggleStatus: toggleShowEdit } = useToggle();

    //fetch data
    const { data: record, loading } = useFetch(DB.MUSIC_RECORDS, "", params.id);

    const updateRecord = async (updateRecordID, record) => {
        try {
            const recordID = params.id;
            record["modified"] = getCurrentDateAsJson();
            updateToFirebaseById(DB.MUSIC_RECORDS, recordID, record);
        } catch (error) {
            showFailure(t('failed_to_save_music'));
            console.warn(error);
        }
    }

    const addCommentToRecord = (comment) => {
        const id = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        pushToFirebaseChild(DB.MUSIC_COMMENTS, id, comment);
    }

    const addLinkToRecord = (link) => {
        const id = params.id;
        link["created"] = getCurrentDateAsJson();
        pushToFirebaseChild(DB.MUSIC_LINKS, id, link);
    }

    const saveStars = async (stars) => {
        const recordID = params.id;
        record["modified"] = getCurrentDateAsJson()
        record["stars"] = Number(stars);
        updateToFirebaseById(DB.MUSIC_RECORDS, recordID, record);
    }

    return (
        <DetailsPage
            loading={loading}
            showEditButton={true}
            isEditOpen={showEdit}
            onToggleEdit={toggleShowEdit}
            title={`${record?.band || ''} ${record?.name || ''}`.trim()}
            preSummaryContent={
                <div className="detailspage-field">
                    <span className="detailspage-meta-label">{t('format')}:</span>{' '}
                    <span className="detailspage-meta-value">{t(`music_format_${getMusicFormatNameByID(record?.format)}`)}</span>
                </div>
            }
            summary={`${t('description')}: ${record?.description || '-'}`}
            ratingSection={<StarRatingWrapper stars={record?.stars} onSaveStars={saveStars} />}
            metaItems={[
                {
                    id: 1,
                    content: <><span className="detailspage-meta-label">{t('created')}:</span> <span className="detailspage-meta-value">{getJsonAsDateTimeString(record?.created, i18n.language)}</span></>
                },
                {
                    id: 2,
                    content: <><span className="detailspage-meta-label">{t('created_by')}:</span> <span className="detailspage-meta-value">{record?.createdBy || '-'}</span></>
                },
                {
                    id: 3,
                    content: <><span className="detailspage-meta-label">{t('modified')}:</span> <span className="detailspage-meta-value">{getJsonAsDateTimeString(record?.modified, i18n.language)}</span></>
                }
            ]}
            editModalTitle={t('modal_header_edit_record')}
            editSection={<AddRecord onSave={updateRecord} recordID={params.id} onClose={toggleShowEdit} />}
            alertSection={
                <Alert
                    message={message}
                    showMessage={showMessage}
                    error={error}
                    showError={showError}
                    onClose={clearMessages}
                />
            }
            imageSection={<ImageComponent url={DB.MUSIC_IMAGES} objID={params.id} />}
            commentSection={<CommentComponent objID={params.id} url={DB.MUSIC_COMMENTS} onSave={addCommentToRecord} />}
            linkSection={<LinkComponent objID={params.id} url={DB.MUSIC_LINKS} onSaveLink={addLinkToRecord} />}
        />
    )
}



