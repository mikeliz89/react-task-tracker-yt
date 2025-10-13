import GoBackButton from "../Buttons/GoBackButton"
import PageContentWrapper from "../Site/PageContentWrapper"
import { Row, ButtonGroup, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import AddGame from "./AddGame";
import Button from '../Buttons/Button';
import Alert from '../Alert';
import i18n from 'i18next';
import { TRANSLATION, DB, ICONS, COLORS, VARIANTS } from '../../utils/Constants';
import AccordionElement from '../AccordionElement';
import StarRatingWrapper from '../StarRating/StarRatingWrapper';
import LinkComponent from '../Links/LinkComponent';
import ImageComponent from '../ImageUpload/ImageComponent';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useFetch from '../Hooks/useFetch';
import { Modal } from 'react-bootstrap';
import { useToggle } from '../Hooks/useToggle';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { pushToFirebaseChild, updateToFirebaseById } from '../../datatier/datatier';
import CommentComponent from '../Comments/CommentComponent';

export default function GameDetails() {

    //params
    const params = useParams();

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.GAMES });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //fetch data
    const { data: game, loading } = useFetch(DB.GAMES, "", params.id);

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //auth
    const { currentUser } = useAuth();

    const updateGame = async (updateGameID, game) => {
        try {
            const gameID = params.id;
            game["modified"] = getCurrentDateAsJson();
            updateToFirebaseById(DB.GAMES, gameID, game);
        } catch (error) {
            setError(t('failed_to_save_game'));
            setShowError(true);
            console.log(error);
        }
    }

    const addCommentToGame = (comment) => {
        const id = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        pushToFirebaseChild(DB.GAME_COMMENTS, id, comment);
    }

    const addLinkToGame = (link) => {
        const id = params.id;
        link["created"] = getCurrentDateAsJson();
        pushToFirebaseChild(DB.GAME_LINKS, id, link);
    }

    const saveStars = async (stars) => {
        const gameID = params.id;
        game["modified"] = getCurrentDateAsJson()
        game["stars"] = Number(stars);
        updateToFirebaseById(DB.GAMES, gameID, game);
    }

    const getAccordionData = () => {
        return [
            { id: 1, name: t('created'), value: getJsonAsDateTimeString(game.created, i18n.language) },
            { id: 2, name: t('created_by'), value: game.createdBy },
            { id: 3, name: t('modified'), value: getJsonAsDateTimeString(game.modified, i18n.language) }
        ];
    }

    //modal
    const { status: showEdit, toggleStatus: toggleShowEdit } = useToggle();

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

            <AccordionElement array={getAccordionData()} title={game.name} />

            <Row>
                <Col>
                    {t('description') + ':'} {game.description}
                </Col>
            </Row>
            <Row>
                <Col>
                    <StarRatingWrapper stars={game.stars} onSaveStars={saveStars} />
                </Col>
            </Row>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant={VARIANTS.SUCCESS} onClose={() => { setShowMessage(false); setShowError(false); }}
            />

            <Modal show={showEdit} onHide={toggleShowEdit}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_edit_game')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddGame onSave={updateGame} gameID={params.id} onClose={() => toggleShowEdit()} />
                </Modal.Body>
            </Modal>

            <hr />
            <ImageComponent url={DB.GAME_IMAGES} objID={params.id} />
            <CommentComponent objID={params.id} url={DB.GAME_COMMENTS} onSave={addCommentToGame} />
            <LinkComponent objID={params.id} url={DB.GAME_LINKS} onSaveLink={addLinkToGame} />
        </PageContentWrapper>
    )
}