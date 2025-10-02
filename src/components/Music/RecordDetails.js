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
import AddRecord from './AddRecord';
import Alert from '../Alert';
import LinkComponent from '../Links/LinkComponent';
import ImageComponent from '../ImageUpload/ImageComponent';
import { getMusicFormatNameByID } from '../../utils/ListUtils';
import StarRatingWrapper from '../StarRating/StarRatingWrapper';
import AccordionElement from '../AccordionElement';
import useFetch from '../useFetch';
import { useToggle } from '../useToggle';

export default function RecordDetails() {

    //params
    const params = useParams();

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_MUSIC });
    const { t: tCommon } = useTranslation(Constants.TRANSLATION_COMMON, {keyPrefix: Constants.TRANSLATION_COMMON});

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //auth
    const { currentUser } = useAuth();

    //modal
    const { status: showEdit, toggleStatus: toggleShowEdit } = useToggle();

    //fetch data
    const { data: record, loading } = useFetch(Constants.DB_MUSIC_RECORDS, "", params.id);

    const updateRecord = async (updateRecordID, record) => {
        try {
            const recordID = params.id;
            record["modified"] = getCurrentDateAsJson();
            updateToFirebaseById(Constants.DB_MUSIC_RECORDS, recordID, record);
        } catch (error) {
            setError(t('failed_to_save_music'));
            setShowError(true);
            console.log(error);
        }
    }

    const addCommentToRecord = (comment) => {
        const id = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        pushToFirebaseChild(Constants.DB_MUSIC_COMMENTS, id, comment);
    }

    const addLinkToRecord = (link) => {
        const id = params.id;
        link["created"] = getCurrentDateAsJson();
        pushToFirebaseChild(Constants.DB_MUSIC_LINKS, id, link);
    }

    const saveStars = async (stars) => {
        const recordID = params.id;
        record["modified"] = getCurrentDateAsJson()
        record["stars"] = Number(stars);
        updateToFirebaseById(Constants.DB_MUSIC_RECORDS, recordID, record);
    }

    const getAccordionData = () => {
        return [
            { id: 1, name: t('created'), value: getJsonAsDateTimeString(record.created, i18n.language) },
            { id: 2, name: t('created_by'), value: record.createdBy },
            { id: 3, name: t('modified'), value: getJsonAsDateTimeString(record.modified, i18n.language) }
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
                        iconName={Constants.ICON_EDIT}
                        text={showEdit ? t('button_close') : ''}
                        color={showEdit ? Constants.COLOR_EDITBUTTON_OPEN : Constants.COLOR_EDITBUTTON_CLOSED}
                        onClick={() => toggleShowEdit()} />
                </ButtonGroup>
            </Row>

            <AccordionElement array={getAccordionData()} title={record.band + ' ' + record.name} />

            <Row>
                <Col>
                    {t('format') + ':'} {t('music_format_' + getMusicFormatNameByID(record.format))}
                </Col>
            </Row>
            <Row>
                <Col>
                    {t('description') + ':'} {record.description}
                </Col>
            </Row>
            <Row>
                <Col>
                    <StarRatingWrapper stars={record.stars} onSaveStars={saveStars} />
                </Col>
            </Row>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant={Constants.VARIANT_SUCCESS}
                onClose={() => { setShowMessage(false); setShowError(false); }}
            />

            <Modal show={showEdit} onHide={toggleShowEdit}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_edit_record')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddRecord onSave={updateRecord} recordID={params.id} onClose={() => toggleShowEdit()} />
                </Modal.Body>
            </Modal>

            <hr />
            <ImageComponent url={Constants.DB_MUSIC_IMAGES} objID={params.id} />
            <CommentComponent objID={params.id} url={Constants.DB_MUSIC_COMMENTS} onSave={addCommentToRecord} />
            <LinkComponent objID={params.id} url={Constants.DB_MUSIC_LINKS} onSaveLink={addLinkToRecord} />
        </PageContentWrapper>
    )
}
