import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, ButtonGroup, Col } from 'react-bootstrap';
import i18n from 'i18next';
import { db } from '../../firebase-config';
import { ref, onValue } from 'firebase/database';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import * as Constants from '../../utils/Constants';
import GoBackButton from '../Buttons/GoBackButton';
import CommentComponent from '../Comments/CommentComponent';
import { useAuth } from '../../contexts/AuthContext';
import PageContentWrapper from '../Site/PageContentWrapper';
import { pushToFirebaseChild, updateToFirebaseById } from '../../datatier/datatier';
import Button from '../Buttons/Button';
import AddMovie from './AddMovie';
import Alert from '../Alert';
import LinkComponent from '../Links/LinkComponent';
import ImageComponent from '../ImageUpload/ImageComponent';
import { getMovieFormatNameByID } from '../../utils/ListUtils';
import StarRatingWrapper from '../StarRating/StarRatingWrapper';
import AccordionElement from '../AccordionElement';

export default function MovieDetails() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_MOVIES, { keyPrefix: Constants.TRANSLATION_MOVIES });

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //states
    const [loading, setLoading] = useState(true);
    const [movie, setMovie] = useState({});
    const [showEdit, setShowEdit] = useState(false);

    //params
    const params = useParams();

    //navigation
    const navigate = useNavigate();

    //auth
    const { currentUser } = useAuth();

    //load data
    useEffect(() => {
        const getMovie = async () => {
            await fetchMovieFromFirebase();
        }
        getMovie();
    }, [])

    const fetchMovieFromFirebase = async () => {
        const dbref = ref(db, `${Constants.DB_MOVIES}/${params.id}`);
        onValue(dbref, (snapshot) => {
            const data = snapshot.val();
            if (data === null) {
                navigate(-1);
            }
            setMovie(data);
            setLoading(false);
        })
    }

    const updateMovie = async (updateMovieID, movie) => {
        try {
            const movieID = params.id;
            movie["modified"] = getCurrentDateAsJson();
            updateToFirebaseById(Constants.DB_MOVIES, movieID, movie);
        } catch (error) {
            setError(t('failed_to_save_movie'));
            setShowError(true);
            console.log(error);
        }
    }

    const addCommentToMovie = (comment) => {
        const id = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        pushToFirebaseChild(Constants.DB_MOVIE_COMMENTS, id, comment);
    }

    const addLinkToMovie = (link) => {
        const id = params.id;
        link["created"] = getCurrentDateAsJson();
        pushToFirebaseChild(Constants.DB_MOVIE_LINKS, id, link);
    }

    const saveStars = async (stars) => {
        const movieID = params.id;
        movie["modified"] = getCurrentDateAsJson()
        movie["stars"] = Number(stars);
        updateToFirebaseById(Constants.DB_MOVIES, movieID, movie);
    }

    const getAccordionData = () => {
        return [
            { id: 1, name: t('created'), value: getJsonAsDateTimeString(movie.created, i18n.language) },
            { id: 2, name: t('created_by'), value: movie.createdBy },
            { id: 3, name: t('modified'), value: getJsonAsDateTimeString(movie.modified, i18n.language) }
        ];
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <PageContentWrapper>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        iconName={Constants.ICON_EDIT}
                        text={showEdit ? t('button_close') : ''}
                        color={showEdit ? Constants.COLOR_EDITBUTTON_OPEN : Constants.COLOR_EDITBUTTON_CLOSED}
                        onClick={() => setShowEdit(!showEdit)} />
                </ButtonGroup>
            </Row>

            <AccordionElement array={getAccordionData()} title={movie.name} />

            <Row>
                <Col>
                    {t('format') + ':'} {t('movie_format_' + getMovieFormatNameByID(movie.format))}
                </Col>
            </Row>
            <Row>
                <Col>
                    {t('description') + ':'} {movie.description}
                </Col>
            </Row>
            <Row>
                <Col>
                    <StarRatingWrapper stars={movie.stars} onSaveStars={saveStars} />
                </Col>
            </Row>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

            {showEdit &&
                <AddMovie onSave={updateMovie} movieID={params.id} onClose={() => setShowEdit(false)} />
            }
            <hr />
            <ImageComponent url={Constants.DB_MOVIE_IMAGES} objID={params.id} />
            <CommentComponent objID={params.id} url={Constants.DB_MOVIE_COMMENTS} onSave={addCommentToMovie} />
            <LinkComponent objID={params.id} url={Constants.DB_MOVIE_LINKS} onSaveLink={addLinkToMovie} />
        </PageContentWrapper>
    )
}