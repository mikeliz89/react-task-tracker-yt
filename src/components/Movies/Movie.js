//states

import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB, NAVIGATION } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { getMovieFormatNameByID } from '../../utils/ListUtils';
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



    const movieTitle = `${movie.name} ${movie.publishYear > 0 ? `(${movie.publishYear})` : ''}`.trim();

    return (
        <ListRow
            item={movie}
            dbKey={DB.MOVIES}
            headerProps={{
                title: movieTitle,
                titleTo: `${NAVIGATION.MOVIE}/${movie.id}`
            }}
            showEditButton={true}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={movie.id}
            section={
                !editable ? (
                    <div>
                        {movie.nameFi !== "" && <p>{movie.nameFi}</p>}
                        {movie.format > 0 && (
                            <p><span>{t('movie_format_' + getMovieFormatNameByID(movie.format))}</span></p>
                        )}
                        <p>{movie.description}</p>
                    </div>
                ) : null
            }
            modalProps={{
                modalTitle: t('edit_movie'),
                modalBody: (
                    editable && <AddMovie
                        movieID={movie.id}
                        onClose={() => setEditable(false)}
                        onSave={updateMovie}
                        showLabels={true}
                    />
                )
            }}
            showCheckButton={true}
            checkButtonProps={{
                checked: !!movie.haveAtHome,
                checkedText: t('have'),
                uncheckedText: t('have_not'),
                onCheck: () => { movie["haveAtHome"] = true; onEdit(movie); },
                onUncheck: () => { movie["haveAtHome"] = false; onEdit(movie); },
            }}
        />
    )
}



