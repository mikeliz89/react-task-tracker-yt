import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Accordion, Table, Row, ButtonGroup, Col } from 'react-bootstrap';
import i18n from 'i18next';
import { db } from '../../firebase-config';
import { ref, onValue } from 'firebase/database';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { getGearCategoryNameByID } from '../../utils/ListUtils';
import * as Constants from '../../utils/Constants';
import GoBackButton from '../Buttons/GoBackButton';
import PageTitle from '../Site/PageTitle';
import SetStarRating from '../StarRating/SetStarRating';
import StarRating from '../StarRating/StarRating';
import CommentComponent from '../Comments/CommentComponent';
import { useAuth } from '../../contexts/AuthContext';
import PageContentWrapper from '../Site/PageContentWrapper';
import { pushToFirebaseChild, updateToFirebaseById } from '../../datatier/datatier';
import Button from '../Buttons/Button';
import AddGear from './AddGear';
import Alert from '../Alert';
import LinkComponent from '../Links/LinkComponent';
import ImageComponent from '../ImageUpload/ImageComponent';

function GearDetails() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_BACKPACKING, { keyPrefix: Constants.TRANSLATION_BACKPACKING });

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //states
    const [loading, setLoading] = useState(true);
    const [gear, setGear] = useState({});
    const [showEdit, setShowEdit] = useState(false);

    //params
    const params = useParams();

    //navigation
    const navigate = useNavigate();

    //auth
    const { currentUser } = useAuth();

    //load data
    useEffect(() => {
        const getGear = async () => {
            await fetchGearFromFirebase();
        }
        getGear();
    }, [])

    const fetchGearFromFirebase = async () => {
        const dbref = ref(db, `${Constants.DB_BACKPACKING_GEAR}/${params.id}`);
        onValue(dbref, (snapshot) => {
            const data = snapshot.val();
            if (data === null) {
                navigate(-1);
            }
            setGear(data);
            setLoading(false);
        })
    }

    const saveStars = async (stars) => {
        const id = params.id;
        gear["modified"] = getCurrentDateAsJson()
        gear["stars"] = Number(stars);
        updateToFirebaseById(Constants.DB_BACKPACKING_GEAR, id, gear);
    }

    const updateGear = async (gear) => {
        try {
            const gearID = params.id;
            gear["modified"] = getCurrentDateAsJson();
            updateToFirebaseById(Constants.DB_BACKPACKING_GEAR, gearID, gear);
        } catch (error) {
            setError(t('failed_to_save_gear'));
            setShowError(true);
            console.log(error);
        }
    }

    const addCommentToGear = (comment) => {
        const id = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        pushToFirebaseChild(Constants.DB_BACKPACKING_GEAR_COMMENTS, id, comment);
    }

    const addLinkToGear = (link) => {
        const id = params.id;
        link["created"] = getCurrentDateAsJson();
        pushToFirebaseChild(Constants.DB_BACKPACKING_GEAR_LINKS, id, link);
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
                                <PageTitle title={gear.name} iconColor='gray' />
                            </Accordion.Header>
                            <Accordion.Body>
                                <Table striped bordered hover>
                                    <tbody>
                                        <tr>
                                            <td>{t('gear_weight_in_grams')}</td>
                                            <td>{gear.weightInGrams}</td>
                                        </tr>
                                        <tr>
                                            <td>{t('created')}</td>
                                            <td>{getJsonAsDateTimeString(gear.created, i18n.language)}</td>
                                        </tr>
                                        <tr>
                                            <td>{t('created_by')}</td>
                                            <td>{gear.createdBy}</td>
                                        </tr>
                                        <tr>
                                            <td>{t('modified')}</td>
                                            <td>{getJsonAsDateTimeString(gear.modified, i18n.language)}</td>
                                        </tr>
                                        <tr>
                                            <td>{t('category')}</td>
                                            <td>{t('gear_category_' + getGearCategoryNameByID(gear.category))}</td>
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
                    {gear.description}
                </Col>
            </Row>
            <Row>
                <Col>
                    <StarRating starCount={gear.stars} />
                </Col>
            </Row>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

            {showEdit &&
                <AddGear onSave={updateGear} gearID={params.id} onClose={() => setShowEdit(false)} />
            }
            <Row>
                <Col>
                    <>
                        <SetStarRating starCount={gear.stars} onSaveStars={saveStars} />
                    </>
                </Col>
            </Row>
            <hr />
            <ImageComponent url={Constants.DB_BACKPACKING_GEAR_IMAGES} objID={params.id} />
            <CommentComponent objID={params.id} url={Constants.DB_BACKPACKING_GEAR_COMMENTS} onSave={addCommentToGear} />
            <LinkComponent objID={params.id} url={Constants.DB_BACKPACKING_GEAR_LINKS} onSaveLink={addLinkToGear} />
        </PageContentWrapper>
    )
}

export default GearDetails
