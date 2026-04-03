import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

import Alert from '../Alert';
import CommentComponent from '../Comments/CommentComponent';
import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebaseChild, updateToFirebaseById } from '../../datatier/datatier';
import DetailsPage from '../Site/DetailsPage';
import ImageComponent from '../ImageUpload/ImageComponent';
import LinkComponent from '../Links/LinkComponent';
import PageTitle from '../Site/PageTitle';
import StarRatingWrapper from '../StarRating/StarRatingWrapper';
import AddGame from './AddGame';
import useFetch from '../Hooks/useFetch';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { TRANSLATION, DB } from '../../utils/Constants';
import { useAlert } from '../Hooks/useAlert';

export default function GameDetails() {

    //params
    const params = useParams();

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.GAMES });

    //fetch data
    const { data: game, loading } = useFetch(DB.GAMES, "", params.id);

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

    const updateGame = async (updateGameID, game) => {
        try {
            const gameID = params.id;
            game["modified"] = getCurrentDateAsJson();
            updateToFirebaseById(DB.GAMES, gameID, game);
        } catch (error) {
            showFailure(t('failed_to_save_game'));
            console.warn(error);
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

    //states
    const [showEdit, setShowEdit] = useState(false);

    return (
        <DetailsPage
            loading={loading}
            showEditButton={true}
            isEditOpen={showEdit}
            onToggleEdit={() => setShowEdit(!showEdit)}
            title={<PageTitle title={game?.name} />}
            summary={`${t('description')}: ${game?.description || '-'}`}
            ratingSection={<StarRatingWrapper stars={game?.stars} onSaveStars={saveStars} />}
            metaItems={[
                { id: 1, content: <>{t('created')}: {getJsonAsDateTimeString(game?.created, i18n.language)}</> },
                { id: 2, content: <>{t('created_by')}: {game?.createdBy}</> },
                { id: 3, content: <>{t('modified')}: {getJsonAsDateTimeString(game?.modified, i18n.language)}</> }
            ]}
            editModalTitle={t('modal_header_edit_game')}
            editSection={<AddGame onSave={updateGame} gameID={params.id} onClose={() => setShowEdit(false)} />}
            alertSection={
                <Alert
                    message={message}
                    showMessage={showMessage}
                    error={error}
                    showError={showError}
                    onClose={clearMessages}
                />
            }
            imageSection={<ImageComponent url={DB.GAME_IMAGES} objID={params.id} />}
            commentSection={<CommentComponent objID={params.id} url={DB.GAME_COMMENTS} onSave={addCommentToGame} />}
            linkSection={<LinkComponent objID={params.id} url={DB.GAME_LINKS} onSaveLink={addLinkToGame} />}
        />
    )
}