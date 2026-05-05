import i18n from 'i18next';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import {updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB } from '../../utils/Constants';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import DetailsPage from '../Site/DetailsPage';
import PageTitle from '../Site/PageTitle';

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

    //states
    const [showEdit, setShowEdit] = useState(false);

    return (
        <DetailsPage
            item={boardGame}
            id={params.id}
            dbKey={DB.BOARD_GAMES}
            loading={loading}
            showEditButton={true}
            isEditOpen={showEdit}
            onToggleEdit={() => setShowEdit(!showEdit)}
            title={boardGame?.name}
            titleSuffix={
                <span className={`details-pill ${boardGame?.haveAtHome === true ? 'details-pill-ready' : 'details-pill-not-ready'}`}>
                    {t('have')}: {boardGame?.haveAtHome === true ? t('yes') : t('no')}
                </span>
            }
            summary={`${t('description')}: ${boardGame?.description || '-'}`}
            metaItems={[
                { id: 1, content: <>{t('created')}: {getJsonAsDateTimeString(boardGame?.created, i18n.language)}</> },
                { id: 2, content: <>{t('created_by')}: {boardGame?.createdBy}</> },
                { id: 3, content: <>{t('modified')}: {getJsonAsDateTimeString(boardGame?.modified, i18n.language)}</> }
            ]}
            editModalTitle={t('modal_header_edit_board_game')}
            editSection={<AddGame onSave={updateBoardGame} gameID={params.id} onClose={() => setShowEdit(false)} dbUrl={DB.BOARD_GAMES} showConsole={false} />}
            alertProps={{
                message,
                showMessage,
                error,
                showError,
                onClose: clearMessages
            }}
            imageProps={{
                showImage: true,
                imageUrl: DB.BOARD_GAME_IMAGES
            }}
            commentProps={{
                showComment: true,
                commentUrl: DB.BOARD_GAME_COMMENTS
            }}
            linkProps={{
                showLink: true,
                linkUrl: DB.BOARD_GAME_LINKS
            }}
        />
    )
}



