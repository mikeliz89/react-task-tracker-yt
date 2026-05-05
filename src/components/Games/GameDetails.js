import i18n from 'i18next';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebaseChild, updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB } from '../../utils/Constants';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { getGameConsoleNameByID } from '../../utils/ListUtils';
import CommentComponent from '../Comments/CommentComponent';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import ImageComponent from '../ImageUpload/ImageComponent';
import LinkComponent from '../Links/LinkComponent';
import DetailsPage from '../Site/DetailsPage';
import PageTitle from '../Site/PageTitle';

import AddGame from './AddGame';

export default function GameDetails() {

    //params
    const params = useParams();
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

    //states
    const [showEdit, setShowEdit] = useState(false);

    return (
        <DetailsPage
            item={game}
            id={params.id}
            dbKey={DB.GAMES}
            loading={loading}
            showEditButton={true}
            isEditOpen={showEdit}
            onToggleEdit={() => setShowEdit(!showEdit)}
            title={game?.name}
            titleSuffix={
                <span className={`details-pill ${game?.haveAtHome === true ? 'details-pill-ready' : 'details-pill-not-ready'}`}>
                    {t('have')}: {game?.haveAtHome === true ? t('yes') : t('no')}
                </span>
            }
            preSummaryContent={
                <div className="detailspage-field">
                    <span className="detailspage-meta-label">{t('console')}:</span>{' '}
                    <span className="detailspage-meta-value">{t(`game_console_${getGameConsoleNameByID(game?.console)}`)}</span>
                </div>
            }
            summary={`${t('description')}: ${game?.description || '-'}`}
            metaItems={[
                { id: 1, content: <>{t('created')}: {getJsonAsDateTimeString(game?.created, i18n.language)}</> },
                { id: 2, content: <>{t('created_by')}: {game?.createdBy}</> },
                { id: 3, content: <>{t('modified')}: {getJsonAsDateTimeString(game?.modified, i18n.language)}</> }
            ]}
            editModalTitle={t('modal_header_edit_game')}
            editSection={<AddGame onSave={updateGame} gameID={params.id} onClose={() => setShowEdit(false)} />}
            alertProps={{
                message,
                showMessage,
                error,
                showError,
                onClose: clearMessages
            }}
            imageSection={<ImageComponent url={DB.GAME_IMAGES} objID={params.id} />}
            commentSection={<CommentComponent objID={params.id} url={DB.GAME_COMMENTS} onSave={addCommentToGame} />}
            linkSection={<LinkComponent objID={params.id} url={DB.GAME_LINKS} onSaveLink={addLinkToGame} />}
        />
    )
}


