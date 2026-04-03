import { useState } from 'react';
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
import PageTitle from '../Site/PageTitle';
import StarRatingWrapper from '../StarRating/StarRatingWrapper';
import { useAlert } from '../Hooks/useAlert';

import AddGame from './AddGame';

export default function BoardGameDetails() {

    //params
    const params = useParams();

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.GAMES });

    //fetch data
    const { data: boardGame, loading } = useFetch(DB.BOARD_GAMES, "", params.id);

    //alert
    const {
        message,
        showMessage,
        error,
        showError,
        clearMessages,
        showFailure
    } = useAlert();

    //auth
    const { currentUser } = useAuth();

    const updateBoardGame = async (updateBoardGameID, boardGame) => {
        try {
            const boardGameID = params.id;
            boardGame["modified"] = getCurrentDateAsJson();
            updateToFirebaseById(DB.BOARD_GAMES, boardGameID, boardGame);
        } catch (error) {
            showFailure(t('failed_to_save_game'));
            console.warn(error);
        }
    }

    const addCommentToBoardGame = (comment) => {
        const id = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        pushToFirebaseChild(DB.BOARD_GAME_COMMENTS, id, comment);
    }

    const addLinkToBoardGame = (link) => {
        const id = params.id;
        link["created"] = getCurrentDateAsJson();
        pushToFirebaseChild(DB.BOARD_GAME_LINKS, id, link);
    }

    const saveStars = async (stars) => {
        const boardGameID = params.id;
        boardGame["modified"] = getCurrentDateAsJson()
        boardGame["stars"] = Number(stars);
        updateToFirebaseById(DB.BOARD_GAMES, boardGameID, boardGame);
    }

    //states
    const [showEdit, setShowEdit] = useState(false);

    return (
        <DetailsPage
            loading={loading}
            showEditButton={true}
            isEditOpen={showEdit}
            onToggleEdit={() => setShowEdit(!showEdit)}
            title={<PageTitle title={boardGame?.name} />}
            titleSuffix={
                <span className={`details-pill ${boardGame?.haveAtHome === true ? 'details-pill-ready' : 'details-pill-not-ready'}`}>
                    {t('have')}: {boardGame?.haveAtHome === true ? t('yes') : t('no')}
                </span>
            }
            summary={`${t('description')}: ${boardGame?.description || '-'}`}
            ratingSection={<StarRatingWrapper stars={boardGame?.stars} onSaveStars={saveStars} />}
            metaItems={[
                { id: 1, content: <>{t('created')}: {getJsonAsDateTimeString(boardGame?.created, i18n.language)}</> },
                { id: 2, content: <>{t('created_by')}: {boardGame?.createdBy}</> },
                { id: 3, content: <>{t('modified')}: {getJsonAsDateTimeString(boardGame?.modified, i18n.language)}</> }
            ]}
            editModalTitle={t('modal_header_edit_board_game')}
            editSection={<AddGame onSave={updateBoardGame} gameID={params.id} onClose={() => setShowEdit(false)} dbUrl={DB.BOARD_GAMES} showConsoleField={false} />}
            alertSection={
                <Alert
                    message={message}
                    showMessage={showMessage}
                    error={error}
                    showError={showError}
                    onClose={clearMessages}
                />
            }
            imageSection={<ImageComponent url={DB.BOARD_GAME_IMAGES} objID={params.id} />}
            commentSection={<CommentComponent objID={params.id} url={DB.BOARD_GAME_COMMENTS} onSave={addCommentToBoardGame} />}
            linkSection={<LinkComponent objID={params.id} url={DB.BOARD_GAME_LINKS} onSaveLink={addLinkToBoardGame} />}
        />
    )
}
