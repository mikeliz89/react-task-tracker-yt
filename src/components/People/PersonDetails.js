import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebaseChild, updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB } from '../../utils/Constants';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';

import Alert from '../Alert';
import CommentComponent from '../Comments/CommentComponent';
import useFetch from '../Hooks/useFetch';
import ImageComponent from '../ImageUpload/ImageComponent';
import LinkComponent from '../Links/LinkComponent';
import DetailsPage from '../Site/DetailsPage';
import { useToggle } from '../Hooks/useToggle';
import { useAlert } from '../Hooks/useAlert';

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

    //auth
    const { currentUser } = useAuth();

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

    const addCommentToPerson = (comment) => {
        const id = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        pushToFirebaseChild(DB.PEOPLE, id, comment);
    }

    const addLinkToPerson = (link) => {
        const id = params.id;
        link["created"] = getCurrentDateAsJson();
        pushToFirebaseChild(DB.PEOPLE, id, link);
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
                    <span className="detailspage-meta-value">{person?.birthday || '-'}</span>
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
            alertSection={
                <Alert
                    message={message}
                    showMessage={showMessage}
                    error={error}
                    showError={showError}
                    onClose={clearMessages}
                />
            }
            imageSection={<ImageComponent url={DB.PERSON_IMAGES} objID={params.id} />}
            commentSection={<CommentComponent objID={params.id} url={DB.PERSON_COMMENTS} onSave={addCommentToPerson} />}
            linkSection={<LinkComponent objID={params.id} url={DB.PERSON_LINKS} onSaveLink={addLinkToPerson} />}
        />
    )
}