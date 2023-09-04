import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, ButtonGroup, Col } from 'react-bootstrap';
import i18n from 'i18next';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { getGearCategoryNameByID } from '../../utils/ListUtils';
import * as Constants from '../../utils/Constants';
import GoBackButton from '../Buttons/GoBackButton';
import CommentComponent from '../Comments/CommentComponent';
import { useAuth } from '../../contexts/AuthContext';
import PageContentWrapper from '../Site/PageContentWrapper';
import { pushToFirebaseChild, updateToFirebaseById } from '../../datatier/datatier';
import Button from '../Buttons/Button';
import AddGear from './AddGear';
import Alert from '../Alert';
import LinkComponent from '../Links/LinkComponent';
import ImageComponent from '../ImageUpload/ImageComponent';
import StarRatingWrapper from '../StarRating/StarRatingWrapper';
import AccordionElement from '../AccordionElement';
import useFetch from '../useFetch';

export default function GearDetails() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_BACKPACKING, { keyPrefix: Constants.TRANSLATION_BACKPACKING });

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //states
    const [showEdit, setShowEdit] = useState(false);

    //params
    const params = useParams();

    //navigation
    const navigate = useNavigate();

    //auth
    const { currentUser } = useAuth();

    //fetch data
    const { data: gear, loading } = useFetch(Constants.DB_BACKPACKING_GEAR, "", params.id);

    const saveStars = async (stars) => {
        const id = params.id;
        gear["modified"] = getCurrentDateAsJson()
        gear["stars"] = Number(stars);
        updateToFirebaseById(Constants.DB_BACKPACKING_GEAR, id, gear);
    }

    const updateGear = async (gear) => {
        try {
            const gearID = params.id;
            gear["modified"] = getCurrentDateAsJson();
            updateToFirebaseById(Constants.DB_BACKPACKING_GEAR, gearID, gear);
        } catch (error) {
            setError(t('failed_to_save_gear'));
            setShowError(true);
            console.log(error);
        }
    }

    const addCommentToGear = (comment) => {
        const id = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        pushToFirebaseChild(Constants.DB_BACKPACKING_GEAR_COMMENTS, id, comment);
    }

    const addLinkToGear = (link) => {
        const id = params.id;
        link["created"] = getCurrentDateAsJson();
        pushToFirebaseChild(Constants.DB_BACKPACKING_GEAR_LINKS, id, link);
    }

    const getAccordionData = () => {
        return [
            { id: 1, name: t('gear_weight_in_grams'), value: gear.weightInGrams },
            { id: 2, name: t('created'), value: getJsonAsDateTimeString(gear.created, i18n.language) },
            { id: 3, name: t('created_by'), value: gear.createdBy },
            { id: 4, name: t('modified'), value: getJsonAsDateTimeString(gear.modified, i18n.language) },
            { id: 5, name: t('category'), value: t('gear_category_' + getGearCategoryNameByID(gear.category)) }
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

            <AccordionElement title={gear.name} array={getAccordionData()} />

            <Row>
                <Col>
                    {gear.description}
                </Col>
            </Row>
            <Row>
                <Col>
                    <StarRatingWrapper stars={gear.stars} onSaveStars={saveStars} />
                </Col>
            </Row>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

            {showEdit &&
                <AddGear onSave={updateGear} gearID={params.id} onClose={() => setShowEdit(false)} />
            }

            <hr />
            <ImageComponent url={Constants.DB_BACKPACKING_GEAR_IMAGES} objID={params.id} />
            <CommentComponent objID={params.id} url={Constants.DB_BACKPACKING_GEAR_COMMENTS} onSave={addCommentToGear} />
            <LinkComponent objID={params.id} url={Constants.DB_BACKPACKING_GEAR_LINKS} onSaveLink={addLinkToGear} />
        </PageContentWrapper>
    )
}