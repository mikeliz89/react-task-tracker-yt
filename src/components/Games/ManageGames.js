import { useTranslation } from 'react-i18next';
import GoBackButton from '../Buttons/GoBackButton';
import { Row, ButtonGroup, Modal } from 'react-bootstrap';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';
import AddGame from './AddGame';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import CenterWrapper from '../Site/CenterWrapper';
import Games from './Games';
import { pushToFirebase, removeFromFirebaseById, updateToFirebaseById } from '../../datatier/datatier';
import Button from '../Buttons/Button';
import Alert from '../Alert';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import { SortMode } from '../SearchSortFilter/SortModes';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import Counter from '../Site/Counter';
import { useToggle } from '../Hooks/useToggle';
import useFetch from '../Hooks/useFetch';
import NavButton from '../Buttons/NavButton';
import { useAlert } from '../Hooks/useAlert';

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
        clearMessages
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
            showSuccess();
        } catch (ex) {
            showFailure();
        }

        function showFailure() {
            setError(t('save_exception'));
            setShowError(true);
        }

        function showSuccess() {
            setMessage(t('save_success'));
            setShowMessage(true);
        }
    }

    const editGame = (game) => {
        const id = game.id;
        updateToFirebaseById(DB.GAMES, id, game);
    }

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>

            <PageTitle title={t('games_title')} />

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

            <Modal show={showAddGame} onHide={toggleAddGame}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_add_game')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddGame onSave={addGame} onClose={toggleAddGame} />
                </Modal.Body>
            </Modal>

            {
                originalGames != null && originalGames.length > 0 ? (
                    <SearchSortFilter
                        onSet={setGames}
                        originalList={originalGames}
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
                        showFilterNotHaveAtHome={true}
                    />
                ) : (<></>)
            }

            <CenterWrapper>
                <Button
                    iconName={ICONS.PLUS}
                    color={showAddGame ? COLORS.ADDBUTTON_OPEN : COLORS.ADDBUTTON_CLOSED}
                    text={showAddGame ? tCommon('buttons.button_close') : t('button_add_game')}
                    onClick={toggleAddGame} />
            </CenterWrapper>

            {
                games != null && games.length > 0 ? (
                    <>
                        <Counter list={games} originalList={originalGames} counter={counter} />
                        <Games games={games} onDelete={deleteGame} onEdit={editGame} />
                    </>
                ) : (
                    <>
                        <CenterWrapper>
                            {t('no_games_to_show')}
                        </CenterWrapper>
                    </>
                )
            }
        </PageContentWrapper>
    )
}
