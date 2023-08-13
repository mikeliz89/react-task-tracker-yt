import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import GoBackButton from '../Buttons/GoBackButton';
import { Row, ButtonGroup, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Icon from '../Icon';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';
import * as Constants from '../../utils/Constants';
import AddGame from './AddGame';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase-config';
import { ref, onValue } from 'firebase/database';
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

export default function ManageGames() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_GAMES, { keyPrefix: Constants.TRANSLATION_GAMES });

    //states
    const [loading, setLoading] = useState(true);
    const [counter, setCounter] = useState(0);
    const [games, setGames] = useState();
    const [originalGames, setOriginalGames] = useState();

    //modal
    const [showAddGame, setShowAddGame] = useState(false);
    const handleClose = () => setShowAddGame(false);
    const handleShow = () => setShowAddGame(true);

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //user
    const { currentUser } = useAuth();

    //load data
    useEffect(() => {
        let cancel = false;

        const getGames = async () => {
            if (cancel) {
                return;
            }
            await fetchGamesFromFirebase();
        }
        getGames();

        return () => {
            cancel = true;
        }
    }, [])

    const fetchGamesFromFirebase = async () => {
        const dbref = await ref(db, Constants.DB_GAMES);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            let counterTemp = 0;
            for (let id in snap) {
                counterTemp++;
                fromDB.push({ id, ...snap[id] });
            }
            setCounter(counterTemp);
            setLoading(false);
            setGames(fromDB);
            setOriginalGames(fromDB);
        })
    }

    const deleteGame = async (id) => {
        removeFromFirebaseById(Constants.DB_GAMES, id);
    }

    const addGame = async (gameID, game) => {
        try {
            clearMessages();
            game["created"] = getCurrentDateAsJson();
            game["createdBy"] = currentUser.email;
            pushToFirebase(Constants.DB_GAMES, game);
            setMessage(t('save_success'));
            setShowMessage(true);
        } catch (ex) {
            setError(t('save_exception'));
            setShowError(true);
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
        <h3>{t('loading')}</h3>
    ) : (
        <PageContentWrapper>

            <PageTitle title={t('games_title')} />

            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Link to={Constants.NAVIGATION_MANAGE_GAMELISTS} className='btn btn-primary'>
                        <Icon name={Constants.ICON_LIST_ALT} color='white' />
                        {t('button_game_lists')}
                    </Link>
                </ButtonGroup>
            </Row>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success'
                onClose={() => { setShowMessage(false); setShowError(false); }}
            />

            <Modal show={showAddGame} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_add_game')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddGame onSave={addGame} onClose={() => setShowAddGame(false)} />
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
                    text={showAddGame ? t('button_close') : t('button_add_game')}
                    onClick={() => setShowAddGame(!showAddGame)} />
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
