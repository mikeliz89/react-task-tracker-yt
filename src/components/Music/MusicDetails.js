import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Accordion, Table, Row, ButtonGroup, Col } from 'react-bootstrap';
import i18n from 'i18next';
import { db } from '../../firebase-config';
import { ref, onValue } from 'firebase/database';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import * as Constants from '../../utils/Constants';
import GoBackButton from '../Buttons/GoBackButton';
import PageTitle from '../Site/PageTitle';
import CommentComponent from '../Comments/CommentComponent';
import { useAuth } from '../../contexts/AuthContext';
import PageContentWrapper from '../Site/PageContentWrapper';
import { pushToFirebaseChild, updateToFirebaseById } from '../../datatier/datatier';
import Button from '../Buttons/Button';
import AddMusic from './AddMusic';
import Alert from '../Alert';
import LinkComponent from '../Links/LinkComponent';
import ImageComponent from '../ImageUpload/ImageComponent';
import { getMusicFormatNameByID } from '../../utils/ListUtils';
import StarRatingWrapper from '../StarRating/StarRatingWrapper';

function MusicDetails() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_MUSIC, { keyPrefix: Constants.TRANSLATION_MUSIC });

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //states
    const [loading, setLoading] = useState(true);
    const [music, setMusic] = useState({});
    const [showEdit, setShowEdit] = useState(false);

    //params
    const params = useParams();

    //navigation
    const navigate = useNavigate();

    //auth
    const { currentUser } = useAuth();

    //load data
    useEffect(() => {
        const getMusic = async () => {
            await fetchMusicFromFirebase();
        }
        getMusic();
    }, [])

    const fetchMusicFromFirebase = async () => {
        const dbref = ref(db, `${Constants.DB_MUSIC}/${params.id}`);
        onValue(dbref, (snapshot) => {
            const data = snapshot.val();
            if (data === null) {
                navigate(-1);
            }
            setMusic(data);
            setLoading(false);
        })
    }

    const updateMusic = async (updateMusicID, music) => {
        try {
            const musicID = params.id;
            music["modified"] = getCurrentDateAsJson();
            updateToFirebaseById(Constants.DB_MUSIC, musicID, music);
        } catch (error) {
            setError(t('failed_to_save_music'));
            setShowError(true);
            console.log(error);
        }
    }

    const addCommentToMusic = (comment) => {
        const id = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        pushToFirebaseChild(Constants.DB_MUSIC_COMMENTS, id, comment);
    }

    const addLinkToMusic = (link) => {
        const id = params.id;
        link["created"] = getCurrentDateAsJson();
        pushToFirebaseChild(Constants.DB_MUSIC_LINKS, id, link);
    }

    const saveStars = async (stars) => {
        const musicID = params.id;
        music["modified"] = getCurrentDateAsJson()
        music["stars"] = Number(stars);
        updateToFirebaseById(Constants.DB_MUSIC, musicID, music);
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
                        color={showEdit ? 'red' : 'orange'}
                        onClick={() => setShowEdit(!showEdit)} />
                </ButtonGroup>
            </Row>
            <Row>
                <Col>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                <PageTitle title={music.band + ' ' + music.name} iconColor='gray' />
                            </Accordion.Header>
                            <Accordion.Body>
                                <Table striped bordered hover>
                                    <tbody>
                                        <tr>
                                            <td>{t('created')}</td>
                                            <td>{getJsonAsDateTimeString(music.created, i18n.language)}</td>
                                        </tr>
                                        <tr>
                                            <td>{t('created_by')}</td>
                                            <td>{music.createdBy}</td>
                                        </tr>
                                        <tr>
                                            <td>{t('modified')}</td>
                                            <td>{getJsonAsDateTimeString(music.modified, i18n.language)}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>
            </Row>

            <Row>
                <Col>
                    {t('format') + ':'} {t('music_format_' + getMusicFormatNameByID(music.format))}
                </Col>
            </Row>
            <Row>
                <Col>
                    {t('description') + ':'} {music.description}
                </Col>
            </Row>
            <Row>
                <Col>
                    <StarRatingWrapper stars={music.stars} onSaveStars={saveStars} />
                </Col>
            </Row>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

            {showEdit &&
                <AddMusic onSave={updateMusic} musicID={params.id} onClose={() => setShowEdit(false)} />
            }
            <hr />
            <ImageComponent url={Constants.DB_MUSIC_IMAGES} objID={params.id} />
            <CommentComponent objID={params.id} url={Constants.DB_MUSIC_COMMENTS} onSave={addCommentToMusic} />
            <LinkComponent objID={params.id} url={Constants.DB_MUSIC_LINKS} onSaveLink={addLinkToMusic} />
        </PageContentWrapper>
    )
}

export default MusicDetails
