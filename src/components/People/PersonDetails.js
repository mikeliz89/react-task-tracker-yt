import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB } from '../../utils/Constants';
import { getCurrentDateAsJson, getJsonAsDateString, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import { useToggle } from '../Hooks/useToggle';
import DetailsPage from '../Site/DetailsPage';

import AddPerson from './AddPerson';

export default function PersonDetails() {

    //params
    const params = useParams();

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.PEOPLE });

    //alert
    const {
        message,
        showMessage,
        error,
        showError,
        clearMessages,
        showFailure
    } = useAlert();

    //fetch data
    const { data: person, loading } = useFetch(DB.PEOPLE, "", params.id);

    //modal
    const { status: showEdit, toggleStatus: toggleShowEdit } = useToggle();

    const updatePerson = async (person) => {
        try {
            const personID = params.id;
            person["modified"] = getCurrentDateAsJson();
            updateToFirebaseById(DB.PEOPLE, personID, person);
        } catch (error) {
            showFailure(t('failed_to_save_person'));
            console.warn(error);
        }

        toggleShowEdit();
    }

    return (
        <DetailsPage
            loading={loading}
            showEditButton={true}
            isEditOpen={showEdit}
            onToggleEdit={toggleShowEdit}
            title={person?.name}
            preSummaryContent={
                <div className="detailspage-field">
                    <span className="detailspage-meta-label">{t('birthday')}:</span>{' '}
                    <span className="detailspage-meta-value">{person?.birthday ? getJsonAsDateString(person.birthday, i18n.language) : '-'}</span>
                </div>
            }
            summary={`${t('description')}: ${person?.description || '-'}`}
            metaItems={[
                {
                    id: 1,
                    content: <><span className="detailspage-meta-label">{t('created')}:</span> <span className="detailspage-meta-value">{getJsonAsDateTimeString(person?.created, i18n.language)}</span></>
                },
                {
                    id: 2,
                    content: <><span className="detailspage-meta-label">{t('created_by')}:</span> <span className="detailspage-meta-value">{person?.createdBy || '-'}</span></>
                },
                {
                    id: 3,
                    content: <><span className="detailspage-meta-label">{t('modified')}:</span> <span className="detailspage-meta-value">{getJsonAsDateTimeString(person?.modified, i18n.language)}</span></>
                }
            ]}
            editModalTitle={t('modal_header_edit_person')}
            editSection={<AddPerson onSave={updatePerson} personID={params.id} onClose={toggleShowEdit} />}
            alertProps={{
                message,
                showMessage,
                error,
                showError,
                onClose: clearMessages
            }}
            imageProps={{
                showImage: true,
                imageUrl: DB.PERSON_IMAGES
            }}
            commentProps={{
                showComment: true,
                commentUrl: DB.PERSON_COMMENTS
            }}
            linkProps={{
                showLink: true,
                linkUrl: DB.PERSON_LINKS
            }}
        />
    )
}


