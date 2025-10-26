import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Row, ButtonGroup, Col } from 'react-bootstrap';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import i18n from "i18next";
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { getMovementCategoryNameByID } from '../../utils/ListUtils';
import { TRANSLATION, DB, ICONS, COLORS, VARIANTS } from '../../utils/Constants';
import { useAuth } from '../../contexts/AuthContext';
import Alert from '../Alert';
import AddMovement from './AddMovement';
import PageContentWrapper from '../Site/PageContentWrapper';
import { pushToFirebaseChild, updateToFirebaseById } from '../../datatier/datatier';
import LinkComponent from '../Links/LinkComponent';
import CommentComponent from '../Comments/CommentComponent';
import ImageComponent from '../ImageUpload/ImageComponent';
import StarRatingWrapper from '../StarRating/StarRatingWrapper';
import AccordionElement from '../AccordionElement';
import useFetch from '../Hooks/useFetch';
import { useAlert } from '../Hooks/useAlert';

export default function MovementDetails() {

    //states
    const [showEditMovement, setShowEditMovement] = useState(false);

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

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.EXERCISES });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //params
    const params = useParams();

    //auth
    const { currentUser } = useAuth();

    //fetch data
    const { data: movement, loading } = useFetch(DB.EXERCISE_MOVEMENTS, "", params.id);

    const saveStars = async (stars) => {
        const movementID = params.id;
        movement["modified"] = getCurrentDateAsJson();
        movement["stars"] = Number(stars);
        updateToFirebaseById(DB.EXERCISE_MOVEMENTS, movementID, movement);
    }

    const addCommentToMovement = (comment) => {
        const movementID = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        pushToFirebaseChild(DB.EXERCISE_MOVEMENT_COMMENTS, movementID, comment);
    }

    const addLinkToMovement = (link) => {
        const movementID = params.id;
        link["created"] = getCurrentDateAsJson();
        pushToFirebaseChild(DB.EXERCISE_MOVEMENT_LINKS, movementID, link);
    }

    const getAccordionData = () => {
        return [
            { id: 1, name: t('created'), value: getJsonAsDateTimeString(movement.created, i18n.language) },
            { id: 2, name: t('created_by'), value: movement.createdBy },
            { id: 3, name: t('modified'), value: getJsonAsDateTimeString(movement.modified, i18n.language) },
            { id: 4, name: t('category'), value: t('movementcategory_' + getMovementCategoryNameByID(movement.category)) }
        ];
    }

    const updateMovement = async (updateMovementID, movement) => {
        try {
            const movementID = params.id;
            movement["modified"] = getCurrentDateAsJson();
            updateToFirebaseById(DB.EXERCISE_MOVEMENTS, movementID, movement);
        } catch (error) {
            showFailure(t('movement_save_exception'));
            console.warn(error);
        }
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
                        text={showEditMovement ? tCommon('buttons.button_close') : ''}
                        color={showEditMovement ? COLORS.EDITBUTTON_OPEN : COLORS.EDITBUTTON_CLOSED}
                        onClick={() => setShowEditMovement(!showEditMovement)} />
                </ButtonGroup>
            </Row>

            <AccordionElement array={getAccordionData()} title={movement.name} />

            <Row>
                <Col>
                    {t('description') + ': '}{movement.description}
                </Col>
            </Row>

            <Row>
                <Col>
                    <StarRatingWrapper stars={movement.stars} onSaveStars={saveStars} />
                </Col>
            </Row>

            <Alert message={message}
                showMessage={showMessage}
                error={error}
                showError={showError}
                variant={VARIANTS.SUCCESS}
                onClose={clearMessages}
            />

            {showEditMovement &&
                <AddMovement movementID={params.id} onClose={() => setShowEditMovement(false)} onSave={updateMovement} />
            }

            <hr />

            <ImageComponent url={DB.EXERCISE_MOVEMENT_IMAGES} objID={params.id} />
            <CommentComponent objID={params.id} url={DB.EXERCISE_MOVEMENT_COMMENTS} onSave={addCommentToMovement} />
            <LinkComponent objID={params.id} url={DB.EXERCISE_MOVEMENT_LINKS} onSaveLink={addLinkToMovement} />
        </PageContentWrapper>
    )
}
