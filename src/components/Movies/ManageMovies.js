import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Modal } from 'react-bootstrap';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import CenterWrapper from '../Site/CenterWrapper';
import Movies from './Movies';
import { useState } from 'react';
import Counter from '../Site/Counter';
import Alert from '../Alert';
import { pushToFirebase, removeFromFirebaseById, updateToFirebaseById } from '../../datatier/datatier';
import AddMovie from './AddMovie';
import { useAuth } from '../../contexts/AuthContext';
import { SortMode } from '../SearchSortFilter/SortModes';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { useToggle } from '../useToggle';
import useFetch from '../useFetch';
import NavButton from '../Buttons/NavButton';

export default function ManageMovies() {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MOVIES });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //fetch data
    const { data: movies, setData: setMovies,
        originalData: originalMovies, counter, loading } = useFetch(DB.MOVIES);

    //modal
    const { status: showAddMovie, toggleStatus: toggleAddMovie } = useToggle();

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //user
    const { currentUser } = useAuth();

    const deleteMovie = async (id) => {
        removeFromFirebaseById(DB.MOVIES, id);
    }

    const addMovie = async (movieID, movie) => {
        try {
            clearMessages();
            movie["created"] = getCurrentDateAsJson();
            movie["createdBy"] = currentUser.email;
            pushToFirebase(DB.MOVIES, movie);
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

    const editMovie = (movie) => {
        const id = movie.id;
        updateToFirebaseById(DB.MOVIES, id, movie);
    }

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>

            <PageTitle title={t('movies_title')} />

            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <NavButton to={NAVIGATION.MANAGE_MOVIELISTS}
                        icon={ICONS.LIST_ALT}>
                        {t('button_movie_lists')}
                    </NavButton>
                </ButtonGroup>
            </Row>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant={VARIANTS.SUCCESS}
                onClose={() => { setShowMessage(false); setShowError(false); }}
            />

            <Modal show={showAddMovie} onHide={toggleAddMovie}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_add_movie')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddMovie onSave={addMovie} onClose={toggleAddMovie} />
                </Modal.Body>
            </Modal>

            {
                originalMovies != null && originalMovies.length > 0 ? (
                    <SearchSortFilter
                        onSet={setMovies}
                        originalList={originalMovies}
                        //search
                        showSearchByText={true}
                        showSearchByFinnishName={true}
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
                    color={showAddMovie ? COLORS.ADDBUTTON.OPEN : COLORS.ADDBUTTON_CLOSED}
                    text={showAddMovie ? tCommon('buttons.button_close') : t('button_add_movie')}
                    onClick={toggleAddMovie} />
            </CenterWrapper>

            {
                movies != null && movies.length > 0 ? (
                    <>
                        <Counter list={movies} originalList={originalMovies} counter={counter} />
                        <Movies movies={movies} onDelete={deleteMovie} onEdit={editMovie} />
                    </>
                ) : (
                    <>
                        <CenterWrapper>
                            {t('no_movies_to_show')}
                        </CenterWrapper>
                    </>
                )
            }
        </PageContentWrapper>
    )
}
