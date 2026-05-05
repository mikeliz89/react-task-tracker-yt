import i18n from 'i18next';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { pushToFirebaseChild, updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB } from '../../utils/Constants';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { getMovieFormatNameByID } from '../../utils/ListUtils';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import DetailsPage from '../Site/DetailsPage';

import AddMovie from './AddMovie';

export default function MovieDetails() {

    //params
    const params = useParams();

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MOVIES });

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

    //states
    const [showEdit, setShowEdit] = useState(false);

    //fetch data
    const { data: movie, loading } = useFetch(DB.MOVIES, "", params.id);

    const updateMovie = async (updateMovieID, movie) => {
        try {
            const movieID = params.id;
            movie["modified"] = getCurrentDateAsJson();
            updateToFirebaseById(DB.MOVIES, movieID, movie);
        } catch (error) {
            showFailure(t('failed_to_save_movie'));
            console.warn(error);
        }
    }
    // ...existing code...

    return (
        <DetailsPage
            item={movie}
            id={params.id}
            dbKey={DB.MOVIES}
            loading={loading}
            showEditButton={true}
            isEditOpen={showEdit}
            onToggleEdit={() => setShowEdit(!showEdit)}
            title={movie?.name}
            titleSuffix={
                <span className={`details-pill ${movie?.haveAtHome === true ? 'details-pill-ready' : 'details-pill-not-ready'}`}>
                    {movie?.haveAtHome === true
                        ? t('have')
                        : t('have_not')}
                </span>
            }
            preSummaryContent={<span className="detailspage-field">{t('format')}: {t('movie_format_' + getMovieFormatNameByID(movie?.format))}</span>}
            summary={`${t('description')}: ${movie?.description || '-'}`}
            metaItems={[
                { id: 1, content: <>{t('created')}: {getJsonAsDateTimeString(movie?.created, i18n.language)}</> },
                { id: 2, content: <>{t('created_by')}: {movie?.createdBy}</> },
                { id: 3, content: <>{t('modified')}: {getJsonAsDateTimeString(movie?.modified, i18n.language)}</> }
            ]}
            editSection={<AddMovie onSave={updateMovie} movieID={params.id} onClose={() => setShowEdit(false)} />}
            alertProps={{
                message,
                showMessage,
                error,
                showError,
                onClose: clearMessages
            }}
            commentProps={{
                showComment: true,
                commentUrl: DB.MOVIE_COMMENTS
            }}
            linkProps={{
                showLink: true,
                linkUrl: DB.MOVIE_LINKS
            }}
            imageProps={{
                showImage: true,
                imageUrl: DB.MOVIE_IMAGES,
            }}
        />
    )
}


