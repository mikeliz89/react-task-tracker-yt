import { useTranslation } from 'react-i18next';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';
import AddGame from './AddGame';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import Games from './Games';
import { pushToFirebase, removeFromFirebaseById, updateToFirebaseById } from '../../datatier/datatier';
import { SortMode } from '../SearchSortFilter/SortModes';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { useToggle } from '../Hooks/useToggle';
import useFetch from '../Hooks/useFetch';
import NavButton from '../Buttons/NavButton';
import { useAlert } from '../Hooks/useAlert';
import ManagePage from '../Site/ManagePage';

export default function ManageGames() {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.GAMES });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //fetch data
    const { data: games, setData: setGames,
        originalData: originalGames,
        counter, loading } = useFetch(DB.GAMES);

    //modal
    const { status: showAddGame, toggleStatus: toggleAddGame } = useToggle();

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

    //user
    const { currentUser } = useAuth();

    const deleteGame = async (id) => {
        removeFromFirebaseById(DB.GAMES, id);
    }

    const addGame = async (gameID, game) => {
        try {
            clearMessages();
            game["created"] = getCurrentDateAsJson();
            game["createdBy"] = currentUser.email;
            pushToFirebase(DB.GAMES, game);
            showSuccess(t('save_success'));
        } catch (ex) {
            showFailure(t('save_exception'));
            console.warn(ex);
        }
    }

    const editGame = (game) => {
        const id = game.id;
        updateToFirebaseById(DB.GAMES, id, game);
    }

    return (
        <ManagePage
            loading={loading}
            loadingText={tCommon("loading")}
            title={t('games_title')}
            iconName={ICONS.GAMEPAD}
            topActions={(
                <>
                    <NavButton to={NAVIGATION.MANAGE_GAMELISTS}
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
                show: showAddGame,
                onHide: toggleAddGame,
                title: t('modal_header_add_game'),
                body: <AddGame onSave={addGame} onClose={toggleAddGame} />,
            }}
            searchSortFilter={{
                onSet: setGames,
                originalList: originalGames,
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
                show: showAddGame,
                iconName: ICONS.PLUS,
                openColor: COLORS.ADDBUTTON_OPEN,
                closedColor: COLORS.ADDBUTTON_CLOSED,
                openText: tCommon('buttons.button_close'),
                closedText: t('button_add_game'),
                onToggle: toggleAddGame,
            }}
            hasItems={games != null && games.length > 0}
            emptyText={t('no_games_to_show')}
        >
            <>
                <Games
                    games={games}
                    onDelete={deleteGame}
                    onEdit={editGame}
                    originalList={originalGames}
                    counter={counter}
                />
            </>
        </ManagePage>
    )
}
