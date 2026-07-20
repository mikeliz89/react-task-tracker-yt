//states
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB, NAVIGATION } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { getMovieFormatNameByID } from '../../utils/ListUtils';
import ListRow from '../Site/ListRow';

import AddMovie from './AddMovie';

export default function Movie({ item, onDelete, onEdit }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MOVIES });
    const [editable, setEditable] = useState(false);

    const updateMovie = (updateMovieID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.MOVIES, updateMovieID, object);
        setEditable(false);
    }

    const movieTitle = `${item.name} ${item.publishYear > 0 ? `(${item.publishYear})` : ''}`.trim();

    return (
        <ListRow
            item={item}
            dbKey={DB.MOVIES}
            headerProps={{
                title: movieTitle,
                titleTo: `${NAVIGATION.MOVIE}/${item.id}`
            }}
            showEditButton={true}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={item.id}
            section={
                <div>
                    {item.nameFi !== "" && (
                        <div>
                            <p>{item.nameFi}</p>
                        </div>
                    )}
                    {item.format > 0 && (
                        <div>
                            <p><span>{t('movie_format_' + getMovieFormatNameByID(item.format))}</span></p>
                        </div>
                    )}
                    <div>
                        <p>{item.description}</p>
                    </div>
                </div>
            }
            modalProps={{
                modalTitle: t('edit_movie'),
                modalBody: (
                    editable && <AddMovie
                        movieID={item.id}
                        onClose={() => setEditable(false)}
                        onSave={updateMovie}
                        showLabels={true}
                    />
                )
            }}
            showCheckButton={true}
            checkButtonProps={{
                checked: !!item.haveAtHome,
                //checkedText: t('have'),
                //uncheckedText: t('have_not'),
                onCheck: () => { item["haveAtHome"] = true; onEdit(item); },
                onUncheck: () => { item["haveAtHome"] = false; onEdit(item); },
            }}
        />
    )
}
