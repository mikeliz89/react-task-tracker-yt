import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, ButtonGroup, Col } from 'react-bootstrap';
import i18n from 'i18next';
import { db } from '../../firebase-config';
import { ref, onValue } from 'firebase/database';
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

export default function PersonDetails() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_PEOPLE, { keyPrefix: Constants.TRANSLATION_PEOPLE });

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //states
    const [loading, setLoading] = useState(true);
    const [person, setPerson] = useState({});
    const [showEdit, setShowEdit] = useState(false);

    //params
    const params = useParams();

    //navigation
    const navigate = useNavigate();

    //auth
    const { currentUser } = useAuth();

    //load data
    useEffect(() => {
        const getPerson = async () => {
            await fetchPersonFromFirebase();
        }
        getPerson();
    }, [])

    const fetchPersonFromFirebase = async () => {
        const dbref = ref(db, `${Constants.DB_PEOPLE}/${params.id}`);
        onValue(dbref, (snapshot) => {
            const data = snapshot.val();
            if (data === null) {
                navigate(-1);
            }
            setPerson(data);
            setLoading(false);
        })
    }

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
                        onClick={() => setShowEdit(!showEdit)} />
                </ButtonGroup>
            </Row>

            <AccordionElement array={getAccordionData()} title={person.name} />

            <Row>
                <Col>
                    {person.description}
                </Col>
            </Row>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

            {showEdit &&
                <AddPerson onSave={updatePerson} personID={params.id} onClose={() => setShowEdit(false)} />
            }
            <hr />
            <ImageComponent url={Constants.DB_PERSON_IMAGES} objID={params.id} />
            <CommentComponent objID={params.id} url={Constants.DB_PERSON_COMMENTS} onSave={addCommentToPerson} />
            <LinkComponent objID={params.id} url={Constants.DB_PERSON_LINKS} onSaveLink={addLinkToPerson} />
        </PageContentWrapper>
    )
}