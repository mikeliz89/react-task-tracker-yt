


//states

import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB, NAVIGATION } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { getMovieFormatNameByID } from '../../utils/ListUtils';
import CheckButton from '../Buttons/CheckButton';
import NavButton from '../Buttons/NavButton';
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

    return (
        <ListRow
            headerLeft={
                <span>
                    <NavButton to={`${NAVIGATION.MOVIE}/${movie.id}`} className="">
                        {movie.name} {movie.publishYear > 0 ? '(' + movie.publishYear + ')' : ''}
                    </NavButton>
                </span>
            }
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
                    showLabels={false} />
            }

            <p>
                <CheckButton
                    checked={movie.haveAtHome}
                    checkedText={t('have')}
                    uncheckedText={t('have_not')}
                    onCheck={markHaveAtHome}
                    onUncheck={markNotHaveAtHome}
                    style={{ margin: '5px' }}
                />
            </p>
        </ListRow>
    )
}



