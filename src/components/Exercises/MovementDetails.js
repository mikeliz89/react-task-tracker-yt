//react
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Accordion, Table, Row, ButtonGroup, Col } from 'react-bootstrap';
//firebase
import { db } from '../../firebase-config';
import { push, ref, child, onValue, update, remove } from "firebase/database";
//buttons
import Button from '../../components/Button';
import GoBackButton from '../../components/GoBackButton';
//i18n
import i18n from "i18next";
//utils
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { getMovementCategoryNameByID } from '../../utils/ListUtils';
//StarRating
import SetStarRating from '../StarRating/SetStarRating';
import StarRating from '../StarRating/StarRating';
//Comment
import AddComment from '../Comments/AddComment';
import Comments from '../Comments/Comments';
//Links
import AddLink from '../Links/AddLink';
import Links from '../Links/Links';
//auth
import { useAuth } from '../../contexts/AuthContext';
//pagetitle
import PageTitle from '../PageTitle';
//alert
import Alert from '../Alert';

export default function MovementDetails() {

    //constants
    const DB_MOVEMENTS = '/exercise-movements';
    const DB_MOVEMENT_COMMENTS = '/exercise-movement-comments';
    const DB_MOVEMENT_LINKS = '/exercise-movement-links';

    //states
    const [loading, setLoading] = useState(true);
    const [movement, setMovement] = useState({});
    const [showEditMovement, setShowEditMovement] = useState(false);

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //translation
    const { t } = useTranslation('exercises', { keyPrefix: 'exercises' });

    //params
    const params = useParams();

    //navigation
    const navigate = useNavigate();

    //auth
    const { currentUser } = useAuth();

    //load data
    useEffect(() => {
        const getMovement = async () => {
            await fetchMovementFromFirebase();
        }
        getMovement();
    }, [])

    const fetchMovementFromFirebase = async () => {
        const dbref = ref(db, `${DB_MOVEMENTS}/${params.id}`);
        onValue(dbref, (snapshot) => {
            const data = snapshot.val();
            if (data === null) {
                navigate(-1);
            }
            setMovement(data);
            setLoading(false);
        })
    }

    const saveStars = async (stars) => {
        const movementID = params.id;
        const updates = {};
        movement["modified"] = getCurrentDateAsJson();
        movement["stars"] = Number(stars);
        updates[`${DB_MOVEMENTS}/${movementID}`] = movement;
        update(ref(db), updates);
    }

    const addCommentToMovement = (comment) => {
        const movementID = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        const dbref = child(ref(db, DB_MOVEMENT_COMMENTS), movementID);
        push(dbref, comment);
    }

    const addLinkToMovement = (link) => {
        const movementID = params.id;
        link["created"] = getCurrentDateAsJson();
        const dbref = child(ref(db, DB_MOVEMENT_LINKS), movementID);
        push(dbref, link);
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <div>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        iconName='edit'
                        text={showEditMovement ? t('button_close') : ''}
                        color={showEditMovement ? 'red' : 'orange'}
                        onClick={() => setShowEditMovement(!showEditMovement)} />
                </ButtonGroup>
            </Row>
            <Row>
                <Col>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                <PageTitle title={movement.name} iconName='glass-martini' iconColor='gray' />
                            </Accordion.Header>
                            <Accordion.Body>
                                <Table striped bordered hover>
                                    <tbody>
                                        <tr>
                                            <td>{t('created')}</td>
                                            <td>{getJsonAsDateTimeString(movement.created, i18n.language)}</td>
                                        </tr>
                                        <tr>
                                            <td>{t('created_by')}</td>
                                            <td>{movement.createdBy}</td>
                                        </tr>
                                        <tr>
                                            <td>{t('modified')}</td>
                                            <td>{getJsonAsDateTimeString(movement.modified, i18n.language)}</td>
                                        </tr>
                                        <tr>
                                            <td>{t('category')}</td>
                                            <td>{t('movementcategory_' + getMovementCategoryNameByID(movement.category))}</td>
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
                    <StarRating starCount={movement.stars} />
                </Col>
            </Row>

            <div className="page-content">

                <Alert message={message} showMessage={showMessage}
                    error={error} showError={showError}
                    variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

                <SetStarRating starCount={movement.stars} onSaveStars={saveStars} />
                <AddComment onSave={addCommentToMovement} />
                <AddLink onSaveLink={addLinkToMovement} />

                <Comments objID={params.id} url={'exercise-movement-comments'} />
                <Links objID={params.id} url={'exercise-movement-links'} />
            </div>
        </div>
    )
}
