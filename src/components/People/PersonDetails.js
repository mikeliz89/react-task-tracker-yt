import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Row, ButtonGroup, Col, Modal } from 'react-bootstrap';
import i18n from 'i18next';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import * as Constants from '../../utils/Constants';
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
import useFetch from '../useFetch';
import { useToggle } from '../useToggle';

export default function PersonDetails() {

    //params
    const params = useParams();

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_PEOPLE, { keyPrefix: Constants.TRANSLATION_PEOPLE });

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //fetch data
    const { data: person, loading } = useFetch(Constants.DB_PEOPLE, "", params.id);

    //auth
    const { currentUser } = useAuth();

    //modal
    const { status: showEdit, toggleStatus: toggleShowEdit } = useToggle();

    const updatePerson = async (person) => {
        try {
            const personID = params.id;
            person["modified"] = getCurrentDateAsJson();
            updateToFirebaseById(Constants.DB_PEOPLE, personID, person);
        } catch (error) {
            setError(t('failed_to_save_person'));
            setShowError(true);
            console.log(error);
        }

        toggleShowEdit();
    }

    const addCommentToPerson = (comment) => {
        const id = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        pushToFirebaseChild(Constants.DB_PEOPLE, id, comment);
    }

    const addLinkToPerson = (link) => {
        const id = params.id;
        link["created"] = getCurrentDateAsJson();
        pushToFirebaseChild(Constants.DB_PEOPLE, id, link);
    }

    const getAccordionData = () => {
        return [
            { id: 1, name: t('created'), value: getJsonAsDateTimeString(person.created, i18n.language) },
            { id: 2, name: t('created_by'), value: person.createdBy },
            { id: 3, name: t('modified'), value: getJsonAsDateTimeString(person.modified, i18n.language) }
        ];
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <PageContentWrapper>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        iconName={Constants.ICON_EDIT}
                        text={showEdit ? t('button_close') : ''}
                        color={showEdit ? Constants.COLOR_EDITBUTTON_OPEN : Constants.COLOR_EDITBUTTON_CLOSED}
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

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant={Constants.VARIANT_SUCCESS}
                onClose={() => { setShowMessage(false); setShowError(false); }}
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
            <ImageComponent url={Constants.DB_PERSON_IMAGES} objID={params.id} />
            <CommentComponent objID={params.id} url={Constants.DB_PERSON_COMMENTS} onSave={addCommentToPerson} />
            <LinkComponent objID={params.id} url={Constants.DB_PERSON_LINKS} onSaveLink={addLinkToPerson} />
        </PageContentWrapper>
    )
}