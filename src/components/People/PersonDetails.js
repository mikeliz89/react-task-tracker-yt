import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Row, ButtonGroup, Col, Modal } from 'react-bootstrap';
import i18n from 'i18next';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { TRANSLATION, DB, ICONS, COLORS } from '../../utils/Constants';
import GoBackButton from '../Buttons/GoBackButton';
import CommentComponent from '../Comments/CommentComponent';
import { useAuth } from '../../contexts/AuthContext';
import PageContentWrapper from '../Site/PageContentWrapper';
import { pushToFirebaseChild, updateToFirebaseById } from '../../datatier/datatier';
import Button from '../Buttons/Button';
import AddPerson from './AddPerson';
import Alert from '../Alert';
import LinkComponent from '../Links/LinkComponent';
import ImageComponent from '../ImageUpload/ImageComponent';
import AccordionElement from '../AccordionElement';
import useFetch from '../Hooks/useFetch';
import { useToggle } from '../Hooks/useToggle';
import { useAlert } from '../Hooks/useAlert';

export default function PersonDetails() {

    //params
    const params = useParams();

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.PEOPLE });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //alert
    const {
        message, setMessage,
        showMessage, setShowMessage,
        error, setError,
        showError, setShowError,
        clearMessages,
        showSuccess,
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

    const getAccordionData = () => {
        return [
            { id: 1, name: t('created'), value: getJsonAsDateTimeString(person.created, i18n.language) },
            { id: 2, name: t('created_by'), value: person.createdBy },
            { id: 3, name: t('modified'), value: getJsonAsDateTimeString(person.modified, i18n.language) }
        ];
    }

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        iconName={ICONS.EDIT}
                        text={showEdit ? tCommon('buttons.button_close') : ''}
                        color={showEdit ? COLORS.EDITBUTTON_OPEN : COLORS.EDITBUTTON_CLOSED}
                        onClick={() => toggleShowEdit()} />
                </ButtonGroup>
            </Row>

            <AccordionElement array={getAccordionData()} title={person.name} />

            <Row>
                <Col>
                    {t('description') + ': '} {person.description}
                </Col>
            </Row>

            <Row>
                <Col>
                    {t('birthday') + ': '} {person.birthday}
                </Col>
            </Row>

            <Alert
                message={message}
                showMessage={showMessage}
                error={error}
                showError={showError}
                onClose={clearMessages}
            />

            <Modal show={showEdit} onHide={toggleShowEdit}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_edit_person')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddPerson onSave={updatePerson} personID={params.id}
                        onClose={() => toggleShowEdit()} />
                </Modal.Body>
            </Modal>

            <hr />
            <ImageComponent url={DB.PERSON_IMAGES} objID={params.id} />
            <CommentComponent objID={params.id} url={DB.PERSON_COMMENTS} onSave={addCommentToPerson} />
            <LinkComponent objID={params.id} url={DB.PERSON_LINKS} onSaveLink={addLinkToPerson} />
        </PageContentWrapper>
    )
}