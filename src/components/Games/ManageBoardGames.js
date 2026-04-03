import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Modal } from 'react-bootstrap';

import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebase, removeFromFirebaseById, updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';

import Alert from '../Alert';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import NavButton from '../Buttons/NavButton';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { SortMode } from '../SearchSortFilter/SortModes';
import CenterWrapper from '../Site/CenterWrapper';
import Counter from '../Site/Counter';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import { useToggle } from '../Hooks/useToggle';

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

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>

            <PageTitle title={t('board_games_title')} iconName={ICONS.GAMEPAD} />

            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <NavButton to={NAVIGATION.MANAGE_GAMELISTS}
                        icon={ICONS.LIST_ALT}>
                        {t('button_game_lists')}
                    </NavButton>
                </ButtonGroup>
            </Row>

            <Alert message={message}
                showMessage={showMessage}
                error={error}
                showError={showError}
                variant={VARIANTS.SUCCESS}
                onClose={clearMessages}
            />

            <Modal show={showAddBoardGame} onHide={toggleAddBoardGame}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_add_board_game')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddGame
                        onSave={addBoardGame}
                        onClose={toggleAddBoardGame}
                        dbUrl={DB.BOARD_GAMES}
                        showConsoleField={false}
                    />
                </Modal.Body>
            </Modal>

            {
                originalBoardGames != null && originalBoardGames.length > 0 ? (
                    <SearchSortFilter
                        onSet={setBoardGames}
                        originalList={originalBoardGames}
                        //search
                        showSearchByText={true}
                        showSearchByDescription={true}
                        //sort
                        defaultSort={SortMode.Name_ASC}
                        showSortByName={true}
                        showSortByStarRating={true}
                        showSortByCreatedDate={true}
                        showSortByPublishYear={true}
                        //filter
                        filterMode={FilterMode.Name}
                        showFilterHaveAtHome={true}
                        showFilterHaveRated={true}
                    />
                ) : (<></>)
            }

            <CenterWrapper>
                <Button
                    iconName={ICONS.PLUS}
                    color={showAddBoardGame ? COLORS.ADDBUTTON_OPEN : COLORS.ADDBUTTON_CLOSED}
                    text={showAddBoardGame ? tCommon('buttons.button_close') : t('button_add_board_game')}
                    onClick={toggleAddBoardGame} />
            </CenterWrapper>

            {
                boardGames != null && boardGames.length > 0 ? (
                    <>
                        <Counter list={boardGames} originalList={originalBoardGames} counter={counter} />
                        <Games
                            games={boardGames}
                            onDelete={deleteBoardGame}
                            onEdit={editBoardGame}
                            dbUrl={DB.BOARD_GAMES}
                            detailsNavigation={NAVIGATION.BOARD_GAME}
                            showConsole={false}
                        />
                    </>
                ) : (
                    <>
                        <CenterWrapper>
                            {t('no_board_games_to_show')}
                        </CenterWrapper>
                    </>
                )
            }
        </PageContentWrapper>
    )
}
