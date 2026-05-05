import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB } from '../../utils/Constants';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { getMusicFormatNameByID } from '../../utils/ListUtils';
import Alert from '../Alert';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import { useToggle } from '../Hooks/useToggle';
import DetailsPage from '../Site/DetailsPage';

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

    return (
        <DetailsPage
            item={record}
            id={params.id}
            dbKey={DB.MUSIC_RECORDS}
            loading={loading}
            showEditButton={true}
            isEditOpen={showEdit}
            onToggleEdit={toggleShowEdit}
            title={`${record?.band || ''} ${record?.name || ''}`.trim()}
            titleSuffix={
                <span className={`details-pill ${record?.haveAtHome === true ? 'details-pill-ready' : 'details-pill-not-ready'}`}>
                    {record?.haveAtHome === true
                        ? t('have')
                        : t('have_not')}
                </span>
            }
            preSummaryContent={
                <div className="detailspage-field">
                    <span className="detailspage-meta-label">{t('format')}:</span>{' '}
                    <span className="detailspage-meta-value">{t(`music_format_${getMusicFormatNameByID(record?.format)}`)}</span>
                </div>
            }
            summary={`${t('description')}: ${record?.description || '-'}`}
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
            alertProps={{
                message,
                showMessage,
                error,
                showError,
                onClose: clearMessages,
                alertColLg: 12,
            }}
            imageProps={{
                showImage: true,
                imageUrl: DB.MUSIC_IMAGES
            }}
            commentProps={{
                showComment: true,
                commentUrl: DB.MUSIC_COMMENTS
            }}
            linkProps={{
                showLink: true,
                linkUrl: DB.MUSIC_LINKS
            }}
        />
    )
}



