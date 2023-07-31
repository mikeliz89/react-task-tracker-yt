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
import Alert from '../Alert';
import LinkComponent from '../Links/LinkComponent';
import ImageComponent from '../ImageUpload/ImageComponent';
import StarRatingWrapper from '../StarRating/StarRatingWrapper';
import AddBand from './AddBand';
import AccordionElement from '../AccordionElement';

function BandDetails() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_MUSIC, { keyPrefix: Constants.TRANSLATION_MUSIC });

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //states
    const [loading, setLoading] = useState(true);
    const [band, setBand] = useState({});
    const [showEdit, setShowEdit] = useState(false);

    //params
    const params = useParams();

    //navigation
    const navigate = useNavigate();

    //auth
    const { currentUser } = useAuth();

    //load data
    useEffect(() => {
        const getBand = async () => {
            await fetchBandFromFirebase();
        }
        getBand();
    }, [])

    const fetchBandFromFirebase = async () => {
        const dbref = ref(db, `${Constants.DB_MUSIC_BANDS}/${params.id}`);
        onValue(dbref, (snapshot) => {
            const data = snapshot.val();
            if (data === null) {
                navigate(-1);
            }
            setBand(data);
            setLoading(false);
        })
    }

    const updateBand = async (updateBandID, band) => {
        try {
            const bandID = params.id;
            band["modified"] = getCurrentDateAsJson();
            updateToFirebaseById(Constants.DB_MUSIC_BANDS, bandID, band);
        } catch (error) {
            setError(t('failed_to_save_music_band'));
            setShowError(true);
            console.log(error);
        }
    }

    const addCommentToBand = (comment) => {
        const id = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        pushToFirebaseChild(Constants.DB_MUSIC_BAND_COMMENTS, id, comment);
    }

    const addLinkToBand = (link) => {
        const id = params.id;
        link["created"] = getCurrentDateAsJson();
        pushToFirebaseChild(Constants.DB_MUSIC_BAND_LINKS, id, link);
    }

    const saveStars = async (stars) => {
        const bandID = params.id;
        band["modified"] = getCurrentDateAsJson()
        band["stars"] = Number(stars);
        updateToFirebaseById(Constants.DB_MUSIC_BANDS, bandID, band);
    }

    const getAccordionData = () => {
        return [
            { id: 1, name: t('created'), value: getJsonAsDateTimeString(band.created, i18n.language) },
            { id: 2, name: t('created_by'), value: band.createdBy },
            { id: 3, name: t('modified'), value: getJsonAsDateTimeString(band.modified, i18n.language) }
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
                        color={showEdit ? 'red' : 'orange'}
                        onClick={() => setShowEdit(!showEdit)} />
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

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

            {showEdit &&
                <AddBand onSave={updateBand} bandID={params.id} onClose={() => setShowEdit(false)} />
            }
            <hr />
            <ImageComponent url={Constants.DB_MUSIC_BAND_IMAGES} objID={params.id} />
            <CommentComponent objID={params.id} url={Constants.DB_MUSIC_BAND_COMMENTS} onSave={addCommentToBand} />
            <LinkComponent objID={params.id} url={Constants.DB_MUSIC_BAND_LINKS} onSaveLink={addLinkToBand} />
        </PageContentWrapper>
    )
}

export default BandDetails
