import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Row, ButtonGroup } from 'react-bootstrap';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import Icon from '../Icon';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';
import * as Constants from '../../utils/Constants';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import CenterWrapper from '../Site/CenterWrapper';
import Movies from './Movies';
import { useState, useEffect } from 'react';
import Counter from '../Site/Counter';
import Alert from '../Alert';
import { pushToFirebase, removeFromFirebaseById, updateToFirebaseById } from '../../datatier/datatier';
import AddMovie from './AddMovie';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase-config';
import { ref, onValue } from 'firebase/database';
import { SortMode } from '../SearchSortFilter/SortModes';
import { FilterMode } from '../SearchSortFilter/FilterModes';

export default function Games() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_MOVIES, { keyPrefix: Constants.TRANSLATION_MOVIES });

    //states
    const [loading, setLoading] = useState(true);
    const [counter, setCounter] = useState(0);
    const [movies, setMovies] = useState();
    const [originalMovies, setOriginalMovies] = useState();
    const [showAdd, setShowAdd] = useState(false);

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

        const getMovies = async () => {
            if (cancel) {
                return;
            }
            await fetchMoviesFromFirebase();
        }
        getMovies();

        return () => {
            cancel = true;
        }
    }, [])

    const fetchMoviesFromFirebase = async () => {
        const dbref = await ref(db, Constants.DB_MOVIES);
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
            setMovies(fromDB);
            setOriginalMovies(fromDB);
        })
    }

    const deleteMovie = async (id) => {
        removeFromFirebaseById(Constants.DB_MOVIES, id);
    }

    const addMovie = async (movieID, movie) => {
        try {
            clearMessages();
            movie["created"] = getCurrentDateAsJson();
            movie["createdBy"] = currentUser.email;
            pushToFirebase(Constants.DB_MOVIES, movie);
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

    const editMovie = (movie) => {
        const id = movie.id;
        updateToFirebaseById(Constants.DB_MOVIES, id, movie);
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <PageContentWrapper>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        iconName={Constants.ICON_PLUS}
                        color={showAdd ? 'red' : 'green'}
                        text={showAdd ? t('button_close') : t('button_add_movie')}
                        onClick={() => setShowAdd(!showAdd)} />
                </ButtonGroup>
            </Row>

            <PageTitle title={t('movies_title')} />

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

            <div>
                <Link to={Constants.NAVIGATION_MANAGE_MOVIELISTS} className='btn btn-primary'>
                    <Icon name={Constants.ICON_LIST_ALT} color='white' />
                    {t('button_movie_lists')}
                </Link>
            </div>

            <CenterWrapper>
                {t('movies')}
            </CenterWrapper>

            {
                showAdd && <AddMovie onSave={addMovie} onClose={() => setShowAdd(false)} />
            }

            {
                originalMovies != null && originalMovies.length > 0 ? (
                    <SearchSortFilter
                        onSet={setMovies}
                        originalList={originalMovies}
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
