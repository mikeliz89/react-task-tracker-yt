import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import GoBackButton from '../Buttons/GoBackButton';
import { Row, ButtonGroup, Modal } from 'react-bootstrap';
import { useState } from 'react';
import Icon from '../Icon';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';
import * as Constants from '../../utils/Constants';
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
import { useToggle } from '../useToggle';
import useFetch from '../useFetch';
import NavButton from '../Buttons/NavButton';

export default function ManageGames() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_GAMES });
    const { t: tCommon } = useTranslation(Constants.TRANSLATION_COMMON, { keyPrefix: Constants.TRANSLATION_COMMON });

    //fetch data
    const { data: games, setData: setGames,
        originalData: originalGames,
        counter, loading } = useFetch(Constants.DB_GAMES);

    //modal
    const { status: showAddGame, toggleStatus: toggleAddGame } = useToggle();

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //user
    const { currentUser } = useAuth();

    const deleteGame = async (id) => {
        removeFromFirebaseById(Constants.DB_GAMES, id);
    }

    const addGame = async (gameID, game) => {
        try {
            clearMessages();
            game["created"] = getCurrentDateAsJson();
            game["createdBy"] = currentUser.email;
            pushToFirebase(Constants.DB_GAMES, game);
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

    function clearMessages() {
        setError('');
        setShowError(false);
        setMessage('');
        setShowMessage(false);
    }

    const editGame = (game) => {
        const id = game.id;
        updateToFirebaseById(Constants.DB_GAMES, id, game);
    }

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>

            <PageTitle title={t('games_title')} />

            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <NavButton to={Constants.NAVIGATION_MANAGE_GAMELISTS}
                        icon={Constants.ICON_LIST_ALT}>
                        {t('button_game_lists')}
                    </NavButton>
                </ButtonGroup>
            </Row>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant={Constants.VARIANT_SUCCESS}
                onClose={() => { setShowMessage(false); setShowError(false); }}
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
                    iconName={Constants.ICON_PLUS}
                    color={showAddGame ? Constants.COLOR_ADDBUTTON_OPEN : Constants.COLOR_ADDBUTTON_CLOSED}
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
