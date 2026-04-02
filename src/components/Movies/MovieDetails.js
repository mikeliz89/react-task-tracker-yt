import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import i18n from 'i18next';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { TRANSLATION, DB, ICONS, COLORS } from '../../utils/Constants';
import CommentComponent from '../Comments/CommentComponent';
import { useAuth } from '../../contexts/AuthContext';
import DetailsPage from '../Site/DetailsPage';
import { pushToFirebaseChild, updateToFirebaseById } from '../../datatier/datatier';
import AddMovie from './AddMovie';
import Alert from '../Alert';
import LinkComponent from '../Links/LinkComponent';
import ImageComponent from '../ImageUpload/ImageComponent';
import { getMovieFormatNameByID } from '../../utils/ListUtils';
import StarRatingWrapper from '../StarRating/StarRatingWrapper';
import useFetch from '../Hooks/useFetch';
import { useAlert } from '../Hooks/useAlert';

export default function MovieDetails() {

    //params
    const params = useParams();

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MOVIES });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

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

    //auth
    const { currentUser } = useAuth();

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

    const addCommentToMovie = (comment) => {
        const id = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        pushToFirebaseChild(DB.MOVIE_COMMENTS, id, comment);
    }

    const addLinkToMovie = (link) => {
        const id = params.id;
        link["created"] = getCurrentDateAsJson();
        pushToFirebaseChild(DB.MOVIE_LINKS, id, link);
    }

    const saveStars = async (stars) => {
        const movieID = params.id;
        movie["modified"] = getCurrentDateAsJson()
        movie["stars"] = Number(stars);
        updateToFirebaseById(DB.MOVIES, movieID, movie);
    }

    return (
        <DetailsPage
            loading={loading}
            loadingText={tCommon("loading")}
            showGoBackButton={true}
            showEditButton={true}
            isEditOpen={showEdit}
            editButtonClosedText=""
            editButtonOpenText={tCommon('buttons.button_close')}
            editButtonIconName={ICONS.EDIT}
            editButtonOpenColor={COLORS.EDITBUTTON_OPEN}
            editButtonClosedColor={COLORS.EDITBUTTON_CLOSED}
            onToggleEdit={() => setShowEdit(!showEdit)}
            title={movie?.name}
            preSummaryContent={<span className="detailspage-field">{t('format')}: {t('movie_format_' + getMovieFormatNameByID(movie?.format))}</span>}
            summary={`${t('description')}: ${movie?.description || '-'}`}
            ratingSection={<StarRatingWrapper stars={movie?.stars} onSaveStars={saveStars} />}
            metaItems={[
                { id: 1, content: <>{t('created')}: {getJsonAsDateTimeString(movie?.created, i18n.language)}</> },
                { id: 2, content: <>{t('created_by')}: {movie?.createdBy}</> },
                { id: 3, content: <>{t('modified')}: {getJsonAsDateTimeString(movie?.modified, i18n.language)}</> }
            ]}
            editSection={showEdit ? <AddMovie onSave={updateMovie} movieID={params.id} onClose={() => setShowEdit(false)} /> : null}
        >
            <Row className="detailspage-grid">
                <Col lg={12}>
                    <Alert
                        message={message}
                        showMessage={showMessage}
                        error={error}
                        showError={showError}
                        onClose={clearMessages}
                    />
                </Col>
                <Col lg={12}>
                    <ImageComponent url={DB.MOVIE_IMAGES} objID={params.id} />
                </Col>
                <Col lg={12}>
                    <CommentComponent objID={params.id} url={DB.MOVIE_COMMENTS} onSave={addCommentToMovie} />
                </Col>
                <Col lg={12}>
                    <LinkComponent objID={params.id} url={DB.MOVIE_LINKS} onSaveLink={addLinkToMovie} />
                </Col>
            </Row>
        </DetailsPage>
    )
}