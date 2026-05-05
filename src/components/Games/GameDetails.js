import i18n from 'i18next';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB } from '../../utils/Constants';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { getGameConsoleNameByID } from '../../utils/ListUtils';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
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
            imageProps={{
                showImage: true,
                imageUrl: DB.GAME_IMAGES
            }}
            commentProps={{
                showComment: true,
                commentUrl: DB.GAME_COMMENTS
            }}
            linkProps={{
                showLink: true,
                linkUrl: DB.GAME_LINKS
            }}
        />
    )
}


