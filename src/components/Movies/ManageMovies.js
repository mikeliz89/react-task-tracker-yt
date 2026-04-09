import { useTranslation } from 'react-i18next';

import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebase, removeFromFirebaseById, updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import NavButton from '../Buttons/NavButton';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import { useToggle } from '../Hooks/useToggle';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { SortMode } from '../SearchSortFilter/SortModes';
import ManagePage from '../Site/ManagePage';

import AddMovie from './AddMovie';
import Movies from './Movies';

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

    const deleteMovie = async (id) => {
        removeFromFirebaseById(DB.MOVIES, id);
    }

    const addMovie = async (movieID, movie) => {
        try {
            clearMessages();
            movie["created"] = getCurrentDateAsJson();
            movie["createdBy"] = currentUser.email;
            pushToFirebase(DB.MOVIES, movie);
            showSuccess(t('save_success'));
        } catch (ex) {
            showFailure(t('save_exception'));
            console.warn(ex);
        }
    }

    const editMovie = (movie) => {
        const id = movie.id;
        updateToFirebaseById(DB.MOVIES, id, movie);
    }

    return (
        <ManagePage
            loading={loading}
            loadingText={tCommon("loading")}
            title={t('movies_title')}
            iconName={ICONS.MOVIE}
            topActions={(
                <>
                    <NavButton to={NAVIGATION.MANAGE_MOVIELISTS}
                        icon={ICONS.LIST_ALT}>
                        {t('button_movie_lists')}
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
                show: showAddMovie,
                onHide: toggleAddMovie,
                title: t('modal_header_add_movie'),
                body: <AddMovie onSave={addMovie} onClose={toggleAddMovie} />,
            }}
            searchSortFilter={{
                onSet: setMovies,
                originalList: originalMovies,
                //search
                showSearchByText: true,
                showSearchByFinnishName: true,
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
                show: showAddMovie,
                iconName: ICONS.PLUS,
                openColor: COLORS.ADDBUTTON_OPEN,
                closedColor: COLORS.ADDBUTTON_CLOSED,
                openText: tCommon('buttons.button_close'),
                closedText: t('button_add_movie'),
                onToggle: toggleAddMovie,
            }}
            hasItems={movies != null && movies.length > 0}
            emptyText={t('no_movies_to_show')}
        >
            <>
                <Movies
                    movies={movies}
                    onDelete={deleteMovie}
                    onEdit={editMovie}
                    originalList={originalMovies}
                    counter={counter}
                />
            </>
        </ManagePage>
    )
}



