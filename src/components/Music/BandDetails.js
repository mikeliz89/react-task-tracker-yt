import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Row, ButtonGroup, Col } from 'react-bootstrap';
import i18n from 'i18next';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { TRANSLATION, DB, ICONS, COLORS, VARIANTS } from '../../utils/Constants';
import GoBackButton from '../Buttons/GoBackButton';
import CommentComponent from '../Comments/CommentComponent';
import { useAuth } from '../../contexts/AuthContext';
import PageContentWrapper from '../Site/PageContentWrapper';
import { pushToFirebaseChild, updateToFirebaseById } from '../../datatier/datatier';
import Button from '../Buttons/Button';
import Alert from '../Alert';
import LinkComponent from '../Links/LinkComponent';
import ImageComponent from '../ImageUpload/ImageComponent';
import StarRatingWrapper from '../StarRating/StarRatingWrapper';
import AddBand from './AddBand';
import AccordionElement from '../AccordionElement';
import useFetch from '../Hooks/useFetch';
import { Modal } from 'react-bootstrap';
import { useToggle } from '../Hooks/useToggle';
import { useAlert } from '../Hooks/useAlert';

export default function BandDetails() {

    //params
    const params = useParams();

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MUSIC });
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

    //modal
    const { status: showEdit, toggleStatus: toggleShowEdit } = useToggle();

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

    const getAccordionData = () => {
        return [
            { id: 1, name: t('created'), value: getJsonAsDateTimeString(band.created, i18n.language) },
            { id: 2, name: t('created_by'), value: band.createdBy },
            { id: 3, name: t('modified'), value: getJsonAsDateTimeString(band.modified, i18n.language) }
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

            <AccordionElement array={getAccordionData()} title={band.name} />

            <Row>
                <Col>
                    {t('description') + ':'} {band.description}
                </Col>
            </Row>
            <Row>
                <Col>
                    <StarRatingWrapper stars={band.stars} onSaveStars={saveStars} />
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
                    <Modal.Title>{t('modal_header_edit_band')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddBand onSave={updateBand} bandID={params.id} onClose={() => toggleShowEdit()} />
                </Modal.Body>
            </Modal>

            <hr />
            <ImageComponent url={DB.MUSIC_BAND_IMAGES} objID={params.id} />
            <CommentComponent objID={params.id} url={DB.MUSIC_BAND_COMMENTS} onSave={addCommentToBand} />
            <LinkComponent objID={params.id} url={DB.MUSIC_BAND_LINKS} onSaveLink={addLinkToBand} />
        </PageContentWrapper>
    )
}