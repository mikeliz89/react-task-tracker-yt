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
import GoBackButton from '../../components/GoBackButton';
import PageTitle from '../PageTitle';
import SetStarRating from '../StarRating/SetStarRating';
import StarRating from '../StarRating/StarRating';
import AddComment from '../Comments/AddComment';
import Comments from '../Comments/Comments';
import AddLink from '../Links/AddLink';
import Links from '../Links/Links';
import { useAuth } from '../../contexts/AuthContext';
import PageContentWrapper from '../PageContentWrapper';
import { pushToFirebaseChild, updateToFirebaseById } from '../../datatier/datatier';
import Button from '../Button';
import AddGear from './AddGear';
import Alert from '../Alert';

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
            var gearID = params.id;
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
                        iconName='edit'
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
                        &nbsp;
                        <AddComment onSave={addCommentToGear} />
                        &nbsp;
                        <AddLink onSaveLink={addLinkToGear} />
                    </>
                </Col>
            </Row>
            <hr />
            <Comments objID={params.id} url={'backpacking-gear-comments'} />
            <Links objID={params.id} url={'backpacking-gear-links'} />
        </PageContentWrapper>
    )
}

export default GearDetails
