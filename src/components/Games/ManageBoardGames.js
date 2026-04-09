import { useTranslation } from 'react-i18next';

import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebase, removeFromFirebaseById, updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';

import NavButton from '../Buttons/NavButton';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { SortMode } from '../SearchSortFilter/SortModes';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import { useToggle } from '../Hooks/useToggle';
import ManagePage from '../Site/ManagePage';

import AddGame from './AddGame';
import Games from './Games';

export default function ManageBoardGames() {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.GAMES });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //fetch data
    const { data: boardGames, setData: setBoardGames,
        originalData: originalBoardGames,
        counter, loading } = useFetch(DB.BOARD_GAMES);

    //modal
    const { status: showAddBoardGame, toggleStatus: toggleAddBoardGame } = useToggle();

    //alert
    const {
        message,
        showMessage,
        error,
        showError,
        clearMessages,
        showSuccess,
        showFailure
    } = useAlert();

    //user
    const { currentUser } = useAuth();

    const deleteBoardGame = async (id) => {
        removeFromFirebaseById(DB.BOARD_GAMES, id);
    }

    const addBoardGame = async (boardGameID, boardGame) => {
        try {
            clearMessages();
            boardGame["created"] = getCurrentDateAsJson();
            boardGame["createdBy"] = currentUser.email;
            pushToFirebase(DB.BOARD_GAMES, boardGame);
            showSuccess(t('save_success'));
        } catch (ex) {
            showFailure(t('save_exception'));
            console.warn(ex);
        }
    }

    const editBoardGame = (boardGame) => {
        const id = boardGame.id;
        updateToFirebaseById(DB.BOARD_GAMES, id, boardGame);
    }

    return (
        <ManagePage
            loading={loading}
            loadingText={tCommon("loading")}
            title={t('board_games_title')}
            iconName={ICONS.GAMEPAD}
            topActions={(
                <>
                    <NavButton to={NAVIGATION.MANAGE_BOARD_GAMELISTS}
                        icon={ICONS.LIST_ALT}>
                        {t('button_game_lists')}
                    </NavButton>
                </>
            )}
            alert={{
                message,
                showMessage,
                error,
                showError,
                variant: VARIANTS.SUCCESS,
                onClose: clearMessages,
            }}
            modal={{
                show: showAddBoardGame,
                onHide: toggleAddBoardGame,
                title: t('modal_header_add_board_game'),
                body: (
                    <AddGame
                        onSave={addBoardGame}
                        onClose={toggleAddBoardGame}
                        dbUrl={DB.BOARD_GAMES}
                        showConsoleField={false}
                    />
                ),
            }}
            searchSortFilter={{
                onSet: setBoardGames,
                originalList: originalBoardGames,
                //search
                showSearchByText: true,
                showSearchByDescription: true,
                //sort
                defaultSort: SortMode.Name_ASC,
                showSortByName: true,
                showSortByStarRating: true,
                showSortByCreatedDate: true,
                showSortByPublishYear: true,
                //filter
                filterMode: FilterMode.Name,
                showFilterHaveAtHome: true,
                showFilterHaveRated: true,
            }}
            addButton={{
                show: showAddBoardGame,
                iconName: ICONS.PLUS,
                openColor: COLORS.ADDBUTTON_OPEN,
                closedColor: COLORS.ADDBUTTON_CLOSED,
                openText: tCommon('buttons.button_close'),
                closedText: t('button_add_board_game'),
                onToggle: toggleAddBoardGame,
            }}
            hasItems={boardGames != null && boardGames.length > 0}
            emptyText={t('no_board_games_to_show')}
        >
            <>
                <Games
                    games={boardGames}
                    onDelete={deleteBoardGame}
                    onEdit={editBoardGame}
                    dbUrl={DB.BOARD_GAMES}
                    detailsNavigation={NAVIGATION.BOARD_GAME}
                    showConsole={false}
                    originalList={originalBoardGames}
                    counter={counter}
                />
            </>
        </ManagePage>
    )
}
