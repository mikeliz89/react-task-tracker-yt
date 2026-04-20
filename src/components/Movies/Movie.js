


//states

import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB, NAVIGATION } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { getMovieFormatNameByID } from '../../utils/ListUtils';
import CheckButton from '../Buttons/CheckButton';
import ListRow from '../Site/ListRow';

import AddMovie from './AddMovie';

export default function Movie({ movie, onDelete, onEdit }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MOVIES });
    const [editable, setEditable] = useState(false);

    const updateMovie = (updateMovieID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.MOVIES, updateMovieID, object);
        setEditable(false);
    }

    const markHaveAtHome = () => {
        movie["haveAtHome"] = true;
        onEdit(movie);
    }

    const markNotHaveAtHome = () => {
        movie["haveAtHome"] = false;
        onEdit(movie);
    }

    const movieTitle = `${movie.name} ${movie.publishYear > 0 ? `(${movie.publishYear})` : ''}`.trim();

    return (
        <ListRow
            headerTitle={movieTitle}
            headerTitleTo={`${NAVIGATION.MOVIE}/${movie.id}`}
            showEditButton={true}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={movie.id}
            starCount={movie.stars}
        >
            {!editable &&
                <p>
                    {movie.nameFi !== "" ? movie.nameFi : ''}
                </p>
            }
            {!editable &&
                <p>
                    {movie.format > 0 ?
                        (<span> {
                            t('movie_format_' + getMovieFormatNameByID(movie.format))
                        }</span>) : ('')}
                </p>
            }
            {!editable &&
                <p>
                    {movie.description}
                </p>
            }
            {
                editable && <AddMovie
                    movieID={movie.id}
                    onClose={() => setEditable(false)}
                    onSave={updateMovie}
                    showLabels={true} />
            }

                <CheckButton
                    checked={movie.haveAtHome}
                    checkedText={t('have')}
                    uncheckedText={t('have_not')}
                    onCheck={markHaveAtHome}
                    onUncheck={markNotHaveAtHome}
                    style={{ margin: '5px' }}
                />
        </ListRow>
    )
}



